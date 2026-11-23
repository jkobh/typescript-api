import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.mts',
  out: './drizzle',
  dbCredentials: {
    url: process.env['DATABASE_URL'] ?? 'postgresql://coffee:coffee@localhost:5432/coffee_machine',
  },
  schemaFilter: ['public'],
  tablesFilter: ['standorte', 'maschinen', 'kaffeebohnen'],
  introspect: {
    casing: 'preserve',
  },
  breakpoints: true,
  verbose: true,
});
