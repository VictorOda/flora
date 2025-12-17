import { cn } from '@/lib/utils'
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from '@tanstack/react-router'

type LinkProps = RouterLinkProps & {
  className?: string
}

export function Link({ className, ...props }: LinkProps) {
  return (
    <RouterLink
      {...props}
      className={cn('hover:underline hover:opacity-80', className)}
    />
  )
}
