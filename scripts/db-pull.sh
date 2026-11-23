#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

DATABASE_URL="${DATABASE_URL:-postgresql://coffee:coffee@localhost:5432/coffee_machine}"
export DATABASE_URL

pnpm exec drizzle-kit pull --config=drizzle.config.mts

for file in drizzle/schema.ts drizzle/relations.ts; do
  if [ -f "$file" ]; then
    mv "$file" "${file%.ts}.mts"
  fi
done

for file in drizzle/schema.mts drizzle/relations.mts; do
  if [ -f "$file" ]; then
    sed -i -E "s#(from ['\"]\./)(schema|relations)(['\"])#\1\2.mts\3#g" "$file"
    mv "$file" src/db/"$(basename "$file")"
  fi
done

rm -rf drizzle
printf 'src/db/schema.mts und src/db/relations.mts erzeugt\n'