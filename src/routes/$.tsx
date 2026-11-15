import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { DocsContent, docsClientLoader, docsHead } from "@/src/lib/docs-page";
import type { DocsPageData } from "@/src/lib/docs-page";
import { source } from "@/src/lib/source";

export const Route = createFileRoute("/$")({
  loader: async ({ params }) => {
    const data = (await getDocsPageData({
      data: params._splat?.split("/").filter(Boolean) ?? [],
    })) as DocsPageData;

    await docsClientLoader.preload(data.path);

    return data;
  },
  head: ({ loaderData }) => docsHead(loaderData),
  component: DocsRoute,
});

export const getDocsPageData = createServerFn({ method: "GET" })
  .validator((slugs: unknown): string[] => {
    if (!Array.isArray(slugs)) {
      return [];
    }

    return slugs.map(String);
  })
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs);

    if (!page) {
      throw notFound();
    }

    return {
      path: page.path,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      pageTree: await source.serializePageTree(source.pageTree),
    } satisfies DocsPageData;
  });

function DocsRoute() {
  const data = Route.useLoaderData();

  return <DocsContent data={data} />;
}
