import { readdirSync, statSync } from "node:fs";
import { join, posix, relative } from "node:path";
import stylex from "@stylexjs/unplugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { defineConfig } from "vite-plus";

const docsDir = join(import.meta.dirname, "content/docs");
const docsPages = getDocsPages(docsDir);
const searchIndexPath = "/api/search.json";
const prerenderPaths = new Set(["/", ...docsPages, searchIndexPath]);

export default defineConfig({
  fmt: {
    ignorePatterns: ["src/routeTree.gen.ts", ".source", "dist", "schema"],
  },
  lint: {
    ignorePatterns: ["src/routeTree.gen.ts", ".source", "dist", "schema"],
    options: { typeAware: true, typeCheck: true },
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    mdx(await import("./source.config.ts")),
    stylex.vite({
      useCSSLayers: true,
      // StyleX resolves `.stylex.ts` imports itself, so it needs the tsconfig `@/*` alias too.
      aliases: { "@/*": [`${import.meta.dirname}/*`] },
      // Fontsource ships `index.css` files, which would otherwise win StyleX's default target match.
      cssInjectionTarget: (fileName) => fileName.includes("styles-"),
    }),
    tanstackStart({
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: false,
        crawlLinks: true,
        failOnError: true,
        filter: ({ path }) => prerenderPaths.has(path),
      },
      pages: Array.from(prerenderPaths, (path) => ({
        path,
        prerender: { enabled: true },
        sitemap: { exclude: path === searchIndexPath },
      })),
      sitemap: {
        enabled: true,
        host: "https://docs.lumiscia.com",
      },
    }),
    react(),
  ],
});

function getDocsPages(dir: string) {
  const pages: string[] = [];
  walkDocs(dir, pages);

  return pages.sort();
}

function walkDocs(dir: string, pages: string[]) {
  for (const entry of readdirSync(dir)) {
    const absolutePath = join(dir, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      walkDocs(absolutePath, pages);
      continue;
    }

    if (!entry.endsWith(".mdx") && !entry.endsWith(".md")) {
      continue;
    }

    const path = relative(docsDir, absolutePath)
      .replace(/\.(mdx|md)$/, "")
      .split("/")
      .join(posix.sep);

    pages.push(path === "index" ? "/" : `/${path.replace(/\/index$/, "")}`);
  }
}
