'use client'

import { useEffect, useState } from 'react'

import { PixelArt } from '@/components/game/PixelArt'
import { playerIdle, playerPalette, playerRunA, playerRunB } from '@/components/game/sprites'
import { prefersReducedMotion } from '@/components/game/useReducedMotion'
import { cn } from '@/lib/utils'

export function Player({
  running = false,
  className,
  title,
}: {
  running?: boolean
  className?: string
  title?: string
}) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (!running) return
    if (prefersReducedMotion()) return
    const timer = window.setInterval(() => setFrame((f) => (f + 1) % 2), 140)
    return () => window.clearInterval(timer)
  }, [running])

  const grid = running ? (frame === 0 ? playerRunA : playerRunB) : playerIdle
  return (
    <PixelArt
      grid={grid}
      palette={playerPalette}
      title={title}
      className={cn('pixelated', !running && 'animate-bob', className)}
    />
  )
}
