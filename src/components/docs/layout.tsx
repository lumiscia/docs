import * as stylex from "@stylexjs/stylex";
import type * as PageTree from "fumadocs-core/page-tree";
import type { ReactNode } from "react";

import { Sidebar } from "@/src/components/docs/sidebar";
import { Header } from "@/src/components/site/header";
import { colors, layout, media } from "@/src/styles/tokens.stylex";

export function DocsLayout({ tree, children }: { tree: PageTree.Root; children: ReactNode }) {
  return (
    <div {...stylex.props(styles.page)}>
      <Header tree={tree} />
      <div {...stylex.props(styles.band)}>
        <div {...stylex.props(styles.column)}>
          <aside {...stylex.props(styles.sidebar)}>
            <Sidebar tree={tree} />
          </aside>
          <main {...stylex.props(styles.main)}>{children}</main>
        </div>
      </div>
    </div>
  );
}

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  band: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    paddingInline: { default: layout.gutter, [media.phone]: 0 },
  },
  column: {
    display: "flex",
    flexGrow: 1,
    width: "100%",
    maxWidth: layout.maxWidth,
    marginInline: "auto",
    borderInlineWidth: { default: 1, [media.phone]: 0 },
    borderBlockWidth: 0,
    borderStyle: "solid",
    borderColor: colors.line,
  },
  sidebar: {
    display: { default: "block", [media.tablet]: "none" },
    position: "sticky",
    top: layout.headerHeight,
    flexShrink: 0,
    alignSelf: "flex-start",
    width: 260,
    maxHeight: `calc(100vh - ${layout.headerHeight})`,
    overflowY: "auto",
    overscrollBehavior: "contain",
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderRightColor: colors.line,
  },
  main: { flexGrow: 1, minWidth: 0 },
});
