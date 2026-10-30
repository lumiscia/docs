import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { colors } from "@/src/styles/tokens.stylex";

export function Tabs({
  items,
  defaultIndex = 0,
  children,
}: {
  items: string[];
  defaultIndex?: number;
  children?: ReactNode;
}) {
  return (
    <BaseTabs.Root defaultValue={items[defaultIndex]} {...stylex.props(styles.root)}>
      <BaseTabs.List {...stylex.props(styles.list)}>
        {items.map((item) => (
          <BaseTabs.Tab key={item} value={item} {...stylex.props(styles.tab)}>
            {item}
          </BaseTabs.Tab>
        ))}
      </BaseTabs.List>
      {children}
    </BaseTabs.Root>
  );
}

export function Tab({ value, children }: { value: string; children?: ReactNode }) {
  return (
    <BaseTabs.Panel value={value} keepMounted {...stylex.props(styles.panel)}>
      {children}
    </BaseTabs.Panel>
  );
}

const styles = stylex.create({
  root: {
    marginTop: { default: 20, ":first-child": 0 },
    borderRadius: 10,
    backgroundColor: colors.surface,
    boxShadow: `inset 0 0 0 1px ${colors.line}`,
    overflow: "hidden",
  },
  list: {
    display: "flex",
    gap: 4,
    paddingInline: 8,
    overflowX: "auto",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.line,
  },
  tab: {
    flexShrink: 0,
    height: 40,
    paddingInline: 10,
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    borderBottomColor: { default: "transparent", ":is([data-active])": colors.ink },
    fontSize: 13.5,
    fontWeight: 500,
    color: {
      default: colors.inkMuted,
      ":hover": colors.ink,
      ":is([data-active])": colors.ink,
    },
    cursor: "pointer",
    outline: "none",
    ":focus-visible": { backgroundColor: colors.surfaceMuted },
  },
  panel: {
    padding: 16,
    outline: "none",
  },
});
