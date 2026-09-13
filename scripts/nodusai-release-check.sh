#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "[1/6] Checking for tracked secrets/artifacts..."
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if git ls-files --error-unmatch .env >/dev/null 2>&1; then
    echo "ERROR: .env is tracked by git. Remove it from git before release." >&2
    exit 1
  fi
  if git ls-files | grep -E '(^|/)(NodusAI-.*\.zip|NODUSAI_.*(_NOTES|BUILD_WITH_AI).*\.md)$' >/dev/null; then
    echo "ERROR: temporary NodusAI patch files are tracked by git." >&2
    exit 1
  fi
fi

echo "[2/6] Python syntax check..."
python3 -m py_compile \
  src/backend/base/langflow/main.py \
  src/backend/base/langflow/services/database/models/flow/model.py

echo "[3/6] JSON validation..."
python3 - <<'PY'
import json
from pathlib import Path
for path in [Path('src/frontend/src/locales/en.json'), Path('src/frontend/package.json')]:
    json.loads(path.read_text())
    print(f'  OK {path}')
PY

echo "[4/6] TypeScript type-check..."
cd "$ROOT/src/frontend"
npx tsc --noEmit --pretty --project tsconfig.json

echo "[5/6] Frontend production build + backend static bundle..."
cd "$ROOT"
make build_frontend

echo "[6/6] Final branding smoke scan..."
if grep -RIl --include='*.html' --include='*.js' 'github.com/langflow-ai/langflow/issues' src/backend/base/langflow/frontend >/dev/null 2>&1; then
  echo "WARNING: production frontend still contains an upstream GitHub issues link." >&2
else
  echo "  No upstream GitHub issue links found in built frontend."
fi

echo
echo "NodusAI release checks completed successfully."
