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

**Scoped to a path** (verified 2026-09-17, Biome 2.5.10):

```bash
pnpm exec biome check src/lib/blog.ts   # → Checked 1 file
pnpm exec biome check src/lib/          # → Checked 55 files
```

### TypeScript Checking

```bash
pnpm run astro:check
```

- Runs Astro's TypeScript checker
- Validates `.astro`, `.ts`, `.tsx` files
- Reports type errors
- **No path scoping.** `astro check` exposes only `--root`, `--tsconfig` and
  `--minimumSeverity` — a type check is always project-wide. Run it whole or
  not at all.

### Scoped Test Runs

The full suite is 961 tests in ~11s, so `pnpm run test` is the normal gate.
These are for tight iteration (verified 2026-09-17, Vitest 4.1.11):

```bash
pnpm exec vitest run tests/unit/lib/blog.test.ts   # by file
pnpm exec vitest run tests/unit/lib/               # by directory — 44 files, 811 tests
pnpm exec vitest run -t "certificate"              # by test name — 3 files run, 57 skipped
pnpm exec vitest run --changed origin/main         # by what the branch touched
```

`--related` does **not** exist in Vitest 4 (it fails with
`CACError: Unknown option --related`); `--changed` is the change-driven
selector. Which gate a given change actually needs — mapping, consumers, blind
spots, escalation and fallback — is in
**[Testing Guide → Validation gates](TESTING_GUIDE.md#validation-gates--choosing-what-to-run)**.

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
- Format: `[🤖 Pereira Tech Talks] New release to v{version} launched 🚀`

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

# Cloudflare Pages / production build (must match the hostname you share)
# While the public preview is v3, keep this as the v3 host — apex
# pereiratechtalks.org currently redirects OG assets to the legacy stack (404).
PUBLIC_SITE_URL=https://pereiratechtalks.org

# After DNS cutover to apex (when apex serves this build):
# PUBLIC_SITE_URL=https://pereiratechtalks.org
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

When using the devcontainer, the host port is mapped to **8888** (not Astro's default 4321) to avoid conflict with macOS AirPlay Receiver. Access the dev server at `http://localhost:8888`.

The container also ships the coding-agent suite (Claude Code, Codex, OpenCode,
Pi, Cline, Grok, Cursor, Herdr, Z.AI helper, Dailybot CLI) and an SSH server on
host port **22030**, so you can drive it from another machine:

```bash
ssh -p 22030 node@localhost   # `sshinfo` inside the container prints the details
```

Provider keys live in `docker/local/pertechtalks/.env`. Run `help` inside the
container for the full command list. Full reference:
**[Local Docker development stack](../docker/local/README.md)**.

## Dev Containers Without an Editor (`dev.sh`)

`dev.sh` at the repository root starts the same containers the Dev Containers
plugin starts, detached, from a plain terminal. Opening the project in Cursor or
VS Code keeps working exactly as before — the two paths coexist.

```bash
bash dev.sh setup     # one-time: env files, networks, .devcontainer/
bash dev.sh build     # build the image
bash dev.sh up        # start the runServices, detached
bash dev.sh shell     # login shell as `node` in /app
```

`.devcontainer/devcontainer.json` is the single source of truth. `runServices`
decides what starts — add a service there and `dev.sh up` starts it with no
other edit. `remoteUser`, `workspaceFolder`, `mounts` and `containerEnv` are
read from the same file. `.devcontainer/` is git-ignored here, so `setup`
creates it from the tracked `.devcontainer_example/`.

| Verb | Description |
| :--- | :---------- |
| `setup` | Create `.env` files (mode `0600`), external networks, `.devcontainer/` from `.devcontainer_example/`, and set `"shutdownAction": "none"` |
| `up [service...]` | Start the `runServices`, detached. A second `up` is a no-op |
| `down [service...]` | Stop and remove this repository's services (named volumes are kept) |
| `stop` / `start` / `restart` | Lifecycle for the same set |
| `ps` | What is running |
| `logs [service...]` | Follow logs |
| `shell [service]` | Login shell as `remoteUser`, in `workspaceFolder` |
| `exec <service> <cmd>` | Run one command in a service |
| `ssh [cmd...]` | SSH in as `remoteUser` — the environment Herdr actually gets |
| `build [service...]` | Build images |
| `config` | Resolved configuration — writes nothing, starts nothing |
| `doctor` | Environment diagnosis — writes nothing, starts nothing |

Flags: `--recreate` (with `up`, to apply compose changes to existing containers)
and `--project <name>` (override the compose project). Flags go **before** the
verb: everything after `ssh`, and after `exec <service>`, is passed to the
container verbatim.

**`setup` sets `"shutdownAction": "none"`.** The plugin's default is to stop the
containers when the editor window closes, which is the opposite of what a
terminal user wants. The key is additive, so the plugin path is unaffected — it
just stops tearing the stack down. Use `dev.sh down` to stop it deliberately.

**`config` and `doctor` are read-only.** They are what you run when something is
wrong, so they never create a file, a network, or a container.

`doctor` also reports whether `docker/local/pertechtalks/.env` is readable by
other accounts on the machine (it holds API keys), which compose files the
running container was created from — the fastest way to see whether the terminal
path and the editor path agree — and whether `sshd` is answering on the
published port.

### SSH access and Herdr

The container runs `sshd` on **22030**, published on the same port on the host,
so Herdr can drive it as a machine. `dev.sh ssh` connects without you having to
remember any of that; for Herdr itself, add the alias to the host's
`~/.ssh/config`:

```
Host pereiratechtalks-com
  HostName 127.0.0.1
  Port 22030
  User node
  StrictHostKeyChecking accept-new
```

```bash
herdr machine add --label "pereiratechtalks.com" pereiratechtalks-com
herdr machine list                                   # id, label, ssh target, state
herdr --machine "pereiratechtalks.com" workspace list
```

`--machine` resolves the **label** or the id, not the SSH target, so
`--machine pereiratechtalks-com` reports `unknown machine` while
`--machine "pereiratechtalks.com"` works. It also only runs API-backed machine
commands — it is not a way to run an arbitrary shell command on the remote; use
`dev.sh ssh` or `ssh pereiratechtalks-com` for that.

`authorized_keys` is rebuilt at container start from the host keys mounted
read-only at `~/.ssh_host`, so no key material is ever baked into the image.
Host keys live in the `sshd_data` volume and are generated once, so the
container's identity survives a rebuild and clients never hit a host-key
mismatch. Verify with `ssh-keyscan -p 22030 127.0.0.1` before and after
`dev.sh up --recreate`: the fingerprint must not change.

**Verify over SSH, not with `docker exec`.** `docker exec` hands the session
PID 1's environment, so a container whose SSH wiring is broken still looks
perfectly healthy through it. `sshd` starts every session clean — which is
exactly what Herdr gets:

```bash
bash dev.sh ssh 'command -v opencode; echo "${ZAI_CODING_API_KEY:0:4}"'
bash dev.sh ssh 'bash -lc "command -v codex"'
bash dev.sh ssh 'grokx --help >/dev/null && echo wrappers-ok'
```

Three separate mechanisms make those work, because login and non-login shells
need separate wiring:

- **Login shells** (`dev.sh ssh` with no command, Herdr panes — its `config.toml`
  pins `shell_mode = "login"`) read `/etc/profile.d`. `entrypoint.sh` writes the
  compose environment there as `01-container-env.sh`, mode `0640 root:node`
  because it holds `ZAI_CODING_API_KEY`, `XAI_API_KEY` and
  `AZURE_OPENAI_API_KEY`.
- **Non-interactive bash** (`ssh host <command>`, `dev.sh ssh '<command>'`)
  reads no profile at all. `BASH_ENV` alone is **not** enough here,
  and this is worth knowing because it looks like it should be: bash reads
  `BASH_ENV` for ordinary non-interactive shells, but for one it detects was
  started by `sshd` it reads `~/.bashrc` *instead*. Debian's `~/.bashrc` then
  returns at `case $- in *i*) ;; *) return;; esac` on line 5, so everything the
  image appended below that line is dead code for exactly this caller. The
  entrypoint therefore **prepends** its PATH and environment preamble above that
  guard. `~/.ssh/environment` still carries the provider variables and
  `BASH_ENV` for the non-`sshd` cases.
- **The wrappers themselves** are bash *functions*, which no environment
  variable can carry. The entrypoint installs PATH shims in `/usr/local/bin`
  for the wrapper-only names (`grokx`, `claudex`, `pix`, `codexx`, `check`,
  `sshinfo`, …); each re-sources `custom_commands.sh` and calls the function of
  its own name. Names that are real binaries (`claude`, `codex`, `opencode`,
  `pi`, `cline`, `herdr`, `agent`, `chelper`) are deliberately not shimmed — a
  shim there would shadow the binary for every shell, including the wrapper's
  own call to it.

#### Herdr terminals open in `/app`

`[terminal] new_cwd = "/app"` in the container's `~/.config/herdr/config.toml`,
written by `entrypoint.sh` and persisted in the `herdr_data` volume, alongside
`default_shell = "/bin/bash"`, `shell_mode = "login"` and
`experimental.allow_nested = true`.

The key is **`new_cwd`**. `working_directory` reads like the obvious name and is
silently ignored — `herdr config check` reports it as an unknown key.

**Validate that file with `herdr config check`, never with `grep`.** An invalid
`config.toml` is not partially applied — herdr discards it wholesale and runs on
defaults. A grep that finds the line proves the line is in the file, not that
herdr ever read it. The entrypoint runs that check on every start and prints a
warning if the file was rejected. Workspaces created *before* the setting keep
their original cwd; only new ones pick it up.

### Build troubleshooting (hard-won)

Three things make this image slow or impossible to build on some networks. All
three are fixed in `docker/local/pertechtalks/Dockerfile`; this records why, so
nobody reverts them.

**The apt mirror.** `deb.debian.org` resolves to an edge that serves some
networks at ~55 KB/s, which turns the Chromium install into a 50-minute step
that looks frozen (BuildKit shows one line per `RUN`, so a ~250-package download
appears as a single stalled row). `cdn-aws.deb.debian.org` serves the identical
archives at 12-18 MB/s. `ARG APT_MIRROR` rewrites **both** the main and the
`debian-security` URIs; Chromium ships from security, so a mirror carrying only
main leaves the two largest packages on the slow path. Override per build:
`docker compose build --build-arg APT_MIRROR=deb.debian.org`.

**Herdr's installer timeout.** It caps its binary download at `--max-time 120`,
with no environment variable to override it. At ~50 KB/s the 24 MB binary needs
about eight minutes, so all four retries die at two and the build **fails
outright** — retrying never helps. The Dockerfile pipes the installer through
`sed 's/--max-time 120/--max-time 1800/'`, which lifts only that cap and leaves
the SHA-256 verification intact.

**`/etc/profile` overwrites `PATH`.** Debian sets
`PATH="/usr/local/bin:/usr/bin:/bin:..."` for non-root users, discarding the
image's `ENV PATH`. `docker exec` keeps the ENV and sees every CLI; a **login
shell** silently loses `opencode`, `grok`, `codex`, `cline`, `pi` and `chelper`,
while `node` and `claude` keep working, which is what makes it so confusing to
diagnose. The entrypoint's `01-container-env.sh` snapshot restores it, and
`/etc/profile.d/02-container-tool-paths.sh` is the fallback for when it cannot
(no `python3`, an overridden entrypoint). It **appends** those directories,
never prepends: `00-container-node-first.sh` has already put `/usr/local/bin` in
front so the image's own node beats an IDE-bundled one.

Diagnosing a slow build: `docker builder du` does **not** show progress during a
`RUN` step — the download goes to the layer under construction, not the cache,
so the total sits still while everything is fine.

### Things `dev.sh` deliberately does not do

- **It never passes `--remove-orphans`.** The flag deletes every container in
  the project that the *current* compose file does not declare — including one
  an older branch's compose file started and someone is still using, and any
  on-demand service added later but left out of `runServices`. Compose prints a
  warning recommending it; here that warning is an instruction to destroy
  containers you asked for.
- **It never lets compose default the project name to the directory.** The
  project is resolved from `--project`, then `COMPOSE_PROJECT_NAME`, then
  `docker/local/.env`, then the top-level `name:` in the compose file
  (`pertechtalkslocal`), and it refuses to run if none of those answer. Falling
  back to the directory name would build a second, parallel set of containers
  next to the real ones and fight them over ports 8888 and 22030.
- **It never uses `docker compose down`,** which acts on the whole project.
  `dev.sh down` removes only the services this repository declares.

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
