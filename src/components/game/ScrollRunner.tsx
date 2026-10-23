'use client'

import { useEffect, useRef, useState } from 'react'

import { useGame } from '@/components/game/GameProvider'
import { PixelArt } from '@/components/game/PixelArt'
import { Player } from '@/components/game/Player'
import { cn } from '@/lib/utils'

const IDLE_DELAY = 200
const FLAG_ZONE = 30

const CHECKPOINTS = [
  { id: 'profile', color: 'bg-pop-pink' },
  { id: 'quests', color: 'bg-pop-mint' },
  { id: 'levels', color: 'bg-pop-blue' },
  { id: 'inventory', color: 'bg-pop-yellow' },
  { id: 'achievements', color: 'bg-pop-purple' },
  { id: 'save', color: 'bg-pop-orange' },
] as const

type Checkpoint = { id: string; color: string; at: number; x: number }

// 30px period; the 60px march is exactly two periods, so the loop is seamless.
const STRIPES = 'repeating-linear-gradient(90deg, var(--coin) 0 20px, var(--coin-dark) 20px 30px)'
const TICKS =
  'repeating-linear-gradient(90deg, transparent 0 6px, color-mix(in srgb, var(--edge) 22%, transparent) 6px 8px)'

const pole = ['cc', 'cc', ...Array.from({ length: 11 }, () => 'om')]
const polePalette = { c: 'var(--coin)', o: 'var(--edge)', m: 'var(--muted)' }

const clothA = [
  'ooooooooo',
  'orrrrrrro',
  'orrrccrro',
  'orrrccrro',
  'orrrrrrro',
  'ooooooooo',
  '.........',
]
const clothB = [
  'ooooo....',
  'orrrroooo',
  'orrrccrro',
  'orrrccrro',
  'orrrrrrro',
  'ooooorrro',
  '.....oooo',
]
const clothPalette = {
  o: 'var(--edge)',
  r: 'var(--accent)',
  c: 'var(--coin)',
}

const SPARKS = [
  { dx: -12, dy: -10, color: 'bg-pop-yellow' },
  { dx: 14, dy: -14, color: 'bg-pop-pink' },
  { dx: 18, dy: 0, color: 'bg-pop-mint' },
  { dx: -10, dy: 4, color: 'bg-pop-blue' },
] as const

const css = `
.sr-dust, .sr-wave-b, .sr-spark { opacity: 0 }
@keyframes sr-march { to { transform: translateX(60px) } }
@keyframes sr-flip { 50% { opacity: 0 } }
@keyframes sr-dust { from { opacity: 1; transform: translate(0, 0) } to { opacity: 0; transform: translate(-10px, -6px) } }
@keyframes sr-pop { 50% { transform: scale(1.8) } }
@keyframes sr-spark { from { opacity: 1; transform: translate(0, 0) } to { opacity: 0; transform: translate(var(--dx), var(--dy)) } }
@media (prefers-reduced-motion: no-preference) {
  .sr-stripes { animation: sr-march 600ms steps(6) infinite paused }
  .sr-running .sr-stripes { animation-play-state: running }
  .sr-back .sr-stripes { animation-direction: reverse }
  .sr-running .sr-dust { animation: sr-dust 360ms steps(3) infinite }
  .sr-running .sr-dust-late { animation-delay: -180ms }
  .sr-goal .sr-wave-a { animation: sr-flip 560ms steps(1, end) infinite }
  .sr-goal .sr-wave-b { opacity: 1; animation: sr-flip 560ms steps(1, end) -280ms infinite }
  .sr-lit { animation: sr-pop 300ms steps(3) }
  .sr-spark { animation: sr-spark 520ms steps(4) forwards }
}
`

function sameCheckpoints(a: Checkpoint[], b: Checkpoint[]) {
  return (
    a.length === b.length &&
    a.every((c, i) => c.id === b[i].id && c.x === b[i].x && Math.abs(c.at - b[i].at) < 1e-4)
  )
}

export function ScrollRunner() {
  const { play } = useGame()
  const trackRef = useRef<HTMLDivElement>(null)
  const coverRef = useRef<HTMLDivElement>(null)
  const moverRef = useRef<HTMLDivElement>(null)
  const cheered = useRef(false)
  const [running, setRunning] = useState(false)
  const [back, setBack] = useState(false)
  const [goal, setGoal] = useState(false)
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [passed, setPassed] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    const cover = coverRef.current
    const mover = moverRef.current
    if (!track || !cover || !mover) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Cached by measure() so the scroll handler only reads scrollY.
    let maxScroll = 0
    let width = 0
    let playerWidth = 0
    let marks: number[] = []
    let lastY = window.scrollY
    let isRunning = false
    let isBack = false
    let atGoal = false
    let passedCount = 0
    let scrollFrame = 0
    let measureFrame = 0
    let idleTimer = 0

    const render = (y: number) => {
      const p = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0
      cover.style.transform = `translateX(${Math.round(p * width)}px)`
      const x = Math.min(
        Math.max(p * width - playerWidth / 2, 0),
        Math.max(0, width - FLAG_ZONE - playerWidth),
      )
      mover.style.transform = `translateX(${Math.round(x)}px)`

      // Hysteresis so tiny bounces at the bottom don't flicker the goal on and off.
      const remaining = maxScroll - y
      const nextGoal = maxScroll > 0 && (atGoal ? remaining < 24 : remaining <= 2)
      if (nextGoal !== atGoal) {
        atGoal = nextGoal
        setGoal(nextGoal)
      }

      let count = 0
      while (count < marks.length && p >= marks[count]) count++
      if (count !== passedCount) {
        passedCount = count
        setPassed(count)
      }
    }

    const stopRunning = () => {
      if (!isRunning) return
      isRunning = false
      setRunning(false)
    }

    const onScrollFrame = () => {
      scrollFrame = 0
      const y = window.scrollY
      render(y)

      // lastY only moves past the jitter threshold, so slow scrolls still add up.
      if (Math.abs(y - lastY) >= 2) {
        const nextBack = y < lastY
        lastY = y
        if (nextBack !== isBack) {
          isBack = nextBack
          setBack(nextBack)
        }
      }

      if (reducedMotion.matches) return
      if (!isRunning) {
        isRunning = true
        setRunning(true)
      }
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(stopRunning, IDLE_DELAY)
    }

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(onScrollFrame)
    }

    const measure = () => {
      measureFrame = 0
      const scrollY = window.scrollY
      maxScroll = document.documentElement.scrollHeight - window.innerHeight
      width = track.clientWidth
      playerWidth = mover.offsetWidth
      // A world counts as reached once its top passes 40% down the viewport.
      const lead = window.innerHeight * 0.4
      const rail = Math.max(playerWidth, width - FLAG_ZONE)
      const next: Checkpoint[] = []
      if (maxScroll > 0) {
        for (const { id, color } of CHECKPOINTS) {
          const el = document.getElementById(id)
          if (!el) continue
          const top = el.getBoundingClientRect().top + scrollY
          const at = Math.min(1, Math.max(0, (top - lead) / maxScroll))
          const x = Math.min(Math.max(at * width, playerWidth / 2), rail - playerWidth / 2)
          next.push({ id, color, at, x: Math.round(x) })
        }
      }
      next.sort((a, b) => a.at - b.at)
      marks = next.map((c) => c.at)
      setCheckpoints((prev) => (sameCheckpoints(prev, next) ? prev : next))
      lastY = scrollY
      render(scrollY)
    }

    const scheduleMeasure = () => {
      if (!measureFrame) measureFrame = window.requestAnimationFrame(measure)
    }

    scheduleMeasure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', scheduleMeasure)
    // Content height changes (fonts, images) move the checkpoints.
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleMeasure)
    observer?.observe(document.body)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', scheduleMeasure)
      observer?.disconnect()
      window.cancelAnimationFrame(scrollFrame)
      window.cancelAnimationFrame(measureFrame)
      window.clearTimeout(idleTimer)
    }
  }, [])

  // Scrolling isn't a user gesture, so hold the jingle until the page has had one.
  useEffect(() => {
    if (!goal || cheered.current) return
    const activation = typeof navigator === 'undefined' ? undefined : navigator.userActivation
    if (activation && !activation.hasBeenActive) return
    cheered.current = true
    play('unlock')
  }, [goal, play])

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-0 z-30 print:hidden',
        running && 'sr-running',
        back && 'sr-back',
        goal && 'sr-goal',
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <style href="kezhia-scroll-runner" precedence="default">
        {css}
      </style>
      <div className="relative">
        {checkpoints.map((c, i) => (
          <span
            key={c.id}
            className={cn(
              'absolute bottom-[calc(100%_+_5px)] size-1.5 -translate-x-1/2 rotate-45',
              i < passed
                ? cn(c.color, 'sr-lit shadow-[0_0_0_2px_var(--edge)]')
                : 'bg-panel shadow-[0_0_0_2px_var(--muted)]',
            )}
            style={{ left: c.x }}
          />
        ))}

        <div ref={moverRef} className="absolute bottom-full left-0 will-change-transform">
          {/* Flip as a unit so the dust stays behind the runner. */}
          <span className={cn('relative block', back && '-scale-x-100')}>
            <span className="sr-dust absolute bottom-0 left-0 size-[3px] bg-pop-yellow" />
            <span className="sr-dust sr-dust-late absolute bottom-1 left-1 size-[3px] bg-pop-pink" />
            <Player running={running} className="relative block w-[22px] sm:w-7" />
          </span>
        </div>

        <div className="absolute right-1 bottom-full h-[26px] w-[22px]">
          <PixelArt
            grid={pole}
            palette={polePalette}
            className="pixelated absolute bottom-0 left-0 h-[26px] w-1"
          />
          <div
            className={cn(
              'absolute top-1 left-1 h-[14px] w-[18px] transition-transform duration-500 ease-[steps(5)] motion-reduce:transition-none',
              goal ? 'translate-y-0' : 'translate-y-2',
            )}
          >
            <PixelArt
              grid={clothA}
              palette={clothPalette}
              className="sr-wave-a pixelated absolute inset-0 size-full"
            />
            <PixelArt
              grid={clothB}
              palette={clothPalette}
              className="sr-wave-b pixelated absolute inset-0 size-full"
            />
          </div>
          {goal
            ? SPARKS.map((s) => (
                <span
                  key={s.color}
                  className={cn('sr-spark absolute top-1 left-2 size-[3px]', s.color)}
                  style={{ ['--dx' as string]: `${s.dx}px`, ['--dy' as string]: `${s.dy}px` }}
                />
              ))
            : null}
        </div>

        <div
          ref={trackRef}
          className="relative h-2 overflow-hidden border-t-2 border-edge bg-panel-2"
        >
          <div
            className="sr-stripes absolute inset-y-0 -left-[60px] right-0"
            style={{ backgroundImage: STRIPES }}
          />
          <div
            ref={coverRef}
            className="absolute inset-0 bg-panel-2 will-change-transform"
            style={{ backgroundImage: TICKS }}
          />
        </div>
      </div>
    </div>
  )
}
