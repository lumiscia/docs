import { markdownTable } from "fumadocs-core/mdx-plugins/stringifier";
import { asMarkdown, md } from "fumadocs-core/server";
import type { ReactNode } from "react";

import { resolveMarkdownHref } from "@/src/lib/docs-href";
import {
  describeConstraints,
  describePortConnection,
  formatValue,
  getNodeSchema,
} from "@/src/lib/node-schema";

type Children = { children?: ReactNode };

// Markdown forms of the custom MDX components, for `getText('processed')`.
export function getMarkdownComponents(path: string) {
  return {
    async Callout({ title, children }: Children & { title?: ReactNode }) {
      asMarkdown();
      const heading = title && `**${(await md`${title}`).trim()}**`;
      const body = (await md`${children}`).trim();
      return md.linePrefix("> ")`${[heading, body].filter(Boolean).join("\n\n")}`;
    },
    async Cards({ children }: Children) {
      asMarkdown();
      const items = (await md`${children}`).split("\n").map((line) => line.trim());
      return `\n${items.filter(Boolean).join("\n")}\n\n`;
    },
    Card({ title, href, description }: { title: string; href?: string; description?: string }) {
      asMarkdown();
      const link = href ? `[${title}](${resolveMarkdownHref(path, href)})` : title;
      return `- ${link}${description ? `: ${description}` : ""}\n`;
    },
    Tabs({ children }: Children) {
      asMarkdown();
      return children;
    },
    Tab({ value, children }: Children & { value: string }) {
      asMarkdown();
      return md`\n**${value}**\n\n${children}\n\n`;
    },
    Steps({ children }: Children) {
      asMarkdown();
      return children;
    },
    Step({ children }: Children) {
      asMarkdown();
      return children;
    },
    NodeReference({ type }: { type: string }) {
      asMarkdown();
      return nodeReferenceMarkdown(type);
    },
  };
}

function nodeReferenceMarkdown(type: string) {
  const node = getNodeSchema(type);
  const code = (text: string) => `\`${text}\``;
  const ports = [
    ...node["x-lumen-inputs"].map((port) => ({ port, direction: "input" as const })),
    ...node["x-lumen-outputs"].map((port) => ({ port, direction: "output" as const })),
  ];
  const params = Object.entries(node.properties.params?.properties ?? {});

  const portTable = markdownTable([
    ["Port", "Direction", "Kind", "Connection"],
    ...ports.map(({ port, direction }) => [
      code(port.name),
      direction,
      code(port.kind),
      describePortConnection(port, direction),
    ]),
  ]);

  const paramTable =
    params.length === 0
      ? `${code(type)} has no params.`
      : markdownTable([
          ["Param", "Type", "Default", "Description"],
          ...params.map(([name, param]) => {
            const options = param["x-lumen-enumOptions"]?.map((option) => code(option.name));

            return [
              code(name),
              `${code(param["x-lumen-kind"])} (${describeConstraints(param)})`,
              code(formatValue(param.default)),
              [param.description, options && `Options: ${options.join(", ")}`]
                .filter(Boolean)
                .join(" "),
            ];
          }),
        ]);

  return `\n## Ports\n\n${portTable}\n\n## Params\n\n${paramTable}\n\n`;
}
