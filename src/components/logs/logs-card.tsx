import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { P } from '@/components/ui/typography'
import { Log } from '@/types'

interface LogCardProps {
  title: string
  logs: Log[]
}

function LogsCard({ title, logs }: LogCardProps) {
  if (logs.length <= 0) return null

  return (
    <Card key={title}>
      <CardHeader>{title}</CardHeader>
      <CardContent>
        {logs.map((log) => (
          <P key={log.id}>{log.description}</P>
        ))}
      </CardContent>
    </Card>
  )
}

export { LogsCard }
