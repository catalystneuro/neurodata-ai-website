/**
 * Produce the site's image assets from external sources.
 *
 * Driven by scripts/ingest/input/images.yaml, a list of { src, dest, op }:
 *   headshot  center-crop to a 480x480 JPEG (q82), flattened onto white
 *   photo     long edge at most 1800 px, JPEG q80, metadata stripped
 *   group     long edge at most 2400 px, JPEG q82
 *   banner    PNG, width at most 2000 px
 *   logo      copied as-is, or re-encoded as PNG at width 800 if wider
 *   copy      byte-for-byte copy (agenda PDFs and PNGs)
 *
 * Destinations are always overwritten and their directories created.
 * Usage: node scripts/prepare-images.mjs [path/to/images.yaml]
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import sharp from "sharp";
import yaml from "js-yaml";

const manifest = resolve(process.argv[2] ?? "scripts/ingest/input/images.yaml");
const entries = yaml.load(readFileSync(manifest, "utf8"));
if (!Array.isArray(entries)) throw new Error(`${manifest} must be a list of { src, dest, op }`);

const white = { background: "#ffffff" };

async function process_(entry) {
  const { src, dest, op } = entry;
  if (!src || !dest || !op) throw new Error(`entry missing src/dest/op: ${JSON.stringify(entry)}`);
  if (!existsSync(src)) return { dest, status: "MISSING SOURCE", src };
  mkdirSync(dirname(dest), { recursive: true });

  switch (op) {
    case "headshot":
      await sharp(src).rotate().flatten(white)
        .resize(480, 480, { fit: "cover", position: "centre" })
        .jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
      break;
    case "photo":
      await sharp(src).rotate().flatten(white)
        .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true }).toFile(dest);
      break;
    case "group":
      await sharp(src).rotate().flatten(white)
        .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
      break;
    case "banner":
      await sharp(src).rotate()
        .resize({ width: 2000, withoutEnlargement: true })
        .png({ compressionLevel: 9 }).toFile(dest);
      break;
    case "logo": {
      const meta = await sharp(src).metadata();
      if (meta.width > 800) {
        await sharp(src).resize({ width: 800 }).png({ compressionLevel: 9 }).toFile(dest);
      } else {
        copyFileSync(src, dest);
      }
      break;
    }
    case "copy":
      copyFileSync(src, dest);
      break;
    default:
      throw new Error(`unknown op "${op}" for ${dest}`);
  }

  const size = statSync(dest).size;
  let dims = "-";
  if (extname(dest).toLowerCase() !== ".pdf") {
    const m = await sharp(dest).metadata();
    dims = `${m.width}x${m.height}`;
  }
  return { dest, dims, size };
}

const rows = [];
for (const entry of entries) rows.push(await process_(entry));

const fmtSize = (n) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(2)} MB` : `${(n / 1024).toFixed(1)} KB`);
const w = Math.max(...rows.map((r) => r.dest.length));
console.log(`${"dest".padEnd(w)}  ${"size".padStart(10)}  dimensions`);
for (const r of rows) {
  if (r.status) console.log(`${r.dest.padEnd(w)}  ${r.status}  (${r.src})`);
  else console.log(`${r.dest.padEnd(w)}  ${fmtSize(r.size).padStart(10)}  ${r.dims}`);
}
const missing = rows.filter((r) => r.status);
if (missing.length) {
  console.error(`\n${missing.length} source file(s) missing`);
  process.exitCode = 1;
}
