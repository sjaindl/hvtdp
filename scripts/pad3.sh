#!/bin/bash
set -euo pipefail

DIR="${1:-.}"
DRYRUN="${DRYRUN:-1}"  # 1 = print only, 0 = actually rename

if [[ ! -d "$DIR" ]]; then
  echo "Error: not a directory: $DIR" >&2
  exit 1
fi

did_anything=0

# Only top-level files in DIR
while IFS= read -r -d '' path; do
  file="$(basename "$path")"
  dir="$(dirname "$path")"

  # Must have an extension
  [[ "$file" == *.* ]] || continue

  base="${file%.*}"
  ext="${file##*.}"

  # base must be digits only
  [[ "$base" =~ ^[0-9]+$ ]] || continue

  # Force base-10 to avoid 08/09 octal issues
  num=$((10#$base))

  new="$(printf "%03d.%s" "$num" "$ext")"

  [[ "$new" == "$file" ]] && continue

  if [[ -e "$dir/$new" ]]; then
    echo "SKIP (target exists): $file -> $new"
    continue
  fi

  did_anything=1
  if [[ "$DRYRUN" == "1" ]]; then
    echo "DRYRUN: mv -- '$path' '$dir/$new'"
  else
    mv -- "$path" "$dir/$new"
    echo "RENAMED: $file -> $new"
  fi
done < <(find "$DIR" -maxdepth 1 -type f -print0)

if [[ "$did_anything" == "0" ]]; then
  echo "No matching numeric files found in: $DIR"
fi
