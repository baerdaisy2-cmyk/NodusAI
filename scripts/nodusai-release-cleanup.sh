#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

rm -f src/frontend/src/utils/nodus-local-templates.ts
find . -maxdepth 1 -type f \
  \( -name 'NODUSAI_*_NOTES.md' \
     -o -name 'NODUSAI_BUILD_WITH_AI*.md' \
     -o -name 'NodusAI-*.zip' \
  \) -delete

echo "NodusAI temporary patch artifacts cleaned."
