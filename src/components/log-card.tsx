import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Polaroid } from '@/components/ui/polaroid'
import { H3, P } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

interface LogCardProps {
  date: string
  logs: string[]
}

export function LogCard({ date, logs }: LogCardProps) {
  return (
    <Card className="flex flex-col w-full">
      <CardHeader>
        <H3>{date}</H3>
      </CardHeader>
      <CardContent className="flex flex-col gap-16">
        {logs.map((log, index) => (
          <div
            className={cn(
              'flex gap-8',
              index % 2 == 0 ? 'flex-row' : 'flex-row-reverse',
            )}
          >
            <P>{log}</P>
            <div className="flex flex-row">
              <Polaroid imgSrc="" title="Plant 1" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
