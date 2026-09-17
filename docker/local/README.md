# Local Docker development stack

Dev container for pereiratechtalks.org: Node 24, pnpm, the Dailybot CLI, and a
shared suite of Claude, Codex, OpenCode, Pi, Cline, Grok, Cursor, Herdr and
Z.AI coding-agent commands — plus an SSH server so you can reach all of it from
another machine.

## Quick start

```bash
cd docker/local
bash setup.sh
docker compose build
docker compose up -d
```

Attach to the dev container (VS Code Dev Containers, or
`docker compose exec pertechtalksvscode bash`). Run `help` inside for the full
command list.

## Coding agents

Every provider alias runs with full permissions and accepts `-c` / `--continue`.
Base commands (`claude`, `codex`, `opencode`, `pi`, `cline`, `agent`, `herdr`)
keep whatever provider and authentication you configured yourself.

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

This is what makes [Herdr](https://herdr.dev) usable from a phone: SSH into the
container and run `herdr`.

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
