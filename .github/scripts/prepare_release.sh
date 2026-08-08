#!/bin/bash
# Bumps the patch version in package.json, then commits and tags explicitly.
#
# Bumps the version with Node directly instead of `pnpm version` because
# pnpm v11.x runs `git status --porcelain` upfront and fails with
# ERR_PNPM_UNCLEAN_WORKING_TREE when the working tree has untracked files —
# which happens in CI after `pnpm install --frozen-lockfile` leaves transient
# artefacts behind (sharp build outputs, esbuild postinstall, etc.). The Node
# bump only touches package.json and is safe regardless of untracked state.
#
# Next version is max(package.json patch+1, highest existing v* tag + 1) so a
# prior failed release that pushed a tag but not main cannot collide.
set -euo pipefail

BOT_NAME="${RELEASE_BOT_NAME:-Pereira Tech Talks}"

if ! git diff --quiet HEAD -- .; then
  echo "Tracked files have uncommitted changes. Refusing to prepare a release."
  git status --short --untracked-files=no
  exit 1
fi

# Ensure remote tags are visible (checkout may omit some in shallow edge cases).
git fetch --tags --force origin 2>/dev/null || true

VERSION=$(node <<'NODE'
const { execSync } = require('node:child_process');
const fs = require('node:fs');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const [pkgMajor, pkgMinor, pkgPatch] = pkg.version.split('.').map(Number);

let candidateMajor = pkgMajor;
let candidateMinor = pkgMinor;
let candidatePatch = pkgPatch + 1;

const tagText = execSync('git tag -l "v*.*.*"', { encoding: 'utf8' });
for (const line of tagText.split('\n')) {
  const match = /^v(\d+)\.(\d+)\.(\d+)$/.exec(line.trim());
  if (!match) continue;
  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);
  if (
    major > candidateMajor ||
    (major === candidateMajor && minor > candidateMinor) ||
    (major === candidateMajor && minor === candidateMinor && patch >= candidatePatch)
  ) {
    candidateMajor = major;
    candidateMinor = minor;
    candidatePatch = patch + 1;
  }
}

pkg.version = `${candidateMajor}.${candidateMinor}.${candidatePatch}`;
fs.writeFileSync('package.json', `${JSON.stringify(pkg, null, 2)}\n`);
console.log(pkg.version);
NODE
)
TAG="v${VERSION}"

if git rev-parse "refs/tags/${TAG}" >/dev/null 2>&1; then
  echo "Tag ${TAG} already exists after version resolution. Refusing to continue."
  exit 1
fi

RELEASE_MESSAGE="[🤖 ${BOT_NAME}] New release to ${TAG} launched 🚀"

git add package.json
if [[ -f "pnpm-lock.yaml" ]]; then
  git add pnpm-lock.yaml
fi

if git diff --cached --quiet; then
  echo "No release metadata changes staged."
  exit 1
fi

git commit -m "${RELEASE_MESSAGE}"
git tag -a "${TAG}" -m "${TAG}"

echo "Prepared release ${TAG}"
echo "${TAG}" > .release_tag
