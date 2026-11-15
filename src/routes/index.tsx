import { createFileRoute } from "@tanstack/react-router";

import { getDocsPageData } from "./$";
import { DocsContent, docsClientLoader, docsHead } from "@/src/lib/docs-page";
import type { DocsPageData } from "@/src/lib/docs-page";

export const Route = createFileRoute("/")({
  loader: async () => {
    const data = (await getDocsPageData({
      data: [],
    })) as DocsPageData;

    await docsClientLoader.preload(data.path);

    return data;
  },
  head: ({ loaderData }) => docsHead(loaderData),
  component: IndexPage,
});

function IndexPage() {
  const data = Route.useLoaderData();

  return <DocsContent data={data} />;
}
