/**
 * Prefix root-relative links and image sources in Markdown bodies with the
 * configured base path, so content authors can write "/events/2026/" and the
 * page still resolves when the site is served under a project path.
 */
import { visit } from "unist-util-visit";

export default function remarkBaseLinks({ base = "/" } = {}) {
  const prefix = base.replace(/\/+$/, "");
  return (tree) => {
    if (!prefix) return;
    visit(tree, ["link", "image", "definition"], (node) => {
      const url = node.url;
      if (typeof url !== "string") return;
      if (url.startsWith("/") && !url.startsWith("//") && !url.startsWith(prefix + "/")) {
        node.url = prefix + url;
      }
    });
  };
}
