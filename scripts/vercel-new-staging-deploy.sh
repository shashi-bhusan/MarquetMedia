#!/usr/bin/env bash
# Create a fresh Vercel project link (optional) and deploy the current tree as production.
# Uses your local checkout — run from branch `staging` after `git pull`.
#
# Security: export VERCEL_TOKEN in the shell (do not commit it). The CLI reads the env var;
# we do not pass --token on the command line.
#
# Usage:
#   export VERCEL_TOKEN=xxxxxxxx        # https://vercel.com/account/tokens
#   export VERCEL_SCOPE=my-team-slug    # optional; Vercel team slug for Hobby/Pro teams
#   ./scripts/vercel-new-staging-deploy.sh
#
# Brand-new Vercel project (delete local link first):
#   VERCEL_NEW_LINK=1 ./scripts/vercel-new-staging-deploy.sh
#
# After deploy: Vercel dashboard → Project → Settings → Git → Connect
#   https://github.com/shashi-bhusan/MarquetMedia  and set Production Branch to: staging
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "Export VERCEL_TOKEN first (https://vercel.com/account/tokens )" >&2
  exit 1
fi

git checkout staging
git pull shashi staging 2>/dev/null || git pull origin staging 2>/dev/null || true

if [[ "${VERCEL_NEW_LINK:-}" == "1" ]]; then
  if [[ -d .vercel ]]; then
    echo "Removing .vercel (VERCEL_NEW_LINK=1) for a new Vercel project link."
    rm -rf .vercel
  fi
fi

SCOPE_ARGS=()
if [[ -n "${VERCEL_SCOPE:-}" ]]; then
  SCOPE_ARGS=(--scope "$VERCEL_SCOPE")
fi

export VERCEL_TOKEN

echo "==> Deploying to production (creates/links project on first run)..."
npx vercel@latest deploy --prod --yes "${SCOPE_ARGS[@]}"

echo ""
echo "Next (dashboard) so Git pushes deploy automatically:"
echo "  • Project → Settings → Git → Connect → shashi-bhusan/MarquetMedia"
echo "  • Production Branch: staging"
echo "  • Copy Environment Variables from your old staging project if needed."
