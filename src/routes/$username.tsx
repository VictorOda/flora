import { H1, H2 } from '@/components/ui/typography'
import { db } from '@/db'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

const UsernameSchema = z.object({
  username: z.string(),
})

export const getProfileByUsername = createServerFn({ method: 'GET' })
  .inputValidator(UsernameSchema)
  .handler(async ({ data }) => {
    const profile = await db.query.profiles.findFirst({
      columns: {
        username: true,
        photoPath: true,
        firstName: true,
        lastName: true,
      },
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
  component: JournalComp,
})

function JournalComp() {
  const { user, profile } = Route.useRouteContext()

  return (
    <div className="flex flex-col space-y-4">
      <H1>User profile: {profile.username}</H1>
      <H2>User signed in: {user?.profile.username}</H2>
    </div>
  )
}
