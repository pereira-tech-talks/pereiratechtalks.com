#!/usr/bin/env bash
#
# lib/layers/agents.sh — the agents layer: coding-agents-kit (`ak`) from its
# release tarball verified against the pinned sha256, plus the pinned Node when
# node is missing or older than its major, then `ak install <kind>...` (each CLI
# pinned and verified by ak itself), the `classic` + `providers` presets, and
# the kit's three agent skills (agentkit, agentkit-setup, agentkit-orchestrate).
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

KINDS="claude codex cursor opencode pi cline grok antigravity"
# The CLIs to install: the arguments (DCK_AGENT_CLIS, which may come from a
# developer's .env as "grok,opencode": commas count as separators) plus every kind
# whose INSTALL_<CLI>_CLI build arg is exactly "true". A kind is installed once.
kinds=""
add_kind() { case " $kinds " in *" $1 "*) ;; *) kinds="${kinds:+$kinds }$1" ;; esac; }
set -f
for k in $(printf '%s' "$*" | tr ',' ' '); do add_kind "$k"; done
set +f
for k in $KINDS; do
  v="INSTALL_$(printf '%s' "$k" | tr '[:lower:]' '[:upper:]')_CLI"
  [ "${!v:-}" = "true" ] && add_kind "$k"
done
# shellcheck disable=SC2086  # the kinds are single words, checked below
set -- $kinds
# DCK_AGENT_SUPPORTED (rendered from dck.toml [agents] supported): the kinds this
# repository's images are wired for; a CLI outside it is refused with the list.
supported="${DCK_AGENT_SUPPORTED:-$KINDS}"
for k in "$@"; do
  case " $KINDS " in
    *" $k "*) ;;
    *) layer_log "unknown kind '$k' (one of: $KINDS)"; exit 2 ;;
  esac
  case " $supported " in
    *" $k "*) ;;
    *) layer_log "'$k' is not supported by this repository ([agents] supported: $supported)"; exit 2 ;;
  esac
done

# 1. Node — the npm-distributed CLIs need a current one. When the image's node is
#    missing or older than the pinned major (Debian's nodejs on python-3.13 and
#    debian, or a repository that runs an older Node in production), the pinned
#    Node goes into the agents' OWN prefix, never over /usr/local: the
#    repository's node stays the shell's node, and npm trees are never mixed.
#    The agent CLIs installed through npm are then launched on that Node (step 4).
node_major="$({ node --version 2>/dev/null || true; } | sed -n 's/^v\([0-9][0-9]*\)\..*/\1/p')"
agent_node=""
agent_path="$PATH"
if [ -z "$node_major" ] || [ "$node_major" -lt "${NODE_VERSION%%.*}" ]; then
  agent_node="${DCK_LAYER_PREFIX:-/opt/dck}/node"
  arch="$(layer_arch)"
  case "$arch" in
    amd64) node_arch=x64; node_sha="$NODE_SHA256_AMD64" ;;
    arm64) node_arch=arm64; node_sha="$NODE_SHA256_ARM64" ;;
  esac
  tarball="/tmp/node-v${NODE_VERSION}.tar.xz"
  layer_fetch "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${node_arch}.tar.xz" "$node_sha" "$tarball"
  mkdir -p "$agent_node"
  tar -xJf "$tarball" -C "$agent_node" --strip-components=1 \
    --exclude CHANGELOG.md --exclude LICENSE --exclude README.md
  rm -f "$tarball"
  chmod -R a+rX,go-w "$agent_node"
  agent_path="$agent_node/bin:$PATH"
  layer_log "installed Node ${NODE_VERSION} for the agents in ${agent_node} (the image's node${node_major:+ v$node_major} is left as it is)"
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
# 2b. The kit's agent skills, from the same verified tarball, into the image's
#     shared skills directory. Agent homes live on volumes, so a skill installed
#     there is lost on every recreate; the entrypoint (dck_skills_link) links
#     these into every agent skills directory at each start instead.
skills_dir="${DCK_SKILLS_DIR:-/usr/local/share/dck/skills}"
mkdir -p "$skills_dir"
for skill in agentkit agentkit-setup agentkit-orchestrate; do
  from="$src/coding-agents-kit-${AGENTKIT_TAG}/skills/$skill"
  if [ ! -f "$from/SKILL.md" ] || [ -L "$from" ]; then
    layer_log "coding-agents-kit ${AGENTKIT_TAG} has no $skill skill"
    exit 1
  fi
  rm -rf "${skills_dir:?}/$skill"
  cp -R "$from" "$skills_dir/$skill"
  chmod -R u+rwX,go+rX,go-w "$skills_dir/$skill"
done
rm -rf "$src"
layer_log "installed coding-agents-kit ${AGENTKIT_TAG} (verified) and its skills agentkit, agentkit-setup, agentkit-orchestrate"

# 3. npm installs globals into ~/.local for the dev user: Node's own prefix
#    (/usr/local) is root's, so `npm install -g` (codex, pi, cline …) would fail
#    for the dev user, at build time and later inside the container alike.
#    ~/.local/bin is on the login PATH (/etc/profile.d/00-dck.sh).
as_user bash -c 'grep -qs "^prefix=" "$HOME/.npmrc" || printf "prefix=%s\n" "$HOME/.local" >> "$HOME/.npmrc"'

# The ak this layer just installed, never another one that happens to be first on
# PATH (an older copy in the image, or the host's in a test environment).
ak_bin="$(as_user bash -lc 'p="$HOME/.local/share/agentkit/bin/ak"; if [ -x "$p" ]; then echo "$p"; else command -v ak; fi')"

# 4. The CLIs this image installs: ak installs each pinned and verified.
if [ "$#" -gt 0 ]; then
  as_user env PATH="$agent_path" bash -c 'NPM_CONFIG_PREFIX="$HOME/.local" exec "$@"' _ "$ak_bin" install "$@"
  layer_log "ak install $*"
fi

# 4a. The record of what this image installed: `dck up` and `dck doctor` compare it
#     with the developer's list (DCK_AGENT_CLIS) and say when a rebuild is needed.
mkdir -p "${DCK_LAYER_PREFIX:-/opt/dck}"
printf '%s\n' "$*" > "${DCK_LAYER_PREFIX:-/opt/dck}/agent-clis"
chmod 0644 "${DCK_LAYER_PREFIX:-/opt/dck}/agent-clis"

# 4b. With the agents' own Node: each npm-installed CLI whose entry point is a node
#     script (~/.local/bin/<cli> -> ../lib/node_modules/...) gets a launcher that
#     runs it on that Node, whatever node comes first on PATH.
if [ -n "$agent_node" ]; then
  # shellcheck disable=SC2016  # expanded by the dev user's shell, not here
  as_user env DCK_AGENT_NODE="$agent_node" bash -c '
    n=0
    for f in "$HOME"/.local/bin/*; do
      [ -L "$f" ] || continue
      target="$(readlink -f "$f")" || continue
      case "$target" in "$HOME"/.local/lib/node_modules/*) ;; *) continue ;; esac
      head -n 1 "$target" 2>/dev/null | grep -q "^#!.*node" || continue
      tmp="$f.dck-tmp"
      printf "#!/bin/sh\n# devcontainer-kit: run on the agents'"'"' own Node (%s); the image'"'"'s node stays first on PATH.\nexec %s/bin/node %s \"\$@\"\n" \
        "$DCK_AGENT_NODE" "$DCK_AGENT_NODE" "$target" > "$tmp" && chmod 0755 "$tmp" && mv -f "$tmp" "$f" && n=$((n + 1))
    done
    echo "$n"' > /tmp/dck-agent-wrappers.count
  layer_log "$(cat /tmp/dck-agent-wrappers.count) agent CLI(s) run on the agents' own Node"
  rm -f /tmp/dck-agent-wrappers.count
fi

# 5. The wrapper names developers type: the classic preset (claudex, codexx, …)
#    and the providers preset (claude-glm, codex-glm, …), loaded by every bash
#    the dev user starts (interactive, login, Herdr panes, ssh). [agents] presets
#    in dck.toml chooses them (DCK_AGENT_PRESETS); unset keeps both, as before.
presets="${DCK_AGENT_PRESETS-classic providers}"
for p in $presets; do
  case "$p" in
    classic|providers) as_user "$ak_bin" alias preset "$p" --on >/dev/null ;;
    *) layer_log "unknown preset '$p' (classic, providers)"; exit 2 ;;
  esac
done
if [ -n "$presets" ]; then
  # shellcheck disable=SC2016  # expanded by the dev user's shell, not here
  as_user bash -c 'line="[ -r \"\$HOME/.local/share/agentkit/aliases.sh\" ] && . \"\$HOME/.local/share/agentkit/aliases.sh\""
    grep -qxF "$line" "$HOME/.bashrc" 2>/dev/null || printf "%s\n" "$line" >> "$HOME/.bashrc"'
  if [ "$presets" = "classic providers" ]; then
    layer_log "presets classic and providers on"
  else
    layer_log "presets on: $presets"
  fi
else
  layer_log "no ak alias preset ([agents] presets = [])"
fi
