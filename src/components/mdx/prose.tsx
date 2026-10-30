import * as stylex from "@stylexjs/stylex";
import { Link2 } from "lucide-react";
import type { ComponentProps } from "react";

import { colors, fonts } from "@/src/styles/tokens.stylex";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export function Heading({
  as: Tag,
  id,
  children,
  ...props
}: Omit<ComponentProps<"h2">, "className" | "style"> & { as: HeadingTag }) {
  return (
    <Tag
      id={id}
      {...props}
      {...stylex.props(stylex.defaultMarker(), styles.heading, headingStyles[Tag])}
    >
      {id ? (
        <a href={`#${id}`} {...stylex.props(styles.headingLink)}>
          {children}
          <Link2 size={14} aria-hidden {...stylex.props(styles.anchorIcon)} />
        </a>
      ) : (
        children
      )}
    </Tag>
  );
}

export function Link({ href = "", ...props }: ComponentProps<"a">) {
  const external = /^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith("//");

  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noreferrer" })}
      {...props}
      {...stylex.props(styles.link)}
    />
  );
}

export function Paragraph(props: ComponentProps<"p">) {
  return <p {...props} {...stylex.props(styles.block, styles.paragraph)} />;
}

export function UnorderedList(props: ComponentProps<"ul">) {
  return <ul {...props} {...stylex.props(styles.block, styles.list, styles.disc)} />;
}

export function OrderedList(props: ComponentProps<"ol">) {
  return <ol {...props} {...stylex.props(styles.block, styles.list, styles.decimal)} />;
}

export function ListItem(props: ComponentProps<"li">) {
  return <li {...props} {...stylex.props(styles.listItem)} />;
}

export function Blockquote(props: ComponentProps<"blockquote">) {
  return <blockquote {...props} {...stylex.props(styles.block, styles.blockquote)} />;
}

export function Rule(props: ComponentProps<"hr">) {
  return <hr {...props} {...stylex.props(styles.rule)} />;
}

export function Table(props: ComponentProps<"table">) {
  return (
    <div {...stylex.props(styles.block, styles.tableWrap)}>
      <table {...props} {...stylex.props(styles.table)} />
    </div>
  );
}

export function TableHeaderCell(props: ComponentProps<"th">) {
  return <th {...props} {...stylex.props(styles.cell, styles.headerCell)} />;
}

export function TableCell(props: ComponentProps<"td">) {
  return <td {...props} {...stylex.props(styles.cell)} />;
}

export function Image({ alt = "", ...props }: ComponentProps<"img">) {
  return <img alt={alt} loading="lazy" {...props} {...stylex.props(styles.block, styles.image)} />;
}

const styles = stylex.create({
  block: { marginTop: { default: 16, ":first-child": 0 } },
  heading: {
    position: "relative",
    color: colors.ink,
    scrollMarginTop: 80,
  },
  headingLink: {
    color: "inherit",
    textDecoration: "none",
  },
  anchorIcon: {
    display: "inline",
    marginLeft: 8,
    verticalAlign: "middle",
    color: colors.inkFaint,
    opacity: { default: 0, [stylex.when.ancestor(":hover")]: 1 },
    transitionProperty: "opacity",
    transitionDuration: "120ms",
  },
  link: {
    color: colors.accentInk,
    textDecorationLine: "underline",
    textDecorationColor: { default: colors.lineStrong, ":hover": colors.accentInk },
    textDecorationThickness: 1,
    textUnderlineOffset: 3,
    transitionProperty: "text-decoration-color",
    transitionDuration: "120ms",
  },
  paragraph: {
    fontSize: 15.5,
    lineHeight: 1.75,
    color: colors.inkMuted,
  },
  list: {
    paddingLeft: 22,
    fontSize: 15.5,
    lineHeight: 1.75,
    color: colors.inkMuted,
  },
  disc: { listStyleType: "disc" },
  decimal: { listStyleType: "decimal" },
  listItem: {
    marginTop: { default: 6, ":first-child": 0 },
    paddingLeft: 4,
    "::marker": { color: colors.inkFaint },
  },
  blockquote: {
    paddingBlock: 2,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftStyle: "solid",
    borderLeftColor: colors.lineStrong,
    color: colors.inkMuted,
  },
  rule: {
    marginBlock: 32,
    height: 1,
    backgroundColor: colors.line,
  },
  tableWrap: {
    overflowX: "auto",
    borderRadius: 10,
    boxShadow: `inset 0 0 0 1px ${colors.line}`,
  },
  table: {
    width: "100%",
    fontSize: 14,
    lineHeight: 1.55,
    color: colors.inkMuted,
  },
  cell: {
    paddingBlock: 10,
    paddingInline: 14,
    textAlign: "left",
    verticalAlign: "top",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.line,
  },
  headerCell: {
    borderTopWidth: 0,
    backgroundColor: colors.surfaceMuted,
    fontFamily: fonts.sans,
    fontWeight: 500,
    color: colors.ink,
    whiteSpace: "nowrap",
  },
  image: { borderRadius: 10 },
});

const headingStyles = stylex.create({
  h1: {
    marginTop: { default: 48, ":first-child": 0 },
    fontSize: 30,
    lineHeight: 1.2,
    fontWeight: 500,
    letterSpacing: "-0.03em",
  },
  h2: {
    marginTop: { default: 44, ":first-child": 0 },
    fontSize: 24,
    lineHeight: 1.25,
    fontWeight: 500,
    letterSpacing: "-0.025em",
  },
  h3: {
    marginTop: { default: 32, ":first-child": 0 },
    fontSize: 19,
    lineHeight: 1.3,
    fontWeight: 600,
    letterSpacing: "-0.015em",
  },
  h4: {
    marginTop: { default: 24, ":first-child": 0 },
    fontSize: 16,
    lineHeight: 1.4,
    fontWeight: 600,
  },
  h5: {
    marginTop: { default: 20, ":first-child": 0 },
    fontSize: 15,
    lineHeight: 1.4,
    fontWeight: 600,
  },
  h6: {
    marginTop: { default: 20, ":first-child": 0 },
    fontSize: 14,
    lineHeight: 1.4,
    fontWeight: 600,
    color: colors.inkMuted,
  },
});
