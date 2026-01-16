import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type DateKey = string
export function groupByDate<T>(
  items: readonly T[],
  getDate: (item: T) => Date,
  options?: {
    format?: (date: Date) => DateKey
  },
): Array<{ date: DateKey; items: T[] }> {
  const format =
    options?.format ?? ((date: Date) => date.toISOString().slice(0, 10)) // YYYY-MM-DD

  const map = new Map<DateKey, T[]>()

  for (const item of items) {
    const date = format(getDate(item))

    const bucket = map.get(date)
    if (bucket) {
      bucket.push(item)
    } else {
      map.set(date, [item])
    }
  }

  return Array.from(map.entries()).map(([date, items]) => ({
    date,
    items,
  }))
}
