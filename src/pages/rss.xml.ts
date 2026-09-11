import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { SITE } from "../consts";
import { withBase } from "../lib/url";

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog")).sort((a, b) => b.data.date.localeCompare(a.data.date));
  return rss({
    title: `${SITE.name} blog`,
    description: SITE.description,
    site: new URL(withBase("/"), context.site).href,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: new Date(p.data.date),
      description: p.data.description,
      link: withBase(`/blog/${p.id}/`),
    })),
  });
}
