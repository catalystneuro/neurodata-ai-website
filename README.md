# NeuroData AI Summer School website

Source for the program website of the NeuroData AI Summer School (formerly NeuroDataReHack), built with [Astro](https://astro.build) and deployed to GitHub Pages by GitHub Actions.

## Local development

```
npm install
npm run dev        # http://localhost:4321/neurodata-ai-website/
npm run build      # checks content references, builds to dist/, checks links
npm run preview
```

Node 22 or newer is required (`.nvmrc`).

## Base path and custom domain

The site is served at `https://neurodata-ai.org/` (repository variables `SITE_URL` and `BASE_PATH=/`, plus `public/CNAME`); without those variables a build targets the GitHub Pages project path `https://catalystneuro.github.io/neurodata-ai-website/`. Every internal link goes through `withBase()` in `src/lib/url.ts`, root-relative links in Markdown bodies are prefixed by `src/plugins/remark-base-links.mjs`, and `scripts/check-links.mjs` fails the build if an un-prefixed or dangling internal link appears in `dist/`.

To change the domain: update the repository variables `SITE_URL` and `BASE_PATH`, the `public/CNAME` file, and the custom domain under Settings, Pages. No code changes are needed. neurodataai.org redirects to neurodata-ai.org at the registrar.

## PR previews

Every pull request is built by `.github/workflows/preview.yml`. For PRs from this
repository the build is published to `https://neurodata-ai.org/pr-NUMBER/` and the
workflow leaves a comment on the PR with the link, updated on each push and removed
when the PR closes. Preview builds carry a `noindex` meta tag and `robots.txt`
disallows `/pr-` paths.

Production and previews share one `gh-pages` branch in this repository, which is
what GitHub Pages serves: `.github/workflows/deploy.yml` writes the root on every
push to `main` and leaves `pr-*/` directories alone; the preview workflow writes
only its own `pr-NUMBER/` directory. Both go through `scripts/publish-gh-pages.sh`,
which creates the branch on first use and serializes pushes. One-time setup after
merging: under Settings, Pages, set the source to "Deploy from a branch",
`gh-pages`, `/ (root)`. The custom domain and HTTPS settings are unaffected.

## Traffic analytics

Page views are counted with GoatCounter (cookie-free, no consent banner needed). The site code
lives in `src/consts.ts` as `SITE.goatcounter`, and `src/layouts/Base.astro` emits the script only
in production builds, so local development and PR previews never count. The dashboard is at
https://neurodata-ai.goatcounter.com/. To turn tracking off, set `goatcounter` to an empty string.

## Editing content

Content editing recipes are documented below as the site takes shape.

The site is content-driven. Almost every change for a new year is a file under `src/content/` or `src/data/`; the pages read those collections and rebuild. Schemas live in `src/content.config.ts` and the build fails on a file that does not match.

### Add a new year

1. Copy `src/content/events/2027.md` to `src/content/events/2028.md`. Set `year`, `name`, dates, `status: upcoming`, `applications`, `banner`, `organizers`, and `instructors` (people slugs).
2. Add `src/content/schedules/2028.yaml` with `event: "2028"` and `tentative: true` until the agenda is confirmed (copy the 2027 file for the shape).
3. Set `CURRENT_EVENT` in `src/consts.ts` to `"2028"`. The header label, the apply CTA, and the home hero follow it.
4. When the previous year ends, set its `status: past`, fill in `stats`, `survey`, `playlistId`, `reportUrl`, `photos`, and run the post-event checklist below.

### Add a session or a recording

Sessions live in `src/content/schedules/<year>.yaml` under `days[].items[]`. Each needs a unique `id` (prefix it with the year), a `start` time as `"HH:MM"`, a `title`, a `type`, and `speakers` (use `person: <slug>` for anyone with a page in `src/content/people/`, plus `name` and `affiliation` so the file reads on its own). Add `youtubeId` when the recording is posted; any item with a `youtubeId` automatically appears in the lectures library, on the speaker's page, and on the event page. Use `recordingStatus: unavailable` for talks that were not recorded and `topics` from the list in `src/content.config.ts`. Mark two or three `featured: true` per year for the home page.

### Add a project

Create `src/content/projects/<year>/<slug>.md` with `title`, `event: "<year>"`, `investigators`, `dandisets`, `links`, and `hasBody: true` if the file has a body (Project Description, Objectives and Approach, Progress, Next Steps, Background and References as `##` headings). Stubs with `hasBody: false` show as cards without a detail page. `featured: true` puts the project on the home page. For a full year of projects, `scripts/ingest/ingest-projects-2026.mjs` shows how to convert the shared project document.

### Add a person

Create `src/content/people/<first-last>.md` with `name`, `affiliation`, `roles` (`faculty`, `instructor`, `advisory`, `guest`, `organizer`), optional `tools` and `links`, and a one-paragraph bio as the body. Put a square headshot at `public/images/people/<first-last>.jpg` (480×480; `npm run images` with an entry in `scripts/ingest/input/images.yaml` will crop and resize) and reference it as `photo: /images/people/<first-last>.jpg`. People without a photo get initials.

### Open and close applications

In the current event file set `applications.state` to `open` with `formUrl` and `deadline`, or to `closed`. The header button, the home hero, the event page banner, and the apply page all change together.

### Testimonials, sponsors, resources, outcomes

These are YAML lists in `src/data/`. Testimonials reference an event by year; `featured: true` puts one on the home page. Outcomes are public outputs (papers, repos, awards) with a year.

### Post-event checklist

Playlist id and recording ids into the schedule; report PDF, slides folder, participant and survey numbers into the event file; photos into `src/assets/photos/<year>/` via `npm run images` and listed under `photos`; projects converted from the shared document; a blog post with highlights.

## Scripts

- `scripts/check-refs.mjs` (prebuild): every `person` slug in schedules resolves; schedule ids are unique.
- `scripts/check-links.mjs` (postbuild): no un-prefixed or dangling internal links in `dist/`.
- `scripts/prepare-images.mjs`: headshots, photos, banners, and logos from `scripts/ingest/input/images.yaml`.
- `scripts/make-brand-images.mjs`: the social card and typographic banners.
- `scripts/ingest/`: one-off converters used to seed the archive; see its README.

## Design

`PRODUCT.md` records what the site is for and `DESIGN.md` records the visual system (one pine green on a near-white ground, Source Serif 4 headings, Source Sans 3 text). Tokens are in `src/styles/global.css`.
