#!/usr/bin/env bash
#
# images/common/editor.sh — the editor layer of every base image: deepworkplan-vim
# installed for the dev user by its official installer, in container mode.
#
#   editor.sh            (run as root during `docker build`, from /tmp/dck-editor:
#                         this script and versions.env, copied for this layer only)
#
# The installer is the project's hosted one (vim.deepworkplan.com serves the same
# file as the release asset); it is fetched from the versioned release asset,
# checked against the SHA-256 pinned in versions.env, and only then run — never
# piped into a shell, as the installer's own help recommends for images:
#   bash install.sh --version X.Y.Z --skip-packages --strict
# --skip-packages: the system packages it needs are installed by install.sh.
# --strict: the build fails if the headless plugin install fails, leaves a
# required plugin missing or empty, or leaves a plugin (or pckr) away from the
# commit the release pins in pckr/lockfile.lua (deepworkplan-vim v0.5.1+).
# --nvim is not used: the image already provides the pinned, checksum-verified
# Neovim at /usr/local/bin/nvim for every user (install.sh); --nvim would put a
# second copy in the dev user's ~/.local/bin, which non-login SSH sessions and
# `docker exec` do not have on PATH.
# The installed configuration must resolve to the pinned commit, and through it
# every plugin is pinned too: deepworkplan-vim's pckr/lockfile.lua fixes each plugin
# and pckr to a commit, and --strict verifies them (docs/SECURITY.md, "Known limits").
set -euo pipefail

BUILD_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=images/versions.env
. "$BUILD_DIR/versions.env"
DEV_USER=dev
home="/home/$DEV_USER"

# fetch <url> <sha256> <dest> — download to a file and verify, or fail the build.
fetch() {
  curl --proto '=https' --tlsv1.2 -fsSL --retry 3 -o "$3" "$1"
  echo "$2  $3" | sha256sum -c - >/dev/null || { echo "checksum mismatch for $1" >&2; exit 1; }
}

# Everything the install leaves in a temp dir lands under /tmp/dck-editor, removed below.
installer=/tmp/dck-editor/install.sh
install -d -o "$DEV_USER" -g "$DEV_USER" /tmp/dck-editor/tmp
fetch "https://github.com/DailybotHQ/deepworkplan-vim/releases/download/${DWP_VIM_TAG}/install.sh" \
  "$DWP_VIM_INSTALLER_SHA256" "$installer"
chmod 0644 "$installer"

# Plugin build steps run pnpm (e.g. `pnpm install --prefix server`); without it such a
# step fails quietly and leaves a half-built plugin. node-24 has pnpm (corepack).
# Debian's nodejs has only an old corepack, whose default "latest" pnpm it cannot run,
# so python-3.13 and debian get a build-only wrapper (gone with /tmp/dck-editor; no
# pnpm is left on PATH): corepack's own bundled pnpm, with dependency install scripts
# off — as pnpm >= 10 does by default on node-24 (optional native add-ons such as
# bufferutil fall back to JavaScript).
mkdir -p /tmp/dck-editor/bin
if ! command -v pnpm >/dev/null 2>&1; then
  printf '%s\n' '#!/bin/sh' \
    'COREPACK_DEFAULT_TO_LATEST=0 COREPACK_ENABLE_DOWNLOAD_PROMPT=0 npm_config_ignore_scripts=true exec corepack pnpm "$@"' \
    > /tmp/dck-editor/bin/pnpm
  chmod 0755 /tmp/dck-editor/bin/pnpm
fi

# install_with_retry <attempts> <command...> — run the installer; when --strict reports
# a plugin problem (the headless install failed or timed out, a plugin is missing or
# empty, or away from its lockfile commit: a plugin clone that lost a race with the
# network), run it again after a growing pause (DCK_EDITOR_RETRY_DELAY seconds × the
# attempt), up to <attempts> runs. A rerun is safe: the installer updates its own
# config in place and re-syncs only what is missing. Any other failure (a checksum,
# a refusal) fails at once; the last plugin failure fails the build, loudly.
install_with_retry() {
  local max="$1" n=1 rc err
  shift
  err="$(mktemp "${TMPDIR:-/tmp}/dck-editor-err.XXXXXX")"
  while :; do
    rc=0
    "$@" 2>"$err" || rc=$?
    cat "$err" >&2
    [ "$rc" -eq 0 ] && { rm -f "$err"; return 0; }
    if ! grep -qE -- '--strict: (the headless plugin install failed|plugins incomplete|plugins differ)' "$err"; then
      rm -f "$err"
      echo "deepworkplan-vim ${DWP_VIM_TAG}: the installer failed (rc=$rc); not a plugin install problem, not retried" >&2
      return "$rc"
    fi
    if [ "$n" -ge "$max" ]; then
      rm -f "$err"
      echo "deepworkplan-vim ${DWP_VIM_TAG}: the plugin install still failed after $max attempts (rc=$rc) — failing the build" >&2
      return "$rc"
    fi
    echo "deepworkplan-vim ${DWP_VIM_TAG}: plugin install attempt $n/$max failed; retrying in $((${DCK_EDITOR_RETRY_DELAY:-15} * n))s" >&2
    sleep "$((${DCK_EDITOR_RETRY_DELAY:-15} * n))"
    n=$((n + 1))
  done
}

# As the dev user, with a clean environment (no build-time variable leaks in).
install_with_retry 3 runuser -u "$DEV_USER" -- env -i \
  HOME="$home" USER="$DEV_USER" LOGNAME="$DEV_USER" SHELL=/bin/bash LANG=en_US.UTF-8 \
  PATH=/usr/local/bin:/usr/bin:/bin:/tmp/dck-editor/bin TMPDIR=/tmp/dck-editor/tmp \
  bash "$installer" --version "${DWP_VIM_TAG#v}" --skip-packages --strict

got="$(git -C "$home/.config/nvim" rev-parse HEAD)"
[ "$got" = "$DWP_VIM_COMMIT" ] || { echo "deepworkplan-vim ${DWP_VIM_TAG} resolved to $got, expected $DWP_VIM_COMMIT" >&2; exit 1; }
nvim --version >/dev/null
# Build-time caches of the plugin builds (corepack's pnpm download, pnpm's cache and
# store; installed node_modules keep their own copies) and the temp dir: nothing the
# editor needs at run time.
rm -rf /tmp/dck-editor "$home/.cache/node" "$home/.cache/pnpm" "$home/.local/share/pnpm"
