'use client'

import { useEffect, useState } from 'react'

import { useReducedMotion } from '@/components/game/useReducedMotion'

export function useTypewriter(
  text: string,
  { speed = 28, start = true, maxMs }: { speed?: number; start?: boolean; maxMs?: number } = {},
) {
  const reduce = useReducedMotion()
  const [progress, setProgress] = useState({ text, count: 0 })
  // Progress belongs to one text; a new text starts typing from 0.
  const typed = progress.text === text ? progress.count : 0
  const count = reduce ? text.length : typed
  const done = count >= text.length

  useEffect(() => {
    if (!start || reduce || done) return
    // With maxMs, type several characters per tick so the line finishes in time.
    const step = maxMs ? Math.max(1, Math.ceil((text.length * speed) / maxMs)) : 1
    const timer = window.setInterval(() => {
      setProgress((p) => ({
        text,
        count: Math.min(text.length, (p.text === text ? p.count : 0) + step),
      }))
    }, speed)
    return () => window.clearInterval(timer)
  }, [text, speed, start, reduce, done, maxMs])

  return {
    shown: text.slice(0, count),
    done,
    finish: () => setProgress({ text, count: text.length }),
  }
}
