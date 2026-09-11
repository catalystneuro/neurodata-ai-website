# Ingestion scripts

These scripts generate content files from the source documents of past NeuroDataReHack events. The outputs under `src/content/schedules/` and `src/content/projects/` are committed and may be hand-edited afterward; rerunning a script overwrites its outputs, so port any manual fixes back into the script or its inputs before rerunning.

All scripts are Node ESM and use `js-yaml`. Each one validates its output at the end by parsing it back and checking it against the shape of the zod schemas in `src/content.config.ts` (item types, topics, people slugs, unique ids, time formats). None of them runs `astro build`.

## Scripts

`ingest-schedule-2026.mjs` writes `src/content/schedules/2026.yaml`. It reads the HTML schedule tables on the nwb.org event page (`../nwb.org/content/events/hck26-2026-janelia-ndrh.md`, override with `NDRH2026_EVENT_MD`) for titles, speakers, affiliations and YouTube links, and joins them with the printed agenda text (`../ndrh2026/_ref/agenda_2026.txt`, override with `NDRH2026_AGENDA`) for end times, rooms and remote markers. Rows are matched by start time and normalised title prefix; rows without a same-day agenda match get no `end`. Day 0 (arrival dinner) comes from the agenda.

`ingest-videos-2025.mjs` writes `src/content/schedules/2025.yaml`. It builds the full schedule from `input/agenda2025.pdf` (converted with `pdftotext -layout`, which must be on the PATH) and attaches the 15 recordings listed in the nwb.org news post (`../nwb.org/content/news/neurodatarehack-2025-videos-announcement.md`, override with `NDRH2025_VIDEOS_MD`). Video titles differ from agenda titles, so the script uses an explicit alias table plus token overlap; the hand-check table is in the script header. Videos with no agenda match go into `unscheduled`.

`ingest-projects-2026.mjs` writes one Markdown file per project to `src/content/projects/2026/` from the exported project document (`../ndrh2026/_ref/projects_body.md`, override with `NDRH2026_PROJECTS_MD`). Key Investigators become `investigators`, Dandiset ids are parsed into `dandisets` (the section is dropped from the body only when every line parsed cleanly), the first GitHub repository and Google Slides link become `links.repo` and `links.slides`, and the first sentence of the description becomes `summary`. Section headings are normalised to the canonical names. Slugs are the title slugified and truncated to 60 characters, with overrides in `input/project-slugs.yaml`.

`ingest-project-stubs.mjs` writes frontmatter-only stubs (`hasBody: false`) for 2022 through 2025 from `input/project-titles.yaml`, which was transcribed by hand from the yearly reports. Edit that file to correct titles, investigators or summaries, then rerun.

## Inputs

`input/speaker-map.yaml` maps display names to people slugs and default affiliations. Only slugs listed there are emitted as `person`; other names get `name` and `affiliation` only. It is shared by all four scripts (speakers and investigators alike).

`input/project-slugs.yaml` holds slug overrides for long 2026 project titles. `input/project-titles.yaml` holds the transcribed 2022 to 2025 project list. `input/agenda2025.pdf` is the printed 2025 agenda.

`lib.mjs` holds the shared helpers: slugify, time parsing, the fixed-width agenda parser, type and topic inference, speaker mapping and the validation checks.
