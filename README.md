# Lumiscia Docs

Documentation site for Lumiscia, built with Fumadocs, TanStack Start, React, StyleX, and Base UI.

## Quick Start

Requires [Vite+](https://viteplus.dev) (`vp`) and [just](https://just.systems).

```sh
vp install
just dev
```

Open <http://localhost:3001> to preview the docs locally.

## Common Commands

```sh
just dev             # Start the local docs server
just check           # Check formatting, lint and types
just build           # Prerender the static site into dist/client
just ready           # Run everything CI runs
vp run preview       # Preview the production build locally
just deploy-dry-run  # Build and validate a Cloudflare deploy
vp run deploy        # Publish to docs.lumiscia.com
vp run deploy:beta   # Upload a preview to beta-lumiscia-docs.oglassyt.workers.dev
```

## Project Structure

- `content/docs` contains the MDX documentation pages.
- `content/docs/**/meta.json` controls sidebar labels and ordering.
- `src` contains the TanStack Start routes, StyleX components and tokens, and the reset stylesheet.
- `wrangler.jsonc` configures Cloudflare Workers static assets for `docs.lumiscia.com`.

## Publishing

The site publishes with Wrangler as a Cloudflare Workers static assets app. TanStack Start prerenders each docs route to static HTML during `vp build`.

```sh
vp run deploy
```

To preview unreleased docs, upload the current checkout as a Worker version under the `beta` preview alias. Production traffic stays on the deployed version, and the preview build sets `noindex` and points its Markdown links at the preview origin.

```sh
vp run deploy:beta
```

Wrangler generated types are intentionally ignored by Git. Regenerate them locally with:

```sh
just typegen
```
