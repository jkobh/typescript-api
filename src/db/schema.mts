import {
  pgTable,
  index,
  uuid,
  text,
  integer,
  timestamp,
  foreignKey,
  unique,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const standorte = pgTable(
  'standorte',
  {
    id: uuid()
      .default(sql`uuidv7()`)
      .primaryKey()
      .notNull(),
    name: text().notNull(),
    ort: text().notNull(),
    version: integer().default(1).notNull(),
    created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    deleted_at: timestamp({ withTimezone: true, mode: 'string' }),
  },
  (table) => [
    index('standorte_deleted_at_idx').using(
      'btree',
      table.deleted_at.asc().nullsLast().op('timestamptz_ops'),
    ),
  ],
);

export const maschinen = pgTable(
  'maschinen',
  {
    id: uuid()
      .default(sql`uuidv7()`)
      .primaryKey()
      .notNull(),
    modell: text().notNull(),
    standort_id: uuid().notNull(),
    version: integer().default(1).notNull(),
    created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    deleted_at: timestamp({ withTimezone: true, mode: 'string' }),
  },
  (table) => [
    index('maschinen_deleted_at_idx').using(
      'btree',
      table.deleted_at.asc().nullsLast().op('timestamptz_ops'),
    ),
    foreignKey({
      columns: [table.standort_id],
      foreignColumns: [standorte.id],
      name: 'maschinen_standort_id_fkey',
    }).onDelete('cascade'),
    unique('maschinen_standort_id_key').on(table.standort_id),
  ],
);

export const kaffeebohnen = pgTable(
  'kaffeebohnen',
  {
    id: uuid()
      .default(sql`uuidv7()`)
      .primaryKey()
      .notNull(),
    sorte: text().notNull(),
    maschine_id: uuid().notNull(),
    version: integer().default(1).notNull(),
    created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    deleted_at: timestamp({ withTimezone: true, mode: 'string' }),
  },
  (table) => [
    index('kaffeebohnen_deleted_at_idx').using(
      'btree',
      table.deleted_at.asc().nullsLast().op('timestamptz_ops'),
    ),
    index('kaffeebohnen_maschine_id_idx').using(
      'btree',
      table.maschine_id.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.maschine_id],
      foreignColumns: [maschinen.id],
      name: 'kaffeebohnen_maschine_id_fkey',
    }).onDelete('cascade'),
  ],
);
