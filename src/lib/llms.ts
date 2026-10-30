import type * as PageTree from "fumadocs-core/page-tree";
import type { InferPageType } from "fumadocs-core/source";

import { docsOrigin, markdownUrl } from "@/src/lib/docs-href";
import { getMarkdownComponents } from "@/src/lib/markdown-components";
import { source } from "@/src/lib/source";

type Page = InferPageType<typeof source>;

// Matches what Cloudflare serves for the prerendered files: revalidate with the ETag on every request.
export const markdownCacheControl = "public, max-age=0, must-revalidate";

const summary =
  "Lumiscia is a hosted API that renders video from JSON compositions on GPUs. You send a composition (a timeline, render settings, and a graph of nodes) to `https://api.lumiscia.com/v1`, a GPU worker renders it with Lumen, and you download the MP4 artifact. Lumen is the open-source rendering engine behind the API, published as `@lumiscia/lumen-*` packages on npm and `lumen-server` on crates.io.";

// Sidebar separators that share an llms.txt section; unlisted separators keep their own name.
const sectionNames: Record<string, string> = {
  "Get started": "Getting started",
  Compositions: "Getting started",
  "Node reference": "Nodes",
  "API & SDKs": "SDKs",
};

const otherLinks = [
  `- [Full documentation](${docsOrigin}/llms-full.txt): Every page in this index as one Markdown file.`,
  "- [OpenAPI spec](https://api.lumiscia.com/v1/openapi.json): The Lumiscia REST API.",
  "- [Composition JSON schema](https://lumiscia.com/schema/composition.json): JSON Schema for the composition document.",
  "- [Agent skill](https://github.com/lumiscia/lumen-oss): Install with `npx skills add lumiscia/lumen-oss`.",
];

export async function getPageMarkdown(page: Page) {
  const body = await page.data.getText("processed", {
    components: getMarkdownComponents(page.path),
  });
  const header = [`# ${page.data.title}`, page.data.description && `> ${page.data.description}`];

  return `${[...header, body.trim()].filter(Boolean).join("\n\n")}\n`;
}

export function getLlmsIndex() {
  const lines = ["# Lumiscia Docs", "", `> ${summary}`];

  for (const [name, pages] of getSections()) {
    lines.push("", `## ${name}`, "");
    for (const page of pages) {
      const description = page.data.description ? `: ${page.data.description}` : "";
      lines.push(`- [${page.data.title}](${docsOrigin}${markdownUrl(page.url)})${description}`);
    }
  }

  lines.push("", "## Other", "", ...otherLinks);

  return `${lines.join("\n")}\n`;
}

export async function getLlmsFull() {
  const pages = [...getSections().values()].flat();
  const markdown = await Promise.all(pages.map(getPageMarkdown));

  return markdown.join("\n---\n\n");
}

// Pages grouped by sidebar separator, in sidebar order.
function getSections() {
  const sections = new Map<string, Page[]>();
  let current: Page[] = [];

  const add = (node: PageTree.Node) => {
    if (node.type === "separator") {
      const name = typeof node.name === "string" ? node.name : "";
      const section = sectionNames[name] ?? name;
      current = sections.get(section) ?? [];
      sections.set(section, current);
    } else if (node.type === "page") {
      const page = source.getNodePage(node);
      if (page) current.push(page);
    } else {
      if (node.index) add(node.index);
      node.children.forEach(add);
    }
  };

  source.pageTree.children.forEach(add);

  return sections;
}
