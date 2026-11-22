#!/bin/bash
#
# Moves the website data from the legacy PHP API into Strapi, area by area.
#
#   scripts/migrate-to-strapi.sh [options] [area ...]
#
# For each selected area (default: all) it downloads the JSON of the PHP GET endpoints, checks it,
# and runs the area's migration script in the Strapi repo (scripts/migrate-<area>.js). The Strapi
# scripts create or update entries and reuse already uploaded media, so this is safe to re-run.
#
# Server handling: with pm2 (VPS) the Strapi process is stopped during the migration and always
# started again afterwards, also when a step fails. Locally (no pm2) a running `strapi develop`
# is left alone.
#
# Options:
#   --strapi-dir DIR   Strapi repo            (default: ../strapi-cloud-template-blog-49970f95ac, env STRAPI_DIR)
#   --images DIR       legacy images          (default: <this repo>/src/assets/images, env IMAGES_DIR)
#   --images-url URL   fallback for images missing locally
#                                             (default: https://www.hvtdpstainz.at/assets/images)
#   --documents DIR    legacy PDFs           (default: <this repo>/src/assets/documents, env DOCUMENTS_DIR)
#   --api-url URL      legacy PHP API         (default: https://www.hvtdpstainz.at/api)
#   --exports DIR      keep the downloaded JSON in DIR (default: temporary directory, deleted afterwards)
#   --pm2 NAME         pm2 process to stop/start (default: strapi-hvtdp if pm2 is installed, else none)
#   --no-pm2           never stop/start a server
#   --list             list the available areas
#   -h, --help         show this help
#
# Examples:
#   scripts/migrate-to-strapi.sh announcement                       # local, one area
#   STRAPI_DIR=~/strapi scripts/migrate-to-strapi.sh \
#     --images /home/hvtdp/htdocs/www.hvtdpstainz.at/assets/images  # VPS, all areas

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STRAPI_DIR="${STRAPI_DIR:-$REPO_DIR/../strapi-cloud-template-blog-49970f95ac}"
IMAGES_DIR="${IMAGES_DIR:-$REPO_DIR/src/assets/images}"
DOCUMENTS_DIR="${DOCUMENTS_DIR:-$REPO_DIR/src/assets/documents}"
DOCUMENTS_URL="https://www.hvtdpstainz.at/assets/documents"
IMAGES_URL="https://www.hvtdpstainz.at/assets/images"
API_URL="https://www.hvtdpstainz.at/api"
EXPORTS_DIR=""
PM2_NAME=""
USE_PM2="auto"

# ---------------------------------------------------------------------------------------------
# Areas: each area_<name> function downloads its endpoints with `fetch` and runs its script with
# `migrate`. Add new areas here and to AREAS (in migration order).
# ---------------------------------------------------------------------------------------------

AREAS=(announcement club fanshop documents championship videos)
PHASE=download

# Announcement bar on the home page (replaces the ticker).
area_announcement() {
  fetch getTicker
  migrate announcement --source "$EXPORTS_DIR/getTicker.json"
}

# Team, board, members, Papp-Fans and match ball donations (with their images).
area_club() {
  local endpoint
  for endpoint in getPlayers getSquadPlayers getActivePlayers getChefs \
    getActiveMembership getSupportMembership getKidsMembership getPappfans getDonations; do
    fetch "$endpoint"
  done
  migrate club --exports "$EXPORTS_DIR" "${MEDIA_ARGS[@]}"
}

# Fanshop items with prices, order options and images.
area_fanshop() {
  fetch getItems
  migrate fanshop --exports "$EXPORTS_DIR" "${MEDIA_ARGS[@]}"
}

# Seasons, standings, season scorers and matches with their goal scorers (needs the club area for players).
area_championship() {
  fetch getStandings
  fetch getScorers
  fetch getMatchInfo
  migrate championship --exports "$EXPORTS_DIR"
}

# Goal videos attached to the matches, Tor des Jahres / Spieler der Saison votings (after club and championship).
area_videos() {
  fetch getGames
  fetch getGoalOfTheSeason
  fetch getPlayerOfTheSeason
  migrate videos --exports "$EXPORTS_DIR"
}

# Documents (PDFs) with category and protected flag.
area_documents() {
  fetch getDocuments
  migrate documents --exports "$EXPORTS_DIR" --documents "$DOCUMENTS_DIR" --documents-url "$DOCUMENTS_URL"
}

# ---------------------------------------------------------------------------------------------

usage() {
  sed -n '3,/^$/p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
}

log() {
  printf '\033[1m==> %s\033[0m\n' "$*"
}

fail() {
  printf '\033[31mError: %s\033[0m\n' "$*" >&2
  exit 1
}

# Downloads <endpoint>.php from the PHP API to $EXPORTS_DIR/<endpoint>.json and checks it is a JSON array.
fetch() {
  local endpoint="$1"
  local file="$EXPORTS_DIR/$endpoint.json"
  if [[ -s "$file" ]]; then
    return # already downloaded in this run
  fi
  log "Downloading $endpoint.php"
  curl -fsS --retry 3 "$API_URL/$endpoint.php" -o "$file" || fail "could not download $API_URL/$endpoint.php"
  # shellcheck disable=SC2016 # JavaScript template literal, not a shell expansion
  node -e '
    const data = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
    if (!Array.isArray(data)) { console.error("not a JSON array"); process.exit(1); }
    console.log(`    ${data.length} entries`);
  ' "$file" || fail "$endpoint.php did not return a JSON array (see $file)"
}

# Runs scripts/migrate-<area>.js in the Strapi repo with the given arguments (only in the migrate phase).
migrate() {
  [[ "$PHASE" == migrate ]] || return 0
  local area="$1"
  shift
  log "Migrating $area"
  (cd "$STRAPI_DIR" && NODE_ENV="$NODE_ENV" node "scripts/migrate-$area.js" "$@" 2>&1 | { grep -v 'sendmail' || true; })
}

stop_server() {
  if [[ -n "$PM2_NAME" ]]; then
    log "Stopping pm2 process $PM2_NAME"
    pm2 stop "$PM2_NAME" >/dev/null
    SERVER_STOPPED=1
  fi
}

start_server() {
  if [[ "${SERVER_STOPPED:-0}" == 1 ]]; then
    log "Starting pm2 process $PM2_NAME"
    pm2 start "$PM2_NAME" >/dev/null
  fi
}

cleanup() {
  local status=$?
  start_server
  if [[ "${REMOVE_EXPORTS:-0}" == 1 ]]; then
    rm -rf "$EXPORTS_DIR"
  fi
  if [[ $status -ne 0 ]]; then
    printf '\033[31mMigration failed (exit %s). Fix the problem and re-run; finished steps are kept.\033[0m\n' "$status" >&2
  fi
}

# --- Arguments ---------------------------------------------------------------------------------

SELECTED=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --strapi-dir) STRAPI_DIR="$2"; shift 2 ;;
    --images) IMAGES_DIR="$2"; shift 2 ;;
    --images-url) IMAGES_URL="$2"; shift 2 ;;
    --documents) DOCUMENTS_DIR="$2"; shift 2 ;;
    --api-url) API_URL="${2%/}"; shift 2 ;;
    --exports) EXPORTS_DIR="$2"; shift 2 ;;
    --pm2) PM2_NAME="$2"; USE_PM2="yes"; shift 2 ;;
    --no-pm2) USE_PM2="no"; shift ;;
    --list) printf '%s\n' "${AREAS[@]}"; exit 0 ;;
    -h | --help) usage; exit 0 ;;
    -*) fail "unknown option $1 (see --help)" ;;
    *) SELECTED+=("$1"); shift ;;
  esac
done

if [[ ${#SELECTED[@]} -eq 0 ]]; then
  SELECTED=("${AREAS[@]}")
fi
for area in "${SELECTED[@]}"; do
  declare -F "area_$area" >/dev/null || fail "unknown area '$area' (available: ${AREAS[*]})"
done

[[ -f "$STRAPI_DIR/package.json" ]] || fail "Strapi repo not found at $STRAPI_DIR (use --strapi-dir)"
[[ -d "$IMAGES_DIR" ]] || fail "images directory not found at $IMAGES_DIR (use --images)"
[[ -d "$DOCUMENTS_DIR" ]] || fail "documents directory not found at $DOCUMENTS_DIR (use --documents)"
command -v node >/dev/null || fail "node is required"
command -v curl >/dev/null || fail "curl is required"
STRAPI_DIR="$(cd "$STRAPI_DIR" && pwd)"
IMAGES_DIR="$(cd "$IMAGES_DIR" && pwd)"
DOCUMENTS_DIR="$(cd "$DOCUMENTS_DIR" && pwd)"
# Arguments for migration scripts that upload images: migrate <area> --source … "${MEDIA_ARGS[@]}"
# shellcheck disable=SC2034 # used by the area functions with images
MEDIA_ARGS=(--images "$IMAGES_DIR" --images-url "$IMAGES_URL")

if [[ "$USE_PM2" == "auto" ]] && command -v pm2 >/dev/null && pm2 describe strapi-hvtdp >/dev/null 2>&1; then
  PM2_NAME="strapi-hvtdp"
elif [[ "$USE_PM2" == "no" ]]; then
  PM2_NAME=""
fi
if [[ -n "$PM2_NAME" ]]; then
  command -v pm2 >/dev/null || fail "pm2 not found (use --no-pm2)"
fi
# The server runs in production mode under pm2; locally the development configuration is used.
NODE_ENV="${NODE_ENV:-$([[ -n "$PM2_NAME" ]] && echo production || echo development)}"

if [[ -z "$EXPORTS_DIR" ]]; then
  EXPORTS_DIR="$(mktemp -d "${TMPDIR:-/tmp}/hvtdp-export.XXXXXX")"
  REMOVE_EXPORTS=1
else
  mkdir -p "$EXPORTS_DIR"
fi

trap cleanup EXIT

log "Areas: ${SELECTED[*]} | Strapi: $STRAPI_DIR ($NODE_ENV) | server: ${PM2_NAME:-not managed}"

# Two passes: first download and check everything (a broken endpoint stops the run before the server
# is touched), then stop the server and migrate.
PHASE=download
for area in "${SELECTED[@]}"; do
  "area_$area"
done

PHASE=migrate
stop_server
for area in "${SELECTED[@]}"; do
  "area_$area"
done

log "Done: ${SELECTED[*]}"
