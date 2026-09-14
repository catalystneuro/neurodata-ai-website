---
name: NeuroData AI Summer School
description: "A conventional academic program site done carefully: white ground, one deep green, a serif for headings and a workhorse sans for everything else, real photographs and logos, and no decoration that does not carry information."
colors:
  ink: "#16211d"
  pine: "#14563f"
  pine-700: "#0f4432"
  pine-600: "#186a4d"
  pine-400: "#3c8f6f"
  pine-100: "#d9ece2"
  pine-50: "#eef6f1"
  sun: "#d9a441"
  sun-700: "#946409"
  sun-200: "#ecd9a6"
  sun-100: "#f7ecd0"
  sun-50: "#fbf6e8"
  paper: "#f7f8f6"
  surface: "#ffffff"
  line: "#dbe2dd"
  line-soft: "#eaeeeb"
  ink-muted: "#4f5b56"
  ink-soft: "#66716c"
  dark: "#12201a"
typography:
  display:
    fontFamily: "Source Serif 4 Variable, Source Serif 4, Georgia, serif"
    fontSize: "clamp(2.1rem, 4.5vw, 3.2rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Source Serif 4 Variable, Source Serif 4, Georgia, serif"
    fontSize: "clamp(1.9rem, 4vw, 2.6rem)"
    fontWeight: 600
    lineHeight: 1.12
  title:
    fontFamily: "Source Serif 4 Variable, Source Serif 4, Georgia, serif"
    fontSize: "clamp(1.4rem, 2.5vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Source Sans 3 Variable, Source Sans 3, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.6
  prose:
    fontFamily: "Source Sans 3 Variable, Source Sans 3, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Source Sans 3 Variable, Source Sans 3, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.08em"
    textTransform: uppercase
  mono:
    fontFamily: "Source Code Pro Variable, Source Code Pro, ui-monospace, monospace"
    fontSize: "0.85rem"
    fontWeight: 400
rounded:
  sm: "0.25rem"
  base: "0.4rem"
  md: "0.5rem"
  lg: "0.6rem"
  xl: "0.8rem"
  full: "999px"
spacing:
  section: "4.5rem"
  block: "2rem"
  gutter: "1.5rem"
---

# Design system

## Overview

The site plays the category straight: an academic program site in the register of the Flatiron Institute CCN workshop pages, Neuromatch Academy, and NeuroHackademy, executed carefully. The identity comes from restraint and craft, not from a concept. A visitor should feel that a serious, well-run program produced this page and should be able to find dates, cost, eligibility, and the application from any event page in seconds.

The palette is deliberately distinct from the two sibling sites: nwb.org (orange and blue, Inter) and catalystneuro.com (navy and cyan, Figtree and Inter). Here there are two colors on a near-white ground: a deep pine green for everything interactive and a warm gold for editorial accents and status.

## Colors

Strategy: restrained. Neutrals plus two accents with distinct jobs.

- `pine` is the interactive color: links, primary buttons, active navigation, hover borders, topic chips, and the occasional filled band. `pine-700` is the hover state, `pine-100` and `pine-50` are tints for chips and subtle backgrounds.
- `sun` is the editorial accent and never interactive. As a fill or rule it is `sun` (#d9a441): the top rules on stat tiles and testimonials, blockquote bars, and column headings on the dark footer, where it is AA. As text on paper or white it is always `sun-700` (#946409), the darkest gold that still reads as gold and passes AA: eyebrows, timeline years, the how-it-works icons, and the "Summer School" line of the wordmark. `sun-100` with a `sun-200` border is the status tint for the open-applications banner, notices, and the highlight chip. Never put `sun` itself as text on a light ground.
- `ink` for headings and body, `ink-muted` for secondary text, `ink-soft` for tertiary text (dates, counts) and it stays AA on `paper` and `surface`.
- `dark` is the footer ground and the only dark surface on the site. Text on it is white at 0.75 alpha, headings at full white.
- No gradients. No colored shadows. No color coding of categories beyond a neutral chip with an icon.

## Typography

- Headings in Source Serif 4 at weight 600, tight leading. The serif is what separates this site from its siblings at a glance and gives the academic register without a crest.
- Body and UI in Source Sans 3. Body is 1.05rem on interface pages and 1.15rem in long-form prose.
- Labels (eyebrows, table headers, chips) are Source Sans 3 at 0.78rem, weight 600, uppercase, tracked 0.08em. This replaces the monospace-label device the sibling sites use.
- Source Code Pro only for code, Dandiset IDs, and YouTube-style identifiers.
- Numbers in stats tiles use tabular figures (`font-variant-numeric: tabular-nums`).

## Layout

- Content width 72rem with a 1.5rem side gutter; prose width 44rem.
- Sections separated by 4.5rem of vertical space on desktop, 3rem on phones, with a hairline rule only where the sections would otherwise run together.
- Two-column layouts (text plus photo, schedule plus sidebar) collapse to one column below 860px.
- The header is sticky, white, with a bottom hairline. Seven navigation items plus one primary button; on phones a panel below the bar.

## Elevation and shapes

- Cards are white on paper with a 1px `line` border and 0.6rem radius. Hover raises the border to `pine-400`; no shadow by default, a soft neutral shadow only on the mobile navigation panel and dialogs.
- Buttons are 0.4rem radius. Primary: pine fill, white text. Secondary: white fill, `line` border, ink text. No pill buttons except chips.
- Cards and gallery photos are 0.6rem radius with a hairline border; full-width photos, banners, and the newsletter band are 0.8rem; notices and menus 0.5rem; headshots are circles.

## Components

- Eyebrow: uppercase label in sun-700, no leading rule.
- Stats tile: large tabular number in serif, label below in the label style, one thin top rule.
- Schedule table: time column in tabular sans, session title, speaker; talk rows link to the recording when one exists; meals and breaks are muted rows; the whole table becomes stacked rows on phones.
- Video card: 16:9 thumbnail with a centered play glyph, title, speaker, year chip. Clicking swaps in the embed.
- Person card: circular photo (initials on pine-100 when there is no photo), name, affiliation, role line.
- Apply banner: a pine-50 band with a left pine rule, one sentence of state, one button.

## Motion

- Transitions of 150ms on color and border only. No entrance animations, no parallax. Respect `prefers-reduced-motion` for the mobile panel.

## Do's and don'ts

- Do use real photographs from HHMI-Janelia and Granada; do caption them.
- Do show numbers only when they change what the reader does or believes.
- Don't add a third accent color, decorative grids, or glows. Don't use sun for anything clickable.
- Don't use bold inside prose for emphasis.
- Don't introduce monospace labels; the sibling sites own that device.
