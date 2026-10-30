// Fails when a schema node has no page under content/docs/nodes, or a page names an unknown type.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const nodesDir = join(root, "content/docs/nodes");
const schema = JSON.parse(readFileSync(join(root, "schema/composition.schema.json"), "utf8")) as {
  properties: { nodes: { items: { oneOf: { properties: { type: { const: string } } }[] } } };
};

const schemaTypes = new Set(
  schema.properties.nodes.items.oneOf.map((node) => node.properties.type.const),
);
const pageTypes = new Map<string, string>();

for (const file of readdirSync(nodesDir, { recursive: true, encoding: "utf8" })) {
  if (!file.endsWith(".mdx")) continue;

  const content = readFileSync(join(nodesDir, file), "utf8");

  for (const [, type] of content.matchAll(/<NodeReference\s+type="([^"]+)"/g)) {
    pageTypes.set(type!, file);
  }
}

const errors = [
  ...[...schemaTypes]
    .filter((type) => !pageTypes.has(type))
    .map((type) => `Node "${type}" has no page in content/docs/nodes.`),
  ...[...pageTypes]
    .filter(([type]) => !schemaTypes.has(type))
    .map(([type, file]) => `${file} references unknown node "${type}".`),
];

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`All ${schemaTypes.size} schema nodes have a page.`);
