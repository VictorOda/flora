import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type AuthAction = 'SIGN_IN' | 'SIGN_UP'
const AUTH_ACTION_TEXT: Record<AuthAction, string> = {
  SIGN_IN: 'Sign In',
  SIGN_UP: 'Sign Up',
}
const AUTH_ACTION_VERB: Record<AuthAction, string> = {
  SIGN_IN: 'Signing In',
  SIGN_UP: 'Signing Up',
}

interface AuthProps {
  authAction: AuthAction
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  status: 'pending' | 'idle' | 'success' | 'error'
  afterSubmit?: React.ReactNode
}

export function Auth({ authAction, onSubmit, status, afterSubmit }: AuthProps) {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-8">
      <Card>
        <CardHeader>
          <CardTitle>{AUTH_ACTION_TEXT[authAction]}</CardTitle>
        </CardHeader>

        <CardContent>
          {/* TODO: Use shadcn/react-hook-form component */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit(e)
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" name="email" id="email" autoFocus />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" id="password" />
            </div>

            {authAction === 'SIGN_UP' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input type="firstName" name="firstName" id="firstName" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input type="lastName" name="lastName" id="lastName" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input type="username" name="username" id="username" />
                </div>
              </>
            )}

            <Button type="submit" disabled={status === 'pending'}>
              {status === 'pending'
                ? AUTH_ACTION_VERB[authAction]
                : AUTH_ACTION_TEXT[authAction]}
            </Button>

            {afterSubmit ? afterSubmit : null}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
