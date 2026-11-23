# Projektrichtlinien (AGENTS.md)

Lernprojekt der Vorlesung **Serverentwicklung** (Semester 7, INFB): eine REST-API für
**Kaffeemaschinen** mit Hono, Drizzle und PostgreSQL.

Diese Regeln gelten projektweit für jeden Chat-Agenten.

## Kontext

- [README.md](./README.md) – Projektüberblick, Datenmodell, Zugangsdaten, Checkliste
- [Makefile](./Makefile) – reicht jedes Ziel 1:1 an ein pnpm-Skript durch
- [package.json](./package.json) – Skripte, Versionen, `packageManager`
- [db/init/01-schema.sql](./db/init/01-schema.sql) – Quelle der Wahrheit für das Schema
- [drizzle.config.mts](./drizzle.config.mts) – Konfiguration für `drizzle-kit pull`

## Code-Stil

- **Stack:** Hono, Drizzle, `pg`, Node ≥ 26.13.1, pnpm ≥ 12, TypeScript 7
- **Named Exports** statt Default-Exports, `const` statt `let` wo möglich, Template Strings,
  Shorthand Properties und Destructuring
- **Keine Kommentare im Code** – sprechende Namen und klare Struktur statt Erklärungen.
  Ausnahme nur, wenn ein Sachverhalt anders nicht verständlich wird
- Kein `enum`, kein `namespace`, keine Parameter-Properties: `erasableSyntaxOnly` ist gesetzt,
  weil Node TypeScript beim Laden nur die Typen entfernt
- Importe brauchen die Endung (`.ts`, `.mts`), weil ESM unter Node sie verlangt
- Auf `make check` grün halten (format, lint, typecheck)

## Architektur

- **Datenmodell:** Standort **1:1** Maschine, Maschine **1:N** Kaffeebohne
- **DB-first:** Das SQL-Schema ist die Wahrheit. `src/db/schema.mts` und `src/db/relations.mts`
  sind **generiert** von `drizzle-kit pull` und werden nicht von Hand geändert
- Änderungen am Datenmodell laufen immer über `db/init/01-schema.sql`, dann `make db-reset`,
  dann `make db-pull`
- Invarianten gehören in die DB: `uuidv7()` als PK-Default, `version` und `updated_at` per
  Trigger, `UNIQUE` für die 1:1-Beziehung
- **Bewusst NICHT umsetzen** (auf Vorgabe): Vitest-Tests, `QUERY`/`DELETE`, Pagination

## Build & Test

- `make check` = `oxfmt` + `oxlint` + `tsc --noEmit`; es gibt keine Teststufe
- Jedes Make-Ziel ist ein 1:1-Durchreicher — wer `make` nicht mag, ruft das pnpm-Skript direkt
- `make db-reset` verwirft das Volume; danach greift der initdb-Mount wieder

## Konventionen

- **Commits:** inkrementell, klein und häufig („Commit early, Commit often“). Einzelne Commits
  müssen nicht verifiziert werden; vor einem Push muss `make check` grün sein
- **Commit-Messages:** Deutsch im Conventional-Format (`feat:`, `fix:`, `build:`, `docs:` …)
- **Zugangsdaten** in `docker-compose.yml`, `keycloak/realm-coffee.json` und `certs/` sind reine
  Entwicklungs-Credentials (kein Geheimniswert)
- Keine Secrets oder hochgeladenen Artefakte committen (`.gitignore` respektieren)
