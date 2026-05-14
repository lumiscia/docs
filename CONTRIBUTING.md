# Contributing

Thanks for helping improve the Lumiscia docs.

## Local setup

Install dependencies and start the docs site:

```sh
pnpm install
pnpm dev
```

The dev server runs at <http://localhost:3001>.

## Before opening a PR

Run the same checks as CI:

```sh
pnpm check
pnpm build
```

Use `pnpm deploy:dry-run` if you need to validate the Cloudflare Workers bundle without publishing.

## Content notes

- Put docs pages under `content/docs`.
- Update the nearest `meta.json` when adding, renaming, or reordering pages.
- New docs pages are picked up by the TanStack Start prerender list during `pnpm build`.
- Prefer short examples that users can paste into their own Lumiscia projects.
