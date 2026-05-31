# Cloudflare Pages Deployment Guide

How the site is built and deployed to Cloudflare Pages.

---

## Architecture

```
PR merged to main
       │
       ├─────────────────────────────────────┐
       │                                     │
       ▼                                     ▼
Cloudflare Pages                      release_and_publish.yml
(auto-triggered on push)              (version bump, tag, GitHub release)
       │
       ▼
┌──────────────────────────────────┐
│ Cloudflare Pages Build          │
│                                  │
│ 1. corepack pnpm install         │
│      --frozen-lockfile           │
│ 2. corepack pnpm run build       │
│    └→ prebuild runs images:webp  │
│    └→ Astro builds to dist/      │
│ 3. Deploy dist/ to CDN           │
└──────────────────────────────────┘
```

## Deployment Strategy

**Cloudflare Pages** is connected to the GitHub repository. On every push to `main`:

1. Cloudflare detects the push
2. Runs `pnpm run build` (which triggers `prebuild` → WebP generation → Astro build)
3. Serves the `dist/` folder from its global CDN

### Branch Protection (Recommended)

Configure in **GitHub → Settings → Branches → Branch protection rules** for `main`:

- **Require a pull request before merging**
- **Require status checks to pass before merging**: `code_check`, `pull_request_content_and_size_check`
- **Require branches to be up to date before merging**

This ensures:
1. All changes go through PRs
2. Linters, tests, and build must pass before merge
3. On merge → Cloudflare deploys automatically; release workflow bumps version and creates tag

## Key Files

| File | Purpose |
|------|---------|
| `package.json` → `build` | Production build (prebuild runs images:webp) |
| `package.json` → `prebuild` | Generates WebP variants before build |
| `astro.config.mjs` | Astro build configuration |
| `dist/` | Built static site (output, not committed) |

## Cloudflare Pages Configuration

| Setting | Value |
|---------|-------|
| **Build command** | `corepack pnpm install --frozen-lockfile && corepack pnpm run build` |
| **Build output directory** | `dist` |
| **Root directory** | (empty) |
| **Node.js version** | 24 (or match `.nvmrc` if present) |

## Environment Variables

If the project uses environment variables (e.g. analytics), configure them in **Cloudflare Pages → Settings → Environment variables**.

## Troubleshooting

### Deployment fails at build

**Possible cause:** Astro build error, missing dependency, or WebP script failure.

**Fix:** Run `pnpm run build` locally to reproduce. Ensure `pnpm run images:webp` succeeds (runs automatically via prebuild).

### Site not updating after deployment

**Possible causes:**
1. Cloudflare edge caching — wait a few minutes or purge cache in Cloudflare dashboard
2. Browser caching — hard refresh (Ctrl+Shift+R)
3. Check Cloudflare Pages deployment logs for build status

### pnpm install fails in Cloudflare

**Possible cause:** Lockfile mismatch or platform-specific native dependencies.

**Fix:** Ensure `pnpm-lock.yaml` is committed and `corepack pnpm install --frozen-lockfile` works locally. Cloudflare uses Linux runners.

## FAQ

**Q: Does Cloudflare deploy on every push to main?**
A: Yes. Cloudflare Pages is connected to the repo and deploys automatically on push to the production branch (typically `main`).

**Q: Can I deploy manually?**
A: Yes. In Cloudflare Pages dashboard, use "Retry deployment" or "Create deployment" to trigger a rebuild.

**Q: What about the release workflow?**
A: The `release_and_publish` workflow runs after a PR is merged. It bumps the version, creates a git tag, and publishes a GitHub Release. It does not deploy — Cloudflare handles deployment.
