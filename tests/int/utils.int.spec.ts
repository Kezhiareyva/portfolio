import { describe, expect, it } from 'vitest'

import { formatMonth, isoMonth, skillKey } from '@/lib/utils'

describe('skillKey', () => {
  it('drops the bracketed part', () => {
    expect(skillKey('Java (Android)')).toBe('java')
  })

  it('lowercases and trims', () => {
    expect(skillKey('  Java ')).toBe('java')
  })
})

describe('month helpers', () => {
  // Midnight on Feb 1 in Jakarta is still Jan 31 in UTC.
  const feb2025 = '2025-01-31T17:00:00.000Z'

  it('formats in Jakarta time', () => {
    expect(formatMonth(feb2025, 'en')).toBe('Feb 2025')
  })

  it('builds the dateTime value in Jakarta time', () => {
    expect(isoMonth(feb2025)).toBe('2025-02')
  })

  it('returns an empty string for a missing date', () => {
    expect(formatMonth(null, 'en')).toBe('')
  })
})
