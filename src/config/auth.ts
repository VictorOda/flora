// TODO: Set rules exactly as in the supabase configuration

import z from 'zod'

// https://supabase.com/dashboard/project/<project_id>/auth/providers?provider=Email
export const PASSWORD_POLICY = {
  minLength: 8,
} as const

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(PASSWORD_POLICY.minLength),
  redirectUrl: z.url().optional(),
})

export const SignUpSchema = z.object({
  email: z.email(),
  password: z.string().min(PASSWORD_POLICY.minLength),
  redirectUrl: z.url().optional(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string().min(3).max(20),
})
