import "./styles.css";

import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { RootProvider } from "fumadocs-ui/provider/base";
import browserCollections from "collections/browser";

import pageTree from "./page-tree.json";

type PageData = {
  path: string;
  title: string;
  description?: string;
};

const pages = Object.fromEntries(
  browserCollections.docs.getPages().map((page) => [
    page.slugs.length === 0 ? "/docs" : `/docs/${page.slugs.join("/")}`,
    {
      path: page.path,
      title: page.data.title,
      description: page.data.description,
    },
  ]),
) as Record<string, PageData>;

const clientLoader = browserCollections.docs.createClientLoader<PageData>({
  id: "docs",
  component({ default: MDX, toc }, page) {
    return (
      <DocsPage toc={toc}>
        <DocsTitle>{page.title}</DocsTitle>
        <DocsDescription>{page.description}</DocsDescription>
        <DocsBody>
          <MDX />
        </DocsBody>
      </DocsPage>
    );
  },
});

function App() {
  const pathname = normalizePath(window.location.pathname);
  const page = pages[pathname] ?? null;
  const data = useFumadocsLoader({ pageTree });

  if (!page) {
    return (
      <RootProvider>
        <DocsLayout tree={data.pageTree}>
          <DocsPage>
            <DocsTitle>Not found</DocsTitle>
            <DocsBody>
              <p>The page you requested does not exist.</p>
            </DocsBody>
          </DocsPage>
        </DocsLayout>
      </RootProvider>
    );
  }

  return (
    <RootProvider>
      <DocsLayout tree={data.pageTree}>
        <Suspense>{clientLoader.useContent(page.path, page)}</Suspense>
      </DocsLayout>
    </RootProvider>
  );
}

function normalizePath(pathname: string) {
  if (pathname === "/") {
    window.history.replaceState(null, "", "/docs");
    return "/docs";
  }

  return pathname.replace(/\/$/, "") || "/docs";
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
