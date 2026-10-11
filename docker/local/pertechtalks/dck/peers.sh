#!/usr/bin/env bash
#
# images/common/peers.sh — herdr-peers (and Herdr's own skill) in the image, so
# agents inside the container can list and ask Herdr agents on other machines.
#
#   peers.sh            (run as root during `docker build`, from /tmp/dck-peers:
#                        this script and versions.env)
#
# herdr-peers comes from its tag's source, verified file by file against the
# release SHA256SUMS, which is itself pinned by sha256 in versions.env. Nothing
# is piped into a shell. The skills land in /usr/local/share/dck/skills/ (not in
# an agent home: those live on volumes); the entrypoint links them into each
# agent's skill directory at start (dck_skills_link).
set -euo pipefail

BUILD_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=images/versions.env
. "$BUILD_DIR/versions.env"

fetch() {
  curl --proto '=https' --tlsv1.2 -fsSL --retry 3 -o "$2" "$1"
}

work="$(mktemp -d /tmp/dck-peers.XXXXXX)"
fetch "https://github.com/DailybotHQ/herdr-peers/releases/download/${HERDR_PEERS_TAG}/SHA256SUMS" "$work/SHA256SUMS"
echo "${HERDR_PEERS_SUMS_SHA256}  $work/SHA256SUMS" | sha256sum -c - >/dev/null \
  || { echo "checksum mismatch for herdr-peers ${HERDR_PEERS_TAG} SHA256SUMS" >&2; exit 1; }
fetch "https://codeload.github.com/DailybotHQ/herdr-peers/tar.gz/refs/tags/${HERDR_PEERS_TAG}" "$work/src.tgz"
mkdir "$work/src"
tar -xzf "$work/src.tgz" -C "$work/src" --strip-components=1
(cd "$work/src" && sha256sum -c --quiet "$work/SHA256SUMS") \
  || { echo "herdr-peers ${HERDR_PEERS_TAG}: a file does not match its release SHA256SUMS" >&2; exit 1; }
# Everything installed must be listed (and so verified): no unlisted file, no symlink.
if [ -n "$(cd "$work/src" && find skills/herdr-peers ! -type f ! -type d)" ]; then
  echo "herdr-peers ${HERDR_PEERS_TAG}: the skill contains a symlink or special file" >&2; exit 1
fi
listed="$(awk '{p=$2; sub(/^\*/, "", p); sub(/^\.\//, "", p); print p}' "$work/SHA256SUMS" | sort -u)"
unlisted="$(cd "$work/src" && find skills/herdr-peers -type f | sort | comm -23 - <(printf '%s\n' "$listed"))"
if [ -n "$unlisted" ]; then
  echo "herdr-peers ${HERDR_PEERS_TAG}: files not covered by SHA256SUMS: $unlisted" >&2; exit 1
fi

skills=/usr/local/share/dck/skills
mkdir -p "$skills"
rm -rf "$skills/herdr-peers"
cp -R "$work/src/skills/herdr-peers" "$skills/herdr-peers"
chmod -R a+rX "$skills/herdr-peers"
ln -sfn "$skills/herdr-peers/scripts/herdr-peers" /usr/local/bin/herdr-peers

# Herdr's own skill, matching the pinned binary (herdr-peers builds on it).
mkdir -p "$skills/herdr"
herdr --skill > "$skills/herdr/SKILL.md"
chmod 0644 "$skills/herdr/SKILL.md"

rm -rf "$work"
herdr-peers --help >/dev/null
echo "herdr-peers ${HERDR_PEERS_TAG} installed (verified)"
