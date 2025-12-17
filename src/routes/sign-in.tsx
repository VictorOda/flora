import { Auth } from '@/components/auth'
import { SignInSchema } from '@/config/auth'
import { getSupabaseServerClient } from '@/utils/supabase'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

export const signInFn = createServerFn({ method: 'POST' })
  .inputValidator(SignInSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      console.log('Sign In Error', error.message)
      return {
        error: true,
        message: error.message,
      }
    }

    // Redirect to the prev page stored in the "redirect" search param
    throw redirect({
      href: data.redirectUrl || '/',
    })
  })

export const Route = createFileRoute('/sign-in')({
  component: SignInComp,
})

function SignInComp() {
  const router = useRouter()

  const signInMutation = useMutation({
    mutationFn: signInFn,
    onError: async () => {
      await router.invalidate()
      router.navigate({ to: '/' })
      return
    },
  })

  return (
    <Auth
      authAction="SIGN_IN"
      status={signInMutation.status}
      onSubmit={(e) => {
        const formData = new FormData(e.target as HTMLFormElement)
        console.log('Sign In Data', formData)

        signInMutation.mutate({
          data: {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
          },
        })
      }}
      afterSubmit={
        signInMutation.data ? (
          <div className="text-red-400">{signInMutation.data.message}</div>
        ) : null
      }
    />
  )
}
