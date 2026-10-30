import { Menu as BaseMenu } from "@base-ui/react/menu";
import * as stylex from "@stylexjs/stylex";
import { Check } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { colors, fonts } from "@/src/styles/tokens.stylex";

export const MenuRoot = BaseMenu.Root;

export function MenuTrigger({
  xstyle,
  ...props
}: Omit<ComponentProps<typeof BaseMenu.Trigger>, "className" | "style"> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return <BaseMenu.Trigger {...props} {...stylex.props(xstyle)} />;
}

export function MenuPopup({
  align = "start",
  children,
  xstyle,
}: {
  align?: "start" | "center" | "end";
  children: ReactNode;
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner align={align} sideOffset={8} {...stylex.props(styles.positioner)}>
        <BaseMenu.Popup {...stylex.props(styles.popup, xstyle)}>{children}</BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return <div {...stylex.props(styles.label)}>{children}</div>;
}

export function MenuRadioGroup<T extends string>({
  value,
  onValueChange,
  options,
}: {
  value: T;
  onValueChange: (value: T) => void;
  options: readonly T[];
}) {
  return (
    <BaseMenu.RadioGroup value={value} onValueChange={(next) => onValueChange(next as T)}>
      {options.map((option) => (
        <BaseMenu.RadioItem
          key={option}
          value={option}
          closeOnClick={false}
          {...stylex.props(styles.item)}
        >
          {option}
          <BaseMenu.RadioItemIndicator {...stylex.props(styles.indicator)}>
            <Check size={14} />
          </BaseMenu.RadioItemIndicator>
        </BaseMenu.RadioItem>
      ))}
    </BaseMenu.RadioGroup>
  );
}

const styles = stylex.create({
  positioner: { zIndex: 50, outline: "none" },
  popup: {
    display: "flex",
    flexDirection: "column",
    minWidth: 220,
    maxWidth: "calc(100vw - 16px)",
    padding: 4,
    borderRadius: 10,
    backgroundColor: colors.surface,
    color: colors.ink,
    fontFamily: fonts.sans,
    overflowWrap: "anywhere",
    boxShadow: `0 0 0 1px ${colors.line}, 0 16px 36px -14px rgba(0,0,0,0.35)`,
    outline: "none",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minHeight: 34,
    paddingInline: 10,
    borderWidth: 0,
    borderRadius: 7,
    backgroundColor: { default: "transparent", ":is([data-highlighted])": colors.surfaceMuted },
    color: { default: colors.ink, ":is([data-disabled])": colors.inkFaint },
    fontFamily: "inherit",
    fontSize: 13.5,
    textAlign: "left",
    textDecoration: "none",
    cursor: "default",
    outline: "none",
    userSelect: "none",
  },
  label: {
    paddingTop: 8,
    paddingBottom: 6,
    paddingInline: 10,
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.inkFaint,
  },
  indicator: { display: "inline-flex", marginLeft: "auto", color: colors.accent },
});
