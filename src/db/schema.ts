import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const todos = pgTable('plants', {
  id: serial('id').primaryKey(),
  name: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
