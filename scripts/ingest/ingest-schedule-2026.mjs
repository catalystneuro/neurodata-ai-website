#!/usr/bin/env node
// Build src/content/schedules/2026.yaml from the nwb.org event page (HTML
// tables with YouTube links) joined with the printed agenda text (end times,
// rooms, remote markers).
//
//   node scripts/ingest/ingest-schedule-2026.mjs
//
// Sources (override with env vars):
//   NDRH2026_EVENT_MD  default ../nwb.org/content/events/hck26-2026-janelia-ndrh.md
//   NDRH2026_AGENDA    default ../ndrh2026/_ref/agenda_2026.txt
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import {
  REPO_ROOT, CONTENT_DIR, slugify, uniqueId, to24h, minutesOf, normTitle, parseAgenda,
  speakerFor, inferType, inferTopics, dumpYaml, writeFile, validateScheduleDoc,
} from "./lib.mjs";

const EVENT_MD = process.env.NDRH2026_EVENT_MD
  ?? path.resolve(REPO_ROOT, "..", "nwb.org", "content", "events", "hck26-2026-janelia-ndrh.md");
const AGENDA_TXT = process.env.NDRH2026_AGENDA
  ?? path.resolve(REPO_ROOT, "..", "ndrh2026", "_ref", "agenda_2026.txt");
const OUT = path.join(CONTENT_DIR, "schedules", "2026.yaml");

const EVENT = "2026";
const DATES = { 0: "2026-07-11", 1: "2026-07-12", 2: "2026-07-13", 3: "2026-07-14", 4: "2026-07-15", 5: "2026-07-16", 6: "2026-07-17" };
const FEATURED = [/^developing with llms/i, /^applying neural foundation models/i, /^introduction to nwb and dandi/i];

// ---- 1. parse the HTML tables on the event page --------------------------------

function decode(s) {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function parseEventPage(md) {
  const days = [];
  const headingRe = /^### Day (\d) \(([^)]+)\): (.*)$/gm;
  const headings = [...md.matchAll(headingRe)];
  headings.forEach((h, i) => {
    const dayNum = Number(h[1]);
    const theme = h[3].trim();
    const sectionEnd = i + 1 < headings.length ? headings[i + 1].index : md.length;
    const section = md.slice(h.index, sectionEnd);
    const rows = [];
    for (const m of section.matchAll(/<tr><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>/g)) {
      const [, time, sessionHtml, speaker, affiliation] = m;
      const link = sessionHtml.match(/<a href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]+)">(.*?)<\/a>/);
      const asterisk = /<sup>\*<\/sup>/.test(sessionHtml);
      const title = decode(sessionHtml.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").replace(/\s*\*\s*$/, "").trim();
      rows.push({
        start: to24h(time),
        title,
        youtubeId: link ? link[1] : undefined,
        asterisk,
        speaker: decode(speaker).trim(),
        affiliation: decode(affiliation).trim(),
      });
    }
    days.push({ dayNum, theme, rows });
  });
  return days;
}

// ---- 2. the fixed-width agenda text is parsed by parseAgenda() in lib.mjs ----

// ---- 3. join --------------------------------------------------------------------

function titleMatches(tableNorm, agendaNorm) {
  if (!tableNorm || !agendaNorm) return false;
  if (tableNorm === agendaNorm) return true;
  const short = tableNorm.length <= agendaNorm.length ? tableNorm : agendaNorm;
  const long = short === tableNorm ? agendaNorm : tableNorm;
  const prefix = short.split(" ").slice(0, Math.max(3, Math.min(6, short.split(" ").length))).join(" ");
  return long.startsWith(prefix);
}

function findAgendaRow(tableRow, agendaRows, tableRows) {
  const tn = normTitle(tableRow.title);
  const byTitle = agendaRows.filter((r) => titleMatches(tn, r.norm));
  const exact = byTitle.find((r) => r.start === tableRow.start);
  if (exact) return { row: exact, how: "start+title" };

  // Same start time, different wording (e.g. a combined agenda row that the
  // event page split into two talks). Accept it unless that agenda row is
  // really the title match for another row of the table on the same day.
  const sameStart = agendaRows.filter((r) => r.start === tableRow.start);
  if (sameStart.length === 1) {
    const claimedElsewhere = tableRows.some((o) => o !== tableRow && titleMatches(normTitle(o.title), sameStart[0].norm));
    if (!claimedElsewhere) return { row: sameStart[0], how: "start" };
  }

  if (byTitle.length === 0) return null;
  const s = minutesOf(tableRow.start);
  byTitle.sort((a, b) => Math.abs(minutesOf(a.start) - s) - Math.abs(minutesOf(b.start) - s));
  return { row: byTitle[0], how: "title" };
}

function roomFor(type, agendaRow) {
  if (!agendaRow) return undefined;
  if (agendaRow.location) return agendaRow.location;
  if (["talk", "discussion", "presentations", "checkin"].includes(type)) return "Synapse";
  return undefined;
}

function main() {
  const md = fs.readFileSync(EVENT_MD, "utf8");
  const agendaTxt = fs.readFileSync(AGENDA_TXT, "utf8");
  const tableDays = parseEventPage(md);
  const agenda = parseAgenda(agendaTxt);
  const allAgendaRows = [...agenda.entries()].flatMap(([d, rows]) => rows.map((r) => ({ ...r, dayNum: d })));

  const used = new Set();
  const days = [];
  const stats = { items: 0, youtube: 0, ends: 0, remote: 0, unmatched: [] };

  // Day 0: arrival, from the agenda text
  const day0 = agenda.get(0) ?? [];
  const arrival = day0.find((r) => /dinner/i.test(r.title));
  days.push({
    date: DATES[0],
    label: "Day 0",
    theme: "Arrival",
    items: [{
      id: uniqueId(`${EVENT}-${slugify("Arrival and dinner")}`, used),
      start: arrival?.start ?? "19:00",
      end: arrival?.end ?? "20:30",
      title: "Arrival and dinner",
      type: "arrival",
      ...(arrival?.location ? { room: arrival.location } : {}),
    }],
  });

  for (const td of tableDays) {
    const agendaRows = agenda.get(td.dayNum) ?? [];
    const items = [];
    td.rows.forEach((row, i) => {
      const type = inferType(row.title);
      const match = findAgendaRow(row, agendaRows, td.rows);
      if (match && match.how === "start") console.log(`  note: Day ${td.dayNum} ${row.start} "${row.title}" matched agenda "${match.row.cleanTitle}" by start time only`);
      let agendaRow = match?.row;
      let remoteOnly = false;
      if (!agendaRow) {
        const elsewhere = allAgendaRows.find((r) => r.dayNum !== td.dayNum && titleMatches(normTitle(row.title), r.norm));
        if (elsewhere) { agendaRow = elsewhere; remoteOnly = true; }
        stats.unmatched.push(`Day ${td.dayNum} ${row.start} ${row.title}${elsewhere ? ` (found on agenda Day ${elsewhere.dayNum}, used for remote flag only)` : ""}`);
      }

      const item = { id: uniqueId(`${EVENT}-${slugify(row.title)}`, used), start: row.start };
      if (agendaRow && !remoteOnly) {
        let end = agendaRow.end;
        const next = td.rows[i + 1];
        if (next && minutesOf(next.start) < minutesOf(end) && minutesOf(next.start) > minutesOf(row.start)) end = next.start;
        if (minutesOf(end) > minutesOf(row.start)) { item.end = end; stats.ends++; }
      }
      item.title = row.title;
      item.type = type;
      const remote = Boolean(agendaRow?.remote);
      const sp = speakerFor(row.speaker, row.affiliation, { remote });
      item.speakers = sp ? [sp] : [];
      if (remote && sp) stats.remote++;
      const room = remoteOnly ? undefined : roomFor(type, agendaRow);
      if (room) item.room = room;
      if (row.youtubeId) { item.youtubeId = row.youtubeId; item.recordingStatus = "available"; stats.youtube++; }
      else if (row.asterisk) item.recordingStatus = "unavailable";
      item.topics = inferTopics(row.title, type);
      if (FEATURED.some((re) => re.test(row.title))) item.featured = true;
      items.push(item);
      stats.items++;
    });
    days.push({ date: DATES[td.dayNum], label: `Day ${td.dayNum}`, theme: td.theme, items });
  }

  const doc = { event: EVENT, tentative: false, timezone: "America/New_York", days };
  const out = dumpYaml(doc);
  writeFile(OUT, out);

  // ---- check: parse it back and validate against the schema shape ----------------
  const parsed = yaml.load(fs.readFileSync(OUT, "utf8"));
  const v = validateScheduleDoc(parsed, { expectedEvent: EVENT });
  console.log(`ok: ${v.items} items across ${parsed.days.length} days; ${stats.youtube} youtubeIds; ${stats.ends} end times; ${stats.remote} remote speakers`);
  if (stats.unmatched.length) {
    console.log("rows with no same-day agenda match (end time omitted):");
    for (const u of stats.unmatched) console.log(`  - ${u}`);
  }
}

main();
