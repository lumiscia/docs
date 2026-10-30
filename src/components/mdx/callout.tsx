import * as stylex from "@stylexjs/stylex";
import { CircleCheck, Info, OctagonX, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { colors } from "@/src/styles/tokens.stylex";

const icons = { info: Info, warn: TriangleAlert, error: OctagonX, success: CircleCheck };

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: keyof typeof icons;
  title?: ReactNode;
  children?: ReactNode;
}) {
  const Icon = icons[type];

  return (
    <div role="note" {...stylex.props(styles.callout, tones[type])}>
      <Icon size={16} {...stylex.props(styles.icon)} />
      <div {...stylex.props(styles.content)}>
        {title && <p {...stylex.props(styles.title)}>{title}</p>}
        {children}
      </div>
    </div>
  );
}

const styles = stylex.create({
  callout: {
    display: "flex",
    gap: 12,
    marginTop: { default: 20, ":first-child": 0 },
    paddingBlock: 14,
    paddingInline: 16,
    borderRadius: 10,
    backgroundColor: colors.surface,
    boxShadow: `inset 0 0 0 1px ${colors.line}`,
    fontSize: 15,
  },
  icon: { flexShrink: 0, marginTop: 5 },
  content: { flexGrow: 1, minWidth: 0 },
  title: {
    marginBottom: 4,
    fontSize: 15,
    lineHeight: 1.6,
    fontWeight: 600,
    color: colors.ink,
  },
});

const tones = stylex.create({
  info: { color: colors.accent, backgroundColor: colors.accentSoft },
  warn: { color: colors.warning, backgroundColor: colors.warningSoft },
  error: { color: colors.danger, backgroundColor: colors.dangerSoft },
  success: { color: colors.success, backgroundColor: colors.successSoft },
});
