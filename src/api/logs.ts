import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import z from 'zod'

import { db } from '@/db'
import { logs } from '@/db/schema.public'

const GetLatestLogsByUserSchema = z.object({
  userId: z.uuid(),
  limit: z.number().min(1).max(100).optional().default(10),
})

export const getLatestLogsByUser = createServerFn({ method: 'GET' })
  .inputValidator(GetLatestLogsByUserSchema)
  .handler(async ({ data }) => {
    try {
      return await db
        .select()
        .from(logs)
        .where(eq(logs.userId, data.userId))
        .orderBy(desc(logs.createdAt))
        .limit(data.limit)
    } catch (error) {
      // For optional/non-critical data, return empty array for graceful degradation
      // This allows the page to render even if logs can't be loaded
      console.error('Error fetching logs:', error)
      return []
    }
  })
