# Lumiscia Docs

Documentation site for Lumiscia, built with Fumadocs, TanStack Start, React, and Tailwind CSS.

## Quick Start

```sh
pnpm install
pnpm dev
```

Open <http://localhost:3001> to preview the docs locally.

## Common Commands

```sh
pnpm dev             # Start the local docs server
pnpm check           # Type-check the docs app
pnpm build           # Prerender the static site into dist/client
pnpm preview         # Preview the production build locally
pnpm deploy:dry-run  # Build and validate a Cloudflare deploy
pnpm deploy          # Publish to docs.lumiscia.com
```

## Project Structure

- `content/docs` contains the MDX documentation pages.
- `content/docs/**/meta.json` controls sidebar labels and ordering.
- `src` contains the TanStack Start routes, router setup, and global styles.
- `wrangler.jsonc` configures Cloudflare Workers static assets for `docs.lumiscia.com`.

## Publishing

The site publishes with Wrangler as a Cloudflare Workers static assets app. TanStack Start prerenders each docs route to static HTML during `pnpm build`.

```sh
pnpm deploy
```

Wrangler generated types are intentionally ignored by Git. Regenerate them locally with:

```sh
pnpm typegen
```
