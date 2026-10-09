# Local Docker development stack

Dev container for pereiratechtalks.org: Node 24, pnpm, the Dailybot CLI, **Herdr**
(mesh runtime), **Neovim 0.12.5 + DeepWorkPlan Vim v0.5.0**, and an SSH server on host port
**22030**. Coding-agent CLIs (Claude, Codex, Cursor, OpenCode, Pi, Cline, Grok)
are **opt-in** via `INSTALL_*_CLI=true` build args — the default image stays lean.

## Quick start

From the repository root, `dev.sh` starts the same containers the Dev Containers
plugin starts — no editor required:

```bash
bash dev.sh setup     # env files, networks, .devcontainer/
bash dev.sh build
bash dev.sh up
bash dev.sh shell     # login shell as `node` in /app
bash dev.sh agents    # list live Herdr machines/agents (inside container)
bash dev.sh ask 1 "…" # prompt another agent with a [herdr-mesh] reply grant
```

Or open the project in Cursor / VS Code and let the Dev Containers plugin do it.
Both paths produce the same containers and can be used interchangeably. See
[Development Commands → Dev Containers Without an Editor](../../docs/DEVELOPMENT_COMMANDS.md#dev-containers-without-an-editor-devsh).

Run `help` inside the container for the full command list.

Raw compose still works, but you have to name the project yourself — the
launcher and the plugin both use `pertechtalkslocal`, and letting compose
default to the directory name creates a second, conflicting stack that fights
the real one over ports 8888 and 22030:

```bash
cd docker/local
bash setup.sh
docker compose -p pertechtalkslocal build
docker compose -p pertechtalkslocal up -d pertechtalksvscode
```

## Default image vs selective coding CLIs

Always installed:

| Tool | Notes |
|------|-------|
| `herdr` | Mesh runtime (`allow_nested`); catalog refresh + ED25519 peer trust on start |
| `nvim` | Neovim **0.12.5** in `~/.local/opt/nvim-v0.12.5`, linked as `~/.local/bin/nvim` (`EDITOR=nvim`) |
| DeepWorkPlan Vim | `DailybotHQ/deepworkplan-vim` @ **v0.5.0** under `~/.config/nvim`, installed at build by `https://vim.deepworkplan.com/install.sh --version "$DWP_VIM_VERSION" --nvim "$NVIM_VERSION" --skip-packages --strict` (sha256-verified Neovim; the build fails if a required plugin is missing). Bump with `--build-arg DWP_VIM_VERSION=… --build-arg NVIM_VERSION=…` |
| `gh`, `dailybot`, `chelper` | GitHub CLI, Dailybot CLI, Z.AI helper |

Opt-in (rebuild with build-args; only the string `true` installs):

```bash
docker compose -p pertechtalkslocal -f docker/local/docker-compose.yaml build \
  --build-arg INSTALL_CLAUDE_CLI=true \
  --build-arg INSTALL_CURSOR_CLI=true \
  --build-arg INSTALL_CODEX_CLI=true \
  --build-arg INSTALL_PI_CLI=true \
  --build-arg INSTALL_OPENCODE_CLI=true \
  --build-arg INSTALL_CLINE_CLI=true \
  --build-arg INSTALL_GROK_CLI=true
```

Or export the same names before `bash dev.sh build` (compose forwards them).

## Herdr mesh

- Peer SSH include: `~/.ssh_host/config.d/herdr-peers` (fallback: `dailybot-peers` if a host kit still uses that name).
- Optional catalog: host `~/.local/state/herdr/client` mounted read-only; `herdr-refresh-catalog` copies it for Herdr to read.
- List / ask: `bash dev.sh agents` and `bash dev.sh ask …` append a public `[herdr-mesh]` reply grant on first hop.
- SSH: host port **22030** → container sshd (key-based; see `.env.example`).

## Coding agents

When a CLI is installed, every provider alias runs with full permissions and
accepts `-c` / `--continue`. Base commands (`claude`, `codex`, `opencode`, `pi`,
`cline`, `agent`, `herdr`) keep whatever provider and authentication you
configured yourself.

| Group | Commands |
|-------|----------|
| Claude Code | `claude`, `claudex`, `claude-glm`, `claudex-glm`, `claude-xai` |
| Codex | `codex`, `codexx`, `codex-azure`, `codex-glm`, `codex-xai` |
| OpenCode | `opencode`, `opencodex`, `opencode-azure`, `opencode-glm`, `opencode-xai` |
| Pi | `pi`, `pix`, `pi-azure`, `pi-glm`, `pi-xai` |
| Cline | `cline`, `clinex`, `cline-azure`, `clinex-azure`, `cline-xai`, `cline-glm`, `clinex-glm` |
| Grok / xAI | `grokx`, `codex-xai`, `claude-xai`, `opencode-xai`, `pi-xai`, `cline-xai` |
| Other | `herdr`, `chelper`, `agent`, `cursorx`, `dailybot` |

Full-permission flags per agent: Codex `--dangerously-bypass-approvals-and-sandbox`,
Claude `--dangerously-skip-permissions`, OpenCode `--auto`, Cline `--yolo`,
Pi `--approve`, Cursor `--force`.

### Provider keys

Set them in `docker/local/pertechtalks/.env` (git-ignored, survives rebuilds),
then open a **fresh shell** inside the container:

| Variable | Used by |
|----------|---------|
| `ZAI_CODING_API_KEY` | `*-glm` wrappers ([Coding Plan keys](https://z.ai/manage-apikey/apikey-list)) |
| `XAI_API_KEY` | `grokx` and the `*-xai` wrappers ([console.x.ai](https://console.x.ai/)) |
| `AZURE_OPENAI_API_KEY` + `AZURE_OPENAI_RESOURCE` (or `AZURE_OPENAI_BASE_URL`) | the `*-azure` wrappers |

`.env.example` documents every optional override (endpoints, model IDs,
timeouts). `chelper` runs the Z.AI Coding Tool Helper wizard.

### Model mapping

`claude-glm` / `claudex-glm` remap the Opus/Sonnet/Haiku aliases to GLM for
that process only — nothing is written to `~/.claude/settings.json`, and plain
`claude` / `claudex` keep your Anthropic auth untouched.

| Env var | Default |
|---------|---------|
| `ZAI_DEFAULT_OPUS_MODEL` | `glm-5.3` |
| `ZAI_DEFAULT_SONNET_MODEL` | `glm-5.3` |
| `ZAI_DEFAULT_HAIKU_MODEL` | `glm-5.3-flash` |

See [latest model mapping](https://docs.z.ai/devpack/latest-model). For 1M
context set the models to e.g. `glm-5.3[1m]` and
`ZAI_CODING_AUTO_COMPACT_WINDOW=1000000`.

The `opencode-glm` wrapper writes the configured GLM model IDs and Coding Plan
endpoint into OpenCode automatically; `opencode-xai` uses `XAI_MODEL_DAILY`,
`XAI_MODEL_REASONING` and `XAI_BASE_URL`; `opencode-azure` uses the matching
`AZURE_OPENAI_*` variables. The selected provider and model are persisted in
`~/.config/opencode/opencode.json`.

To verify a GLM session, run `/status` in a **new** `claude-glm` session: the
Anthropic base URL must be `https://api.z.ai/api/anthropic`. The Model line may
still show a Claude-looking alias — routing is decided by the base URL and the
process-scoped `ANTHROPIC_DEFAULT_*_MODEL` variables.

## SSH access (port 22030)

`entrypoint.sh` configures and starts `sshd` on every container start, and
docker-compose publishes it on host port **22030**:

```bash
ssh -p 22030 node@localhost          # from the machine running Docker
ssh -p 22030 node@<docker-host-ip>   # from another device on the LAN
```

Run `sshinfo` inside the container for the connection details and the list of
trusted keys.

- **Authentication is key-based.** Trusted keys are rebuilt on every start from
  the host's mounted `~/.ssh` (its `*.pub` files and `authorized_keys`) plus
  anything in `SSH_AUTHORIZED_KEYS` (separate several with `;`). The private
  key you already use for git therefore works out of the box.
- **Password login is opt-in** — set `SSH_NODE_PASSWORD` in `.env`. Handy for
  phone SSH clients that have no key loaded.
- Root login is refused; only the `node` user may log in.
- Host keys live in the `sshd_data` named volume, so the container keeps the
  same identity across rebuilds and clients never see a host-key mismatch.
- An SSH session is a login shell, so it picks up `~/.bash_profile` →
  `~/.bashrc` → `docker/custom_commands.sh`, lands in `/app`, and inherits the
  compose environment through the snapshot the entrypoint writes to
  `/etc/profile.d/01-container-env.sh`.
- Set `SSH_SERVER_ENABLED=false` to turn the server off. Changing
  `SSH_SERVER_PORT` also requires changing the published port in
  `docker-compose.yaml` — both sides are pinned to 22030.
- Docker publishes the port on every interface, which is what makes the phone
  case work. To keep it on the machine itself instead, change the mapping to
  `'127.0.0.1:22030:22030'`.

From the repository root, `bash dev.sh ssh` does the same thing without you
having to remember the port, and `bash dev.sh doctor` reports whether `sshd` is
answering.

## Herdr as a remote machine

[Herdr](https://herdr.dev) on the host can drive this container as a *machine*,
which is what makes it usable from a laptop pane or a phone. Add an entry to the
host's `~/.ssh/config`:

```
Host pereiratechtalks-com
  HostName 127.0.0.1
  Port 22030
  User node
  StrictHostKeyChecking accept-new
```

Then register and open it:

```bash
herdr machine add --label "pereiratechtalks.com" pereiratechtalks-com
herdr machine list                                    # id, label, ssh target, state
herdr --machine "pereiratechtalks.com" workspace list
```

`--machine` takes the **label** or the id, never the SSH target, and only runs
API-backed machine commands — for a shell on the remote use `dev.sh ssh`.

`entrypoint.sh` writes the container's `~/.config/herdr/config.toml` on every
start (persisted in the `herdr_data` volume) with:

| Key | Value | Why |
|-----|-------|-----|
| `terminal.default_shell` | `/bin/bash` | An empty value falls back to `/bin/sh`, which cannot see the bash functions in `custom_commands.sh` — every wrapper reports "not found" |
| `terminal.shell_mode` | `login` | A login shell reads `/etc/profile.d`, where the entrypoint puts the compose environment |
| `terminal.new_cwd` | `/app` | New terminals open in the workspace instead of `/home/node` |
| `experimental.allow_nested` | `true` | The host's herdr attaches to the container's herdr |

The key is `new_cwd`. `working_directory` reads like the obvious name and is
silently rejected as an unknown key. Check this file with `herdr config check`,
never with `grep`: an invalid `config.toml` is not partially applied, herdr
discards it wholesale and runs on defaults — so a grep that finds the line
proves the line is in the file, not that herdr ever read it. The entrypoint runs
that check on every start and warns if the file was rejected.

Workspaces created *before* the setting keep their original cwd; only new ones
pick it up.

A command run over SSH is neither a login shell nor an interactive one. Bash
reads `BASH_ENV` for ordinary non-interactive shells, but for one started by
`sshd` it reads `~/.bashrc` *instead* — and Debian's copy returns at
`case $- in *i*) ;; *) return;; esac` on line 5, so everything the image appended
below is dead code for this caller. The entrypoint therefore **prepends** the
PATH and environment preamble above that guard.

That restores the environment, but not the wrappers: `grokx` and friends are
bash *functions*, which no variable can carry. So the entrypoint also installs
**PATH shims** in `/usr/local/bin` for the wrapper-only commands (`grokx`, `claudex`, `pix`, `codexx`, `check`, `sshinfo`, …). Each shim
re-sources `custom_commands.sh` and calls the function of its own name. Names
that are real binaries (`claude`, `codex`, `opencode`, `pi`, `cline`, `herdr`,
`agent`, `chelper`) are deliberately **not** shimmed — a shim there would shadow
the binary for every shell, including the wrapper's own call to it.

## Persistence

Sessions and configuration survive container rebuilds through named Docker
volumes, which the entrypoint symlinks into each agent's normal home directory:

| Volume | Backs |
|--------|-------|
| `claude_data` | `~/.claude`, `~/.claude.json`, `~/.config/claude-code` |
| `codex_data` | `~/.codex` |
| `cursor_data` | `~/.cursor`, `~/.config/cursor` |
| `gh_data` | `~/.config/gh` |
| `dailybot_data` | `~/.config/dailybot` |
| `chelper_data` | `~/.chelper` |
| `opencode_data` | `~/.config/opencode`, `~/.local/share/opencode` |
| `pi_data` | `~/.pi` |
| `cline_data` | `~/.cline` |
| `herdr_data` | `~/.config/herdr` |
| `grok_data` | `~/.grok` |
| `sshd_data` | sshd host keys |
| `pnpm_store` / `pnpm_cache` | the pnpm store, which must stay off the bind mount |
