import type { ImageMetadata } from "astro";

const all = import.meta.glob<{ default: ImageMetadata }>("/src/assets/photos/**/*.{jpg,jpeg,png}", { eager: true });

/** "2026/w1-lecture-talk.jpg" -> ImageMetadata (throws at build time if missing). */
export function photo(src: string): ImageMetadata {
  const key = `/src/assets/photos/${src}`;
  const mod = all[key];
  if (!mod) throw new Error(`Photo not found: ${key}`);
  return mod.default;
}
