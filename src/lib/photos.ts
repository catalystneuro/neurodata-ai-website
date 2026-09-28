import type { ImageMetadata } from "astro";

const all = import.meta.glob<{ default: ImageMetadata }>("/src/assets/photos/**/*.{jpg,jpeg,png}", { eager: true });

/** "2026/w1-lecture-talk.jpg" -> ImageMetadata (throws at build time if missing). */
export function photo(src: string): ImageMetadata {
  const key = `/src/assets/photos/${src}`;
  const mod = all[key];
  if (!mod) throw new Error(`Photo not found: ${key}`);
  return mod.default;
}

const headshots = import.meta.glob<{ default: ImageMetadata }>("/src/assets/people/*.{jpg,jpeg,png}", { eager: true });
const banners = import.meta.glob<{ default: ImageMetadata }>("/src/assets/banners/*.{jpg,jpeg,png}", { eager: true });

/** A person's `photo` field ("ben-dichter.jpg") -> ImageMetadata from src/assets/people/. */
export function headshot(file: string): ImageMetadata {
  const mod = headshots[`/src/assets/people/${file}`];
  if (!mod) throw new Error(`Headshot not found: src/assets/people/${file}`);
  return mod.default;
}

/** An event's `banner` field ("2026.png") -> ImageMetadata from src/assets/banners/. */
export function banner(file: string): ImageMetadata {
  const mod = banners[`/src/assets/banners/${file}`];
  if (!mod) throw new Error(`Banner not found: src/assets/banners/${file}`);
  return mod.default;
}
