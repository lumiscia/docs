import { createFileRoute } from "@tanstack/react-router";

import { getLlmsIndex, markdownCacheControl } from "@/src/lib/llms";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(getLlmsIndex(), {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": markdownCacheControl,
          },
        }),
    },
  },
});
