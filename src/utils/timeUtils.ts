export function parseSecondsToTime(totalSeconds: number) {
  const days = Math.floor(totalSeconds / 86400)
  const remainder = totalSeconds % 86400
  const hours = Math.floor(remainder / 3600)
  const minutes = Math.floor((remainder % 3600) / 60)
  const seconds = remainder % 60
  return { days, hours, minutes, seconds }
}

export function formatTime(h: number = 0, m: number = 0, s: number = 0): string {
  return [h, m, s].map(n => n.toString().padStart(2, '0')).join(':')
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }).replace(',', '')
}

export function formatDateOnly(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
