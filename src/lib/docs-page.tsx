import { Suspense } from "react";
import type { ComponentProps } from "react";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import browserCollections from "collections/browser";

import type { source } from "./source";

export type DocsPageData = {
  path: string;
  title: string;
  description?: string;
  pageTree: Awaited<ReturnType<typeof source.serializePageTree>>;
};

export const docsClientLoader = browserCollections.docs.createClientLoader<DocsPageData>({
  id: "docs",
  component({ default: MDX, toc }, page) {
    return (
      <DocsPage toc={toc}>
        <DocsTitle>{page.title}</DocsTitle>
        <DocsDescription>{page.description}</DocsDescription>
        <DocsBody>
          <MDX components={getMdxComponents(page.path)} />
        </DocsBody>
      </DocsPage>
    );
  },
});

const GITHUB_URL = "https://github.com/lumiscia/docs";

function getMdxComponents(path: string) {
  const Link = defaultMdxComponents.a;

  return {
    ...defaultMdxComponents,
    a: (props: ComponentProps<"a">) => <Link {...props} href={resolveDocsHref(path, props.href)} />,
  };
}

function resolveDocsHref(path: string, href: ComponentProps<"a">["href"]) {
  if (!href || href.startsWith("/") || href.startsWith("#") || href.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(href)) {
    return href;
  }

  const sourceDir = path.replace(/\/?[^/]+\.(md|mdx)$/, "");
  const url = new URL(href, `https://docs.local/${sourceDir ? `${sourceDir}/` : ""}`);
  const pathname = url.pathname.replace(/\/index$/, "");

  return `${pathname}${url.search}${url.hash}`;
}

function SidebarTitle() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid size-7 shrink-0 place-items-center rounded-md border bg-fd-background shadow-xs">
        <img src="/logo.svg" alt="" className="size-5" />
      </span>
      <span className="font-semibold tracking-normal text-fd-foreground">Lumiscia</span>
    </span>
  );
}

export function DocsContent({ data }: { data: DocsPageData }) {
  const Content = docsClientLoader.getComponent(data.path);
  const layout = useFumadocsLoader({ pageTree: data.pageTree });

  return (
    <DocsLayout
      githubUrl={GITHUB_URL}
      nav={{ title: <SidebarTitle />, url: "/" }}
      tree={layout.pageTree}
    >
      <Suspense>
        <Content {...data} />
      </Suspense>
    </DocsLayout>
  );
}
