// Shared helpers for the ingestion scripts in this directory.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

export const INGEST_DIR = path.dirname(fileURLToPath(import.meta.url));
export const INPUT_DIR = path.join(INGEST_DIR, "input");
export const REPO_ROOT = path.resolve(INGEST_DIR, "..", "..");
export const CONTENT_DIR = path.join(REPO_ROOT, "src", "content");

// Mirrors TOPICS in src/content.config.ts. Keep in sync by hand; the check at
// the end of each script reads the real file to verify.
export const TOPICS = [
  "nwb", "dandi", "streaming", "ephys", "ophys", "behavior", "spike-sorting", "pynapple",
  "neurosift", "openscope", "ibl", "foundation-models", "llm", "agents", "conversion",
  "dimensionality-reduction", "state-space", "showcase", "open-source", "welcome",
];

export const ITEM_TYPES = [
  "talk", "breakout", "hack", "meal", "break", "social", "discussion", "presentations", "tour", "checkin", "arrival",
];

export const PEOPLE_SLUGS = [
  "ben-dichter", "ryan-ly", "oliver-ruebel", "carter-peene", "guillaume-viejo", "misha-ahrens",
  "carsen-stringer", "atika-syeda", "jacob-pennington", "pranav-rai", "jerome-lecoq", "will-slatton",
  "alexandre-andre", "jeremy-magland", "robin-dard", "jakob-voigts", "alessio-buccino", "stephanie-prince",
  "chris-halcrow", "mayo-faulkner", "alison-comrie", "eva-dyer", "scott-linderman", "edoardo-balzani",
  "sarah-jo-venditto", "satrajit-ghosh", "olivier-winter", "ariel-rokem",
];

export function readTopicsFromConfig() {
  const src = fs.readFileSync(path.join(REPO_ROOT, "src", "content.config.ts"), "utf8");
  const m = src.match(/export const TOPICS = \[([\s\S]*?)\] as const;/);
  if (!m) throw new Error("Could not find TOPICS in src/content.config.ts");
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

export function slugify(s) {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’'"“”‘]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Truncate a slug to maxLen characters at a hyphen boundary.
export function truncateSlug(slug, maxLen = 60) {
  if (slug.length <= maxLen) return slug;
  const cut = slug.slice(0, maxLen);
  const i = cut.lastIndexOf("-");
  return (i > 0 ? cut.slice(0, i) : cut).replace(/-+$/, "");
}

// Return a unique id given a set of already used ids ("x", "x-2", "x-3", ...).
export function uniqueId(base, used) {
  let id = base;
  let n = 2;
  while (used.has(id)) id = `${base}-${n++}`;
  used.add(id);
  return id;
}

// "8:15 AM" -> "08:15", "12:30 PM" -> "12:30", "12:00 AM" -> "00:00"
export function to24h(s) {
  const m = s.trim().match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
  if (!m) throw new Error(`Bad time: ${s}`);
  let h = parseInt(m[1], 10);
  const mm = m[2];
  const pm = m[3].toUpperCase() === "PM";
  if (h === 12) h = pm ? 12 : 0;
  else if (pm) h += 12;
  return `${String(h).padStart(2, "0")}:${mm}`;
}

export function minutesOf(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

// Loose title normalisation used for matching schedule rows across sources.
export function normTitle(s) {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\bincl\.\s*/g, "including ")
    .replace(/\(remote\)/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ---- fixed-width agenda text (pdftotext -layout of the printed agenda) --------
//
// Returns Map<dayNum, rows[]> where each row has start/end ("HH:MM"), title,
// cleanTitle (no trailing location), location (Dining Room, Lobby, ...), speaker,
// remote (true when the speaker column says "(remote)"), breakout (parallel
// session text in the Breakout column, if any) and norm (normalised title).

export const AGENDA_LOCATIONS = /\((Dining Room|Dining Hall|Lobby|Synapse|Spectrum|Cafeteria|Rooftop)\)\s*$/i;

export function parseAgenda(txt) {
  const days = new Map(); // dayNum -> rows
  let current = null;
  let cols = null; // { speaker, breakout } column start offsets from the header line
  const timeRowRe = /^\s*(\d{1,2}:\d{2} [AP]M)\s+(\d{1,2}:\d{2} [AP]M)\s+(?:\d+:\d{2}:\d{2}\s+)?/;

  const partsOf = (line) => {
    // split on runs of 3+ spaces, keeping the character offset of each part
    const out = [];
    for (const m of line.matchAll(/\S(?:.*?\S)?(?=\s{3,}|\s*$)/g)) {
      let text = m[0];
      let idx = m.index;
      const d = text.match(/^\d+:\d{2}:\d{2}\s+/); // stray duration token on a continuation line
      if (d) { text = text.slice(d[0].length); idx += d[0].length; }
      if (/^\d+:\d{2}:\d{2}$/.test(text)) continue;
      if (text) out.push({ text, idx });
    }
    return out;
  };
  const columnOf = (idx) => {
    if (cols && idx >= cols.breakout - 3) return "breakout";
    if (cols && idx >= cols.speaker - 3) return "speaker";
    return "main";
  };

  for (const rawLine of txt.split(/\r?\n/)) {
    const line = rawLine.replace(/\t/g, "    ");
    const dayM = line.match(/^\s*Day (\d) \(([^)]+)\)\s*$/);
    if (dayM) {
      current = { dayNum: Number(dayM[1]), rows: [] };
      days.set(current.dayNum, current.rows);
      cols = null;
      continue;
    }
    if (!current) continue;
    if (/Start Time/.test(line)) {
      const sp = line.indexOf("Speaker");
      const br = line.indexOf("Breakout");
      cols = { speaker: sp >= 0 ? sp : 10_000, breakout: br >= 0 ? br : 10_000 };
      continue;
    }
    if (/^\s*$/.test(line) || /^\s*\d{1,2}\/\d{1,2}\/\d{4}/.test(line)) continue;

    const tm = line.match(timeRowRe);
    if (tm) {
      const row = { start: to24h(tm[1]), end: to24h(tm[2]), title: "", speaker: "", breakout: "" };
      for (const p of partsOf(line.slice(tm[0].length).padStart(line.length))) {
        const c = columnOf(p.idx);
        row[c === "main" ? "title" : c] = p.text;
      }
      current.rows.push(row);
    } else if (current.rows.length) {
      // continuation line: append to the last row's columns
      const row = current.rows[current.rows.length - 1];
      for (const p of partsOf(line)) {
        const c = columnOf(p.idx);
        if (c === "main") {
          // an unlabelled second speaker on the main-title line position is rare; treat as title text
          row.title = `${row.title} ${p.text}`.trim();
        } else if (c === "speaker") {
          row.speaker = `${row.speaker} ${p.text}`.trim();
        } else if (c === "breakout" && !row.breakout) {
          row.breakout = p.text;
        }
      }
    }
  }
  for (const rows of days.values()) {
    for (const r of rows) {
      r.remote = /\(remote\)/i.test(r.speaker);
      r.speaker = r.speaker.replace(/\(remote\)/gi, "").replace(/\s+/g, " ").trim();
      const loc = r.title.match(AGENDA_LOCATIONS);
      r.location = loc ? loc[1] : undefined;
      r.cleanTitle = loc ? r.title.slice(0, loc.index).trim() : r.title.trim();
      r.norm = normTitle(r.cleanTitle);
    }
  }
  return days;
}

// ---- speaker / person mapping ------------------------------------------------

let speakerMapCache;
export function loadSpeakerMap() {
  if (!speakerMapCache) {
    const raw = yaml.load(fs.readFileSync(path.join(INPUT_DIR, "speaker-map.yaml"), "utf8"));
    speakerMapCache = new Map();
    for (const [name, v] of Object.entries(raw.speakers)) {
      const entry = { person: v.person, affiliation: v.affiliation };
      if (v.person && !PEOPLE_SLUGS.includes(v.person)) throw new Error(`speaker-map: unknown person slug ${v.person}`);
      speakerMapCache.set(name.toLowerCase(), entry);
      for (const alias of v.aliases ?? []) speakerMapCache.set(alias.toLowerCase(), entry);
    }
  }
  return speakerMapCache;
}

// Build a speaker object for the schedule schema. `affiliation` from the source
// wins over the map when present. Returns null for "Everyone" / blank.
export function speakerFor(name, affiliation, { remote = false } = {}) {
  const clean = (name ?? "").replace(/\s+/g, " ").trim();
  if (!clean || /^everyone$/i.test(clean)) return null;
  const entry = loadSpeakerMap().get(clean.toLowerCase());
  const out = {};
  if (entry?.person) out.person = entry.person;
  out.name = clean;
  const aff = (affiliation ?? "").trim() || entry?.affiliation;
  if (aff) out.affiliation = aff;
  if (remote) out.remote = true;
  return out;
}

// Investigator object for the projects schema (name, optional affiliation, optional person).
export function investigatorFor(name, affiliation) {
  const clean = (name ?? "").replace(/\s+/g, " ").trim();
  if (!clean) return null;
  const entry = loadSpeakerMap().get(clean.toLowerCase());
  const out = { name: clean };
  if (affiliation) out.affiliation = affiliation;
  if (entry?.person) out.person = entry.person;
  return out;
}

// Split "Ben Dichter & Ryan Ly" / "A and B" / "A, B" into names.
export function splitSpeakers(s) {
  return (s ?? "")
    .split(/\s*(?:&|\band\b|,|\/)\s*/)
    .map((x) => x.trim())
    .filter(Boolean);
}

// ---- schedule item type / topic inference ------------------------------------

export function inferType(title) {
  const t = title.toLowerCase();
  if (/^(breakfast|lunch|dinner)\b/.test(t)) return "meal";
  if (/^arrival/.test(t)) return "arrival";
  if (/^hacking on projects/.test(t)) return "hack";
  if (/^(project check-ins|project roundtable|discussion and feedback)/.test(t)) return "discussion";
  if (/^project presentations/.test(t)) return "presentations";
  if (/^lab tour/.test(t)) return "tour";
  if (/^(speed networking|group photo)/.test(t)) return "social";
  if (/^(introduction to day|welcome)/.test(t)) return "talk";
  if (/^(getting started with ai agents|agent skills)/.test(t)) return "breakout";
  if (/refreshments|\bbreak\b/.test(t)) return "break";
  return "talk";
}

// Ordered list of [regex, topics]. First match wins.
const TOPIC_RULES = [
  [/^welcome/i, ["welcome"]],
  [/introduction to nwb and dandi/i, ["nwb", "dandi"]],
  [/how to read nwb files/i, ["nwb", "streaming"]],
  [/tour of nwb dandisets/i, ["dandi"]],
  [/international brain lab/i, ["ibl", "ephys"]],
  [/openscope predictive processing/i, ["openscope", "showcase"]],
  [/openscope databook \(electrophysiology\)/i, ["openscope", "ephys"]],
  [/openscope databook \(calcium imaging\)/i, ["openscope", "ophys"]],
  [/openscope/i, ["openscope"]],
  [/pynapple/i, ["pynapple"]],
  [/kilosort/i, ["spike-sorting", "ephys"]],
  [/spikeinterface/i, ["spike-sorting", "ephys"]],
  [/facemap: quantifying/i, ["behavior"]],
  [/suite2p|rastermap|cellpose/i, ["ophys", "behavior"]],
  [/developing with llms|coding with llms/i, ["llm"]],
  [/ai agents|agent skills/i, ["agents", "llm"]],
  [/foundation models|torch_brain/i, ["foundation-models"]],
  [/neurosift/i, ["neurosift", "llm"]],
  [/virtual datasets|lindi/i, ["streaming", "nwb"]],
  [/converting data/i, ["conversion"]],
  [/cicada/i, ["nwb"]],
  [/spyglass/i, ["nwb"]],
  [/write good issues|contributing to open source/i, ["open-source"]],
  [/visual computations in large-scale recordings/i, ["showcase", "ophys"]],
  [/showcase/i, ["showcase"]],
];

export function inferTopics(title, type) {
  if (type !== "talk" && type !== "breakout") return [];
  for (const [re, topics] of TOPIC_RULES) if (re.test(title)) return topics;
  return [];
}

// ---- output helpers ------------------------------------------------------------

export function dumpYaml(obj) {
  return yaml.dump(obj, { lineWidth: 120, noRefs: true, quotingType: '"', forceQuotes: false });
}

export function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log(`wrote ${path.relative(REPO_ROOT, file)}`);
}

// ---- lightweight schema checks (mirror content.config.ts) ---------------------

function assert(cond, msg) {
  if (!cond) throw new Error(`validation: ${msg}`);
}

export function validateScheduleDoc(doc, { expectedEvent }) {
  const topics = readTopicsFromConfig();
  assert(doc.event === expectedEvent, `event must be "${expectedEvent}"`);
  assert(typeof doc.tentative === "boolean", "tentative must be boolean");
  assert(typeof doc.timezone === "string", "timezone must be string");
  const ids = new Set();
  const checkItem = (it, where) => {
    assert(typeof it.id === "string" && /^\d{4}-[a-z0-9-]+$/.test(it.id), `${where}: bad id ${it.id}`);
    assert(!ids.has(it.id), `${where}: duplicate id ${it.id}`);
    ids.add(it.id);
    assert(typeof it.title === "string" && it.title.length > 0, `${where}: missing title`);
    for (const k of ["start", "end"]) if (it[k] !== undefined) assert(/^\d{2}:\d{2}$/.test(it[k]), `${where}: bad ${k} ${it[k]}`);
    if (it.type !== undefined) assert(ITEM_TYPES.includes(it.type), `${where}: bad type ${it.type}`);
    for (const sp of it.speakers ?? []) {
      if (sp.person !== undefined) assert(PEOPLE_SLUGS.includes(sp.person), `${where}: unknown person ${sp.person}`);
      assert(sp.name, `${where}: speaker without name`);
    }
    for (const t of it.topics ?? []) assert(topics.includes(t), `${where}: unknown topic ${t}`);
    if (it.recordingStatus !== undefined) assert(["available", "unavailable", "pending"].includes(it.recordingStatus), `${where}: bad recordingStatus`);
    if (it.youtubeId !== undefined) assert(/^[\w-]{6,}$/.test(it.youtubeId), `${where}: bad youtubeId`);
    if (it.featured !== undefined) assert(typeof it.featured === "boolean", `${where}: featured must be boolean`);
  };
  for (const day of doc.days ?? []) {
    assert(typeof day.label === "string", "day label");
    if (day.date !== undefined) assert(/^\d{4}-\d{2}-\d{2}$/.test(String(day.date)), `bad date ${day.date}`);
    for (const it of day.items ?? []) checkItem(it, `${day.label} ${it.title}`);
  }
  for (const it of doc.unscheduled ?? []) checkItem(it, `unscheduled ${it.title}`);
  return { items: ids.size };
}

export function validateProjectFrontmatter(fm, where) {
  assert(typeof fm.title === "string" && fm.title.length > 0, `${where}: title`);
  assert(/^\d{4}$/.test(String(fm.event)), `${where}: event`);
  for (const inv of fm.investigators ?? []) {
    assert(inv.name, `${where}: investigator without name`);
    if (inv.person !== undefined) assert(PEOPLE_SLUGS.includes(inv.person), `${where}: unknown person ${inv.person}`);
  }
  for (const d of fm.dandisets ?? []) {
    assert(/^\d{6}$/.test(d.id), `${where}: dandiset id ${d.id}`);
    if (d.url !== undefined) assert(/^https?:\/\//.test(d.url), `${where}: dandiset url`);
  }
  for (const [k, v] of Object.entries(fm.links ?? {})) {
    assert(["repo", "slides", "notebook", "presentation", "paper"].includes(k), `${where}: link key ${k}`);
    assert(/^https?:\/\/\S+$/.test(v), `${where}: link ${k} not a url`);
  }
  if (fm.featured !== undefined) assert(typeof fm.featured === "boolean", `${where}: featured`);
  assert(typeof fm.hasBody === "boolean", `${where}: hasBody`);
  if (fm.summary !== undefined) assert(typeof fm.summary === "string", `${where}: summary`);
}

// Parse "---\n<yaml>\n---\n<body>" back out of a markdown file.
export function splitFrontmatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error("no frontmatter");
  return { data: yaml.load(m[1]), body: m[2] };
}
