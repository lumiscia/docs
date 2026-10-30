import * as stylex from "@stylexjs/stylex";
import { findNeighbour } from "fumadocs-core/page-tree";
import type * as PageTree from "fumadocs-core/page-tree";
import { AnchorProvider } from "fumadocs-core/toc";
import type { TableOfContents } from "fumadocs-core/toc";
import { ArrowLeft, ArrowRight, SquarePen } from "lucide-react";
import type { ReactNode } from "react";

import { PageActions } from "@/src/components/docs/page-actions";
import { Toc } from "@/src/components/docs/toc";
import { docsRepoUrl } from "@/src/components/site/links";
import { colors, fonts, layout, media } from "@/src/styles/tokens.stylex";

type DocsPageProps = {
  title: string;
  description?: string;
  url: string;
  path: string;
  tree: PageTree.Root;
  toc: TableOfContents;
  children: ReactNode;
};

export function DocsPage({ title, description, url, path, tree, toc, children }: DocsPageProps) {
  const { previous, next } = findNeighbour(tree, url);

  return (
    <AnchorProvider toc={toc} single>
      <div {...stylex.props(styles.grid)}>
        <article {...stylex.props(styles.article)}>
          <header {...stylex.props(styles.header)}>
            <h1 {...stylex.props(styles.title)}>{title}</h1>
            {description && <p {...stylex.props(styles.description)}>{description}</p>}
            <PageActions url={url} />
          </header>
          <div {...stylex.props(styles.body)}>{children}</div>
          <footer {...stylex.props(styles.footer)}>
            <a
              href={`${docsRepoUrl}/blob/main/content/docs/${path}`}
              target="_blank"
              rel="noreferrer"
              {...stylex.props(styles.edit)}
            >
              <SquarePen size={14} />
              edit on github
            </a>
            {(previous || next) && (
              <nav aria-label="pagination" {...stylex.props(styles.pager)}>
                {previous && <PagerLink item={previous} direction="previous" />}
                {next && <PagerLink item={next} direction="next" />}
              </nav>
            )}
          </footer>
        </article>
        <aside {...stylex.props(styles.toc)}>
          <Toc items={toc} />
        </aside>
      </div>
    </AnchorProvider>
  );
}

function PagerLink({ item, direction }: { item: PageTree.Item; direction: "previous" | "next" }) {
  const next = direction === "next";

  return (
    <a href={item.url} {...stylex.props(styles.pagerLink, next && styles.pagerNext)}>
      <span {...stylex.props(styles.pagerLabel, next && styles.pagerLabelNext)}>
        {next ? null : <ArrowLeft size={13} />}
        {direction}
        {next ? <ArrowRight size={13} /> : null}
      </span>
      <span {...stylex.props(styles.pagerTitle)}>{item.name}</span>
    </a>
  );
}

const styles = stylex.create({
  grid: {
    display: "flex",
    gap: 48,
    paddingTop: { default: 48, [media.phone]: 32 },
    paddingBottom: 64,
    paddingInline: { default: 48, [media.tablet]: 32, [media.phone]: 20 },
  },
  article: {
    flexGrow: 1,
    minWidth: 0,
    maxWidth: 760,
    marginInline: "auto",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    paddingBottom: 28,
    marginBottom: 28,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.line,
  },
  title: {
    fontSize: "clamp(30px, 3.4vw, 40px)",
    lineHeight: 1.1,
    fontWeight: 500,
    letterSpacing: "-0.03em",
  },
  description: {
    fontSize: { default: 17, [media.phone]: 16 },
    lineHeight: 1.55,
    color: colors.inkMuted,
  },
  body: { minWidth: 0 },
  footer: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    marginTop: 56,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.line,
  },
  edit: {
    display: "inline-flex",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    fontSize: 13.5,
    color: { default: colors.inkMuted, ":hover": colors.ink },
    textDecoration: "none",
  },
  pager: {
    display: "grid",
    gridTemplateColumns: { default: "1fr 1fr", [media.phone]: "1fr" },
    gap: 12,
  },
  pagerLink: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    paddingBlock: 14,
    paddingInline: 16,
    borderRadius: 10,
    backgroundColor: colors.surface,
    boxShadow: {
      default: `inset 0 0 0 1px ${colors.line}`,
      ":hover": `inset 0 0 0 1px ${colors.lineStrong}`,
    },
    textDecoration: "none",
  },
  pagerNext: {
    alignItems: "flex-end",
    textAlign: "right",
    gridColumn: { default: 2, [media.phone]: 1 },
  },
  pagerLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.inkFaint,
  },
  pagerLabelNext: { justifyContent: "flex-end" },
  pagerTitle: { fontSize: 15, fontWeight: 500, color: colors.ink },
  toc: {
    display: { default: "block", [media.laptop]: "none" },
    position: "sticky",
    top: `calc(${layout.headerHeight} + 48px)`,
    alignSelf: "flex-start",
    flexShrink: 0,
    width: 200,
    maxHeight: `calc(100vh - ${layout.headerHeight} - 96px)`,
    overflowY: "auto",
  },
});
