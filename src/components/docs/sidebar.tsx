import { Collapsible } from "@base-ui/react/collapsible";
import * as stylex from "@stylexjs/stylex";
import type * as PageTree from "fumadocs-core/page-tree";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

import { usePathname, isActiveUrl } from "@/src/lib/pathname";
import { colors, fonts } from "@/src/styles/tokens.stylex";

export function Sidebar({ tree }: { tree: PageTree.Root }) {
  const pathname = usePathname();

  return (
    <nav aria-label="docs" {...stylex.props(styles.nav)}>
      <NodeList nodes={tree.children} pathname={pathname} />
    </nav>
  );
}

function NodeList({ nodes, pathname }: { nodes: PageTree.Node[]; pathname: string }) {
  return nodes.map((node, index) => {
    const key = node.$id ?? index;

    if (node.type === "separator") {
      return (
        <p key={key} {...stylex.props(styles.section)}>
          {node.name}
        </p>
      );
    }

    if (node.type === "folder") {
      return <SidebarFolder key={key} folder={node} pathname={pathname} />;
    }

    return <SidebarLink key={key} item={node} active={isActiveUrl(node.url, pathname)} />;
  });
}

function SidebarLink({ item, active }: { item: PageTree.Item; active: boolean }) {
  return (
    <a
      href={item.url}
      aria-current={active ? "page" : undefined}
      {...(item.external && { target: "_blank", rel: "noreferrer" })}
      {...stylex.props(styles.row, styles.link, active && styles.active)}
    >
      {item.name}
    </a>
  );
}

function SidebarFolder({ folder, pathname }: { folder: PageTree.Folder; pathname: string }) {
  const [open, setOpen] = useState(() => folder.defaultOpen || containsUrl(folder, pathname));
  const indexActive = folder.index ? isActiveUrl(folder.index.url, pathname) : false;
  const chevron = (
    <ChevronRight size={14} {...stylex.props(styles.chevron, open && styles.chevronOpen)} />
  );

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      {folder.index ? (
        <div {...stylex.props(styles.folderRow)}>
          <a
            href={folder.index.url}
            aria-current={indexActive ? "page" : undefined}
            {...stylex.props(styles.row, styles.link, styles.grow, indexActive && styles.active)}
          >
            {folder.name}
          </a>
          <Collapsible.Trigger
            aria-label={open ? "collapse section" : "expand section"}
            {...stylex.props(styles.toggle)}
          >
            {chevron}
          </Collapsible.Trigger>
        </div>
      ) : (
        <Collapsible.Trigger {...stylex.props(styles.row, styles.link, styles.folderTrigger)}>
          {folder.name}
          {chevron}
        </Collapsible.Trigger>
      )}
      <Collapsible.Panel {...stylex.props(styles.panel)}>
        <NodeList nodes={folder.children} pathname={pathname} />
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

function containsUrl(folder: PageTree.Folder, pathname: string): boolean {
  if (folder.index && isActiveUrl(folder.index.url, pathname)) return true;
  return folder.children.some((node) =>
    node.type === "folder"
      ? containsUrl(node, pathname)
      : node.type === "page" && isActiveUrl(node.url, pathname),
  );
}

const styles = stylex.create({
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    padding: 12,
  },
  section: {
    marginTop: { default: 20, ":first-child": 4 },
    marginBottom: 6,
    paddingInline: 10,
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.inkFaint,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minHeight: 32,
    paddingBlock: 6,
    paddingInline: 10,
    borderRadius: 7,
    fontSize: 14,
    lineHeight: 1.35,
    textAlign: "left",
  },
  link: {
    color: { default: colors.inkMuted, ":hover": colors.ink },
    backgroundColor: { default: "transparent", ":hover": colors.surfaceMuted },
    textDecoration: "none",
  },
  active: {
    color: { default: colors.accentInk, ":hover": colors.accentInk },
    backgroundColor: { default: colors.accentSoft, ":hover": colors.accentSoft },
    fontWeight: 500,
  },
  grow: { flexGrow: 1, minWidth: 0 },
  folderRow: { display: "flex", alignItems: "center", gap: 2 },
  folderTrigger: {
    justifyContent: "space-between",
    width: "100%",
    cursor: "pointer",
  },
  toggle: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: 28,
    height: 28,
    borderRadius: 6,
    color: { default: colors.inkFaint, ":hover": colors.ink },
    backgroundColor: { default: "transparent", ":hover": colors.surfaceMuted },
    cursor: "pointer",
  },
  chevron: {
    flexShrink: 0,
    color: colors.inkFaint,
    transitionProperty: "transform",
    transitionDuration: "160ms",
  },
  chevronOpen: { transform: "rotate(90deg)" },
  panel: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    marginLeft: 16,
    paddingLeft: 6,
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: colors.line,
  },
});
