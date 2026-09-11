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

The site is served from `https://catalystneuro.github.io/neurodata-ai-website/` by default. Every internal link goes through `withBase()` in `src/lib/url.ts`, root-relative links in Markdown bodies are prefixed by `src/plugins/remark-base-links.mjs`, and `scripts/check-links.mjs` fails the build if an un-prefixed or dangling internal link appears in `dist/`.

To move to a custom domain: set the repository variables `SITE_URL` (for example `https://example.org`) and `BASE_PATH` (`/`), add `public/CNAME` containing the domain, and enable the domain under Settings, Pages. No code changes are needed.

## Editing content

Content editing recipes are documented below as the site takes shape.
