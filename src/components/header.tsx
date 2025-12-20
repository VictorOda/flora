import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Link } from '@/components/ui/link'
import { useRouteContext } from '@tanstack/react-router'
import { Route } from '@/routes/__root'

export function Header() {
  const { user } = useRouteContext({ from: Route.id })

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <Card className="flex flex-row justify-between items-center bg-sidebar rounded-full p-2">
        <div>
          {user ? (
            <div className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={user.profile.photoPath ?? undefined}
                  alt="User icon"
                />
                <AvatarFallback>
                  {user.profile.firstName &&
                    user.profile.firstName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Link to="/sign-out">Sign Out</Link>
            </div>
          ) : (
            <div className="flex flex-row gap-4">
              <Link to="/sign-in">Sign In</Link>
              <Link to="/sign-up">Sign Up</Link>
            </div>
          )}
        </div>

        <div className="flex flex-row gap-4">
          <Link to="/">Friends</Link>
          <Link to="/">Diary</Link>
          <Link to="/">Flora</Link>
        </div>

        <div>
          <Button>+ Log</Button>
        </div>
      </Card>
    </div>
  )
}
