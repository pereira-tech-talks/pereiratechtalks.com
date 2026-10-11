#!/usr/bin/env bash
# dev.sh — this repository's development container, the same container VS Code
# or Cursor opens from .devcontainer/devcontainer.json. A thin launcher over
# devcontainer-kit (`dck`); Docker alone is enough for the container verbs. The
# block between the dck markers is rendered and reconciled by `dck init`.
#
#   bash dev.sh up        build if needed and start (setup on the first run)
#   bash dev.sh shell     a shell inside, as the container user
#   bash dev.sh agents    the live coding agents on every Herdr machine
#   bash dev.sh ask <machine>:<pane> "<prompt>"   ask one of them
#   bash dev.sh install-dck   install devcontainer-kit, pinned and verified
#   bash dev.sh help      every command
# >>> dck:devsh >>>
set -euo pipefail
DCK_RENDERED_WITH="v0.2.8"
# sha256 of that release's SHA256SUMS, when the rendering dck knew it (else empty).
DCK_SUMS_SHA256=""
# The compose project dck uses, so plain compose never acts on another checkout.
DCK_PROJECT="pereiratechtalks-com"
cd "$(dirname "$0")"

usage() {
  cat <<'USAGE'
usage: bash dev.sh <command> [args]
  up                    setup (first run) and start the container
  down                  stop and remove the container (volumes are kept)
  shell                 a login shell inside, as the container user
  exec <cmd...>         run a command inside
  build | rebuild       build the image | rebuild and recreate (volumes are kept)
  logs | ps | doctor    container logs | status | a full diagnosis
  ssh [cmd...]          ssh into the container with agent forwarding
  herdr [add|status|repair|remove|mesh]   the container as a Herdr machine (default: add)
  herdr-layout [--keep|--reset]   the standard sidebar inside: Home · Editor · Development · Agents
  agents                the live coding agents on every Herdr machine
  ask <machine>:<pane> "<prompt>"   ask one of them, with the reply grant
  install-dck           install devcontainer-kit (dck) on this host, pinned and verified

Without dck, up/down/shell/exec/build/rebuild/logs/ps run on plain `docker
compose`; the other commands need dck (bash dev.sh install-dck).
USAGE
}

# dck on PATH, else its default install location.
dck_bin=""
if command -v dck >/dev/null 2>&1; then
  dck_bin="dck"
elif [ -x "${DCK_INSTALL_DIR:-$HOME/.local/share/dck}/bin/dck" ]; then
  dck_bin="${DCK_INSTALL_DIR:-$HOME/.local/share/dck}/bin/dck"
fi

# install-dck: clone the tag this repository was rendered with, verify every
# shipped file against that release's SHA256SUMS, then run its installer
# without touching shell rc files. Nothing is piped into a shell.
install_dck() {
  if ! printf '%s\n' "$DCK_RENDERED_WITH" | grep -Eq '^v[0-9]+\.[0-9]+\.[0-9]+$'; then
    echo "dev.sh: invalid rendered version '$DCK_RENDERED_WITH'" >&2; return 2
  fi
  command -v git >/dev/null 2>&1 || { echo "dev.sh: git is required to install dck" >&2; return 4; }
  command -v curl >/dev/null 2>&1 || { echo "dev.sh: curl is required to install dck" >&2; return 4; }
  local work rc=0 dest="${DCK_INSTALL_DIR:-$HOME/.local/share/dck}"
  work="$(mktemp -d "${TMPDIR:-/tmp}/dck-install.XXXXXX")"
  # An explicit chain: `set -e` does not apply inside a subshell tested by `||`.
  (
    sum() { if command -v sha256sum >/dev/null 2>&1; then sha256sum "$@"; else shasum -a 256 "$@"; fi; }
    git clone -q --depth 1 --branch "$DCK_RENDERED_WITH" https://github.com/DailybotHQ/devcontainer-kit "$work/kit" &&
    curl --proto '=https' --tlsv1.2 -fsSL --retry 3 -o "$work/SHA256SUMS" \
      "https://github.com/DailybotHQ/devcontainer-kit/releases/download/$DCK_RENDERED_WITH/SHA256SUMS" &&
    if [ -n "$DCK_SUMS_SHA256" ]; then
      [ "$(sum "$work/SHA256SUMS" | cut -d' ' -f1)" = "$DCK_SUMS_SHA256" ] ||
        { echo "dev.sh: SHA256SUMS does not match the digest this repository pins" >&2; false; }
    fi &&
    cd "$work/kit" &&
    # Everything that runs must be covered by the sums: the installer, the
    # launcher and its whole library.
    for f in install.sh bin/dck lib/*; do
      [ -d "$f" ] && continue
      grep -Eq "^[0-9a-f]{64}  \*?(\./)?$f\$" "$work/SHA256SUMS" ||
        { echo "dev.sh: $f is not covered by the release SHA256SUMS" >&2; exit 1; }
    done &&
    sum -c --quiet "$work/SHA256SUMS" &&
    bash ./install.sh --no-rc &&
    printf '%s %s\n' "$DCK_RENDERED_WITH" "$(sum "$work/SHA256SUMS" | cut -d' ' -f1)" > "$dest/RELEASE_SUMS_SHA256"
  ) || rc=$?
  rm -rf "$work"
  if [ "$rc" -ne 0 ]; then
    echo "dev.sh: devcontainer-kit $DCK_RENDERED_WITH was not installed (download or verification failed)" >&2
    return "$rc"
  fi
  dck_bin="$dest/bin/dck"
  echo "dev.sh: devcontainer-kit $DCK_RENDERED_WITH installed (verified). Add ${DCK_INSTALL_DIR:-~/.local/share/dck}/bin to PATH to use dck directly; it needs python3 >= 3.11."
}

# The docker-only fallback refuses what dck's own preflight refuses: container
# configuration that reaches the host. A grep-level mirror of dck's rules;
# DCK_TRUST=1 starts it anyway, once you have read the files it names.
preflight() {
  [ "${DCK_TRUST:-0}" = 1 ] && return 0
  local compose=docker/local/docker-compose.yaml found="" root src line dir
  root="$(pwd -P)"
  [ -f "$compose" ] && [ ! -L "$compose" ] || { echo "dev.sh: $compose is missing or a symlink" >&2; return 5; }
  grep -Eq '^[[:space:]]*privileged:[[:space:]]*(true|yes|on)' "$compose" && found="$found
  - privileged: true"
  grep -Eq '^[[:space:]]*cap_add:' "$compose" && found="$found
  - cap_add"
  grep -q 'docker\.sock' "$compose" && found="$found
  - the Docker socket"
  grep -Eq "^[[:space:]]*(network_mode|pid|ipc|userns_mode|uts):[[:space:]]*['\"]?host" "$compose" && found="$found
  - a host namespace (network_mode/pid/ipc/userns_mode/uts: host)"
  grep -Eq '^[[:space:]]*security_opt:' "$compose" && found="$found
  - security_opt"
  grep -Eq '^[[:space:]]*devices:' "$compose" && found="$found
  - host devices"
  if [ -f docker/local/.env ] && grep -Eq '^[[:space:]]*(export[[:space:]]+)?DCK_HOST_SSH_AUTH_SOCK[[:space:]]*[=:]' docker/local/.env; then
    found="$found
  - docker/local/.env sets DCK_HOST_SSH_AUTH_SOCK"
  fi
  if [ -f .devcontainer/devcontainer.json ] && grep -q '"initializeCommand"' .devcontainer/devcontainer.json; then
    found="$found
  - initializeCommand in .devcontainer/devcontainer.json"
  fi
  # Bind mounts: short (`- src:/dst`) and long (`source: src`) syntax.
  while IFS= read -r src; do
    [ -n "$src" ] || continue
    case "$src" in
      '${DCK_HOST_SSH_AUTH_SOCK:-/run/host-services/ssh-auth.sock}') continue ;;
      /*|'~'*|'$'*) found="$found
  - a host bind mount ($src)"; continue ;;
    esac
    # A directory resolves itself; a file (or a missing path) its parent.
    if [ -d "docker/local/$src" ]; then
      dir="$(cd docker/local 2>/dev/null && cd -P "$src" 2>/dev/null && pwd -P)" || dir=""
    else
      dir="$(cd docker/local 2>/dev/null && cd -P "$(dirname "$src")" 2>/dev/null && pwd -P)" || dir=""
    fi
    case "$dir/" in
      "$root"/*) ;;
      *) found="$found
  - a bind mount outside the repository ($src)" ;;
    esac
  done <<EOF
$(sed -n -e "s/^[[:space:]]*-[[:space:]]*['\"]\{0,1\}\([^'\":[:space:]][^:'\"]*\):\/.*/\1/p" \
         -e "s/^[[:space:]]*source:[[:space:]]*['\"]\{0,1\}\([^'\"[:space:]]*\).*/\1/p" "$compose" |
  grep -E '^[./~$]' || true)
EOF
  [ -z "$found" ] && return 0
  printf 'dev.sh: this repository'"'"'s container configuration reaches the host:%s\n' "$found" >&2
  echo "dev.sh: review it, then re-run with DCK_TRUST=1 to start it anyway" >&2
  return 5
}

verb="${1:-help}"
[ $# -gt 0 ] && shift

case "$verb" in
  install-dck) install_dck; exit $? ;;
  help|-h|--help) usage; exit 0 ;;
esac

if [ -z "$dck_bin" ]; then
  # Docker alone: the container verbs on plain compose. dck's start hook still
  # runs inside (the entrypoint), and dck-created named volumes make compose print
  # a harmless "volume ... already exists but was not created by Docker Compose".
  case "$verb" in
    up|down|build|rebuild|logs|ps|shell|exec)
      command -v docker >/dev/null 2>&1 || { echo "dev.sh: docker is required on the host" >&2; exit 4; } ;;
  esac
  svc="pertechtalks" user="node" workdir="/app"
  compose=(docker compose -p "$DCK_PROJECT" -f docker/local/docker-compose.yaml)
  # Docker Desktop exposes the host SSH agent itself; a Linux host passes its own.
  if [ -z "${DCK_HOST_SSH_AUTH_SOCK:-}" ] && [ "$(uname -s)" = Linux ] && [ -n "${SSH_AUTH_SOCK:-}" ]; then
    export DCK_HOST_SSH_AUTH_SOCK="$SSH_AUTH_SOCK"
  fi
  # Missing .env files from their examples: regular files inside the repository
  # only, never through a symlink, never over an existing file.
  for ex in docker/local/*/.env.example; do
    t="${ex%.example}"
    [ -f "$ex" ] && [ ! -L "$ex" ] && [ ! -L "$(dirname "$ex")" ] || continue
    [ -e "$t" ] || [ -L "$t" ] && continue
    (umask 077 && set -C && cat "$ex" > "$t") 2>/dev/null || true
  done
  case "$verb" in
    up|build|rebuild) preflight || exit $? ;;
  esac
  case "$verb" in
    up) exec "${compose[@]}" up -d "$@" "$svc" ;;
    down) exec "${compose[@]}" down "$@" ;;
    build) exec "${compose[@]}" build "$@" "$svc" ;;
    rebuild) "${compose[@]}" build "$@" "$svc" && exec "${compose[@]}" up -d --force-recreate "$svc" ;;
    logs) exec "${compose[@]}" logs -f "$@" ;;
    ps) exec "${compose[@]}" ps "$@" ;;
    shell) exec "${compose[@]}" exec -u "$user" -w "$workdir" "$svc" bash -l ;;
    exec) exec "${compose[@]}" exec -u "$user" -w "$workdir" "$svc" "$@" ;;
    doctor|ssh|agents|ask|setup|herdr|herdr-layout)
      if [ -t 0 ] && [ -t 2 ]; then
        printf 'dev.sh: "%s" needs devcontainer-kit (dck). Install %s now (pinned, verified)? [Y/n] ' "$verb" "$DCK_RENDERED_WITH" >&2
        ans=""; read -r ans || ans=n
        case "$ans" in n|N|no|NO) ;; *) install_dck && exec bash "$PWD/$(basename "$0")" "$verb" "$@" ;; esac
      fi
      cat >&2 <<EOF
dev.sh: "$verb" needs devcontainer-kit (dck) on this host — this repository was
rendered with ${DCK_RENDERED_WITH}. Install it, pinned and verified (python3 >= 3.11):
  bash dev.sh install-dck
or by hand:
  git clone --branch ${DCK_RENDERED_WITH} https://github.com/DailybotHQ/devcontainer-kit
  ./devcontainer-kit/install.sh
EOF
      exit 4 ;;
    *) echo "dev.sh: unknown command '$verb'" >&2; usage >&2; exit 2 ;;
  esac
fi

case "$("$dck_bin" --version 2>/dev/null)" in
  "devcontainer-kit ${DCK_RENDERED_WITH#v}") ;;
  *) echo "dev.sh: note: this repository was rendered with devcontainer-kit ${DCK_RENDERED_WITH}; run \`dck init\` to reconcile it with $("$dck_bin" --version 2>/dev/null)" >&2 ;;
esac

case "$verb" in
  up) "$dck_bin" setup && exec "$dck_bin" up "$@" ;;
  down|shell|exec|build|rebuild|logs|ps|doctor|ssh|agents|ask|setup) exec "$dck_bin" "$verb" "$@" ;;
  herdr) if [ $# -eq 0 ]; then exec "$dck_bin" herdr add; else exec "$dck_bin" herdr "$@"; fi ;;
  herdr-layout) exec "$dck_bin" herdr layout "$@" ;;
  *) echo "dev.sh: unknown command '$verb'" >&2; usage >&2; exit 2 ;;
esac
# <<< dck:devsh <<<
