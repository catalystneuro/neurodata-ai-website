// Make the white backing rectangle of a logo transparent by flood-filling
// near-white pixels that are connected to the image border. White inside the
// artwork (not reachable from the edge) is left alone.
// Usage: node scripts/knockout-white.mjs <file.png> [...]
import sharp from "sharp";
const T = 235; // channel value above which a pixel counts as "white" for the flood
for (const file of process.argv.slice(2)) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const isWhite = (i) => data[i * 4 + 3] === 0 || (data[i * 4] >= T && data[i * 4 + 1] >= T && data[i * 4 + 2] >= T);
  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) { stack.push(x, (h - 1) * w + x); }
  for (let y = 0; y < h; y++) { stack.push(y * w, y * w + w - 1); }
  while (stack.length) {
    const i = stack.pop();
    if (seen[i] || !isWhite(i)) continue;
    seen[i] = 1;
    const x = i % w, y = (i - x) / w;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - w);
    if (y < h - 1) stack.push(i + w);
  }
  let cleared = 0;
  for (let i = 0; i < w * h; i++) {
    if (seen[i]) { data[i * 4 + 3] = 0; cleared++; continue; }
    // soften anti-aliased fringe: pixels adjacent to the cleared region get alpha from their darkness
    const x = i % w, y = (i - x) / w;
    const nb = [x > 0 && seen[i - 1], x < w - 1 && seen[i + 1], y > 0 && seen[i - w], y < h - 1 && seen[i + w]].some(Boolean);
    if (nb && data[i * 4 + 3] > 0) {
      const lum = (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3;
      if (lum > 200) data[i * 4 + 3] = Math.round(data[i * 4 + 3] * (255 - lum) / 55);
    }
  }
  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toFile(file + ".tmp");
  const { renameSync } = await import("node:fs");
  renameSync(file + ".tmp", file);
  console.log(`${file}: cleared ${cleared} of ${w * h} pixels`);
}
