# Development Commands

Complete reference for all npm scripts and CLI commands available in Pereira Tech Talks v3.0.0.

## Quick Reference

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start development server |
| `pnpm run build` | Production build with type check |
| `pnpm run biome:check` | Check code quality |
| `pnpm run biome:fix` | Auto-fix code issues |
| `pnpm run astro:check` | TypeScript type checking |
| `pnpm run md:check` | Verify every HTML page has a matching `.md` for agents |
| `pnpm run md:check:strict` | Same as above; exits `1` on missing (for CI) |

## Development

### Start Dev Server

```bash
pnpm run dev
```

- Starts Astro development server at `http://localhost:8888`
- Hot Module Replacement (HMR) enabled
- Accessible on local network (host: true)

### Preview Production Build

```bash
pnpm run astro:preview
```

- Previews the production build locally
- Useful for testing before deployment

## Build Commands

### Production Build

```bash
pnpm run build
```

- Runs TypeScript checking (`astro check`)
- Builds static site to `dist/` folder
- Optimizes assets (CSS, JS, images)

### Production Build (Cloudflare Pages)

```bash
pnpm run build
```

This command:
1. Runs `prebuild` (generates WebP variants via `images:webp`)
2. Runs TypeScript checking (`astro check`)
3. Builds to `dist/` directory

**Output structure:**
```
dist/
├── index.html
├── about/index.html
├── blog/
│   └── ...
├── _astro/
│   ├── *.css
│   └── *.js
└── images/
```

## Code Quality

### Biome (Linting & Formatting)

**Check for issues:**
```bash
pnpm run biome:check
```

**Auto-fix issues:**
```bash
pnpm run biome:fix
```

**Fix with unsafe transformations:**
```bash
pnpm run biome:fix:unsafe
```

Biome handles both linting and formatting. It replaces ESLint and Prettier.

### TypeScript Checking

```bash
pnpm run astro:check
```

- Runs Astro's TypeScript checker
- Validates `.astro`, `.ts`, `.tsx` files
- Reports type errors

### Markdown-for-Agents Parity Check

```bash
pnpm run md:check          # Report missing .md files
pnpm run md:check:strict   # Same, but exits 1 on missing (for CI)
```

- Scans `dist/` for every `index.html` and checks it has a matching `.md` counterpart
- Catches agent-markdown coverage gaps before deployment (`MARKDOWN_FOR_AGENTS.md` endpoints)
- Requires `pnpm run build` to run first (operates on the build output)
- Excludes: `/internal/*`, `/api/*`, `/.well-known/*`, `/_astro/*`, `/images/*`, `/404`, `/rss.xml`, pagination, tag listings, and redirect pages
- When missing files appear, the report lists them by language (EN / ES)
- Script lives at `scripts/check-md-parity.mjs`

## Package Management

### Check for Updates

```bash
pnpm run ncu:check
```

- Uses `npm-check-updates` to list available updates
- Shows current vs latest versions

### Upgrade All Packages

```bash
pnpm run ncu:upgrade
```

- Updates all dependencies in `package.json`
- Run `pnpm install` after to apply changes

### Install Dependencies

```bash
pnpm install
```

## Lighthouse

### Run Lighthouse Audit

```bash
pnpm run lighthouse
```

- Runs Lighthouse CI against the built `dist/` folder
- Requires a prior `pnpm run build` (the `dist/` directory must exist)
- Requires Chrome installed locally
- Tests pages defined in `lighthouserc.cjs`: `/`, `/about/`, `/blog/`, `/es/`
- Asserts performance budgets: Performance >= 95, Accessibility = 100, Best Practices >= 95, SEO >= 95

## Release

### Create Release

```bash
pnpm run release
```

- Bumps patch version
- Creates commit with release message
- Format: `[🤖 Sergio Alexander Florez Galeano] New release to v{version} launched 🚀`

## Astro CLI

The Astro CLI is available via `pnpm run astro`:

```bash
# General help
pnpm run astro -- --help

# Add integration
pnpm run astro -- add svelte

# Sync content collections
pnpm run astro -- sync
```

### Common Astro Commands

| Command | Description |
|---------|-------------|
| `astro dev` | Start dev server |
| `astro build` | Build for production |
| `astro preview` | Preview build |
| `astro check` | Type checking |
| `astro sync` | Sync content collections |
| `astro add` | Add integrations |

## Workflow Examples

### Daily Development

```bash
# Start working
pnpm run dev

# Before committing
pnpm run biome:check
pnpm run astro:check
```

### Before Pull Request

```bash
# Full validation
pnpm run biome:check && pnpm run astro:check && pnpm run build
```

### Deploy (Cloudflare Pages)

Cloudflare Pages deploys automatically on push to `main`. No manual deploy step needed. Ensure `pnpm run build` succeeds locally before pushing.

### Update Dependencies

```bash
# Check what's available
pnpm run ncu:check

# Upgrade packages
pnpm run ncu:upgrade

# Install updated packages
pnpm install

# Verify everything works
pnpm run build
```

## Environment Variables

Astro uses `.env` files for environment variables:

```bash
# .env (local development)
PUBLIC_SITE_URL=http://localhost:8888

# .env.production (production)
PUBLIC_SITE_URL=https://pereiratechtalks.org
```

**Access in code:**
```typescript
// Client-side (must use PUBLIC_ prefix)
const url = import.meta.env.PUBLIC_SITE_URL;

// Server-side only
const secret = import.meta.env.SECRET_KEY;
```

## Troubleshooting

### Clear Cache

```bash
# Remove Astro cache
rm -rf .astro

# Remove node_modules and reinstall
rm -rf node_modules
pnpm install
```

### Reset Build

```bash
# Remove build output
rm -rf dist

# Rebuild
pnpm run build
```

### Port Already in Use

```bash
# Kill process on port 8888
lsof -ti:8888 | xargs kill -9

# Or use different port
pnpm run dev -- --port 3000
```

### Devcontainer (Cursor / VS Code)

When using the devcontainer, the host port is mapped to **8888** (not 8888) to avoid conflict with macOS AirPlay Receiver. Access the dev server at `http://localhost:8888`.

## Scripts Reference

Full `package.json` scripts:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "prebuild": "node scripts/generate-webp-homepage.mjs && node scripts/generate-webp-blog-shared.mjs && node scripts/generate-webp-blog-posts.mjs",
    "astro": "astro",
    "astro:check": "astro check",
    "astro:preview": "astro preview",
    "biome:check": "biome check",
    "biome:fix": "biome check --write",
    "biome:fix:unsafe": "biome check --write --unsafe",
    "ncu:check": "ncu",
    "ncu:upgrade": "ncu -u",
    "test": "echo 'Running tests...'",
    "release": "bash .github/scripts/prepare_release.sh"
  }
}
```

## Testing (Future)

Testing is not yet configured. When implemented:

```bash
# Unit tests (Vitest)
pnpm run test

# E2E tests (Playwright)
pnpm run test:e2e

# Watch mode
pnpm run test:watch
```
