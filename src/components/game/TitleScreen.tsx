'use client'

import React, { useMemo, useRef } from 'react'

import { Coin } from '@/components/game/Coin'
import { useGame } from '@/components/game/GameProvider'
import { PixelArt } from '@/components/game/PixelArt'
import { Player } from '@/components/game/Player'
import { cloud, cloudPalette } from '@/components/game/sprites'
import { useReducedMotion } from '@/components/game/useReducedMotion'
import { useTypewriter } from '@/components/game/useTypewriter'
import { Marquee } from '@/components/ui/marquee'
import { RetroGrid } from '@/components/ui/retro-grid'

const disc = [
  '....cccc....',
  '..cccccccc..',
  '.cccccccccc.',
  '.cccccccccc.',
  'cccccccccccc',
  'cccccccccccc',
  'cccccccccccc',
  'cccccccccccc',
  '.cccccccccc.',
  '.cccccccccc.',
  '..cccccccc..',
  '....cccc....',
]

// Deterministic "random" star field so server and client markup match.
const stars = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53) % 55,
  delay: (i % 7) * 0.35,
  size: i % 3 === 0 ? 4 : 3,
}))

function ridge(width: number, fn: (x: number) => number) {
  return Array.from({ length: width }, (_, x) => Math.max(0, Math.round(fn(x))))
}

// Columns overlap slightly (1.02) to avoid hairline seams.
function ridgePath(heights: number[], height: number) {
  return heights.map((h, x) => (h > 0 ? `M${x} ${height - h}h1.02v${h}h-1.02z` : '')).join('')
}

function Mountains() {
  const height = 26
  const backD = useMemo(
    () =>
      ridgePath(
        ridge(120, (x) =>
          Math.max(
            22 - Math.abs(x - 24) * 0.9,
            19 - Math.abs(x - 68) * 0.8,
            23 - Math.abs(x - 101) * 1.1,
            6,
          ),
        ),
        height,
      ),
    [],
  )
  // Long flat-topped volcano, like Tangkuban Perahu north of Bandung.
  const frontD = useMemo(
    () =>
      ridgePath(
        ridge(120, (x) => {
          if (x < 12) return 3
          if (x < 40) return 3 + (x - 12) * 0.5
          if (x < 82) return 17 + (x % 9 === 0 ? 1 : 0)
          if (x < 104) return 17 - (x - 82) * 0.6
          return 5 + Math.max(0, 4 - Math.abs(x - 112) * 0.6)
        }),
        height,
      ),
    [],
  )
  return (
    <svg
      viewBox={`0 0 120 ${height}`}
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      className="absolute inset-x-0 bottom-[30%] h-[34%] w-full"
      aria-hidden="true"
    >
      <path d={backD} fill="var(--mountain-2)" />
      <path d={frontD} fill="var(--mountain)" />
    </svg>
  )
}

export function TitleScreen({
  name,
  role,
  intro,
  ticker,
}: {
  name: string
  role: string
  intro: string
  ticker: string[]
}) {
  const { t, play } = useGame()
  const sceneRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { shown, done } = useTypewriter(t.title.greeting, { speed: 45 })
  const [first, ...rest] = name.split(' ')
  const firstLine = [first, rest[0]].filter(Boolean).join(' ')
  const secondLine = rest.slice(1).join(' ')

  const onPointerMove = (event: React.PointerEvent) => {
    const el = sceneRef.current
    if (reduce || !el || event.pointerType !== 'mouse') return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--px', String((event.clientX - rect.left) / rect.width - 0.5))
    el.style.setProperty('--py', String((event.clientY - rect.top) / rect.height - 0.5))
  }

  return (
    <section
      id="start"
      aria-labelledby="title-name"
      onPointerMove={onPointerMove}
      className="relative flex min-h-[min(90svh,860px)] flex-col overflow-hidden border-b-4 border-edge"
      style={{
        background:
          'linear-gradient(var(--sky-1) 0 34%, var(--sky-2) 34% 58%, var(--sky-3) 58% 100%)',
      }}
    >
      <div ref={sceneRef} className="absolute inset-0" aria-hidden="true">
        {stars.map((star, i) => (
          <span
            key={i}
            className="animate-twinkle absolute hidden dark:block"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              background: 'var(--star)',
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
        <div
          className="absolute top-4 right-4 w-14 transition-transform duration-300 motion-reduce:transition-none sm:top-[9%] sm:right-[8%] sm:w-28"
          style={{ transform: 'translate(calc(var(--px, 0) * -18px), calc(var(--py, 0) * -10px))' }}
        >
          <PixelArt grid={disc} palette={{ c: 'var(--sun)' }} className="pixelated w-full" />
        </div>
        {[
          { top: '12%', w: 'w-40', d: '75s', delay: '-10s' },
          { top: '26%', w: 'w-28', d: '95s', delay: '-50s' },
          { top: '6%', w: 'w-24', d: '120s', delay: '-80s' },
        ].map((c, i) => (
          <div
            key={i}
            className={`animate-drift absolute left-0 ${c.w}`}
            style={{ top: c.top, ['--drift' as string]: c.d, animationDelay: c.delay }}
          >
            <PixelArt grid={cloud} palette={cloudPalette} className="pixelated w-full" />
          </div>
        ))}
        <div
          className="absolute inset-0 transition-transform duration-300 motion-reduce:transition-none"
          style={{ transform: 'translateX(calc(var(--px, 0) * -14px))' }}
        >
          <Mountains />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[31%]">
          <RetroGrid
            angle={70}
            cellSize={48}
            opacity={1}
            lightLineColor="var(--grid-line)"
            darkLineColor="var(--grid-line)"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] flex-1 items-center gap-10 px-4 pt-12 pb-20 sm:px-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] md:pt-16">
        <div className="min-w-0">
          <p className="animate-blink font-hud text-[22px] text-ink">{t.title.player}</p>
          {/* Pixelify's C closes into an O when bold or shadowed, so the second line stays light and flat. */}
          <h1 id="title-name" className="mt-3 font-pixel leading-[0.95] font-medium text-ink">
            <span className="text-3d block text-[clamp(2.6rem,8vw,5.6rem)]">{firstLine}</span>
            {secondLine ? (
              <>
                {' '}
                <span className="mt-2 block text-[clamp(1.6rem,4.6vw,3.2rem)] font-normal text-accent">
                  {secondLine}
                </span>
              </>
            ) : null}
          </h1>
          <p className="mt-6 inline-block bg-edge px-3 py-1 font-hud text-[24px] leading-tight text-coin sm:text-[28px]">
            {role}
          </p>
          <div className="pixel-box mt-6 max-w-[60ch] p-4 sm:p-5">
            <p className="text-[16px] leading-relaxed text-ink text-pretty sm:text-[17px]">
              {intro}
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <a
              href="#profile"
              onClick={() => play('start')}
              className="pixel-btn h-12 bg-accent px-5 text-[18px] font-bold text-on-accent"
            >
              <span aria-hidden="true">▶</span>
              {t.title.pressStart}
              <span aria-hidden="true" className="animate-blink">
                _
              </span>
            </a>
            <a
              href="#save"
              onClick={() => play('blip')}
              className="pixel-btn h-12 bg-panel px-5 text-[16px] font-bold text-ink"
            >
              {t.title.continue}
            </a>
            <Coin id="start" />
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[18rem] flex-col items-center md:max-w-[20rem]">
          <div
            className="pixel-box relative mb-5 w-full p-4 font-hud text-[22px] leading-tight text-ink"
            aria-hidden="true"
          >
            {shown}
            {!done ? <span className="animate-blink">▌</span> : null}
            <span className="absolute -bottom-[14px] left-1/2 size-4 -translate-x-1/2 rotate-45 bg-panel shadow-[4px_4px_0_0_var(--edge)]" />
          </div>
          <p className="sr-only">{t.title.greeting}</p>
          <Player className="w-32 sm:w-40" title={name} />
          <div
            className="mt-1 h-3 w-28 bg-edge/30 [clip-path:ellipse(50%_50%)]"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="relative z-10 border-t-4 border-edge bg-edge py-1 text-coin">
        {reduce ? (
          // A frozen marquee would cut the sentences off, so wrap them.
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1 px-4 py-2">
            {ticker.map((item, i) => (
              <li key={i} className="font-hud text-[22px] leading-tight">
                <span aria-hidden="true">★ </span>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <Marquee pauseOnHover className="[--duration:36s] [--gap:2.5rem]" repeat={3}>
            {ticker.map((item, i) => (
              <span key={i} className="font-hud text-[22px] whitespace-nowrap">
                ★ {item}
              </span>
            ))}
          </Marquee>
        )}
      </div>
    </section>
  )
}
