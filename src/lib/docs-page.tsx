import { Suspense } from "react";
import type { ComponentProps } from "react";
import type * as PageTree from "fumadocs-core/page-tree";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import browserCollections from "collections/browser";

import { DocsLayout } from "@/src/components/docs/layout";
import { DocsPage } from "@/src/components/docs/page";
import { mdxComponents } from "@/src/components/mdx";
import { Link } from "@/src/components/mdx/prose";
import { resolveDocsHref } from "@/src/lib/docs-href";

import type { source } from "./source";

export type DocsPageData = {
  path: string;
  url: string;
  title: string;
  description?: string;
  pageTree: Awaited<ReturnType<typeof source.serializePageTree>>;
};

type DocsContentProps = { page: DocsPageData; tree: PageTree.Root };

export const docsClientLoader = browserCollections.docs.createClientLoader<DocsContentProps>({
  id: "docs",
  component({ default: MDX, toc }, { page, tree }) {
    return (
      <DocsPage
        title={page.title}
        description={page.description}
        url={page.url}
        path={page.path}
        tree={tree}
        toc={toc}
      >
        <MDX components={getMdxComponents(page.path)} />
      </DocsPage>
    );
  },
});

function getMdxComponents(path: string) {
  return {
    ...mdxComponents,
    a: (props: ComponentProps<"a">) => (
      <Link {...props} href={props.href && resolveDocsHref(path, props.href)} />
    ),
  };
}

export function DocsContent({ data }: { data: DocsPageData }) {
  const Content = docsClientLoader.getComponent(data.path);
  const { pageTree } = useFumadocsLoader({ pageTree: data.pageTree });

  return (
    <DocsLayout tree={pageTree}>
      <Suspense>
        <Content page={data} tree={pageTree} />
      </Suspense>
    </DocsLayout>
  );
}
