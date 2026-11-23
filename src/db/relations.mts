import { relations } from 'drizzle-orm/relations';
import { standorte, maschinen, kaffeebohnen } from './schema.mts';

export const maschinenRelations = relations(maschinen, ({ one, many }) => ({
  standorte: one(standorte, {
    fields: [maschinen.standort_id],
    references: [standorte.id],
  }),
  kaffeebohnens: many(kaffeebohnen),
}));

export const standorteRelations = relations(standorte, ({ many }) => ({
  maschinens: many(maschinen),
}));

export const kaffeebohnenRelations = relations(kaffeebohnen, ({ one }) => ({
  maschinen: one(maschinen, {
    fields: [kaffeebohnen.maschine_id],
    references: [maschinen.id],
  }),
}));
