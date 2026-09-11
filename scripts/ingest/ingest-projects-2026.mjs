#!/usr/bin/env node
// Split the 2026 shared project document (exported to Markdown) into one
// Markdown file per project under src/content/projects/2026/.
//
//   node scripts/ingest/ingest-projects-2026.mjs
//
// Source (override with NDRH2026_PROJECTS_MD): ../ndrh2026/_ref/projects_body.md
// Slug overrides: scripts/ingest/input/project-slugs.yaml
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import {
  REPO_ROOT, INPUT_DIR, CONTENT_DIR, slugify, truncateSlug, investigatorFor,
  dumpYaml, writeFile, validateProjectFrontmatter, splitFrontmatter,
} from "./lib.mjs";

const SRC = process.env.NDRH2026_PROJECTS_MD ?? path.resolve(REPO_ROOT, "..", "ndrh2026", "_ref", "projects_body.md");
const OUT_DIR = path.join(CONTENT_DIR, "projects", "2026");
const EVENT = "2026";
const SLUG_OVERRIDES = yaml.load(fs.readFileSync(path.join(INPUT_DIR, "project-slugs.yaml"), "utf8")) ?? {};
const FEATURED_SLUGS = new Set([
  "minute-scale-oscillatory-sequences-in-entorhinal-cortex",
  "prediction-error-oscillations-in-mouse-v1",
  "support-s3-read-in-the-aqnwb-c-api",
]);

// Section headings as they appear -> canonical name. Unknown headings are kept as written.
const CANON = new Map([
  ["key investigators", "Key Investigators"],
  ["project description", "Project Description"],
  ["dandiset(s) used", "Dandiset(s) Used"],
  ["dandisets used", "Dandiset(s) Used"],
  ["objectives and approach", "Objectives and Approach"],
  ["progress", "Progress"],
  ["next steps", "Next Steps"],
  ["progress and next steps", "Progress and Next Steps"],
  ["background and references", "Background and References"],
  ["background and reference", "Background and References"],
  ["link to presentation", "Link to presentation"],
  ["slides", "Slides"],
]);
const BODY_ORDER = ["Project Description", "Dandiset(s) Used", "Objectives and Approach", "Progress", "Next Steps", "Progress and Next Steps", "Background and References"];

function canonHeading(raw) {
  const key = raw.replace(/\*+/g, "").replace(/[:\s]+$/g, "").trim().toLowerCase();
  return CANON.get(key) ?? raw.replace(/\*+/g, "").trim();
}

function cleanTitle(s) {
  return s.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
}

// Parse one project chunk (text after "# Title") into an ordered list of sections.
function parseSections(text) {
  const sections = [];
  let cur = null;
  const push = (name) => { cur = { name, lines: [] }; sections.push(cur); };
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) { push(canonHeading(h2[1])); continue; }
    // Bold pseudo-headings, e.g. "**Project Description****  " followed by "** text..."
    const bold = line.match(/^\*\*([A-Za-z()\s]+?)\*\*+\s*(.*)$/);
    if (bold && CANON.has(bold[1].trim().toLowerCase())) {
      push(canonHeading(bold[1]));
      let rest = bold[2].replace(/^\*+\s*/, "").trim();
      if (!rest && lines[i + 1]?.startsWith("**")) { rest = lines[i + 1].replace(/^\*+\s*/, "").trim(); i++; }
      if (rest) cur.lines.push(rest);
      continue;
    }
    if (!cur) { if (line.trim()) push("Preamble"), cur.lines.push(line); continue; }
    cur.lines.push(line);
  }
  for (const s of sections) s.text = s.lines.join("\n").replace(/^(\s*\n)+/, "").replace(/\s+$/, "");
  return sections;
}

function bullets(text) {
  return text.split("\n").map((l) => l.match(/^\s*[-*•]\s+(.*)$/)).filter(Boolean).map((m) => m[1].trim()).filter(Boolean);
}

function stripMd(s) {
  return s
    .replace(/<(https?:\/\/[^>]+)>/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\*\*|__/g, "")
    .replace(/\\([\[\]()*_~#.-])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSentence(text, max = 220) {
  const clean = stripMd(text.split("\n").map((l) => l.replace(/^\s*[-*•]\s+/, "")).join(" "))
    .replace(/\s*\(\s*https?:\/\/[^)\s]*\s*\)/g, "")
    .replace(/\s*https?:\/\/\S+/g, "")
    .replace(/\s+([,.;:])/g, "$1");
  const m = clean.match(/^.*?(?<!\b(?:al|e\.g|i\.e|vs|Dr|Fig|No|St))[.!?](?=\s+[A-Z“"(]|\s*$)/);
  let s = (m ? m[0] : clean).trim();
  if (s.length > max) {
    const cut = s.slice(0, max - 1);
    s = `${cut.slice(0, cut.lastIndexOf(" "))}…`;
  }
  return s;
}

// Dandiset extraction. Returns { dandisets, fullyParsed }.
function parseDandisets(text) {
  const seen = new Map();
  const add = (id, note) => {
    if (!seen.has(id)) seen.set(id, { id, url: `https://dandiarchive.org/dandiset/${id}` });
    if (note && !seen.get(id).note) seen.get(id).note = note;
  };
  let fully = true;
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return { dandisets: [], fullyParsed: false };
  for (let line of lines) {
    // Broken link of the form "[000](https://dandiarchive.org/dandiset/000363?...)409": the
    // visible text is the intended id, the href points elsewhere. Reassemble it.
    line = line.replace(/\[(\d{1,6})\]\([^)]*\)(\d{1,5})/g, (_, a, b) => (a + b).length === 6 ? a + b : `${a}${b}`);
    const ids = [];
    for (const m of line.matchAll(/dandiset\/(\d{6})/g)) ids.push(m[1]);
    for (const m of line.matchAll(/dandi\.(\d{6})/g)) ids.push(m[1]);
    for (const m of line.matchAll(/(?<![\d/.])(\d{6})(?![\d/])/g)) ids.push(m[1]);
    const uniq = [...new Set(ids)];
    if (!uniq.length) { fully = false; continue; }
    let residual = line
      .replace(/^[-*•]\s+/, "")
      .replace(/<https?:\/\/[^>]+>/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\*\*/g, "")
      .replace(/\b(DANDI(?:\s*ID)?|Dandiset used|dandiset)\s*:?/gi, "")
      .replace(/\d{6}/g, "")
      .replace(/\(\s*\)/g, "")
      .replace(/^[\s:,\-–()]+|[\s:,\-–()]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if ((residual.match(/\(/g) ?? []).length !== (residual.match(/\)/g) ?? []).length) residual = residual.replace(/[()]/g, "");
    if (residual.length > 60 || uniq.length > 1 && residual.length > 0 && !/^[\w\s,]+$/.test(residual)) fully = false;
    const note = residual && residual.length <= 60 ? residual : undefined;
    for (const id of uniq) add(id, uniq.length === 1 ? note : undefined);
  }
  // Notes only make sense when the section is dropped from the body; otherwise
  // the reader sees the original text anyway and partial residues would just be noise.
  const dandisets = [...seen.values()];
  if (!fully) for (const d of dandisets) delete d.note;
  return { dandisets, fullyParsed: fully };
}

function firstUrl(text, re) {
  const m = text?.match(re);
  return m ? m[0].replace(/[>)\]]+$/, "") : undefined;
}
const GITHUB_RE = /https:\/\/github\.com\/[\w.-]+\/[\w.-]+/;
const SLIDES_RE = /https:\/\/(?:docs\.google\.com\/presentation\/[^\s)>\]]+|canva\.link\/[^\s)>\]]+|www\.canva\.com\/design\/[^\s)>\]]+)/;

function main() {
  const src = fs.readFileSync(SRC, "utf8");
  const chunks = src.split(/^(?=# )/m).filter((c) => c.startsWith("# "));
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const written = [];
  const usedSlugs = new Set();
  const report = [];

  for (const chunk of chunks) {
    const nl = chunk.indexOf("\n");
    const title = cleanTitle(chunk.slice(2, nl));
    const sections = parseSections(chunk.slice(nl + 1));
    const byName = (n) => sections.find((s) => s.name === n);

    let slug = SLUG_OVERRIDES[title] ?? truncateSlug(slugify(title), 60);
    if (usedSlugs.has(slug)) throw new Error(`duplicate slug ${slug}`);
    usedSlugs.add(slug);

    const investigators = bullets(byName("Key Investigators")?.text ?? "")
      .map((b) => stripMd(b.split("\n")[0]).replace(/https?:\/\/\S+/g, "").trim())
      .filter(Boolean)
      .map((n) => investigatorFor(n))
      .filter(Boolean);

    const dandiSec = byName("Dandiset(s) Used");
    const { dandisets, fullyParsed } = dandiSec ? parseDandisets(dandiSec.text) : { dandisets: [], fullyParsed: false };

    const all = sections.map((s) => s.text).join("\n");
    const progressText = sections.filter((s) => /^Progress/.test(s.name)).map((s) => s.text).join("\n");
    const links = {};
    const repo = firstUrl(progressText, GITHUB_RE) ?? firstUrl(all, GITHUB_RE);
    if (repo) links.repo = repo;
    const slides = firstUrl(progressText, SLIDES_RE) ?? firstUrl(all, SLIDES_RE);
    if (slides) links.slides = slides;

    const desc = byName("Project Description")?.text ?? "";
    const summary = desc ? firstSentence(desc) : undefined;

    // Body: canonical sections in document order, minus Key Investigators, minus a
    // fully parsed Dandiset section, minus link-only sections we captured.
    const bodyParts = [];
    for (const s of sections) {
      if (s.name === "Key Investigators") continue;
      if (s.name === "Dandiset(s) Used" && fullyParsed) continue;
      if ((s.name === "Link to presentation" || s.name === "Slides") && links.slides) continue;
      if (!s.text.trim()) continue;
      const text = s.text.replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n");
      bodyParts.push(s.name === "Preamble" ? text : `## ${s.name}\n\n${text}`);
    }
    const body = bodyParts.join("\n\n").trim() + "\n";

    const fm = { title, event: EVENT, investigators, dandisets, topics: [], links };
    if (FEATURED_SLUGS.has(slug)) fm.featured = true;
    if (summary) fm.summary = summary;
    fm.hasBody = true;

    const file = path.join(OUT_DIR, `${slug}.md`);
    writeFile(file, `---\n${dumpYaml(fm)}---\n\n${body}`);
    written.push(file);
    report.push({ slug, investigators: investigators.length, dandisets: dandisets.map((d) => d.id).join(","), dandiKept: dandiSec && !fullyParsed, repo: Boolean(repo), slides: Boolean(slides), unknownSections: sections.filter((s) => !BODY_ORDER.includes(s.name) && !["Key Investigators", "Link to presentation", "Slides", "Preamble"].includes(s.name)).map((s) => s.name) });
  }

  // ---- check: parse frontmatter back and validate ----------------------------
  const featured = new Set();
  for (const f of written) {
    const { data, body } = splitFrontmatter(fs.readFileSync(f, "utf8"));
    validateProjectFrontmatter(data, path.basename(f));
    if (!body.trim()) throw new Error(`${f}: empty body`);
    if (data.featured) featured.add(path.basename(f, ".md"));
  }
  for (const s of FEATURED_SLUGS) if (!featured.has(s)) throw new Error(`featured slug not produced: ${s}`);
  console.log(`ok: ${written.length} project files in ${path.relative(REPO_ROOT, OUT_DIR)}`);
  console.table(report);
}

main();
