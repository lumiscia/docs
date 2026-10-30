import { createFileRoute } from "@tanstack/react-router";

import { getDocsPageData } from "./$";
import { DocsContent, docsClientLoader } from "@/src/lib/docs-page";
import type { DocsPageData } from "@/src/lib/docs-page";

export const Route = createFileRoute("/")({
  loader: async () => {
    const data = (await getDocsPageData({
      data: [],
    })) as DocsPageData;

    await docsClientLoader.preload(data.path);

    return data;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title ? `${loaderData.title} | Lumiscia Docs` : "Lumiscia Docs" },
      ...(loaderData?.description
        ? [{ name: "description", content: loaderData.description }]
        : []),
    ],
    links: [{ rel: "canonical", href: "https://docs.lumiscia.com/" }],
  }),
  component: IndexPage,
});

function IndexPage() {
  const data = Route.useLoaderData();

  return <DocsContent data={data} />;
}
