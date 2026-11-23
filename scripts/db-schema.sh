#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

psql_schema() {
  docker exec -i coffee_db psql -v ON_ERROR_STOP=1 -U coffee -d coffee_machine < db/init/01-schema.sql
}

wait_for_db() {
  printf 'Warte auf coffee_db'
  for _ in $(seq 1 60); do
    if docker exec coffee_db pg_isready -U coffee -d coffee_machine >/dev/null 2>&1; then
      printf ' bereit\n'
      return 0
    fi
    printf '.'
    sleep 1
  done
  printf ' Zeitueberschreitung\n'
  return 1
}

wait_for_db
psql_schema
printf 'Schema in coffee_machine eingespielt\n'