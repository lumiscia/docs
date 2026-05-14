import "../styles.css";

import type { ComponentProps, ReactNode } from "react";
import { useMemo } from "react";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useParams,
  useRouterState,
} from "@tanstack/react-router";
import { FrameworkProvider, type Router } from "fumadocs-core/framework";
import { RootProvider as FumadocsRootProvider } from "fumadocs-ui/provider/base";

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
      {
        rel: "icon",
        href: "/favicon.ico",
        sizes: "any",
      },
      {
        rel: "icon",
        href: "/logo.svg",
        type: "image/svg+xml",
      },
      {
        rel: "apple-touch-icon",
        href: "/logo192.png",
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
    ],
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col">
        <FrameworkProvider
          Link={StaticDocsLink}
          useParams={useStaticDocsParams}
          usePathname={useStaticDocsPathname}
          useRouter={useStaticDocsRouter}
        >
          <FumadocsRootProvider theme={{ defaultTheme: "light", enableSystem: false }}>
            {children}
          </FumadocsRootProvider>
        </FrameworkProvider>
        <Scripts />
      </body>
    </html>
  );
}

function StaticDocsLink({ href = "#", prefetch: _prefetch, ...props }: ComponentProps<"a"> & { prefetch?: boolean }) {
  return <a href={href} {...props} />;
}

function useStaticDocsPathname() {
  return useRouterState({ select: (state) => state.location.pathname });
}

function useStaticDocsParams() {
  return useParams({ strict: false });
}

function useStaticDocsRouter(): Router {
  return useMemo(
    () => ({
      push(url) {
        window.location.assign(url);
      },
      refresh() {
        window.location.reload();
      },
    }),
    [],
  );
}
