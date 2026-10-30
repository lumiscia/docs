import { relative, resolve } from "node:path";
import { replaceSource } from "fumadocs-core/mdx-plugins/stringifier";

import { resolveMarkdownHref } from "./docs-href.ts";

type VFile = Parameters<typeof replaceSource>[0];
type Node = Parameters<typeof replaceSource>[1];

// Rewrites links in the processed Markdown (`getText('processed')`) to absolute `.md` URLs.
// The rendered HTML keeps the authored links.
export function remarkMarkdownLinks({ dir }: { dir: string }) {
  const docsDir = resolve(dir);

  return (tree: Node, file: VFile) => {
    const path = relative(docsDir, file.path).split("\\").join("/");

    walk(tree, (node) => {
      if (node.type !== "link") return;

      const href = resolveMarkdownHref(path, node.url);
      if (href === node.url) return;

      const title = node.title ? ` ${JSON.stringify(node.title)}` : "";
      replaceSource(file, node, (s) => `[${s.inner(node)}](${href}${title})`);
    });
  };
}

function walk(node: Node, visit: (node: Node) => void) {
  visit(node);
  if ("children" in node) for (const child of node.children) walk(child, visit);
}
