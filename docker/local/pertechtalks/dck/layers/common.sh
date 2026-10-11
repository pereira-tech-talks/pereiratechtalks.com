# shellcheck shell=bash
#
# lib/layers/common.sh — helpers for the opt-in layer installers.
# Baked into the base images at /usr/local/lib/dck/layers/ and run at the
# REPOSITORY's image build (`RUN dck-layer <layer> ...` in the Dockerfile
# `dck init` renders), never at base-image build time. Pins come from the
# base image's /etc/dck/versions.env (DCK_VERSIONS overrides it in tests).

set -euo pipefail

DCK_VERSIONS="${DCK_VERSIONS:-/etc/dck/versions.env}"
# shellcheck source=images/versions.env
. "$DCK_VERSIONS"
DCK_USER="${DCK_USER:-dev}"

layer_log() { printf 'dck-layer: %s\n' "$*" >&2; }

layer_arch() {
  local a
  a="$(dpkg --print-architecture 2>/dev/null || uname -m)"
  case "$a" in
    amd64|x86_64) echo amd64 ;;
    arm64|aarch64) echo arm64 ;;
    *) layer_log "unsupported architecture: $a"; return 1 ;;
  esac
}

# fetch <url> <sha256> <dest> — download, verify, or fail the build.
layer_fetch() {
  curl --proto '=https' --tlsv1.2 -fsSL --retry 3 -o "$3" "$1"
  local got
  got="$(sha256sum "$3" | cut -d' ' -f1)"
  if [ "$got" != "$2" ]; then
    rm -f "$3"
    layer_log "checksum mismatch for $1"
    return 1
  fi
}

# Run a command as the dev user (directly when the build already runs as it).
as_user() {
  if [ "$(id -u)" = "0" ] && [ "$DCK_USER" != "root" ]; then
    runuser -u "$DCK_USER" -- env HOME="$(getent passwd "$DCK_USER" | cut -d: -f6)" "$@"
  else
    "$@"
  fi
}
