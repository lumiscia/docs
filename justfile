# Check formatting, lint, types and build the site
ready:
	vp check
	vp exec node scripts/check-nodes.ts
	vp build

# Start the docs dev server on port 3001
dev:
	vp run dev

# Check formatting, lint and types
check:
	vp check

# Check that every schema node has a reference page
check-nodes:
	vp exec node scripts/check-nodes.ts

# Copy the engine's composition schema from a lumen-oss checkout
sync-schema lumen="../lumen-oss":
	cp {{lumen}}/definitions/composition.schema.json schema/composition.schema.json

# Prerender the static site into dist/client
build:
	vp build

# Regenerate Cloudflare worker types
typegen:
	vp run typegen

# Build and validate a Cloudflare deploy without publishing
deploy-dry-run:
	vp run deploy:dry-run
