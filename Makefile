.PHONY: start dev format lint typecheck check db-up db-down db-reset db-schema db-pull db-studio

start:
	pnpm start

dev:
	pnpm dev

format:
	pnpm format

lint:
	pnpm lint

typecheck:
	pnpm typecheck

check:
	pnpm check

db-up:
	pnpm db:up

db-down:
	pnpm db:down

db-reset:
	pnpm db:reset

db-schema:
	pnpm db:schema

db-pull:
	pnpm db:pull

db-studio:
	pnpm db:studio