'use client'

import { motion, steps, useInView, type Variants } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useGame } from '@/components/game/GameProvider'
import { PixelArt, type Palette, type PixelGrid } from '@/components/game/PixelArt'
import { Player } from '@/components/game/Player'
import { SectionFrame } from '@/components/game/SectionFrame'
import { cloud, cloudPalette, playerIdle, playerPalette } from '@/components/game/sprites'
import { useReducedMotion } from '@/components/game/useReducedMotion'
import { useTypewriter } from '@/components/game/useTypewriter'
import { cn } from '@/lib/utils'

type Stat = { label: string; value: string }

const POP = [
  'bg-pop-pink',
  'bg-pop-mint',
  'bg-pop-blue',
  'bg-pop-yellow',
  'bg-pop-purple',
  'bg-pop-orange',
] as const
const WAVE_MS = 1600
const TYPE_SPEED = 22

const platform: PixelGrid = [
  '.oooooooooooooooooooooo.',
  'ollllllllllllllllllllllo',
  'oppppppppppppppppppppppo',
  'oppyppppyppppppyppppyppo',
  'oddddddddddddddddddddddo',
  '.oddddddddddddddddddddo.',
  '..oooooooooooooooooooo..',
]

const platformPalette: Palette = {
  o: 'var(--edge)',
  l: '#ffd6e8',
  p: 'var(--pop-pink)',
  d: '#d9488a',
  y: 'var(--pop-yellow)',
}

// Overlay on the player's 16px grid, 3px wider for the raised hand.
// The last row paints over the resting hand.
const ARM_W = 19
const blankArm = '.'.repeat(ARM_W)
const armUp: PixelGrid = [
  ...Array<string>(7).fill(blankArm),
  '...............ss..',
  '...............ss..',
  '...............mm..',
  '...............mm..',
  '..............mmm..',
  '...............mm..',
  blankArm,
  '.............mm....',
]
const armOut: PixelGrid = [
  ...Array<string>(7).fill(blankArm),
  '.................ss',
  '.................ss',
  '................mm.',
  '................mm.',
  '..............mmm..',
  '...............mm..',
  blankArm,
  '.............mm....',
]

const PORTRAIT_ROWS = 13
const portrait: PixelGrid = playerIdle.slice(0, PORTRAIT_ROWS)
const blankFace = '.'.repeat(16)
const mouthOpen: PixelGrid = Array.from({ length: PORTRAIT_ROWS }, (_, y) =>
  y === 7 ? '.......MM.......' : y === 8 ? '.......rr.......' : blankFace,
)

const heart: PixelGrid = [
  '.oo...oo.',
  'orro.orro',
  'orwrorrro',
  'orrrrrrro',
  '.orrrrro.',
  '..orrro..',
  '...oro...',
  '....o....',
]
const heartPalette: Palette = { o: 'var(--edge)', r: '#ff4f7b', w: '#ffffff' }

const sparkle: PixelGrid = ['..a..', '..a..', 'aawaa', '..a..', '..a..']

const statList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
}
const statRow: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.24, ease: steps(3, 'start') } },
}

function useWave(enabled: boolean) {
  const [waving, setWaving] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    },
    [],
  )

  const wave = useCallback(() => {
    if (!enabled || timer.current !== null) return
    setWaving(true)
    timer.current = window.setTimeout(() => {
      timer.current = null
      setWaving(false)
    }, WAVE_MS)
  }, [enabled])

  return { waving, wave }
}

export function ProfileSection({
  name,
  paragraphs,
  stats,
}: {
  name: string
  paragraphs: string[]
  stats: { label: string; value: string }[]
}) {
  const { t } = useGame()
  const lines = useMemo(() => paragraphs.map((p) => p.trim()).filter(Boolean), [paragraphs])

  return (
    <SectionFrame
      id="profile"
      title={t.sections.profile.title}
      subtitle={t.sections.profile.subtitle}
      tone="sky"
    >
      <div
        className={cn(
          'grid items-start gap-10 lg:gap-12',
          lines.length > 0 ? 'md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]' : 'max-w-xl',
        )}
      >
        <CharacterCard name={name} stats={stats} />
        {lines.length > 0 ? <AboutDialog name={name} paragraphs={lines} /> : null}
      </div>
    </SectionFrame>
  )
}

function CharacterCard({ name, stats }: { name: string; stats: Stat[] }) {
  const { t } = useGame()
  const reduce = useReducedMotion()
  const { waving, wave } = useWave(!reduce)

  return (
    <motion.article
      aria-labelledby="profile-name"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ duration: 0.4, ease: steps(5, 'start') }}
      className="pixel-box flex min-w-0 flex-col"
    >
      <div className="flex items-center justify-between gap-3 border-b-4 border-edge bg-pop-pink px-4 py-2">
        <p className="font-pixel text-[15px] font-bold tracking-wide text-on-pop uppercase">
          <span aria-hidden="true">★ </span>
          {t.title.player}
        </p>
        <span aria-hidden="true" className="flex gap-2">
          {['bg-pop-yellow', 'bg-pop-mint', 'bg-pop-blue'].map((color) => (
            <span key={color} className={cn('size-3 shadow-[0_0_0_2px_var(--edge)]', color)} />
          ))}
        </span>
      </div>

      <Stage waving={waving} onWave={wave} reduce={reduce} />

      <div className="relative border-t-4 border-edge px-5 pb-6 sm:px-6">
        <h3
          id="profile-name"
          className="pixel-box-flat relative mx-auto -mt-6 w-fit max-w-full bg-pop-yellow px-4 py-2 text-center font-pixel text-[20px] leading-tight font-medium text-balance break-words text-on-pop sm:text-[22px]"
        >
          {name}
        </h3>
        <StatSheet stats={stats} />
      </div>
    </motion.article>
  )
}

function Stage({
  waving,
  onWave,
  reduce,
}: {
  waving: boolean
  onWave: () => void
  reduce: boolean
}) {
  return (
    <div
      aria-hidden="true"
      onPointerEnter={onWave}
      className="relative flex flex-col items-center overflow-hidden bg-pop-pink/20 px-4 pt-12 pb-8 sm:pt-16 sm:pb-10"
      style={{
        backgroundImage:
          'radial-gradient(color-mix(in srgb, var(--pop-pink) 45%, transparent) 2px, transparent 2.5px)',
        backgroundSize: '22px 22px',
      }}
    >
      <PixelArt
        grid={cloud}
        palette={cloudPalette}
        className="pixelated absolute top-5 left-[8%] w-16"
      />
      <PixelArt
        grid={cloud}
        palette={cloudPalette}
        className="pixelated absolute top-11 right-[9%] w-11"
      />
      <Sparkle color="var(--pop-purple)" delay={0} className="top-[34%] left-[16%]" />

      <motion.div
        className="relative z-10"
        initial={reduce ? false : { y: -120, opacity: 0 }}
        whileInView={reduce ? { y: 0, opacity: 1 } : { y: [-120, 0, -14, 0], opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={
          reduce
            ? { duration: 0 }
            : {
                y: { duration: 0.7, times: [0, 0.55, 0.8, 1], ease: steps(4, 'start') },
                opacity: { duration: 0.15 },
              }
        }
        onAnimationComplete={onWave}
      >
        <div className="animate-bob relative">
          {/* Bob the wrapper, not the sprite, so the arm overlays move with it. */}
          <Player className="block w-32 animate-none sm:w-40 lg:w-44" />
          {waving ? (
            <>
              <span
                className="animate-blink absolute top-0 left-0 w-[118.75%]"
                style={{ animationDuration: '0.4s' }}
              >
                <PixelArt grid={armUp} palette={playerPalette} className="pixelated block w-full" />
              </span>
              <span
                className="animate-blink absolute top-0 left-0 w-[118.75%]"
                style={{ animationDuration: '0.4s', animationDelay: '-0.2s' }}
              >
                <PixelArt
                  grid={armOut}
                  palette={playerPalette}
                  className="pixelated block w-full"
                />
              </span>
              <motion.span
                // Ends invisible; data-fx keeps the print stylesheet from revealing it.
                data-fx=""
                className="absolute -top-8 left-[78%] block w-6 sm:w-7"
                initial={{ opacity: 0, y: 6, scale: 0.6 }}
                animate={{ opacity: [0, 1, 1, 0], y: -22, scale: 1 }}
                transition={{ duration: 1.4, ease: steps(7, 'start') }}
              >
                <PixelArt grid={heart} palette={heartPalette} className="pixelated block w-full" />
              </motion.span>
            </>
          ) : null}
        </div>
      </motion.div>

      {/* Overlap by one sprite pixel (8/10/11px) so the feet sit on the platform. */}
      <div className="relative -mt-2 sm:-mt-2.5 lg:-mt-[11px]">
        <PixelArt
          grid={platform}
          palette={platformPalette}
          className="pixelated block w-48 sm:w-60 lg:w-[264px]"
        />
        <Sparkle color="var(--pop-mint)" delay={0.8} className="-top-4 -left-5" />
        <Sparkle color="var(--pop-blue)" delay={1.6} className="top-3 -right-6" />
      </div>
    </div>
  )
}

function Sparkle({
  color,
  delay,
  className,
}: {
  color: string
  delay: number
  className?: string
}) {
  return (
    <span
      className={cn('animate-twinkle absolute block size-4 sm:size-5', className)}
      style={{ animationDelay: `${delay}s` }}
    >
      <PixelArt
        grid={sparkle}
        palette={{ a: color, w: '#ffffff' }}
        className="pixelated block size-full"
      />
    </span>
  )
}

function StatSheet({ stats }: { stats: Stat[] }) {
  const reduce = useReducedMotion()
  if (stats.length === 0) return null

  return (
    <motion.dl
      variants={statList}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="@container mt-6 grid gap-3"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={`${i}-${stat.label}`}
          variants={statRow}
          className="group grid gap-1 border-b-2 border-dashed border-muted/25 pb-3 last:border-b-0 last:pb-0 @sm:grid-cols-[8.5rem_minmax(0,1fr)] @sm:gap-4"
        >
          <dt className="flex items-center gap-2.5 font-hud text-[20px] leading-tight text-muted">
            <span
              aria-hidden="true"
              className={cn(
                'size-3 shrink-0 shadow-[0_0_0_2px_var(--edge)] transition-transform duration-150 ease-[steps(2)] group-hover:-translate-y-1 group-hover:rotate-45 motion-reduce:transition-none',
                POP[i % POP.length],
              )}
            />
            {stat.label}
          </dt>
          <dd className="min-w-0 text-[16px] leading-snug font-semibold break-words text-ink">
            {stat.value}
          </dd>
        </motion.div>
      ))}
    </motion.dl>
  )
}

function AboutDialog({ name, paragraphs }: { name: string; paragraphs: string[] }) {
  const reduce = useReducedMotion()
  const [round, setRound] = useState(0)

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ duration: 0.4, delay: 0.1, ease: steps(5, 'start') }}
      className="min-w-0 md:sticky md:top-24"
    >
      <DialogScreen
        key={round}
        name={name}
        paragraphs={paragraphs}
        replay={round > 0}
        onReplay={() => setRound((r) => r + 1)}
      />
    </motion.div>
  )
}

function DialogScreen({
  name,
  paragraphs,
  replay,
  onReplay,
}: {
  name: string
  paragraphs: string[]
  replay: boolean
  onReplay: () => void
}) {
  const { t, play } = useGame()
  const reduce = useReducedMotion()
  const boxRef = useRef<HTMLDivElement>(null)
  const actionRef = useRef<HTMLButtonElement>(null)
  const inView = useInView(boxRef, { once: true, margin: '0px 0px -30% 0px', initial: replay })
  const first = paragraphs[0] ?? ''
  const { shown, done, finish } = useTypewriter(first, {
    speed: TYPE_SPEED,
    start: inView,
    maxMs: 1200,
  })
  const speaker = name.trim().split(/\s+/)[0] || name
  const talking = inView && !done && !reduce

  // Replaying remounts the dialog, so put focus back on its button.
  useEffect(() => {
    if (replay) actionRef.current?.focus()
  }, [replay])

  const onAction = () => {
    play('blip')
    if (done) onReplay()
    else finish()
  }

  return (
    <div ref={boxRef} className="pixel-box flex flex-col">
      <div className="flex items-center gap-3 border-b-4 border-edge bg-pop-pink px-3 py-2.5 sm:px-4">
        <Portrait talking={talking} />
        <p className="min-w-0 font-pixel text-[18px] leading-tight font-bold break-words text-on-pop">
          {speaker}
        </p>
        <span aria-hidden="true" className="ml-auto flex flex-wrap justify-end gap-2">
          {paragraphs.map((_, i) => (
            <span
              key={i}
              className={cn(
                'size-3 shadow-[0_0_0_2px_var(--edge)] transition-transform duration-150 ease-[steps(2)] motion-reduce:transition-none',
                done || i === 0 ? POP[(i + 1) % POP.length] : 'bg-on-pop/15',
                i === 0 && !done && '-translate-y-1',
              )}
            />
          ))}
        </span>
      </div>

      <div className="sr-only" data-nojs-show="">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div
        aria-hidden="true"
        data-nojs-hide=""
        className="grid gap-4 p-5 text-[16px] leading-relaxed break-words text-ink sm:p-6 sm:text-[17px]"
      >
        <p className="flex gap-3">
          <span className={cn('mt-[0.6em] size-2 shrink-0', POP[0])} />
          <span className="min-w-0">
            {shown}
            {!done ? (
              <span className="relative">
                <span className="animate-blink absolute top-[0.1em] left-0.5 h-[1.1em] w-[0.45em] bg-accent" />
              </span>
            ) : null}
            {/* The untyped rest holds its place so words don't jump lines while typing. */}
            <span className="invisible">{first.slice(shown.length)}</span>
          </span>
        </p>
        {paragraphs.slice(1).map((p, j) => {
          const i = j + 1
          return (
            <motion.p
              key={i}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{
                duration: 0.2,
                delay: done ? Math.min(i - 1, 6) * 0.06 : 0,
                ease: steps(3, 'start'),
              }}
              className="flex gap-3"
            >
              <span className={cn('mt-[0.6em] size-2 shrink-0', POP[i % POP.length])} />
              <span className="min-w-0">{p}</span>
            </motion.p>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-x-5 gap-y-4 border-t-4 border-edge bg-panel-2 px-4 py-4">
        {/* One button for both steps so focus stays put when the label changes. */}
        <button
          ref={actionRef}
          type="button"
          onClick={onAction}
          className="pixel-btn h-10 bg-pop-pink px-4 text-[15px] font-bold text-on-pop"
        >
          {done ? (
            <>
              <span aria-hidden="true">↺</span>
              {t.profile.again}
            </>
          ) : (
            t.profile.skip
          )}
        </button>
      </div>
    </div>
  )
}

function Portrait({ talking }: { talking: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="pixel-box-flat relative flex size-14 shrink-0 items-end justify-center overflow-hidden bg-pop-blue"
    >
      <PixelArt grid={portrait} palette={playerPalette} className="pixelated block w-12" />
      {talking ? (
        <span
          className="animate-blink absolute bottom-0 left-1/2 block w-12 -translate-x-1/2"
          style={{ animationDuration: '0.32s' }}
        >
          <PixelArt grid={mouthOpen} palette={playerPalette} className="pixelated block w-full" />
        </span>
      ) : null}
    </span>
  )
}
