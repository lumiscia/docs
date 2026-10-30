# Check formatting, lint, types and build the site
ready:
	vp check
	vp build

# Start the docs dev server on port 3001
dev:
	vp run dev

# Check formatting, lint and types
check:
	vp check

# Prerender the static site into dist/client
build:
	vp build

# Regenerate Cloudflare worker types
typegen:
	vp run typegen

# Build and validate a Cloudflare deploy without publishing
deploy-dry-run:
	vp run deploy:dry-run
