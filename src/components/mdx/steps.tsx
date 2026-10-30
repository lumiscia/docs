import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { colors, fonts } from "@/src/styles/tokens.stylex";

export function Steps({ children }: { children?: ReactNode }) {
  return <div {...stylex.props(styles.steps)}>{children}</div>;
}

export function Step({ children }: { children?: ReactNode }) {
  return <div {...stylex.props(styles.step)}>{children}</div>;
}

const styles = stylex.create({
  steps: {
    marginTop: { default: 24, ":first-child": 0 },
    marginLeft: 13,
    paddingLeft: 28,
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: colors.line,
    counterReset: "step",
  },
  step: {
    position: "relative",
    paddingBottom: { default: 28, ":last-child": 0 },
    counterIncrement: "step",
    "::before": {
      content: "counter(step)",
      position: "absolute",
      top: 0,
      left: -42,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 27,
      height: 27,
      borderRadius: 999,
      backgroundColor: colors.surface,
      boxShadow: `inset 0 0 0 1px ${colors.lineStrong}`,
      fontFamily: fonts.mono,
      fontSize: 12,
      color: colors.ink,
    },
  },
});
