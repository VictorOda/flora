import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

import { getLatestLogsByUser } from '@/api/logs'
import { Card } from '@/components/ui/card'
import { H1, H2, P } from '@/components/ui/typography'
import { db } from '@/db'
import { groupByDate } from '@/lib/utils'
import { LogsCard } from '@/components/logs/logs-card'

const UsernameSchema = z.object({
  username: z.string(),
})

export const getProfileByUsername = createServerFn({ method: 'GET' })
  .inputValidator(UsernameSchema)
  .handler(async ({ data }) => {
    const profile = await db.query.profiles.findFirst({
      where: (profiles, { eq }) => eq(profiles.username, data.username),
    })

    return profile
  })

export const Route = createFileRoute('/$username')({
  beforeLoad: async ({ params }) => {
    const profile = await getProfileByUsername({
      data: { username: params.username },
    })

    if (!profile) {
      // TODO: Add not found page
      throw redirect({ to: '/' })
    }

    return { profile }
  },
  loader: async ({ context }) => {
    return await getLatestLogsByUser({
      data: {
        userId: context.profile.id,
      },
    })
  },
  component: JournalComp,
})

function JournalComp() {
  const { user, profile } = Route.useRouteContext()
  const logs = Route.useLoaderData()
  const logsByDate = groupByDate(logs, (log) => log.date)

  return (
    <div className="flex flex-col space-y-4">
      <H1>{profile.username}</H1>
      {logsByDate.map((dateLogs) => (
        <LogsCard title={dateLogs.date} logs={dateLogs.items} />
      ))}
    </div>
  )
}
