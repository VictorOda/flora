import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './supabase/migrations',
  schema: './src/db/schema.public.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schemaFilter: ['public'],
  verbose: true,
  strict: true,
  casing: 'snake_case',
})
