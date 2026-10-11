#!/usr/bin/env bash
# The site's own start hook: devcontainer-kit runs it as the container user, from
# /app, at every container start (dck_repo_hook).
#
# pnpm's store must live on the container's filesystem, never on the /app bind
# mount: Docker Desktop's fakeowner layer cannot service the store's hardlinks and
# installs die with ERR_PNPM_EPERM. pnpm 11 reads `storeDir` ONLY from
# ~/.config/pnpm/config.yaml (`store-dir` in .npmrc and the env vars are ignored),
# so it is written here, outside the repository, where CI and host installs keep
# their own defaults. node_modules itself stays on the bind mount.
set -eu
store="$HOME/.local/share/pnpm/store"
cache="$HOME/.cache/pnpm"
mkdir -p "$store" "$cache" "$HOME/.config/pnpm"
cat > "$HOME/.config/pnpm/config.yaml" <<YAML
# Written by docker/local/dev-setup-hook.sh at every container start.
storeDir: ${store}
cacheDir: ${cache}
YAML
