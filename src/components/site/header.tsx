import * as stylex from "@stylexjs/stylex";
import type * as PageTree from "fumadocs-core/page-tree";

import { MobileNav } from "@/src/components/docs/mobile-nav";
import { SearchDialog } from "@/src/components/docs/search-dialog";
import { GitHubIcon } from "@/src/components/site/icons";
import { githubUrl, navLinks } from "@/src/components/site/links";
import { Logo } from "@/src/components/site/logo";
import { ThemeMenu } from "@/src/components/site/theme-menu";
import { colors, layout, media } from "@/src/styles/tokens.stylex";

export function Header({ tree }: { tree: PageTree.Root }) {
  return (
    <header {...stylex.props(styles.band)}>
      <div {...stylex.props(styles.inner)}>
        <a href="/" aria-label="Lumiscia docs home" {...stylex.props(styles.lockup)}>
          <Logo width={22} height={22} />
          Lumiscia
          <span {...stylex.props(styles.badge)}>docs</span>
        </a>
        <nav aria-label="site" {...stylex.props(styles.nav)}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...(link.external && { target: "_blank", rel: "noreferrer" })}
              {...stylex.props(styles.link)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div {...stylex.props(styles.actions)}>
          <SearchDialog />
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="github"
            {...stylex.props(styles.icon)}
          >
            <GitHubIcon width={18} height={18} />
          </a>
          <ThemeMenu />
          <MobileNav tree={tree} />
        </div>
      </div>
    </header>
  );
}

const styles = stylex.create({
  band: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    backgroundColor: colors.page,
    paddingInline: { default: layout.gutter, [media.phone]: 0 },
  },
  inner: {
    display: "flex",
    alignItems: "center",
    gap: { default: 32, [media.tablet]: 16 },
    maxWidth: layout.maxWidth,
    height: layout.headerHeight,
    marginInline: "auto",
    paddingInline: { default: 24, [media.phone]: 16 },
    borderInlineWidth: { default: 1, [media.phone]: 0 },
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderStyle: "solid",
    borderColor: colors.line,
  },
  lockup: {
    display: "inline-flex",
    alignItems: "center",
    flexShrink: 0,
    gap: 8,
    fontSize: 17,
    fontWeight: 600,
    letterSpacing: "-0.03em",
    color: colors.ink,
    textDecoration: "none",
  },
  badge: {
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "-0.01em",
    color: colors.inkFaint,
  },
  nav: {
    display: { default: "flex", [media.tablet]: "none" },
    alignItems: "center",
    gap: 24,
  },
  link: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1,
    color: { default: colors.inkMuted, ":hover": colors.ink },
    textDecoration: "none",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: { default: 16, [media.phone]: 10 },
    marginLeft: "auto",
  },
  icon: {
    display: { default: "inline-flex", [media.phone]: "none" },
    color: { default: colors.inkMuted, ":hover": colors.ink },
  },
});
