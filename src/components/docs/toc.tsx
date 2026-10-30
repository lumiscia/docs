import * as stylex from "@stylexjs/stylex";
import { TOCItem } from "fumadocs-core/toc";
import type { TableOfContents } from "fumadocs-core/toc";

import { colors, fonts } from "@/src/styles/tokens.stylex";

export function Toc({ items }: { items: TableOfContents }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="on this page" {...stylex.props(styles.nav)}>
      <p {...stylex.props(styles.label)}>on this page</p>
      <div {...stylex.props(styles.list)}>
        {items.map((item) => (
          <TOCItem
            key={item.url}
            href={item.url}
            {...stylex.props(styles.item, item.depth >= 3 && styles.nested)}
          >
            {item.title}
          </TOCItem>
        ))}
      </div>
    </nav>
  );
}

const styles = stylex.create({
  nav: { display: "flex", flexDirection: "column", gap: 10 },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.inkFaint,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: colors.line,
  },
  item: {
    marginLeft: -1,
    paddingBlock: 5,
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: { default: "transparent", ":is([data-active=true])": colors.accent },
    fontSize: 13,
    lineHeight: 1.4,
    color: {
      default: colors.inkMuted,
      ":hover": colors.ink,
      ":is([data-active=true])": colors.ink,
    },
    textDecoration: "none",
    transitionProperty: "color, border-color",
    transitionDuration: "120ms",
  },
  nested: { paddingLeft: 24 },
});
