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
| 1 | Setup GitHub Config | Git identity `Pereira Tech Talks` + `gh auth login` |
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
| **Concurrency** | Single group `release-and-publish-main`, **never** cancels in-flight releases |
| **Permissions** | `contents: write`, `pull-requests: read` |
| **Git identity** | `Pereira Tech Talks <pereiratechtalks@gmail.com>` |

**Deployment:** Cloudflare Pages deploys automatically on push to `main`. This workflow does **not** deploy.

### Strategy (and why)

This repo uses a **merge → always patch bump** flow: every merged PR to `main` bumps `package.json` patch, commits/tags as the community bot, pushes to `main`, and opens a GitHub Release.

| Approach | Fit for this site | Notes |
|----------|-------------------|-------|
| **Current: merge → patch** | Good | Simple for a content-heavy static site; frequent small releases |
| [release-please](https://github.com/googleapis/release-please) | Strong alternative | Opens a Release PR; tag on merge — works cleanly with “require PR” rulesets without bypass |
| [semantic-release](https://semantic-release.gitbook.io/) | Overkill here | Needs npm publish + Conventional Commit–driven bumps; heavier for SSG |

We keep the light flow because most merges are content/docs and a patch bump is enough. If branch-protection bypass for the automation user becomes painful, migrate to **release-please** (PR-based) instead of pushing version commits directly to `main`.

### Requirements for the automation actor

`AUTOMATION_GITHUB_TOKEN` must:

1. Have permission to push commits + tags to `main`
2. **Bypass** the ruleset that requires PRs (or be a GitHub App with that bypass)
3. Be allowed past any required status checks that would block the bot’s version commit

Without bypass, Prepare release fails with “Changes must be made through a pull request” (GH013).

### Failure modes already hardened

| Symptom | Cause | Mitigation in repo |
|---------|-------|--------------------|
| `fatal: tag 'vX.Y.Z' already exists` | A previous run pushed the tag but `main` was rejected | `prepare_release.sh` picks the next free version above both `package.json` and existing `v*` tags |
| Orphan tag after failed run | `git push --follow-tags` published the tag before/without the branch | Workflow pushes `HEAD:main` first, then the tag; deletes the local tag if the branch push fails |
| Non-FF / wrong tip | Checkout used the PR head instead of the merge commit | Checkout uses `pull_request.merge_commit_sha` |

### Job 1: `release_and_publish`

| Step | What it does |
|------|-------------|
| Checkout | Full history (`fetch-depth: 0`), `AUTOMATION_GITHUB_TOKEN`, credentials persisted for push |
| Setup Node / pnpm cache | Node 24.15.0 + pnpm store cache |
| Configure git identity | Pereira Tech Talks bot |
| Build release notes | `.github/scripts/get_github_release_log.sh` — commits since last tag |
| Prepare release | `pnpm run release` (bump/commit/tag) → `git push --follow-tags origin HEAD:main` |
| Publish GitHub Release | `ncipollo/release-action@v1` with `allowUpdates: true` |

**Helper scripts:**

- `prepare_release.sh` — patch bump via Node, commit `[🤖 Pereira Tech Talks] New release to vX.Y.Z launched 🚀`, annotated tag
- `get_github_release_log.sh` — changelog from last tag (skips merge + prior release commits)

### Job 2: `cleanup_caches` (depends on: Job 1)

Dispatches a `cleanup_caches` repository event via GitHub API. See [DEPLOYMENT.md](./DEPLOYMENT.md) for Cloudflare Pages setup.

---

## Workflow Dependencies

```
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
