#!/usr/bin/env bash
#
# images/common/install.sh — the build steps shared by every flavour.
#
#   install.sh <flavour> <extra apt packages...>
#
# Runs once, as root, during `docker build`, from /tmp/dck-build (this
# directory plus versions.env). Every download is pinned in versions.env and
# verified by SHA-256 before use; nothing is ever piped into a shell. No
# coding-agent CLI or agent tooling is installed here: those are opt-in layers
# (lib/layers/, docs/layers.md); the exclusion list is in docs/images.md.
set -euo pipefail

FLAVOUR="$1"; shift
BUILD_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=images/versions.env
. "$BUILD_DIR/versions.env"

DEV_USER=dev
DEV_UID=1000
ARCH="$(dpkg --print-architecture)"
case "$ARCH" in
  amd64) GH_SHA="$GH_SHA256_AMD64"; HERDR_ASSET=herdr-linux-x86_64; HERDR_SHA="$HERDR_SHA256_AMD64"
         NVIM_ASSET=nvim-linux-x86_64; NVIM_SHA="$NVIM_SHA256_AMD64" ;;
  arm64) GH_SHA="$GH_SHA256_ARM64"; HERDR_ASSET=herdr-linux-aarch64; HERDR_SHA="$HERDR_SHA256_ARM64"
         NVIM_ASSET=nvim-linux-arm64; NVIM_SHA="$NVIM_SHA256_ARM64" ;;
  *) echo "unsupported architecture: $ARCH" >&2; exit 1 ;;
esac

# fetch <url> <sha256> <dest> — download to a file and verify, or fail the build.
fetch() {
  curl --proto '=https' --tlsv1.2 -fsSL --retry 3 -o "$3" "$1"
  echo "$2  $3" | sha256sum -c - >/dev/null || { echo "checksum mismatch for $1" >&2; exit 1; }
}

# --- system packages (one apt transaction) --------------------------------
export DEBIAN_FRONTEND=noninteractive
apt-get update
# shellcheck disable=SC2068
apt-get install -y --no-install-recommends \
  ca-certificates curl git git-lfs sudo build-essential less nano procps \
  openssh-server openssh-client ripgrep fd-find xz-utils unzip bash-completion \
  locales tzdata tar gzip lua5.4 fontconfig "$@"
ln -sf "$(command -v fdfind)" /usr/local/bin/fd
sed -i 's/^# *\(en_US.UTF-8\)/\1/' /etc/locale.gen && locale-gen >/dev/null

# --- sshd: hardened drop-in, NO host keys in the image ---------------------
# Host keys are generated at runtime into a persistent volume by the
# entrypoint (dck_sshd); baking them would ship one private key to everyone.
rm -f /etc/ssh/ssh_host_*
mkdir -p /etc/ssh/sshd_config.d /run/sshd
install -m 0644 "$BUILD_DIR/sshd_config.conf" /etc/ssh/sshd_config.d/10-dck.conf
# GitHub's published host keys: `git` over SSH never asks to trust one.
grep -v '^#' "$BUILD_DIR/github_known_hosts" >> /etc/ssh/ssh_known_hosts
chmod 0644 /etc/ssh/ssh_known_hosts

# --- GitHub CLI --------------------------------------------------------------
fetch "https://github.com/cli/cli/releases/download/v${GH_VERSION}/gh_${GH_VERSION}_linux_${ARCH}.tar.gz" "$GH_SHA" /tmp/gh.tgz
tar -xzf /tmp/gh.tgz -C /tmp
install -m 0755 "/tmp/gh_${GH_VERSION}_linux_${ARCH}/bin/gh" /usr/local/bin/gh
rm -rf /tmp/gh.tgz "/tmp/gh_${GH_VERSION}_linux_${ARCH}"

# --- Herdr: system-wide, so a non-login SSH session (PATH=/usr/local/bin:...)
# finds it when the host attaches the container as a machine ---------------
fetch "https://github.com/ogulcancelik/herdr/releases/download/v${HERDR_VERSION}/${HERDR_ASSET}" "$HERDR_SHA" /usr/local/bin/herdr
chmod 0755 /usr/local/bin/herdr

# --- Neovim (official tarball) ---------------------------------------------
fetch "https://github.com/neovim/neovim/releases/download/v${NVIM_VERSION}/${NVIM_ASSET}.tar.gz" "$NVIM_SHA" /tmp/nvim.tgz
mkdir -p "/opt/nvim-${NVIM_VERSION}"
tar -xzf /tmp/nvim.tgz -C "/opt/nvim-${NVIM_VERSION}" --strip-components=1
ln -sfn "/opt/nvim-${NVIM_VERSION}/bin/nvim" /usr/local/bin/nvim
rm -f /tmp/nvim.tgz

# --- the dev user (uid 1000) ------------------------------------------------
existing="$(getent passwd "$DEV_UID" | cut -d: -f1 || true)"
if [ -n "$existing" ] && [ "$existing" != "$DEV_USER" ]; then
  # node images ship `node` as uid 1000: rename it rather than fight over the uid.
  group="$(id -gn "$existing")"
  usermod -l "$DEV_USER" -d "/home/$DEV_USER" -m "$existing"
  groupmod -n "$DEV_USER" "$group"
elif [ -z "$existing" ]; then
  groupadd --gid "$DEV_UID" "$DEV_USER"
  useradd --uid "$DEV_UID" --gid "$DEV_USER" --create-home --shell /bin/bash "$DEV_USER"
fi
usermod -s /bin/bash "$DEV_USER"
printf '%s ALL=(root) NOPASSWD:ALL\n' "$DEV_USER" > "/etc/sudoers.d/$DEV_USER"
chmod 0440 "/etc/sudoers.d/$DEV_USER"
home="/home/$DEV_USER"
mkdir -p "$home/.dck/volumes" "$home/.config/herdr" "$home/.local/bin" "$home/.ssh"
chmod 0700 "$home/.ssh"
# `ssh <container> <command>` runs a non-login shell, which bash (run by sshd)
# starts by reading ~/.bashrc. Load the container environment there, BEFORE
# Debian's "not interactive: return" guard, so commands see it too.
[ -f "$home/.bashrc" ] || cp /etc/skel/.bashrc "$home/.bashrc"
{
  echo '# devcontainer-kit: the container environment, also for non-interactive ssh commands,'
  echo '# and the user tool PATH (ak, nvim) for non-login shells (docker exec, editor terminals)'
  # shellcheck disable=SC2016  # expanded by the user's shell, not here
  echo '[ -r /etc/profile.d/00-dck.sh ] && . /etc/profile.d/00-dck.sh'
  # shellcheck disable=SC2016  # expanded by the user's shell, not here
  echo '[ -r "$HOME/.dck/env.sh" ] && . "$HOME/.dck/env.sh"'
  cat "$home/.bashrc"
} > /tmp/dck-bashrc && mv /tmp/dck-bashrc "$home/.bashrc"

# deepworkplan-vim is installed later, in its own layer (images/common/editor.sh),
# so an editor bump does not rebuild this one.

# --- Herdr seed config (the entrypoint keeps it current: dck_herdr_config) ---
install -m 0644 "$BUILD_DIR/herdr-config.toml" "$home/.config/herdr/config.toml"
chown -R "$DEV_USER:$DEV_USER" "$home"

# --- shell environment --------------------------------------------------------
install -m 0644 "$BUILD_DIR/profile.sh" /etc/profile.d/00-dck.sh
# Repositories are bind-mounted from the host with the host's ownership.
git config --system safe.directory '*'
git config --system init.defaultBranch main

# --- image metadata for `dck doctor` (drift) ---------------------------------
mkdir -p /etc/dck
{
  echo "DCK_IMAGE_FLAVOUR=$FLAVOUR"
  echo "GH_VERSION=$GH_VERSION"
  echo "HERDR_VERSION=$HERDR_VERSION"
  echo "NVIM_VERSION=$NVIM_VERSION"
  echo "DWP_VIM_TAG=$DWP_VIM_TAG"
} > /etc/dck/image.env
install -m 0644 "$BUILD_DIR/versions.env" /etc/dck/versions.env

# --- verify and clean ---------------------------------------------------------
gh --version >/dev/null
herdr --version >/dev/null
nvim --version >/dev/null
apt-get clean
rm -rf /var/lib/apt/lists/* /tmp/* /root/.cache
