#!/usr/bin/env node
// Build src/content/schedules/2025.yaml from the printed 2025 agenda (PDF,
// converted with `pdftotext -layout`) and attach the 15 recorded talks listed
// in the nwb.org "recordings now available" news post.
//
//   node scripts/ingest/ingest-videos-2025.mjs
//
// Sources (override with env vars):
//   NDRH2025_AGENDA_PDF  default scripts/ingest/input/agenda2025.pdf
//   NDRH2025_VIDEOS_MD   default ../nwb.org/content/news/neurodatarehack-2025-videos-announcement.md
//
// The agenda PDF still carries the stale title "Welcome to NeuroDataReHack
// 2024" on the Day 1 welcome talk; the dates in it are July 13-18, 2025, so
// the title is corrected here.
//
// Hand-check table: video title (news post)  ->  agenda row
// ------------------------------------------------------------------------------
//   Reading NWB data from DANDI (Stephanie Prince)      -> Day 1 10:30 How to read NWB files (incl. streaming)
//   A tour of DANDI datasets and search tools           -> Day 1 11:30 A tour of NWB Dandisets & searching tools
//   Data from the International Brain Laboratory        -> Day 1 12:00 Data from The International Brain Lab
//   Intro to the OpenScope DataBook                     -> Day 1 13:30 Introduction to OpenScope and DataBook
//   SpikeInterface: A unified framework...              -> Day 2 09:15 SpikeInterface (Chris Halcrow)
//   Pynapple: Python Neural Analysis package            -> Day 2 10:00 Neural Data Analysis with Pynapple
//   Tour of electrophysiology tutorials in the DataBook -> Day 2 10:45 OpenScope DataBook (electrophysiology)
//   Whole-brain and whole body computations... (Ahrens) -> Day 2 13:30 Dandiset showcase: Glia Accumulate Evidence...
//   A tour of calcium imaging tutorials in the DataBook -> Day 2 14:00 OpenScope DataBook (calcium imaging)
//   Neurosift and AI assisted exploration of DANDI      -> Day 2 15:30 Neurosift visualizations and AI chat
//   Writing good issues                                 -> Day 2 16:30 Contributing to open source: repos, issues, and pull requests
//   Developing with LLMs                                -> Day 3 09:25 Intro to coding with LLMs
//   Virtual Datasets & LINDI                            -> Day 3 13:30 Virtual datasets and LINDI (Ben Dichter & Ryan Ly)
//   Converting neurophysiology data to NWB              -> Day 4 09:30 Converting data to NWB
//   Understanding visual processing w/ large-scale...   -> Day 5 09:10 suite2p, rastermap, facemap, cellpose (Carsen Stringer)
// Not recorded (technical issue): Day 1 09:00 Welcome, Day 1 09:30 Introduction to NWB and DANDI.
// No recording listed: Day 2 14:45 Spyglass (Alison Comrie).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import yaml from "js-yaml";
import {
  REPO_ROOT, INPUT_DIR, CONTENT_DIR, slugify, uniqueId, normTitle, parseAgenda,
  speakerFor, splitSpeakers, inferType, inferTopics, dumpYaml, writeFile, validateScheduleDoc,
} from "./lib.mjs";

const AGENDA_PDF = process.env.NDRH2025_AGENDA_PDF ?? path.join(INPUT_DIR, "agenda2025.pdf");
const VIDEOS_MD = process.env.NDRH2025_VIDEOS_MD
  ?? path.resolve(REPO_ROOT, "..", "nwb.org", "content", "news", "neurodatarehack-2025-videos-announcement.md");
const OUT = path.join(CONTENT_DIR, "schedules", "2025.yaml");

const EVENT = "2025";
const DATES = { 0: "2025-07-13", 1: "2025-07-14", 2: "2025-07-15", 3: "2025-07-16", 4: "2025-07-17", 5: "2025-07-18" };
const THEMES = {
  0: "Arrival",
  1: "Accessing data and starting projects",
  2: "Analyzing data",
  3: "Advanced analysis",
  4: "Hacking on projects",
  5: "Presentations",
};
const NOTE = "Two talks (the welcome and the overview of NWB and DANDI) were not recorded because of a technical issue.";
const UNRECORDED = [/^welcome to neurodatarehack/i, /^introduction to nwb and dandi$/i];

// Explicit aliases for pairs the token-overlap score cannot resolve on its own.
// video title regex -> agenda title regex
const ALIASES = [
  [/^reading nwb data from dandi/i, /^how to read nwb files/i],
  [/^a tour of dandi datasets and search tools/i, /^a tour of nwb dandisets/i],
  [/^intro to the openscope databook/i, /^introduction to openscope and databook/i],
  [/^tour of electrophysiology tutorials/i, /^openscope databook \(electrophysiology\)/i],
  [/^a tour of calcium imaging tutorials/i, /^openscope databook \(calcium imaging\)/i],
  [/^whole-brain and whole body computations/i, /^dandiset showcase: glia/i],
  [/^neurosift and ai assisted/i, /^neurosift visualizations/i],
  [/^writing good issues/i, /^contributing to open source/i],
  [/^developing with llms/i, /^intro to coding with llms/i],
  [/^understanding visual processing/i, /^suite2p, rastermap, facemap, cellpose/i],
  [/^converting neurophysiology data to nwb/i, /^converting data to nwb/i],
  [/^spikeinterface/i, /^spikeinterface$/i],
  [/^pynapple/i, /pynapple/i],
  [/^virtual datasets/i, /^virtual datasets and lindi/i],
  [/^data from the international brain laboratory/i, /^data from the international brain lab/i],
];

function parseVideos(md) {
  const out = [];
  for (const m of md.matchAll(/^- \*\*\[(.+?)\]\(https:\/\/www\.youtube\.com\/watch\?v=([\w-]+)\)\*\*\s*\*by ([^*]+)\*/gm)) {
    out.push({ title: m[1].trim(), youtubeId: m[2], speaker: m[3].trim() });
  }
  return out;
}

const STOP = new Set(["a", "the", "of", "and", "to", "in", "with", "for", "from", "on", "w", "intro", "introduction", "tour"]);
function tokens(s) {
  return new Set(normTitle(s).split(" ").filter((t) => t && !STOP.has(t)));
}
function overlap(a, b) {
  const ta = tokens(a); const tb = tokens(b);
  let n = 0; for (const t of ta) if (tb.has(t)) n++;
  return n / Math.max(1, Math.min(ta.size, tb.size));
}

function matchVideo(video, talks) {
  const alias = ALIASES.find(([vre]) => vre.test(video.title));
  if (alias) {
    const hit = talks.find((t) => alias[1].test(t.title));
    if (hit) return { item: hit, how: "alias" };
  }
  let best = null;
  for (const t of talks) {
    const s = overlap(video.title, t.title);
    if (s >= 0.5 && (!best || s > best.s)) best = { item: t, s };
  }
  return best ? { item: best.item, how: `overlap ${best.s.toFixed(2)}` } : null;
}

function main() {
  const agendaTxt = execFileSync("pdftotext", ["-layout", AGENDA_PDF, "-"], { encoding: "utf8" });
  const agenda = parseAgenda(agendaTxt);
  const videos = parseVideos(fs.readFileSync(VIDEOS_MD, "utf8"));
  if (videos.length !== 15) console.warn(`warning: expected 15 videos, found ${videos.length}`);

  const used = new Set();
  const days = [];
  const talks = []; // items of type talk, for video matching
  const stats = { items: 0, youtube: 0, unrecorded: 0 };

  for (const dayNum of Object.keys(DATES).map(Number)) {
    const rows = agenda.get(dayNum) ?? [];
    const items = [];
    for (const r of rows) {
      let title = r.cleanTitle
        .replace(/^Welcome to NeuroDataReHack \d{4}$/i, `Welcome to NeuroDataReHack ${EVENT}`)
        .replace(/^Speed Networking$/i, "Speed networking")
        .replace(/^Lab Tour$/i, "Lab tour");
      let abstract;
      const hackNote = title.match(/^(Hacking on projects)\.\s*(.+)$/);
      if (hackNote) { title = hackNote[1]; abstract = hackNote[2].trim(); }
      if (dayNum === 0 && /^dinner$/i.test(title)) title = "Arrival and dinner";

      const type = dayNum === 0 ? "arrival" : inferType(title);
      const item = { id: uniqueId(`${EVENT}-${slugify(title)}`, used), start: r.start, end: r.end, title, type };
      const speakers = splitSpeakers(r.speaker).map((n) => speakerFor(n, undefined, { remote: r.remote })).filter(Boolean);
      item.speakers = speakers;
      const room = r.location ?? (["talk", "discussion", "presentations", "checkin"].includes(type) ? "Synapse" : undefined);
      if (room) item.room = room;
      item.topics = inferTopics(title, type);
      if (abstract) item.abstract = abstract;
      if (type === "talk" && UNRECORDED.some((re) => re.test(title))) { item.recordingStatus = "unavailable"; stats.unrecorded++; }
      items.push(item);
      if (type === "talk") talks.push(item);
      stats.items++;
    }
    days.push({ date: DATES[dayNum], label: `Day ${dayNum}`, theme: THEMES[dayNum], items });
  }

  const unscheduled = [];
  const taken = new Set();
  console.log("video matches:");
  for (const v of videos) {
    const m = matchVideo(v, talks.filter((t) => !taken.has(t)));
    if (m) {
      taken.add(m.item);
      m.item.youtubeId = v.youtubeId;
      m.item.recordingStatus = "available";
      stats.youtube++;
      console.log(`  ${v.title}  ->  ${m.item.title}  [${m.how}]`);
    } else {
      console.log(`  ${v.title}  ->  (no agenda match, added to unscheduled)`);
      const sp = splitSpeakers(v.speaker).map((n) => speakerFor(n)).filter(Boolean);
      unscheduled.push({
        id: uniqueId(`${EVENT}-${slugify(v.title)}`, used),
        title: v.title, type: "talk", speakers: sp, youtubeId: v.youtubeId, recordingStatus: "available",
        topics: inferTopics(v.title, "talk"),
      });
    }
  }

  const doc = { event: EVENT, tentative: false, timezone: "America/New_York", note: NOTE, days };
  if (unscheduled.length) doc.unscheduled = unscheduled;
  writeFile(OUT, dumpYaml(doc));

  const parsed = yaml.load(fs.readFileSync(OUT, "utf8"));
  const v = validateScheduleDoc(parsed, { expectedEvent: EVENT });
  console.log(`ok: ${v.items} items across ${parsed.days.length} days; ${stats.youtube} youtubeIds attached; ${unscheduled.length} unscheduled; ${stats.unrecorded} marked unavailable`);
}

main();
