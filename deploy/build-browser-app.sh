#!/usr/bin/env bash
# Builds the CleanScape app for the browser and puts it where the Earthy server serves it: server/static/app.
#
# Why: Expo Go on iPhone only opens a project for the account that owns it, so other people's iPhones can't
# run the app through Expo Go. The browser build opens from a link on any phone, with nothing to install.
#
# Run from anywhere:   deploy/build-browser-app.sh
# Then commit server/static/app and update the server (deploy/deploy-on-vultr.md).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$(mktemp -d)"
trap 'rm -rf "$OUT"' EXIT

cd "$ROOT/app"
[ -d node_modules ] || npm install --no-audit --no-fund

# "same-origin": the browser app talks to the server it was opened from (see src/services/earthy-api.ts).
CLEANSCAPE_BROWSER_BUILD=1 EXPO_PUBLIC_EARTHY_API_URL=same-origin \
  npx expo export --platform web --output-dir "$OUT/dist" --clear

python3 "$ROOT/deploy/finish-browser-app.py" "$OUT/dist" "$ROOT/server/static/app"
echo "Browser app is in server/static/app"
