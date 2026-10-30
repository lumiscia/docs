import * as stylex from "@stylexjs/stylex";

import { Code } from "@/src/components/mdx/code-block";
import { Heading, Paragraph, Table, TableCell, TableHeaderCell } from "@/src/components/mdx/prose";
import { acceptsExpression, getNodeSchema } from "@/src/lib/node-schema";
import type { NodeParam, NodePort } from "@/src/lib/node-schema";
import { colors } from "@/src/styles/tokens.stylex";

export function NodeReference({ type }: { type: string }) {
  const node = getNodeSchema(type);
  const params = Object.entries(node.properties.params?.properties ?? {});

  return (
    <>
      <Heading as="h2" id="ports">
        Ports
      </Heading>
      <Table>
        <thead>
          <tr>
            <TableHeaderCell>Port</TableHeaderCell>
            <TableHeaderCell>Direction</TableHeaderCell>
            <TableHeaderCell>Kind</TableHeaderCell>
            <TableHeaderCell>Connection</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {node["x-lumen-inputs"].map((port) => (
            <PortRow key={port.name} port={port} direction="input" />
          ))}
          {node["x-lumen-outputs"].map((port) => (
            <PortRow key={port.name} port={port} direction="output" />
          ))}
        </tbody>
      </Table>

      <Heading as="h2" id="params">
        Params
      </Heading>
      {params.length === 0 ? (
        <Paragraph>
          <Code>{type}</Code> has no params.
        </Paragraph>
      ) : (
        <Table>
          <thead>
            <tr>
              <TableHeaderCell>Param</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Default</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
            </tr>
          </thead>
          <tbody>
            {params.map(([name, param]) => (
              <ParamRow key={name} name={name} param={param} />
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

function PortRow({ port, direction }: { port: NodePort; direction: "input" | "output" }) {
  const connection =
    direction === "output"
      ? "-"
      : [port.optional ? "Optional" : "Required", port.variadic && "variadic"]
          .filter(Boolean)
          .join(", ");

  return (
    <tr>
      <TableCell>
        <Code>{port.name}</Code>
      </TableCell>
      <TableCell>{direction}</TableCell>
      <TableCell>
        <Code>{port.kind}</Code>
      </TableCell>
      <TableCell>{connection}</TableCell>
    </tr>
  );
}

function ParamRow({ name, param }: { name: string; param: NodeParam }) {
  const options = param["x-lumen-enumOptions"]?.map((option) => option.name);

  return (
    <tr>
      <TableCell>
        <Code>{name}</Code>
      </TableCell>
      <TableCell>
        <Code>{param["x-lumen-kind"]}</Code>
        <span {...stylex.props(styles.detail)}>{describeConstraints(param)}</span>
      </TableCell>
      <TableCell>
        <Code>{formatValue(param.default)}</Code>
      </TableCell>
      <TableCell>
        <InlineMarkdown text={param.description} />
        {options && (
          <span {...stylex.props(styles.detail)}>
            Options:{" "}
            {options.map((option, index) => (
              <span key={option}>
                {index > 0 && ", "}
                <Code>{option}</Code>
              </span>
            ))}
          </span>
        )}
      </TableCell>
    </tr>
  );
}

// Schema descriptions come from Rust doc comments and only use backticks for markup.
function InlineMarkdown({ text }: { text: string }) {
  return text
    .replaceAll("\n", " ")
    .split("`")
    .map((part, index) => (index % 2 === 1 ? <Code key={index}>{part}</Code> : part));
}

function describeConstraints(param: NodeParam) {
  const { min, max, step, format } = param["x-lumen-constraints"] ?? {};
  const details = [];

  if (min !== undefined && max !== undefined) details.push(`${min} to ${max}`);
  else if (min !== undefined) details.push(`min ${min}`);
  else if (max !== undefined) details.push(`max ${max}`);
  if (step !== undefined) details.push(`step ${step}`);
  if (format) details.push(`${format} format`);
  details.push(acceptsExpression(param) ? "expression" : "literal only");

  return details.join(" · ");
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(formatValue).join(", ")}]`;
  return JSON.stringify(value);
}

const styles = stylex.create({
  detail: {
    display: "block",
    marginTop: 4,
    fontSize: 12.5,
    lineHeight: 1.5,
    color: colors.inkFaint,
  },
});
