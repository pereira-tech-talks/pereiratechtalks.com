#!/bin/bash
# Build release notes from commits since the previous release tag.
# Falls back to scanning commit subjects until the previous automation
# release commit when no prior tag exists.
set -euo pipefail

OUT="git_logs_output.txt"
rm -f "${OUT}"

LAST_TAG="$(git describe --tags --abbrev=0 2>/dev/null || true)"

if [[ -n "${LAST_TAG}" ]]; then
  RANGE="${LAST_TAG}..HEAD"
  mapfile -t LINES < <(git log "${RANGE}" --pretty=format:'%s' --no-merges)
else
  mapfile -t LINES < <(git log --pretty=format:'%s' --no-merges)
fi

count=0
for text_line in "${LINES[@]}"; do
  # Stop / skip automation release commits (current + legacy author names).
  if [[ "${text_line}" =~ New\ release\ to\ v ]]; then
    if [[ -z "${LAST_TAG}" ]]; then
      break
    fi
    continue
  fi
  if [[ "${text_line}" =~ ^Merge\ (branch|pull\ request) ]]; then
    continue
  fi
  echo "- ${text_line}" >> "${OUT}"
  count=$((count + 1))
done

if [[ "${count}" -eq 0 ]]; then
  echo "- Maintenance release" > "${OUT}"
fi

echo "Wrote ${count} changelog entries to ${OUT}"
