'use client'

import { AnimatePresence, motion, steps, useInView, type Variants } from 'motion/react'
import { useEffect, useEffectEvent, useRef, useState } from 'react'

import { useGame } from '@/components/game/GameProvider'
import { PixelArt, type Palette, type PixelGrid } from '@/components/game/PixelArt'
import { SectionFrame } from '@/components/game/SectionFrame'
import { iconPalette, trophy } from '@/components/game/sprites'
import {
  isMotionPaused,
  prefersReducedMotion,
  useReducedMotion,
} from '@/components/game/useReducedMotion'
import type { Dictionary, Locale } from '@/lib/i18n'
import { cn, formatMonth, isoMonth } from '@/lib/utils'
import type { Certification } from '@/payload-types'

// No purple: it's already used for the header bars and ribbons.
const tints = [
  { bg: 'bg-pop-pink', fill: 'var(--pop-pink)' },
  { bg: 'bg-pop-blue', fill: 'var(--pop-blue)' },
  { bg: 'bg-pop-mint', fill: 'var(--pop-mint)' },
  { bg: 'bg-pop-orange', fill: 'var(--pop-orange)' },
  { bg: 'bg-pop-yellow', fill: 'var(--pop-yellow)', silver: true },
] as const

type Tint = (typeof tints)[number]

const disc: PixelGrid = [
  '.....oooooo.....',
  '...oohhffffoo...',
  '..ohhffffffffo..',
  '.ohffffffffffso.',
  '.ohffffffffffso.',
  'ohffffffffffffso',
  'ohffffffffffffso',
  'offffffffffffffo',
  'offffffffffffffo',
  'offffffffffffsso',
  'offffffffffffsso',
  '.offffffffffsso.',
  '.offffffffffsso.',
  '..offffffsssso..',
  '...oossssssoo...',
  '.....oooooo.....',
]

const ribbon: PixelGrid = [
  '...orRo..oRro...',
  '...orRo..oRro...',
  '...orRo..oRro...',
  '...orRo..oRro...',
  '...orRo..oRro...',
  '...o..o..o..o...',
]

const padlock: PixelGrid = [
  '...oooooo...',
  '..oggggggo..',
  '..ogo..ogo..',
  '..ogo..ogo..',
  '..ogo..ogo..',
  'oooooooooooo',
  'oyyyyyyyyyyo',
  'oyyyyooyyyyo',
  'oyyyyooyyyyo',
  'oyyyyyoyyyyo',
  'oYYYYYYYYYYo',
  'oooooooooooo',
]

const glint: PixelGrid = ['..w..', '..w..', 'wwwww', '..w..', '..w..']

const discPalette = (fill: string): Palette => ({
  o: 'var(--edge)',
  f: fill,
  h: `color-mix(in srgb, ${fill} 45%, #ffffff)`,
  s: `color-mix(in srgb, ${fill} 72%, var(--edge))`,
})

const ribbonPalette: Palette = {
  o: 'var(--edge)',
  r: 'var(--pop-purple)',
  R: 'color-mix(in srgb, var(--pop-purple) 68%, var(--edge))',
}

// Silver trophy so it still reads on the yellow medallion.
const silverTrophy: Palette = { o: 'var(--edge)', c: '#f4f1ff', C: '#a9a1cc' }

const padlockPalette: Palette = {
  o: 'var(--edge)',
  g: '#9aa3c7',
  y: 'var(--coin)',
  Y: 'var(--coin-dark)',
}

const sparks = [
  { x: 0, y: -40, className: 'bg-coin' },
  { x: 30, y: -28, className: 'bg-pop-pink' },
  { x: 42, y: 0, className: 'bg-pop-mint' },
  { x: 30, y: 28, className: 'bg-pop-blue' },
  { x: 0, y: 40, className: 'bg-pop-yellow' },
  { x: -30, y: 28, className: 'bg-pop-orange' },
  { x: -42, y: 0, className: 'bg-pop-purple' },
  { x: -30, y: -28, className: 'bg-coin' },
] as const

const shutter: Variants = {
  shut: { y: 0, opacity: 1 },
  open: {
    y: '-105%',
    opacity: 0,
    transition: { delay: 0.18, duration: 0.42, ease: steps(6) },
  },
}

const shackle: Variants = {
  shut: { y: 0, rotate: 0, scale: 1 },
  open: { y: -8, rotate: -14, scale: 1.25, transition: { duration: 0.18, ease: steps(3) } },
}

const REVEAL_START = 150
const REVEAL_GAP = 170
const REVEAL_MAX = 1000
// Lets the shutter start lifting before the medallion pops.
const UNLOCK_DELAY = 0.22

export function Achievements({
  certifications,
  locale,
}: {
  certifications: Certification[]
  locale: Locale
}) {
  const { t, play, toast } = useGame()
  const reduce = useReducedMotion()
  const count = certifications.length

  const caseRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLUListElement>(null)
  const inView = useInView(gridRef, { once: true, margin: '0px 0px -25% 0px' })
  const doneRef = useRef(false)
  // Badges only start locked if the whole case was off-screen at mount, so nothing visibly re-locks.
  // Server render and first paint always show them unlocked.
  const [armed, setArmed] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const el = caseRef.current
    // Read the media query and pause flag directly: during hydration `reduce` is still false.
    if (
      reduce ||
      prefersReducedMotion() ||
      isMotionPaused() ||
      count === 0 ||
      !el ||
      doneRef.current
    )
      return
    const rect = el.getBoundingClientRect()
    if (rect.top >= window.innerHeight || rect.bottom <= 0) setArmed(true)
  }, [reduce, count])

  // Focus inside the grid unlocks everything, so keyboard users never land on a hidden link.
  const onGridFocus = () => {
    if (armed) setStep(count)
  }

  const runUnlock = useEffectEvent(() => {
    const timers: number[] = []
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms))

    const gap = Math.min(REVEAL_GAP, Math.round(REVEAL_MAX / count))
    const revealEnd = reduce ? 0 : REVEAL_START + (count - 1) * gap
    if (reduce) {
      at(0, () => setStep(count))
    } else {
      // Monotonic, so a restarted sequence never re-locks a badge.
      for (let i = 0; i < count; i++) {
        at(REVEAL_START + i * gap, () => setStep((s) => Math.max(s, i + 1)))
      }
    }

    // Not announced: it fires from scrolling, not from a user action.
    const toastAt = revealEnd + 250
    at(toastAt, () => {
      play('unlock')
      toast({
        kind: 'achievement',
        title: t.achievements.unlocked,
        body: `${t.achievements.caseFull}: ${count}/${count}`,
        announce: false,
      })
    })
    // Leave locked mode for good, e.g. if new certs arrive later.
    at(Math.max(toastAt, revealEnd) + 1000, () => {
      doneRef.current = true
      setArmed(false)
    })

    return () => timers.forEach((id) => window.clearTimeout(id))
  })

  useEffect(() => {
    if (!inView || count === 0 || doneRef.current) return
    return runUnlock()
  }, [inView, count])

  const unlockedCount = armed ? step : count
  const live = !reduce && (armed || step > 0)

  return (
    <SectionFrame
      id="achievements"
      title={t.sections.achievements.title}
      subtitle={t.sections.achievements.subtitle}
      tone="sky"
    >
      {count > 0 ? (
        <div ref={caseRef}>
          <div
            aria-hidden="true"
            className="pixel-box mb-12 flex flex-wrap items-center gap-x-4 gap-y-3 p-3 sm:flex-nowrap sm:p-4"
          >
            <p className="pixel-box-flat flex items-center gap-2 bg-pop-purple px-2.5 py-1 font-pixel text-[15px] font-bold text-on-pop">
              <PixelArt
                grid={trophy}
                palette={iconPalette}
                className="pixelated animate-bob size-5"
              />
              {t.achievements.trophyCase}
            </p>
            <div className="order-last flex h-6 min-w-0 basis-full gap-1 bg-edge p-1 sm:order-none sm:flex-1 sm:basis-0">
              {certifications.map((cert, i) => (
                <span key={cert.id} className="relative min-w-0 flex-1 bg-panel-2">
                  <span
                    className={cn(
                      'absolute inset-0 origin-left bg-coin transition-transform delay-200 duration-300 ease-[steps(3)]',
                      i < unlockedCount ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                </span>
              ))}
            </div>
            <p className="ml-auto font-hud text-[24px] leading-none text-ink tabular-nums sm:ml-0">
              <motion.span
                key={unlockedCount}
                className="inline-block"
                initial={live ? { scale: 1.6 } : false}
                animate={{ scale: 1 }}
                transition={{ duration: 0.25, ease: steps(3) }}
              >
                {unlockedCount}
              </motion.span>
              /{count}
            </p>
          </div>

          <ul
            ref={gridRef}
            role="list"
            onFocus={onGridFocus}
            className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {certifications.map((cert, i) => (
              <Badge
                key={cert.id}
                cert={cert}
                index={i}
                tint={tints[i % tints.length]}
                locale={locale}
                labels={t.achievements}
                verify={t.achievements.verify}
                newTab={t.newTab}
                locked={armed && i >= step}
                burst={!reduce && i < step}
                armed={armed}
                live={live}
                onVerify={() => play('blip')}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </SectionFrame>
  )
}

function Badge({
  cert,
  index,
  tint,
  locale,
  labels,
  verify,
  newTab,
  locked,
  burst,
  armed,
  live,
  onVerify,
}: {
  cert: Certification
  index: number
  tint: Tint
  locale: Locale
  labels: Dictionary['achievements']
  verify: string
  newTab: string
  locked: boolean
  burst: boolean
  armed: boolean
  live: boolean
  onVerify: () => void
}) {
  const issued = formatMonth(cert.issuedAt, locale)
  const hasMeta = Boolean(issued || cert.credentialId)
  const delay = armed ? UNLOCK_DELAY : 0

  return (
    <li className="transition-transform duration-150 ease-[steps(2)] motion-safe:hover:-translate-y-1">
      <motion.article
        className="group pixel-box flex h-full flex-col overflow-hidden"
        initial={false}
        animate={{ scale: locked ? 0.96 : 1 }}
        transition={
          locked ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 16, delay }
        }
      >
        <div
          aria-hidden="true"
          className="flex items-center justify-between gap-2 border-b-4 border-edge bg-pop-purple px-3 py-1.5 font-hud text-[19px] leading-none text-on-pop"
        >
          <span>★ #{String(index + 1).padStart(2, '0')}</span>
          <motion.span
            key={locked ? 'locked' : 'unlocked'}
            initial={live ? { y: -8, scale: 1.3 } : false}
            animate={{ y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: steps(3), delay: locked ? 0 : delay }}
            className="inline-block uppercase"
          >
            {locked ? `? ${labels.badgeLocked}` : `✔ ${labels.badgeUnlocked}`}
          </motion.span>
        </div>

        <div className="relative flex flex-1 flex-col">
          <div className="flex items-start gap-4 p-4 pb-3 sm:p-5 sm:pb-3">
            <Medal tint={tint} index={index} burst={burst} delay={delay} />
            <div className="min-w-0 flex-1 pt-1">
              <h3 className="font-pixel text-[18px] leading-snug font-bold [overflow-wrap:anywhere] text-ink sm:text-[19px]">
                {cert.name}
              </h3>
              <p className="mt-1.5 text-[16px] leading-relaxed text-muted">{cert.issuer}</p>
            </div>
          </div>

          {hasMeta || cert.credentialUrl ? (
            <div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t-4 border-dotted border-edge/20 px-4 pt-3 pb-5 sm:px-5">
              {hasMeta ? (
                <dl className="min-w-0 flex-1 space-y-1.5">
                  {issued && cert.issuedAt ? (
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <dt className="font-hud text-[18px] leading-none text-muted">
                        {labels.issued}
                      </dt>
                      <dd className="font-hud text-[20px] leading-none text-ink">
                        <time dateTime={isoMonth(cert.issuedAt)}>{issued}</time>
                      </dd>
                    </div>
                  ) : null}
                  {cert.credentialId ? (
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <dt className="font-hud text-[18px] leading-none text-muted">
                        {labels.credential}
                      </dt>
                      <dd className="min-w-0 font-hud text-[19px] leading-tight break-all text-ink">
                        {cert.credentialId}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
              {cert.credentialUrl ? (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onVerify}
                  className={cn(
                    'pixel-btn h-10 shrink-0 px-4 text-[15px] font-bold text-on-pop',
                    tint.bg,
                  )}
                >
                  <span aria-hidden="true">✔</span>
                  {verify}
                  <span className="sr-only">
                    : {cert.name} {newTab}
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          ) : null}

          <AnimatePresence>
            {locked ? (
              <motion.div
                key="lock"
                aria-hidden="true"
                variants={shutter}
                initial={false}
                animate="shut"
                exit="open"
                className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-panel-2 print:hidden"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(135deg, transparent 0 12px, color-mix(in srgb, var(--pop-purple) 18%, transparent) 12px 24px)',
                }}
              >
                <motion.div variants={shackle}>
                  <PixelArt
                    grid={padlock}
                    palette={padlockPalette}
                    className="pixelated block size-12"
                  />
                </motion.div>
                <p className="font-hud text-[22px] leading-none tracking-[0.3em] text-muted">???</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.article>
    </li>
  )
}

function Medal({
  tint,
  index,
  burst,
  delay,
}: {
  tint: Tint
  index: number
  burst: boolean
  delay: number
}) {
  return (
    <div
      aria-hidden="true"
      className="relative mb-3 w-16 shrink-0 transition-transform duration-200 ease-[steps(3)] motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-6 sm:w-[72px]"
    >
      <motion.div
        className="relative"
        animate={burst ? { scale: [0.7, 1.28, 0.94, 1], rotate: [0, -12, 6, 0] } : undefined}
        transition={{ duration: 0.55, ease: steps(6), delay }}
      >
        <PixelArt
          grid={ribbon}
          palette={ribbonPalette}
          className="pixelated absolute top-[76%] left-0 block w-full"
        />
        <PixelArt
          grid={disc}
          palette={discPalette(tint.fill)}
          className="pixelated relative block w-full"
        />
        <PixelArt
          grid={trophy}
          palette={'silver' in tint ? silverTrophy : iconPalette}
          className="pixelated absolute top-1/2 left-1/2 block w-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        {/* Only the first few glints twinkle, to keep ambient loops down. */}
        <span
          className={cn(
            'absolute top-[12%] left-[16%] block w-[22%]',
            index < 4 && 'animate-twinkle',
          )}
          style={{ animationDelay: `${(index % 4) * 0.6}s` }}
        >
          <PixelArt grid={glint} palette={{ w: '#ffffff' }} className="pixelated block w-full" />
        </span>
      </motion.div>
      {burst
        ? sparks.map((spark, i) => (
            <motion.span
              key={i}
              data-fx="" // ends invisible, so print styles leave it hidden
              className={cn(
                'absolute top-1/2 left-1/2 -mt-1 -ml-1 size-2 ring-2 ring-edge',
                spark.className,
              )}
              initial={{ opacity: 0 }}
              animate={{
                x: [0, spark.x],
                y: [0, spark.y],
                opacity: [1, 1, 0],
                scale: [0.6, 1.2, 0.6],
              }}
              transition={{ duration: 0.6, ease: steps(6), delay: delay + 0.05 }}
            />
          ))
        : null}
    </div>
  )
}
