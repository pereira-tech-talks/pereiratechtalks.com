#!/usr/bin/env bash
#
# lib/layers/agents.sh — the agents layer: coding-agents-kit (`ak`) from its
# release tarball verified against the pinned sha256, plus the pinned Node when
# node is missing or older than its major, then `ak install <kind>...` (each CLI
# pinned and verified by ak itself) and the `classic` + `providers` presets.
#
#   dck-layer agents [kind...]      (rendered by `dck init` when layers.agents = true)
#
# The base images never contain a coding-agent CLI; this runs only in the
# repository's own image build. Autonomy is coding-agents-kit's default: every
# CLI launched through `ak` gets its own autonomy flag, because the container is
# the sandbox. This layer spells no such flag; the opt-out
# (AGENTKIT_PERMISSIONS=ask, or `ak <kind> --ask`) always wins.
# shellcheck source=lib/layers/common.sh
. "$(dirname "${BASH_SOURCE[0]}")/common.sh"

KINDS="claude codex cursor opencode pi cline grok"
for k in "$@"; do
  case " $KINDS " in
    *" $k "*) ;;
    *) layer_log "unknown kind '$k' (one of: $KINDS)"; exit 2 ;;
  esac
done

# 1. Node — the npm-distributed CLIs need a current one. python-3.13 and debian
#    carry only Debian's nodejs (an older major, installed for the editor's
#    plugins), so the pinned Node goes into /usr/local, ahead of /usr/bin on PATH,
#    whenever node is missing or older than the pinned major.
node_major="$({ node --version 2>/dev/null || true; } | sed -n 's/^v\([0-9][0-9]*\)\..*/\1/p')"
if [ -z "$node_major" ] || [ "$node_major" -lt "${NODE_VERSION%%.*}" ]; then
  arch="$(layer_arch)"
  case "$arch" in
    amd64) node_arch=x64; node_sha="$NODE_SHA256_AMD64" ;;
    arm64) node_arch=arm64; node_sha="$NODE_SHA256_ARM64" ;;
  esac
  tarball="/tmp/node-v${NODE_VERSION}.tar.xz"
  layer_fetch "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${node_arch}.tar.xz" "$node_sha" "$tarball"
  tar -xJf "$tarball" -C "${DCK_LAYER_PREFIX:-/usr/local}" --strip-components=1 \
    --exclude CHANGELOG.md --exclude LICENSE --exclude README.md
  rm -f "$tarball"
  corepack enable >/dev/null 2>&1 || true
  layer_log "installed Node ${NODE_VERSION}"
fi

# 2. coding-agents-kit from its release tarball, verified before it is unpacked,
#    installed for the dev user without touching shell rc files (--no-rc).
src="$(mktemp -d /tmp/agentkit.XXXXXX)"
layer_fetch "https://github.com/DailybotHQ/coding-agents-kit/releases/download/${AGENTKIT_TAG}/coding-agents-kit-${AGENTKIT_TAG}.tar.gz" \
  "$AGENTKIT_SHA256" "$src/agentkit.tar.gz"
tar -xzf "$src/agentkit.tar.gz" -C "$src"
# The install runs as the dev user, so the directory must be theirs.
if [ "$(id -u)" = "0" ]; then chown -R "$DCK_USER" "$src"; fi
as_user bash "$src/coding-agents-kit-${AGENTKIT_TAG}/install.sh" --no-rc
rm -rf "$src"
layer_log "installed coding-agents-kit ${AGENTKIT_TAG} (verified)"

# 3. npm installs globals into ~/.local for the dev user: Node's own prefix
#    (/usr/local) is root's, so `npm install -g` (codex, pi, cline …) would fail
#    for the dev user, at build time and later inside the container alike.
#    ~/.local/bin is on the login PATH (/etc/profile.d/00-dck.sh).
as_user bash -c 'grep -qs "^prefix=" "$HOME/.npmrc" || printf "prefix=%s\n" "$HOME/.local" >> "$HOME/.npmrc"'

ak_bin="$(as_user bash -lc 'command -v ak || echo "$HOME/.local/share/agentkit/bin/ak"')"

# 4. The CLIs the repository asked for: ak installs each pinned and verified.
if [ "$#" -gt 0 ]; then
  as_user bash -c 'NPM_CONFIG_PREFIX="$HOME/.local" exec "$@"' _ "$ak_bin" install "$@"
  layer_log "ak install $*"
fi

# 5. The wrapper names developers type: the classic preset (claudex, codexx, …)
#    and the providers preset (claude-glm, codex-glm, …), loaded by every bash
#    the dev user starts (interactive, login, Herdr panes, ssh).
as_user "$ak_bin" alias preset classic --on >/dev/null
as_user "$ak_bin" alias preset providers --on >/dev/null
# shellcheck disable=SC2016  # expanded by the dev user's shell, not here
as_user bash -c 'line="[ -r \"\$HOME/.local/share/agentkit/aliases.sh\" ] && . \"\$HOME/.local/share/agentkit/aliases.sh\""
  grep -qxF "$line" "$HOME/.bashrc" 2>/dev/null || printf "%s\n" "$line" >> "$HOME/.bashrc"'
layer_log "presets classic and providers on"
