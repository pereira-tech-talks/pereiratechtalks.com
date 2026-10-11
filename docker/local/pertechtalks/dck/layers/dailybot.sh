#!/usr/bin/env bash
#
# lib/layers/dailybot.sh — the dailybot layer: the Dailybot CLI, only when the
# dailybot addon asks for it (layers.dailybot = true). Never in a base image.
#
# The wheel is downloaded from PyPI and checked against its pinned SHA-256,
# then installed as an isolated uv tool (uv itself is the base image's on
# python-3.13, otherwise a pinned, checksum-verified standalone binary).
# Its own dependencies are resolved by uv at build time.
# shellcheck source=lib/layers/common.sh
. "$(dirname "${BASH_SOURCE[0]}")/common.sh"

uv_bin="$(command -v uv || true)"
if [ -z "$uv_bin" ]; then
  arch="$(layer_arch)"
  case "$arch" in
    amd64) uv_triple=x86_64-unknown-linux-gnu; uv_sha="$UV_SHA256_AMD64" ;;
    arm64) uv_triple=aarch64-unknown-linux-gnu; uv_sha="$UV_SHA256_ARM64" ;;
  esac
  layer_fetch "https://github.com/astral-sh/uv/releases/download/${UV_VERSION}/uv-${uv_triple}.tar.gz" "$uv_sha" /tmp/uv.tgz
  mkdir -p /tmp/uv && tar -xzf /tmp/uv.tgz -C /tmp/uv --strip-components=1
  uv_bin=/tmp/uv/uv
fi

wheel="/tmp/$(basename "$DAILYBOT_CLI_WHEEL_URL")"
layer_fetch "$DAILYBOT_CLI_WHEEL_URL" "$DAILYBOT_CLI_WHEEL_SHA256" "$wheel"
UV_TOOL_DIR="${DCK_LAYER_TOOL_DIR:-/opt/dck-tools}" UV_TOOL_BIN_DIR="${DCK_LAYER_BIN_DIR:-/usr/local/bin}" \
  "$uv_bin" tool install --python "$(command -v python3)" "$wheel"
rm -rf "$wheel" /tmp/uv /tmp/uv.tgz
layer_log "installed the Dailybot CLI ${DAILYBOT_CLI_VERSION}"
