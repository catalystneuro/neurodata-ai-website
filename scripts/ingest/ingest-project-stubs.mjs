#!/usr/bin/env node
// Emit stub project pages (frontmatter only, hasBody: false) for the 2022-2025
// events from scripts/ingest/input/project-titles.yaml, which was transcribed
// by hand from the yearly reports.
//
//   node scripts/ingest/ingest-project-stubs.mjs
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import {
  REPO_ROOT, INPUT_DIR, CONTENT_DIR, slugify, truncateSlug, uniqueId, investigatorFor,
  dumpYaml, writeFile, validateProjectFrontmatter, splitFrontmatter,
} from "./lib.mjs";

const TITLES = yaml.load(fs.readFileSync(path.join(INPUT_DIR, "project-titles.yaml"), "utf8"));

function main() {
  const counts = {};
  const written = [];
  for (const [year, projects] of Object.entries(TITLES)) {
    if (!/^\d{4}$/.test(year)) throw new Error(`bad year key ${year}`);
    const outDir = path.join(CONTENT_DIR, "projects", year);
    fs.mkdirSync(outDir, { recursive: true });
    const used = new Set();
    for (const p of projects) {
      const title = p.title.replace(/\s+/g, " ").trim();
      const slug = uniqueId(p.slug ?? truncateSlug(slugify(title), 60), used);
      const investigators = (p.investigators ?? [])
        .map((inv) => (typeof inv === "string" ? investigatorFor(inv) : investigatorFor(inv.name, inv.affiliation)))
        .filter(Boolean);
      const fm = { title, event: year, investigators, dandisets: [], topics: [], links: {} };
      if (p.featured) fm.featured = true;
      if (p.summary) fm.summary = p.summary.replace(/\s+/g, " ").trim();
      fm.hasBody = false;
      const file = path.join(outDir, `${slug}.md`);
      writeFile(file, `---\n${dumpYaml(fm)}---\n`);
      written.push(file);
      counts[year] = (counts[year] ?? 0) + 1;
    }
  }

  for (const f of written) {
    const { data } = splitFrontmatter(fs.readFileSync(f, "utf8"));
    validateProjectFrontmatter(data, path.relative(REPO_ROOT, f));
    if (data.hasBody !== false) throw new Error(`${f}: stub must have hasBody: false`);
  }
  console.log("ok: stubs per year", counts);
}

main();
