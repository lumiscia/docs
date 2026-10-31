import { createFileRoute } from "@tanstack/react-router";

import { getLlmsFull, markdownCacheControl } from "@/src/lib/llms";

export const Route = createFileRoute("/llms-full.txt")({
  server: {
    handlers: {
      GET: async () =>
        new Response(await getLlmsFull(), {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": markdownCacheControl,
          },
        }),
    },
  },
});
