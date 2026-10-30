import { $defs, properties } from "@/schema/composition.schema.json";

type ValueSchema = {
  type?: string;
  $ref?: string;
  enum?: string[];
  pattern?: string;
  anyOf?: ValueSchema[];
};

export type NodePort = { name: string; kind: string; optional?: boolean; variadic?: boolean };

export type NodeParam = ValueSchema & {
  description: string;
  default: unknown;
  additionalProperties?: ValueSchema;
  "x-lumen-kind": string;
  "x-lumen-constraints"?: { min?: number; max?: number; step?: number; format?: string };
  "x-lumen-enumOptions"?: { name: string }[];
};

type NodeSchema = {
  description: string;
  properties: { type: { const: string }; params?: { properties: Record<string, NodeParam> } };
  "x-lumen-inputs": NodePort[];
  "x-lumen-outputs": NodePort[];
};

// The inferred JSON type is a union of every node shape, so narrow it to the fields used here.
const nodes = properties.nodes.items.oneOf as unknown as NodeSchema[];

export function getNodeSchema(type: string) {
  const node = nodes.find((node) => node.properties.type.const === type);

  if (!node) {
    throw new Error(`Unknown node type "${type}". Run \`just sync-schema\` or fix the page.`);
  }

  return node;
}

const expressionRef = "#/$defs/expression";

export type ExpressionSupport = "value" | "entries" | "none";

// "entries" means the param is an object whose values accept expressions.
export function getExpressionSupport(param: NodeParam): ExpressionSupport {
  if (param.anyOf?.some((option) => option.$ref === expressionRef)) return "value";

  const entry = param.additionalProperties;
  const entryName = entry?.$ref?.replace("#/$defs/", "");
  const entrySchema = entryName ? ($defs as Record<string, ValueSchema>)[entryName] : entry;
  const acceptsString = (option: ValueSchema) =>
    option.$ref === expressionRef || (option.type === "string" && !option.pattern && !option.enum);

  return entrySchema?.anyOf?.some(acceptsString) ? "entries" : "none";
}
