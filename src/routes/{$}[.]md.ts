import { createFileRoute } from "@tanstack/react-router";

import { getPageMarkdown, markdownCacheControl } from "@/src/lib/llms";
import { source } from "@/src/lib/source";

// `/guides/animation.md` serves the Markdown of `/guides/animation`; `/index.md` serves `/`.
export const Route = createFileRoute("/{$}.md")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const slugs = params._splat?.split("/").filter(Boolean) ?? [];
        const page = source.getPage(slugs.join("/") === "index" ? [] : slugs);

        if (!page) {
          return new Response("Not found\n", {
            status: 404,
            headers: { "content-type": "text/plain; charset=utf-8" },
          });
        }

        return new Response(await getPageMarkdown(page), {
          headers: {
            "content-type": "text/markdown; charset=utf-8",
            "cache-control": markdownCacheControl,
          },
        });
      },
    },
  },
});
