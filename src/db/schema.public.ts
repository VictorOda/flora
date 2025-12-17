import { sql } from 'drizzle-orm'
import { authenticatedRole, anonRole } from 'drizzle-orm/supabase'
import {
  pgTable,
  text,
  uuid,
  timestamp,
  pgEnum,
  index,
  jsonb,
  check,
  uniqueIndex,
  integer,
  pgPolicy,
} from 'drizzle-orm/pg-core'
import { authUsers } from '@/db/schema.auth'

export const userRole = pgEnum('user_role', ['ADMIN', 'BASIC'])

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id')
      .primaryKey()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    username: text('username').notNull(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    photoPath: text('photo_path'),
    role: userRole('role').default('BASIC').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('profiles_username_unique').on(table.username),

    check(
      'profiles_username_lowercase',
      sql`${table.username} = lower(${table.username})`,
    ),
    check('profiles_username_chars', sql`${table.username} ~ '^[a-z0-9_.]+$'`),
    check(
      'profiles_username_length',
      sql`length(${table.username}) BETWEEN 3 AND 20`,
    ),
    check(
      'profiles_username_reserved',
      sql`${table.username} NOT IN ('admin', 'support', 'root', 'login', 'signup', 'me')`,
    ),

    pgPolicy('profiles_public_select', {
      to: anonRole,
      for: 'select',
      using: sql`true`,
    }),
    pgPolicy('profiles_public_select_auth', {
      to: authenticatedRole,
      for: 'select',
      using: sql`true`,
    }),
    pgPolicy('profiles_insert_own', {
      to: authenticatedRole,
      for: 'insert',
      withCheck: sql`
        (select auth.uid()) IS NULL
        OR ${table.id} = (select auth.uid())
      `,
    }),
    pgPolicy('profiles_update_own', {
      to: authenticatedRole,
      for: 'update',
      using: sql`${table.id} = (select auth.uid())`,
      withCheck: sql`${table.id} = (select auth.uid())`,
    }),
    pgPolicy('profiles_delete_own', {
      to: authenticatedRole,
      for: 'delete',
      using: sql`${table.id} = (select auth.uid())`,
    }),
  ],
)

export const plants = pgTable(
  'plants',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    photoPath: text('photo_path'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('plants_user_id_idx').on(table.userId),

    pgPolicy('plants_public_select', {
      to: anonRole,
      for: 'select',
      using: sql`true`,
    }),
    pgPolicy('plants_public_select_auth', {
      to: authenticatedRole,
      for: 'select',
      using: sql`true`,
    }),
    pgPolicy('plants_insert_own', {
      to: authenticatedRole,
      for: 'insert',
      withCheck: sql`${table.userId} = (select auth.uid())`,
    }),
    pgPolicy('plants_update_own', {
      to: authenticatedRole,
      for: 'update',
      using: sql`${table.userId} = (select auth.uid())`,
      withCheck: sql`${table.userId} = (select auth.uid())`,
    }),
    pgPolicy('plants_delete_own', {
      to: authenticatedRole,
      for: 'delete',
      using: sql`${table.userId} = (select auth.uid())`,
    }),
  ],
)

// In the future we might allow a log to be for multiple plants. In that we case we will need to:
// 1. Create a join table `log_plants (join table)`
// 2. Backfill existing data
// 3. Drop `plant_id`
export const logs = pgTable(
  'logs',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    plantId: uuid('plant_id')
      .notNull()
      .references(() => plants.id, { onDelete: 'cascade' }),
    description: text('description'),
    date: timestamp('date', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('logs_plant_id_idx').on(table.plantId),
    index('logs_user_id_date_idx').on(table.userId, table.date),

    pgPolicy('logs_public_select', {
      to: anonRole,
      for: 'select',
      using: sql`true`,
    }),
    pgPolicy('logs_public_select_auth', {
      to: authenticatedRole,
      for: 'select',
      using: sql`true`,
    }),
    pgPolicy('logs_insert_own', {
      to: authenticatedRole,
      for: 'insert',
      withCheck: sql`
        ${table.userId} = (select auth.uid())
        AND EXISTS (
          SELECT 1 FROM plants p
          WHERE p.id = ${table.plantId}
            AND p.user_id = (select auth.uid())
        )
      `,
    }),
    pgPolicy('logs_update_own', {
      to: authenticatedRole,
      for: 'update',
      using: sql`${table.userId} = (select auth.uid())`,
      withCheck: sql`${table.userId} = (select auth.uid())`,
    }),
    pgPolicy('logs_delete_own', {
      to: authenticatedRole,
      for: 'delete',
      using: sql`${table.userId} = (select auth.uid())`,
    }),
  ],
)

export const photos = pgTable(
  'photos',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    logId: uuid('log_id')
      .notNull()
      .references(() => logs.id, { onDelete: 'cascade' }),
    path: text('path').notNull(),
    order: integer('order').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('photos_log_id_idx').on(table.logId),
    uniqueIndex('photos_log_id_order_unique').on(table.logId, table.order),

    pgPolicy('photos_public_select', {
      to: anonRole,
      for: 'select',
      using: sql`true`,
    }),
    pgPolicy('photos_public_select_auth', {
      to: authenticatedRole,
      for: 'select',
      using: sql`true`,
    }),
    pgPolicy('photos_insert_own', {
      to: authenticatedRole,
      for: 'insert',
      withCheck: sql`
        EXISTS (
          SELECT 1 FROM logs l
          WHERE l.id = ${table.logId}
            AND l.user_id = (select auth.uid())
        )
      `,
    }),
    pgPolicy('photos_update_own', {
      to: authenticatedRole,
      for: 'update',
      using: sql`
        EXISTS (
          SELECT 1 FROM logs l
          WHERE l.id = ${table.logId}
            AND l.user_id = (select auth.uid())
        )
      `,
      withCheck: sql`
        EXISTS (
          SELECT 1 FROM logs l
          WHERE l.id = ${table.logId}
            AND l.user_id = (select auth.uid())
        )
      `,
    }),
    pgPolicy('photos_delete_own', {
      to: authenticatedRole,
      for: 'delete',
      using: sql`
        EXISTS (
          SELECT 1 FROM logs l
          WHERE l.id = ${table.logId}
            AND l.user_id = (select auth.uid())
        )
      `,
    }),
  ],
)
