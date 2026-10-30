import * as stylex from "@stylexjs/stylex";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { ArrowRight } from "lucide-react";

import { DocsLayout } from "@/src/components/docs/layout";
import { siteUrl } from "@/src/components/site/links";
import { source } from "@/src/lib/source";
import { colors, fonts, media } from "@/src/styles/tokens.stylex";

const getPageTree = createServerFn({ method: "GET" }).handler(() =>
  source.serializePageTree(source.pageTree),
);

export const Route = createFileRoute("/404")({
  loader: async () => ({ pageTree: await getPageTree() }),
  head: () => ({
    meta: [{ title: "Page not found | Lumiscia Docs" }, { name: "robots", content: "noindex" }],
  }),
  component: NotFoundPage,
});

function NotFoundPage() {
  const { pageTree } = useFumadocsLoader(Route.useLoaderData());

  return (
    <DocsLayout tree={pageTree}>
      <section {...stylex.props(styles.intro)}>
        <p {...stylex.props(styles.eyebrow)}>404</p>
        <h1 {...stylex.props(styles.title)}>this frame didn't render</h1>
        <p {...stylex.props(styles.lede)}>
          the page may have moved or the link you followed is out of date.
        </p>
        <div {...stylex.props(styles.actions)}>
          <a href="/" {...stylex.props(styles.button, styles.primary)}>
            docs home
          </a>
          <a href={siteUrl} {...stylex.props(styles.button, styles.ghost)}>
            lumiscia.com
            <ArrowRight size={14} />
          </a>
        </div>
      </section>
    </DocsLayout>
  );
}

const styles = stylex.create({
  intro: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 18,
    paddingTop: { default: 96, [media.tablet]: 64, [media.phone]: 48 },
    paddingBottom: { default: 96, [media.phone]: 48 },
    paddingInline: { default: 48, [media.phone]: 20 },
  },
  eyebrow: {
    margin: 0,
    fontFamily: fonts.mono,
    fontSize: 12,
    lineHeight: 1,
    letterSpacing: "0.08em",
    color: colors.accentInk,
  },
  title: {
    maxWidth: 820,
    margin: 0,
    fontSize: "clamp(40px, 5.2vw, 68px)",
    lineHeight: 1,
    fontWeight: 500,
    letterSpacing: "-0.035em",
  },
  lede: {
    maxWidth: 560,
    margin: 0,
    fontSize: { default: 18, [media.phone]: 16 },
    lineHeight: 1.5,
    color: colors.inkMuted,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    height: 40,
    paddingInline: 16,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1,
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  primary: {
    backgroundColor: colors.buttonBg,
    color: colors.buttonInk,
    boxShadow: {
      default: "none",
      [media.hover]: { default: "none", ":hover": `0 0 0 3px ${colors.lineStrong}` },
    },
  },
  ghost: {
    backgroundColor: { default: colors.buttonGhostBg, ":hover": colors.buttonGhostHover },
    color: colors.ink,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.line,
  },
});
