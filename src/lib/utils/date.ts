import { format, parseISO } from 'date-fns'

export function formatDate(date: string | Date | null, formatString: string = 'MMM dd, yyyy'): string {
  if (!date) return ''

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, formatString)
  } catch {
    return ''
  }
}

export function formatDateTime(date: string | Date | null): string {
  return formatDate(date, 'MMM dd, yyyy h:mm a')
}

export function formatTime(time: string | null): string {
  if (!time) return ''

  try {
    // Assuming time is in HH:mm format
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  } catch {
    return time
  }
}
