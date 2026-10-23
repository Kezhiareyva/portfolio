'use client'

import { motion, steps } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { useReducedMotion } from '@/components/game/useReducedMotion'
import { cn } from '@/lib/utils'

const POINTS = 40
const ROWS = 18
const BASE = 768 // Bandung, metres above sea level
const RANGE = 14 // metres shown above and below BASE
const TICK_MS = 1200

const SCANLINES =
  'repeating-linear-gradient(to bottom, transparent 0 3px, color-mix(in srgb, var(--panel) 9%, transparent) 3px 4px)'

const GRID_DOTS = Array.from({ length: 4 }, (_, r) =>
  Array.from({ length: Math.ceil(POINTS / 4) }, (_, c) => ({ x: c * 4 + 1.35, y: r * 5 + 2.35 })),
).flat()

// Deterministic starting series so server and client render the same markup.
function initialSeries() {
  return Array.from({ length: POINTS }, (_, i) => BASE + Math.sin(i / 5) * 6 + Math.cos(i / 3) * 2)
}

function toRow(value: number) {
  const ratio = (BASE + RANGE - value) / (RANGE * 2)
  return Math.min(ROWS - 1, Math.max(0, Math.round(ratio * (ROWS - 1))))
}

// Simulated readings standing in for the RA-ATAP altimeter dashboard.
export function AltimeterDemo({
  labels,
  className,
}: {
  labels: { altitude: string; simulated: string }
  className?: string
}) {
  const [series, setSeries] = useState<number[]>(initialSeries)
  const [onScreen, setOnScreen] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const running = onScreen && pageVisible && !reduce

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0.1,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === 'visible')
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1]
        const drift = (BASE - last) * 0.15
        const next = last + drift + (Math.random() - 0.5) * 5
        return [...prev.slice(1), next]
      })
    }, TICK_MS)
    return () => window.clearInterval(timer)
  }, [running])

  const rows = series.map(toRow)
  const current = Math.round(series[series.length - 1])
  const delta = current - Math.round(series[series.length - 2])
  const headRow = rows[rows.length - 1]

  return (
    <figure ref={ref} className={cn('pixel-box-flat bg-pop-blue p-3', className)}>
      <div className="relative overflow-hidden bg-edge px-4 pt-3 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <span className="font-pixel text-[15px] font-bold tracking-wide text-pop-blue uppercase">
            {labels.altitude}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-coin px-2 py-0.5 font-hud text-[18px] leading-none text-[#24123d]">
            <span
              aria-hidden="true"
              className={cn('inline-block size-2 bg-[#24123d]', running && 'animate-blink')}
            />
            {labels.simulated}
          </span>
        </div>

        <p className="mt-2 flex items-end gap-2 font-hud leading-none text-pop-mint tabular-nums">
          {/* Only flicker on live ticks, so the server-rendered first value is never dimmed. */}
          <motion.span
            key={current}
            initial={running ? { opacity: 0.35 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.24, ease: steps(3, 'start') }}
            className="text-[64px] sm:text-[72px]"
          >
            {current}
          </motion.span>
          <span className="pb-2 text-[26px]">m</span>
          <span
            className={cn(
              'mb-2 ml-auto text-[22px]',
              delta > 0 ? 'text-pop-yellow' : delta < 0 ? 'text-pop-pink' : 'text-pop-mint',
            )}
          >
            <span aria-hidden="true">{delta > 0 ? '▲' : delta < 0 ? '▼' : '■'}</span>{' '}
            {delta > 0 ? `+${delta}` : delta}
          </span>
        </p>

        <div className="mt-2 flex items-stretch gap-2">
          <svg
            viewBox={`0 0 ${POINTS} ${ROWS}`}
            shapeRendering="crispEdges"
            className="block aspect-[40/18] h-auto min-w-0 flex-1"
            role="img"
            aria-label={`${labels.altitude}: ${current} m (${labels.simulated})`}
          >
            {GRID_DOTS.map((dot) => (
              <rect
                key={`${dot.x}-${dot.y}`}
                x={dot.x}
                y={dot.y}
                width={0.3}
                height={0.3}
                fill="var(--pop-blue)"
                opacity={0.5}
              />
            ))}
            {rows.map((row, x) => {
              const prev = x === 0 ? row : rows[x - 1]
              const top = Math.min(row, prev)
              return (
                <g key={x}>
                  <rect
                    x={x}
                    y={row + 1}
                    width={1}
                    height={ROWS - row - 1}
                    fill="var(--pop-blue)"
                    opacity={0.22}
                  />
                  <rect
                    x={x}
                    y={top}
                    width={1}
                    height={Math.abs(row - prev) + 1}
                    fill="var(--pop-mint)"
                  />
                </g>
              )
            })}
            <rect
              x={POINTS - 1}
              y={headRow}
              width={1}
              height={1}
              fill="var(--coin)"
              className={running ? 'animate-blink' : undefined}
            />
          </svg>
          <div
            aria-hidden="true"
            className="flex flex-col justify-between font-hud text-[18px] leading-none text-pop-blue"
          >
            <span>{BASE + RANGE}</span>
            <span>{BASE}</span>
            <span>{BASE - RANGE}</span>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: SCANLINES }}
        />
      </div>

      <div aria-hidden="true" className="mt-2.5 flex items-center gap-2 px-1">
        <span className="size-3.5 border-2 border-edge bg-pop-pink" />
        <span className="size-3.5 border-2 border-edge bg-pop-yellow" />
        <span className="size-3.5 border-2 border-edge bg-pop-mint" />
        <span className="ml-auto flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-3.5 w-1 bg-edge/70" />
          ))}
        </span>
      </div>
    </figure>
  )
}
