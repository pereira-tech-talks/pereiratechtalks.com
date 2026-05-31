# Workflows Reference

Complete reference for all GitHub Actions workflows in this repository.

**Stack:** Node.js 24.15.0, pnpm (via Corepack), ubuntu-latest runners, Astro static site.

---

## 1. code_check.yml — Code Quality Validation

| Property | Value |
|----------|-------|
| **Trigger** | `pull_request` to `main` (opened, synchronize, reopened) |
| **Concurrency** | Per-workflow + PR number, cancel in-progress |

### Job: `code_check`

| Step | Name | What it does |
|------|------|-------------|
| — | Checkout | `actions/checkout@v4` |
| — | Setup Node | `actions/setup-node@v4` (24.15.0) |
| 0 | Get pnpm store path | Resolves `corepack pnpm store path` |
| 0a | Cache pnpm store | `actions/cache@v4` — caches the pnpm content-addressable store, keyed on `pnpm-lock.yaml` |
| 1 | Install Dependencies | `corepack pnpm install --frozen-lockfile` |
| 2 | Astro checks | `corepack pnpm run astro:check` — TypeScript validation |
| 3 | Biome checks | `corepack pnpm run biome:check` — linting & formatting |
| 4 | Tests | `corepack pnpm run test` |
| 5 | Build | `corepack pnpm run build` (includes prebuild → images:webp) |

**Secrets:** None (uses default `GITHUB_TOKEN`).

**Notes:**
- pnpm resolves platform-specific native bindings (`@rollup/rollup-linux-x64-gnu`, `@esbuild/linux-x64`, etc.) through `optionalDependencies` in the lockfile — no `--no-save` workaround needed.

---

## 2. pull_request_check.yml — PR Content and Size Validation

| Property | Value |
|----------|-------|
| **Trigger** | `pull_request` to `main` (opened, reopened, synchronize, edited) |
| **Concurrency** | Per-workflow + PR number, cancel in-progress |
| **Condition** | Only runs when PR is NOT merged |

### Job: `pull_request_content_and_size_check`

| Step | Name | What it does |
|------|------|-------------|
| — | Checkout | `actions/checkout@v4` with `AUTOMATION_GITHUB_TOKEN`, fetch-depth: 2 |
| 1 | Setup GitHub Config | Git config + `gh auth login` |
| 2 | Check PR size label | Reads existing size label from PR |
| 3 | Calculate PR Size | `git diff --shortstat` → apply size label |
| 4 | Check title length | Minimum 5 characters |
| 5 | Check body length | Minimum 10 characters |

**Size Labels:**

| Lines Changed | Label |
|---------------|-------|
| ≤ 50 | Size - XS |
| ≤ 100 | Size - S |
| ≤ 500 | Size - M |
| ≤ 800 | Size - L |
| ≤ 1500 | Size - XL |
| > 1500 | Size - XXL |

For L/XL/XXL PRs, a warning comment is automatically posted.

**Secrets:** `AUTOMATION_GITHUB_TOKEN`

---

## 3. check_packages_versions.yml — Package Update Detection

| Property | Value |
|----------|-------|
| **Trigger** | Scheduled: Tuesdays 15:00 UTC + `workflow_dispatch` |
| **Branch** | `feature__packages_versions_update` |

### Job: `check_packages_versions`

| Step | Name | What it does |
|------|------|-------------|
| — | Checkout | `actions/checkout@v4` with `AUTOMATION_GITHUB_TOKEN` |
| — | Setup Node | 24.15.0 with npm registry |
| 1 | Setup GitHub Config | Commits as "DailyBot" |
| 2 | Check/create branch | Creates `feature__packages_versions_update` if it doesn't exist |
| 3 | Install Dependencies | `corepack pnpm install --frozen-lockfile` |
| 4 | Check Packages | Runs `scripts/get_packages_upgrades.sh` |
| 5 | Check Git Status | Checks if `packages_upgrades_output.txt` was created |
| 6 | Reinstall | `corepack pnpm install --no-frozen-lockfile` with upgraded versions |
| 7 | Commit and push | Commits changes to upgrade branch |
| 8 | Create PR | `gh pr create` to `main` |

**Secrets:** `AUTOMATION_GITHUB_TOKEN`

**Helper script:** `scripts/get_packages_upgrades.sh`
- Runs `corepack pnpm run ncu:upgrade`
- Extracts lines with `→` (upgrade arrows)
- Creates `packages_upgrades_output.txt` as PR body

---

## 4. check_and_merge_packages_upgrades_pr.yml — Auto-Merge Package Updates

| Property | Value |
|----------|-------|
| **Trigger** | Scheduled: Tuesdays 20:00 UTC + `workflow_dispatch` |
| **Timing** | Runs 5 hours after package detection to allow CI checks |

### Job: `check_packages_versions_upgrades_pr`

| Step | Name | What it does |
|------|------|-------------|
| — | Checkout | `actions/checkout@v4` with `AUTOMATION_GITHUB_TOKEN` |
| — | Setup Node | 24.15.0 |
| 1 | Setup GitHub Config | Git config + `gh auth login` |
| 2 | Find PR | Search for open PR from `feature__packages_versions_update` |
| — | Get PR body | Retrieve PR metadata |
| 3 | Check mergeable state | `gh api` → if `clean`, auto-merge with `gh pr merge` |

**Secrets:** `AUTOMATION_GITHUB_TOKEN`

**Key behavior:** Only merges if PR mergeable state is `clean` (all CI checks passed, no conflicts). If not clean, the PR remains open for manual review.

---

## 5. release_and_publish.yml — Version Bump and GitHub Release

| Property | Value |
|----------|-------|
| **Trigger** | `pull_request` to `main`, type: `closed` (only when merged) |
| **Concurrency** | Per-workflow + PR number, cancel in-progress |

**Deployment:** Cloudflare Pages deploys automatically on push to `main`. This workflow does **not** deploy. It has **3 chained jobs**:

### Job 1: `check_pr_size_label`

Extracts the PR's size label and maps to emoji for the workflow summary.

### Job 2: `release_and_publish` (depends on: Job 1)

| Step | Name | What it does |
|------|------|-------------|
| 0-0a | Cache | pnpm store, keyed on `pnpm-lock.yaml` |
| 2 | Setup GitHub Config | Git config |
| 3 | Release notes | Runs `scripts/get_github_release_log.sh` |
| 4 | Prepare release | `corepack pnpm install --frozen-lockfile && corepack pnpm run release` + push tags to main |
| 5 | Get release tag | Extract latest tag |
| 6 | Publish release | `ncipollo/release-action@v1` |

**Helper script:** `scripts/get_github_release_log.sh`
- Reads `git log --pretty=oneline`
- Stops at the previous release commit
- Skips merge commits
- Prefixes each entry with `🚩`
- Creates `git_logs_output.txt` as release body

### Job 3: `cleanup_caches` (depends on: Job 2)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Cloudflare Pages setup.

Dispatches a `cleanup_caches` event via GitHub API.

---

## Workflow Dependencies

```
check_pr_size_label
         │
         ▼
  release_and_publish
         │
         ▼
  cleanup_caches
```

**Note:** Cloudflare Pages deploys independently on push to `main` (configured in Cloudflare dashboard).

---

## External Actions

| Action | Version | Used In |
|--------|---------|---------|
| `actions/checkout@v4` | v4 | All workflows |
| `actions/setup-node@v4` | v4 | All workflows |
| `actions/cache@v4` | v4 | code_check, release_and_publish |
| `ncipollo/release-action@v1` | v1 | release_and_publish (job 3) |
