import * as stylex from "@stylexjs/stylex";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { colors } from "@/src/styles/tokens.stylex";

export function Cards({ children }: { children?: ReactNode }) {
  return <div {...stylex.props(styles.grid)}>{children}</div>;
}

export function Card({
  title,
  href,
  description,
  icon,
  children,
}: {
  title: ReactNode;
  href?: string;
  description?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  const external = href ? /^https?:\/\//.test(href) : false;
  const content = (
    <>
      {icon && <span {...stylex.props(styles.icon)}>{icon}</span>}
      <span {...stylex.props(styles.title)}>
        {title}
        {external && <ArrowUpRight size={14} {...stylex.props(styles.external)} />}
      </span>
      {description && <span {...stylex.props(styles.description)}>{description}</span>}
      {children}
    </>
  );

  if (!href) return <div {...stylex.props(styles.card)}>{content}</div>;

  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noreferrer" })}
      {...stylex.props(styles.card, styles.interactive)}
    >
      {content}
    </a>
  );
}

const styles = stylex.create({
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 12,
    marginTop: { default: 20, ":first-child": 0 },
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 16,
    borderRadius: 10,
    backgroundColor: colors.surface,
    boxShadow: `inset 0 0 0 1px ${colors.line}`,
    color: colors.inkMuted,
    fontSize: 14,
    lineHeight: 1.55,
    textDecoration: "none",
  },
  interactive: {
    boxShadow: {
      default: `inset 0 0 0 1px ${colors.line}`,
      ":hover": `inset 0 0 0 1px ${colors.lineStrong}`,
    },
    backgroundColor: { default: colors.surface, ":hover": colors.buttonGhostHover },
    transitionProperty: "box-shadow, background-color",
    transitionDuration: "120ms",
  },
  icon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    marginBottom: 4,
    borderRadius: 7,
    backgroundColor: colors.surfaceMuted,
    boxShadow: `inset 0 0 0 1px ${colors.line}`,
    color: colors.ink,
  },
  title: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 15,
    fontWeight: 500,
    color: colors.ink,
  },
  external: { color: colors.inkFaint },
  description: { color: colors.inkMuted },
});
