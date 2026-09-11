/**
 * Post-build link check. Fails the build when a page in dist/ links to an
 * internal path that is not prefixed with the base path or that does not
 * resolve to a built file. Run automatically by `npm run build`.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = "dist";
const rawBase = process.env.BASE_PATH ?? "/neurodata-ai-website";
const base = rawBase === "/" || rawBase === "" ? "" : "/" + rawBase.replace(/^\/+|\/+$/g, "");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith(".html")) out.push(p);
  }
  return out;
}

const attrRe = /\s(?:href|src|poster|content)=["']([^"']+)["']/g;
const problems = [];
const files = walk(DIST);
for (const file of files) {
  const html = readFileSync(file, "utf8");
  for (const m of html.matchAll(attrRe)) {
    const url = m[1];
    if (!url.startsWith("/") || url.startsWith("//")) continue;
    const path = url.split("#")[0].split("?")[0];
    if (base && !path.startsWith(base + "/") && path !== base) {
      problems.push(`${relative(DIST, file)}: un-prefixed link ${url}`);
      continue;
    }
    const rel = base ? path.slice(base.length) : path;
    if (rel === "" || rel === "/") continue;
    const candidates = [join(DIST, rel), join(DIST, rel, "index.html")];
    if (rel.endsWith("/")) candidates.push(join(DIST, rel.slice(0, -1) + ".html"));
    if (!candidates.some((c) => existsSync(c))) problems.push(`${relative(DIST, file)}: dangling link ${url}`);
  }
}

if (problems.length) {
  console.error(`check-links: ${problems.length} problem(s)\n` + problems.slice(0, 80).join("\n"));
  process.exit(1);
}
console.log(`check-links: ${files.length} pages OK (base "${base || "/"}")`);
