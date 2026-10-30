import geistMono from "@fontsource-variable/geist-mono?url";
import interTight from "@fontsource-variable/inter-tight?url";
import * as stylex from "@stylexjs/stylex";
import { createRootRoute, HeadContent, Outlet, Scripts, ScriptOnce } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { themeScript } from "@/src/lib/theme";
import { isActiveUrl, notFoundPath, usePathname } from "@/src/lib/pathname";
import { colors, fonts } from "@/src/styles/tokens.stylex";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lumiscia Docs" },
      {
        name: "description",
        content: "Documentation for building dynamic visual compositions with Lumiscia.",
      },
    ],
    links: [
      { rel: "stylesheet", href: interTight },
      { rel: "stylesheet", href: geistMono },
      { rel: "stylesheet", href: appCss },
      // StyleX serves its CSS from a virtual module in dev; builds append it to styles.css.
      ...(import.meta.env.DEV ? [{ rel: "stylesheet", href: "/virtual:stylex.css" }] : []),
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/logo.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/logo192.png" },
      { rel: "manifest", href: "/manifest.json" },
    ],
    scripts: import.meta.env.DEV ? [{ type: "module", src: "/virtual:stylex.js" }] : [],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  const isNotFound = isActiveUrl(notFoundPath, usePathname());

  return (
    <html
      lang="en"
      data-not-found={isNotFound || undefined}
      suppressHydrationWarning
      {...stylex.props(styles.html)}
    >
      <head>
        <ScriptOnce>{themeScript}</ScriptOnce>
        <HeadContent />
      </head>
      <body {...stylex.props(styles.body)}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const styles = stylex.create({
  html: { backgroundColor: colors.page },
  body: {
    margin: 0,
    fontFamily: fonts.sans,
    backgroundColor: colors.page,
    color: colors.ink,
    WebkitFontSmoothing: "antialiased",
    textRendering: "optimizeLegibility",
  },
});
