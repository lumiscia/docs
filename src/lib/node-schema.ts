import { $defs, properties } from "@/schema/composition.schema.json";

type ValueSchema = {
  type?: string;
  $ref?: string;
  enum?: string[];
  pattern?: string;
  anyOf?: ValueSchema[];
  properties?: Record<string, ValueSchema>;
  additionalProperties?: ValueSchema | boolean;
};

export type NodePort = { name: string; kind: string; optional?: boolean; variadic?: boolean };

export type NodeParam = ValueSchema & {
  description: string;
  default?: unknown;
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

export type ExpressionSupport = "value" | "entries" | "fields" | "none";

const defs = $defs as Record<string, ValueSchema>;

function resolve(schema: ValueSchema | boolean | undefined) {
  if (typeof schema !== "object") return undefined;
  if (!schema.$ref || schema.$ref === expressionRef) return schema;
  return defs[schema.$ref.replace("#/$defs/", "")];
}

const acceptsExpression = (schema: ValueSchema) =>
  schema.anyOf?.some((option) => option.$ref === expressionRef) ?? false;

// "entries" means the param is an object whose values accept expressions,
// "fields" an object with named fields that accept expressions.
export function getExpressionSupport(param: NodeParam): ExpressionSupport {
  const schema = resolve(param);
  if (!schema) return "none";
  if (acceptsExpression(schema)) return "value";

  const entry = resolve(schema.additionalProperties);
  const acceptsString = (option: ValueSchema) =>
    option.$ref === expressionRef || (option.type === "string" && !option.pattern && !option.enum);
  if (entry?.anyOf?.some(acceptsString)) return "entries";

  if (Object.values(schema.properties ?? {}).some(acceptsExpression)) return "fields";
  return "none";
}

export function describePortConnection(port: NodePort, direction: "input" | "output") {
  if (direction === "output") return "-";

  return [port.optional ? "Optional" : "Required", port.variadic && "variadic"]
    .filter(Boolean)
    .join(", ");
}

export function describeConstraints(param: NodeParam) {
  const { min, max, step, format } = param["x-lumen-constraints"] ?? {};
  const details = [];

  if (min !== undefined && max !== undefined) details.push(`${min} to ${max}`);
  else if (min !== undefined) details.push(`min ${min}`);
  else if (max !== undefined) details.push(`max ${max}`);
  if (step !== undefined) details.push(`step ${step}`);
  if (format) details.push(`${format} format`);
  details.push(expressionLabels[getExpressionSupport(param)]);

  return details.join(" · ");
}

const expressionLabels = {
  value: "expression",
  entries: "expression values",
  fields: "expression fields",
  none: "literal only",
};

export function formatValue(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(formatValue).join(", ")}]`;
  return JSON.stringify(value);
}
