import type { InferSelectModel } from 'drizzle-orm'
import { authUsers, logs, photos, plants, profiles } from '@/db/schema'

type AuthUser = InferSelectModel<typeof authUsers>
type Profile = InferSelectModel<typeof profiles>
type Plant = InferSelectModel<typeof plants>
type Log = InferSelectModel<typeof logs>
type Photo = InferSelectModel<typeof photos>

export type { AuthUser, Profile, Plant, Log, Photo }
