import { Auth } from '@/components/auth'
import { SignUpSchema } from '@/config/auth'
import { getSupabaseServerClient } from '@/utils/supabase'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'

export const signUpFn = createServerFn({ method: 'POST' })
  .inputValidator(SignUpSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    console.log('SIGN UP DATA', data)
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          first_name: data.firstName,
          last_name: data.lastName,
        },
      },
    })

    if (error) {
      console.log('SIGN UP ERROR', error.message)
      return {
        error: true,
        message: error.message,
      }
    }

    // Redirect to the user's page
    throw redirect({
      href: `/${data.username}`,
    })
  })

export const Route = createFileRoute('/sign-up')({
  component: SignUpComp,
})

function SignUpComp() {
  const signUpMutation = useMutation({
    mutationFn: useServerFn(signUpFn),
  })

  return (
    <Auth
      authAction="SIGN_UP"
      status={signUpMutation.status}
      onSubmit={(e) => {
        e.preventDefault()
        console.log('SIGN UP')
        const formData = new FormData(e.target as HTMLFormElement)

        signUpMutation.mutate({
          data: {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            username: formData.get('username') as string,
          },
        })
      }}
      afterSubmit={
        signUpMutation.data?.error ? (
          <>
            <div className="text-red-400">{signUpMutation.data.message}</div>
          </>
        ) : null
      }
    />
  )
}
