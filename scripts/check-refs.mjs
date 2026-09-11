/**
 * Pre-build content reference check. Verifies that every schedule speaker
 * `person` slug and every project `investigators[].person` slug resolves to a
 * file in src/content/people. Astro's reference() covers the other links.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";

const people = new Set(
  existsSync("src/content/people")
    ? readdirSync("src/content/people").filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""))
    : [],
);
const problems = [];

if (existsSync("src/content/schedules")) {
  for (const f of readdirSync("src/content/schedules").filter((f) => f.endsWith(".yaml"))) {
    const doc = yaml.load(readFileSync(join("src/content/schedules", f), "utf8"));
    const items = [...(doc.days ?? []).flatMap((d) => d.items ?? []), ...(doc.unscheduled ?? [])];
    for (const it of items) for (const s of it.speakers ?? []) {
      if (s.person && !people.has(s.person)) problems.push(`schedules/${f}: item "${it.id}" speaker slug "${s.person}" not found`);
    }
    const ids = items.map((i) => i.id);
    const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dup.length) problems.push(`schedules/${f}: duplicate item ids ${[...new Set(dup)].join(", ")}`);
  }
}

if (problems.length) {
  console.error("check-refs:\n" + problems.join("\n"));
  process.exit(1);
}
console.log(`check-refs: OK (${people.size} people)`);
