import { createRouter } from "@tanstack/react-router";

import { notFoundPath } from "@/src/lib/pathname";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    rewrite: getNotFoundRewrite(),
  });
}

// Cloudflare serves the prerendered 404 page at every unknown URL. Routing it as /404 lets it
// hydrate without loading the requested path, while the address bar keeps the requested URL.
function getNotFoundRewrite() {
  if (typeof document === "undefined" || !("notFound" in document.documentElement.dataset)) {
    return undefined;
  }

  const requestedHref = window.location.href;

  return {
    input: ({ url }: { url: URL }) => new URL(notFoundPath, url),
    output: ({ url }: { url: URL }) => (url.pathname === notFoundPath ? requestedHref : undefined),
  };
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
