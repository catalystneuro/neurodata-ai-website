/**
 * Base-path helpers. The site may be served from a GitHub Pages project path
 * (e.g. /neurodata-ai-website/) or from the root of a custom domain, so every
 * internal href and asset src must be built with withBase().
 */
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");

/** "/events/2027/" -> "/neurodata-ai-website/events/2027/" (identity when base is "/"). */
export function withBase(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("mailto:") || path.startsWith("#")) return path;
  const p = path.startsWith("/") ? path : "/" + path;
  return BASE + p;
}

/** Absolute URL for canonical / Open Graph tags. */
export function absoluteUrl(path: string, site: URL | undefined): string {
  const origin = site ? site.origin : "https://catalystneuro.github.io";
  return origin + withBase(path);
}

/** The site's base path with a trailing slash, for comparisons against Astro.url.pathname. */
export const basePath = BASE + "/";
