import { Dialog } from "@base-ui/react/dialog";
import * as stylex from "@stylexjs/stylex";
import type * as PageTree from "fumadocs-core/page-tree";
import { Menu, X } from "lucide-react";

import { Sidebar } from "@/src/components/docs/sidebar";
import { navLinks } from "@/src/components/site/links";
import { colors, fonts, media } from "@/src/styles/tokens.stylex";

export function MobileNav({ tree }: { tree: PageTree.Root }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger aria-label="menu" {...stylex.props(styles.trigger)}>
        <Menu size={18} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop {...stylex.props(styles.backdrop)} />
        <Dialog.Popup {...stylex.props(styles.drawer)}>
          <div {...stylex.props(styles.head)}>
            <Dialog.Title {...stylex.props(styles.title)}>menu</Dialog.Title>
            <Dialog.Close aria-label="close menu" {...stylex.props(styles.close)}>
              <X size={16} />
            </Dialog.Close>
          </div>
          <nav aria-label="site" {...stylex.props(styles.links)}>
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
          <Sidebar tree={tree} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const styles = stylex.create({
  trigger: {
    display: { default: "none", [media.tablet]: "inline-flex" },
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: 32,
    height: 32,
    padding: 0,
    borderWidth: 0,
    borderRadius: 6,
    backgroundColor: "transparent",
    color: colors.ink,
    boxShadow: `inset 0 0 0 1px ${colors.line}`,
    cursor: "pointer",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 60,
    backgroundColor: "rgba(8, 8, 12, 0.55)",
    opacity: { default: 1, ":is([data-starting-style])": 0, ":is([data-ending-style])": 0 },
    transitionProperty: "opacity",
    transitionDuration: "200ms",
  },
  drawer: {
    position: "fixed",
    zIndex: 61,
    top: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    width: "min(320px, calc(100vw - 48px))",
    overflowY: "auto",
    backgroundColor: colors.page,
    color: colors.ink,
    fontFamily: fonts.sans,
    boxShadow: `1px 0 0 ${colors.line}, 24px 0 60px -20px rgba(0,0,0,0.45)`,
    outline: "none",
    transform: {
      default: "translateX(0)",
      ":is([data-starting-style])": "translateX(-100%)",
      ":is([data-ending-style])": "translateX(-100%)",
    },
    transitionProperty: "transform",
    transitionDuration: "240ms",
    transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 56,
    paddingInline: 16,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.line,
  },
  title: {
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.inkFaint,
  },
  close: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 6,
    color: colors.inkMuted,
    boxShadow: `inset 0 0 0 1px ${colors.line}`,
    cursor: "pointer",
  },
  links: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.line,
  },
  link: {
    paddingBlock: 8,
    paddingInline: 10,
    borderRadius: 7,
    fontSize: 14,
    fontWeight: 500,
    color: colors.ink,
    textDecoration: "none",
    backgroundColor: { default: "transparent", ":hover": colors.surfaceMuted },
  },
});
