/**
 * Generates the social card and the typographic banners for years without a
 * designed banner (2022, 2027), in the site's own style. Run: node scripts/make-brand-images.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const PINE = "#14563f", INK = "#16211d", PAPER = "#f7f8f6", LINE = "#dbe2dd", SOFT = "#66716c";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function svg({ w, h, title, sub, meta, dark = false }) {
  const bg = dark ? PINE : PAPER;
  const fg = dark ? "#ffffff" : INK;
  const accent = dark ? "rgba(255,255,255,0.75)" : PINE;
  const soft = dark ? "rgba(255,255,255,0.65)" : SOFT;
  const pad = Math.round(w * 0.06);
  const titleSize = Math.round(h * 0.13);
  const lines = title;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${bg}"/>
  ${dark ? "" : `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="${LINE}"/>`}
  <rect x="${pad}" y="${pad}" width="${Math.round(w * 0.09)}" height="6" fill="${dark ? "#ffffff" : PINE}"/>
  <text x="${pad}" y="${pad + 44}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="${Math.round(h * 0.045)}" font-weight="600" letter-spacing="3" fill="${accent}">${esc(meta)}</text>
  ${lines.map((l, i) => `<text x="${pad}" y="${pad + 44 + (i + 1) * titleSize * 1.12 + 10}" font-family="Source Serif 4, Georgia, serif" font-size="${titleSize}" font-weight="600" fill="${fg}">${esc(l)}</text>`).join("\n")}
  <text x="${pad}" y="${h - pad - 6}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="${Math.round(h * 0.05)}" fill="${soft}">${esc(sub)}</text>
</svg>`;
}

mkdirSync("public/images/banners", { recursive: true });
const jobs = [
  { out: "public/social-card.png", w: 1200, h: 630, meta: "NEURODATA AI SUMMER SCHOOL", title: ["Reanalyze open", "neurophysiology data."], sub: "A residential week at HHMI-Janelia. Formerly NeuroDataReHack.", dark: true },
  { out: "public/images/banners/2027.png", w: 2000, h: 667, meta: "NEURODATA AI SUMMER SCHOOL 2027", title: ["July 19–24, 2027"], sub: "HHMI's Janelia Research Campus, Ashburn, Virginia", dark: true },
  { out: "public/images/banners/2022.png", w: 2000, h: 667, meta: "NEURODATAREHACK 2022", title: ["October 3–5, 2022"], sub: "Allen Institute, Seattle. The first NeuroDataReHack.", dark: false },
];
for (const j of jobs) {
  await sharp(Buffer.from(svg(j))).png().toFile(j.out);
  console.log("wrote", j.out);
}
