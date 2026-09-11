// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { unified } from "@astrojs/markdown-remark";
import remarkBaseLinks from "./src/plugins/remark-base-links.mjs";

// The site is served from a GitHub Pages project path by default and can move to a
// custom domain by setting SITE_URL and BASE_PATH (repository variables in CI, or a
// local .env). BASE_PATH="/" collapses the prefix entirely.
const site = process.env.SITE_URL ?? "https://catalystneuro.github.io";
const rawBase = process.env.BASE_PATH ?? "/neurodata-ai-website";
const base = rawBase === "/" || rawBase === "" ? "/" : "/" + rawBase.replace(/^\/+|\/+$/g, "");

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    processor: unified({
      remarkPlugins: [[remarkBaseLinks, { base }]],
      shikiConfig: { theme: "github-dark", wrap: false },
    }),
  },
});
