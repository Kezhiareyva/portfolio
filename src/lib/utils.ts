import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Payload's month picker stores local midnight on the 1st, so read dates in Jakarta time
// or they slip back a month on a UTC server.
export function formatMonth(value: string | null | undefined, locale: string) {
  if (!value) return ''
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(value))
}

// YYYY-MM for <time dateTime>, in the same timezone as formatMonth.
const monthParts = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: '2-digit',
  timeZone: 'Asia/Jakarta',
})

export function isoMonth(value: string) {
  const parts = monthParts.formatToParts(new Date(value))
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value
  return `${part('year')}-${part('month')}`
}

// "Java (Android)" and "java" both become "java".
export function skillKey(name: string) {
  return name
    .toLowerCase()
    .replace(/\s*\(.*\)$/, '')
    .trim()
}
