'use client'

import { motion, steps, useInView, type Variants } from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'

import { GithubIcon, LinkedinIcon } from '@/components/BrandIcons'
import { cmsMark, TechLogoMark, techLogos, type TechLogo } from '@/components/TechLogos'
import { KONAMI, useGame } from '@/components/game/GameProvider'
import { PixelArt, type Palette, type PixelGrid } from '@/components/game/PixelArt'
import { Player } from '@/components/game/Player'
import { SectionFrame } from '@/components/game/SectionFrame'
import { campfire, campfirePalette, coin, coinPalette, moon, sun } from '@/components/game/sprites'
import { useReducedMotion } from '@/components/game/useReducedMotion'
import { useTypewriter } from '@/components/game/useTypewriter'
import { cn } from '@/lib/utils'

const tent: PixelGrid = [
  '........oyyy......',
  '........oyy.......',
  '........o.........',
  '........oo........',
  '.......oaAo.......',
  '......oaaAAo......',
  '.....oaaaAAAo.....',
  '....oaaaddAAAo....',
  '...oaaaaddAAAAo...',
  '..oaaaaddddAAAAo..',
  '.oaaaaaddddAAAAAo.',
  'oaaaaaddddddAAAAAo',
  'oooooooooooooooooo',
]

const tentPalette: Palette = {
  o: 'var(--edge)',
  a: 'var(--pop-orange)',
  A: '#d9622b',
  d: '#24123d',
  y: 'var(--pop-yellow)',
}

const floppy: PixelGrid = [
  'ooooooooooo.',
  'obbsssdssbbo',
  'obbsssdssbbo',
  'obbssssssbbo',
  'obbbbbbbbbbo',
  'obwwwwwwwwbo',
  'obwrrrrrrwbo',
  'obwwwwwwwwbo',
  'obwrrrrrwwbo',
  'obwwwwwwwwbo',
  'obwwwwwwwwbo',
  'oooooooooooo',
]

const floppyPalette: Palette = {
  o: 'var(--edge)',
  b: 'var(--pop-blue)',
  s: '#d7dcef',
  d: 'var(--edge)',
  w: '#ffffff',
  r: 'var(--pop-pink)',
}

const heart: PixelGrid = [
  '..oo.oo..',
  '.oppoppo.',
  'opwpppppo',
  'opppppppo',
  '.opppppo.',
  '..opppo..',
  '...opo...',
  '....o....',
]

const heartPalette: Palette = { o: 'var(--edge)', p: 'var(--pop-pink)', w: '#ffffff' }

const flower: PixelGrid = ['.p.', 'pyp', '.g.']

const envelopeIcon: PixelGrid = [
  'oooooooooo',
  'oo......oo',
  'o.o....o.o',
  'o..o..o..o',
  'o...oo...o',
  'o........o',
  'o........o',
  'oooooooooo',
]

const copyIcon: PixelGrid = [
  'oooooo...',
  'o....o...',
  'o..oooooo',
  'o..o....o',
  'o..o....o',
  'oooo....o',
  '...o....o',
  '...o....o',
  '...oooooo',
]

const checkIcon: PixelGrid = [
  '........o',
  '.......oo',
  'o.....oo.',
  'oo...oo..',
  '.oo.oo...',
  '..ooo....',
  '...o.....',
]

const downloadIcon: PixelGrid = [
  '...ooo...',
  '...ooo...',
  '...ooo...',
  'ooooooooo',
  '.ooooooo.',
  '..ooooo..',
  '...ooo...',
  '....o....',
  'ooooooooo',
]

const inkPalette: Palette = { o: 'currentColor' }

const flames = campfire.slice(0, 10)
const logs = campfire.slice(10)

const fx = `
@keyframes save-spark {
  0% { transform: translate(0, 0); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translate(var(--drift, 0px), -76px); opacity: 0; }
}
@keyframes save-glow {
  0%, 100% { transform: scale(1); opacity: 0.45; }
  50% { transform: scale(1.1); opacity: 0.8; }
}
.save-spark { animation: save-spark 2.2s steps(9, end) infinite; }
.save-glow { animation: save-glow 1.8s steps(3, end) infinite; }
@media (prefers-reduced-motion: reduce) {
  .save-spark { display: none; }
  .save-glow { animation: none; }
}
`

const sparks = [
  {
    left: '28%',
    size: 4,
    delay: '-0.2s',
    duration: '1.9s',
    drift: '-12px',
    color: 'var(--pop-yellow)',
  },
  {
    left: '50%',
    size: 5,
    delay: '-1.1s',
    duration: '2.4s',
    drift: '8px',
    color: 'var(--pop-orange)',
  },
  { left: '66%', size: 4, delay: '-0.7s', duration: '2.1s', drift: '14px', color: 'var(--coin)' },
  {
    left: '40%',
    size: 3,
    delay: '-1.6s',
    duration: '2.6s',
    drift: '-4px',
    color: 'var(--pop-pink)',
  },
  {
    left: '58%',
    size: 3,
    delay: '-0.4s',
    duration: '2.3s',
    drift: '-16px',
    color: 'var(--pop-yellow)',
  },
]

const stepEase = steps(4)

const keyGlyph: Record<string, string> = {
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
}

const footerStack: (Pick<TechLogo, 'name' | 'path'> & { href?: string })[] = techLogos.map(
  (logo) => (logo.name === 'Payload CMS' ? cmsMark : logo),
)

const flagColors = Array.from({ length: 12 }, (_, i) => (i % 2 ? 'bg-pop-yellow' : 'bg-pop-orange'))

const meterVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
}

const segmentVariants: Variants = {
  hidden: { opacity: 0, scaleY: 0.3 },
  show: { opacity: 1, scaleY: 1, transition: { duration: 0.16, ease: steps(2) } },
}

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: steps(3) } },
}

function steppedHill(heights: number[]) {
  const w = 100 / heights.length
  const points = ['0% 100%']
  heights.forEach((h, i) => {
    points.push(`${(i * w).toFixed(2)}% ${100 - h}%`, `${((i + 1) * w).toFixed(2)}% ${100 - h}%`)
  })
  points.push('100% 100%')
  return `polygon(${points.join(', ')})`
}

const backHill = steppedHill([
  30, 42, 55, 68, 78, 70, 56, 44, 38, 46, 60, 74, 84, 76, 62, 48, 36, 30,
])
const frontHill = steppedHill([
  18, 24, 30, 38, 34, 26, 20, 24, 32, 42, 50, 44, 36, 28, 22, 26, 34, 28,
])

const sceneStars = [
  { left: '8%', top: '14%' },
  { left: '22%', top: '30%' },
  { left: '37%', top: '10%' },
  { left: '49%', top: '26%' },
  { left: '63%', top: '16%' },
  { left: '74%', top: '34%' },
  { left: '15%', top: '44%' },
]

// Side gutters only, so no star lands between the title letters.
const footerStars = Array.from({ length: 14 }, (_, i) => ({
  left: i % 2 === 0 ? (i * 7 + 3) % 16 : 84 + ((i * 5) % 14),
  top: (i * 29 + 11) % 70,
  size: i % 3 === 0 ? 4 : 3,
  twinkle: i % 5 === 0,
  delay: (i % 4) * 0.5,
}))

const flowers = [
  { left: '6%', color: 'var(--pop-pink)' },
  { left: '19%', color: 'var(--pop-yellow)' },
  { left: '81%', color: 'var(--pop-purple)' },
  { left: '92%', color: 'var(--pop-blue)' },
]

function CampScene({ reduce }: { reduce: boolean }) {
  return (
    <div
      className="pixel-box relative h-full min-h-[300px] overflow-hidden sm:min-h-[340px]"
      style={{ background: 'linear-gradient(var(--sky-1), var(--sky-2) 55%, var(--horizon))' }}
      aria-hidden="true"
    >
      {sceneStars.map((star, i) => (
        <span
          key={i}
          className="absolute size-[3px]"
          style={{ left: star.left, top: star.top, background: 'var(--star)' }}
        />
      ))}
      <PixelArt
        grid={sun}
        palette={{ c: 'var(--sun)' }}
        className="pixelated absolute top-8 right-6 w-10 dark:hidden sm:w-12"
      />
      <PixelArt
        grid={moon}
        palette={{ c: 'var(--sun)' }}
        className="pixelated absolute top-8 right-6 hidden w-10 dark:block sm:w-12"
      />

      <div className="absolute inset-x-0 top-3 h-1 bg-edge/50" />
      <div className="absolute inset-x-3 top-4 flex justify-between">
        {flagColors.map((color, i) => (
          <span
            key={i}
            className={cn(
              'h-4 w-3 [clip-path:polygon(0_0,100%_0,50%_100%)] sm:h-5 sm:w-4',
              color,
              i > 7 && 'hidden sm:block',
            )}
          />
        ))}
      </div>

      <div
        className="absolute inset-x-0 bottom-12 h-24 sm:h-28"
        style={{ background: 'var(--mountain-2)', clipPath: backHill }}
      />
      <div
        className="absolute inset-x-0 bottom-12 h-16 sm:h-20"
        style={{ background: 'var(--mountain)', clipPath: frontHill }}
      />

      <div className="pixel-ground absolute inset-x-0 bottom-0 h-14 border-t-4 border-edge">
        {flowers.map((f, i) => (
          <span key={i} className="absolute top-3" style={{ left: f.left }}>
            <PixelArt
              grid={flower}
              palette={{ p: f.color, y: 'var(--pop-yellow)', g: 'var(--grass-dark)' }}
              className="pixelated block w-3 sm:w-4"
            />
          </span>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-[50px] z-10 flex items-end justify-center gap-3 px-3 sm:gap-6">
        <PixelArt grid={tent} palette={tentPalette} className="pixelated w-28 shrink-0 sm:w-36" />

        <div className="relative w-16 shrink-0 sm:w-20">
          <div
            className="save-glow pointer-events-none absolute -inset-x-10 -top-8 -bottom-4 opacity-50"
            style={{
              background:
                'radial-gradient(closest-side, var(--pop-yellow) 0 34%, var(--pop-orange) 34% 62%, transparent 62%)',
            }}
          />
          {sparks.map((s, i) => (
            <span
              key={i}
              className="save-spark absolute bottom-[55%]"
              style={
                {
                  left: s.left,
                  width: s.size,
                  height: s.size,
                  background: s.color,
                  animationDelay: s.delay,
                  animationDuration: s.duration,
                  '--drift': s.drift,
                } as React.CSSProperties
              }
            />
          ))}
          <PixelArt
            grid={flames}
            palette={campfirePalette}
            className="pixelated animate-flicker relative block w-full origin-bottom"
          />
          <PixelArt
            grid={logs}
            palette={campfirePalette}
            className="pixelated relative block w-full"
          />
        </div>

        <div className="relative shrink-0">
          <ul className="absolute -top-7 left-1/2 flex -translate-x-1/2 gap-1">
            {[0, 1, 2].map((i) => (
              <motion.li
                key={i}
                initial={reduce ? false : { opacity: 0, y: 8, scale: 0.5 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 0.35 + i * 0.06, duration: 0.24, ease: stepEase }}
              >
                <PixelArt grid={heart} palette={heartPalette} className="pixelated w-4 sm:w-5" />
              </motion.li>
            ))}
          </ul>
          <Player className="block w-20 sm:w-24" />
        </div>
      </div>
    </div>
  )
}

export function SavePoint({
  availability,
  email,
  linkedin,
  github,
  cvUrl,
}: {
  availability: string
  email: string
  linkedin?: string | null
  github?: string | null
  cvUrl: string | null
}) {
  const { t, play } = useGame()
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLParagraphElement>(null)
  const inView = useInView(panelRef, { once: true, margin: '0px 0px -20% 0px' })
  const { shown, done } = useTypewriter(t.save.saved, { speed: 45, start: inView })

  const [copied, setCopied] = useState(false)
  const [selectHint, setSelectHint] = useState(false)
  const [coinPops, setCoinPops] = useState(0)
  const copyTimer = useRef<number | undefined>(undefined)
  const hintTimer = useRef<number | undefined>(undefined)
  useEffect(
    () => () => {
      window.clearTimeout(copyTimer.current)
      window.clearTimeout(hintTimer.current)
    },
    [],
  )

  const selectEmail = () => {
    const el = emailRef.current
    const selection = window.getSelection()
    if (!el || !selection) return
    const range = document.createRange()
    range.selectNodeContents(el)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      selectEmail()
      let ok = false
      try {
        ok = document.execCommand('copy')
      } catch {
        // Some browsers throw here; treat it as a failed copy.
      }
      if (!ok) {
        setCopied(false)
        setSelectHint(true)
        window.clearTimeout(hintTimer.current)
        hintTimer.current = window.setTimeout(() => setSelectHint(false), 3000)
        return
      }
    }
    window.clearTimeout(hintTimer.current)
    setSelectHint(false)
    play('coin')
    setCopied(true)
    setCoinPops((n) => n + 1)
    window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopied(false), 2000)
  }

  const btn = 'pixel-btn relative h-12 w-full justify-center px-4 text-[16px] font-bold'
  const actions: { key: string; node: React.ReactNode }[] = [
    {
      key: 'mail',
      node: (
        <a
          href={`mailto:${email}`}
          onClick={() => play('blip')}
          className={cn(btn, 'bg-pop-orange text-on-pop')}
        >
          <PixelArt grid={envelopeIcon} palette={inkPalette} className="pixelated w-5" />
          {t.save.email}
        </a>
      ),
    },
    {
      key: 'copy',
      node: (
        <button type="button" onClick={copyEmail} className={cn(btn, 'bg-pop-yellow text-on-pop')}>
          <PixelArt
            grid={copied ? checkIcon : copyIcon}
            palette={inkPalette}
            className="pixelated w-[18px]"
          />
          {/* Both labels share one grid cell so the button never changes width. */}
          <span className="grid *:col-start-1 *:row-start-1">
            <span className="invisible" aria-hidden="true">
              {t.save.copy}
            </span>
            <span className="invisible" aria-hidden="true">
              {t.save.copied}
            </span>
            <motion.span
              key={copied ? 'copied' : 'copy'}
              initial={reduce || coinPops === 0 ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16, ease: steps(2) }}
            >
              {copied ? t.save.copied : t.save.copy}
            </motion.span>
          </span>
          {coinPops > 0 ? (
            <PixelArt
              key={coinPops}
              grid={coin}
              palette={coinPalette}
              className="pixelated pointer-events-none absolute -top-8 left-1/2 -ml-3 w-6 animate-[coin-pop_600ms_steps(6)_forwards] motion-reduce:hidden"
            />
          ) : null}
        </button>
      ),
    },
  ]
  if (linkedin) {
    actions.push({
      key: 'linkedin',
      node: (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => play('blip')}
          className={cn(btn, 'bg-pop-blue text-on-pop')}
        >
          <LinkedinIcon className="size-5" />
          LinkedIn
          <span className="sr-only"> {t.newTab}</span>
          <span aria-hidden="true">↗</span>
        </a>
      ),
    })
  }
  if (github) {
    actions.push({
      key: 'github',
      node: (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => play('blip')}
          className={cn(btn, 'bg-pop-purple text-on-pop')}
        >
          <GithubIcon className="size-5" />
          GitHub
          <span className="sr-only"> {t.newTab}</span>
          <span aria-hidden="true">↗</span>
        </a>
      ),
    })
  }
  if (cvUrl) {
    actions.push({
      key: 'cv',
      node: (
        <a
          href={cvUrl}
          download
          onClick={() => play('unlock')}
          className={cn(btn, 'bg-coin text-[#24123d]')}
        >
          <PixelArt grid={downloadIcon} palette={inkPalette} className="pixelated w-[18px]" />
          {t.hud.downloadCv}
        </a>
      ),
    })
  }

  return (
    <>
      <style href="save-point-fx" precedence="medium">
        {fx}
      </style>

      <SectionFrame
        id="save"
        title={t.sections.save.title}
        subtitle={t.sections.save.subtitle}
        tone="band"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10 lg:items-stretch">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: stepEase }}
          >
            <CampScene reduce={reduce} />
          </motion.div>

          {/* Panel first on phones so jumping to #save lands on the email. */}
          <motion.div
            ref={panelRef}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 0.4, delay: 0.08, ease: stepEase }}
            className="pixel-box min-w-0 max-lg:order-first"
          >
            <div
              className="flex items-center justify-between gap-3 border-b-4 border-edge bg-pop-orange px-4 py-2 text-on-pop"
              aria-hidden="true"
            >
              <span className="flex items-center gap-2 font-pixel text-[16px] font-bold tracking-wide">
                <PixelArt grid={floppy} palette={floppyPalette} className="pixelated w-6" />
                SLOT 01
              </span>
              <span className="font-hud text-[20px] leading-none">★ 100%</span>
            </div>

            <div className="p-5 sm:p-6">
              <div className="pixel-box-flat bg-panel-2 p-1" aria-hidden="true">
                <motion.div
                  className="flex gap-1"
                  variants={meterVariants}
                  initial={reduce ? false : 'hidden'}
                  animate={reduce || inView ? 'show' : 'hidden'}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <motion.span
                      key={i}
                      variants={segmentVariants}
                      className="block h-4 flex-1 origin-bottom bg-pop-mint"
                    />
                  ))}
                </motion.div>
              </div>

              <p className="mt-5 flex min-h-6 items-center gap-2 font-hud text-[24px] leading-none text-ink">
                <span className="text-mint" aria-hidden="true">
                  ✔
                </span>
                <span aria-hidden="true">
                  {shown}
                  {!done ? <span className="animate-blink">▌</span> : null}
                </span>
                <span className="sr-only">{t.save.saved}</span>
              </p>

              <h3 className="mt-4 font-pixel text-[clamp(1.3rem,2.8vw,1.7rem)] leading-snug font-bold text-ink">
                {t.save.prompt}
              </h3>

              {availability ? (
                <div className="pixel-box-flat mt-5 flex items-start gap-3 bg-panel-2 px-4 py-3">
                  <span
                    className="animate-twinkle mt-1.5 size-3 shrink-0 bg-mint"
                    aria-hidden="true"
                  />
                  <p className="text-[16px] leading-relaxed text-ink">{availability}</p>
                </div>
              ) : null}

              <div className="pixel-box-flat mt-7 bg-pop-orange/15 px-4 py-4">
                <p
                  ref={emailRef}
                  className="font-pixel text-[clamp(1.3rem,4.4vw,2.1rem)] leading-tight font-bold break-all text-ink select-all sm:break-normal sm:wrap-anywhere"
                >
                  {email}
                </p>
              </div>
              {selectHint ? (
                <p className="mt-2 font-hud text-[20px] leading-tight text-muted">
                  {t.save.selectHint}
                </p>
              ) : null}

              {/* An odd last button spans the full row. */}
              <ul className="mt-7 grid gap-4 sm:grid-cols-2">
                {actions.map((action, i) => (
                  <motion.li
                    key={action.key}
                    className="w-full sm:[&:last-child:nth-child(odd)]:col-span-2"
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.24, ease: stepEase }}
                  >
                    {action.node}
                  </motion.li>
                ))}
              </ul>
              <span className="sr-only" aria-live="polite">
                {copied ? t.save.copied : selectHint ? t.save.selectHint : ''}
              </span>
            </div>
          </motion.div>
        </div>
      </SectionFrame>
    </>
  )
}

// Rendered after <main> so it stays a top-level contentinfo landmark.
export function Footer() {
  const { t, play, konamiStep } = useGame()
  const reduce = useReducedMotion()
  const words: { text: string; start: number }[] = []
  let letterCount = 0
  for (const text of t.footer.thanks.split(' ')) {
    words.push({ text, start: letterCount })
    letterCount += Array.from(text).length
  }
  // Stagger from the parent (capped at ~0.4s) so a hovered letter doesn't reuse its entrance delay.
  const titleVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: Math.min(0.03, 0.4 / Math.max(letterCount, 1)) } },
  }

  return (
    <footer className="relative overflow-hidden bg-edge">
      <div aria-hidden="true">
        {footerStars.map((star, i) => (
          <span
            key={i}
            className={cn('absolute bg-coin/70', star.twinkle && 'animate-twinkle')}
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              animationDelay: star.twinkle ? `${star.delay}s` : undefined,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 pt-16 pb-14 text-center sm:px-6">
        <p className="font-hud text-[22px] tracking-[0.4em] text-pop-yellow" aria-hidden="true">
          ★ ◆ ★
        </p>

        <motion.p
          className="mt-4 font-pixel text-[clamp(2rem,6.4vw,4.25rem)] leading-[1.1] font-bold"
          variants={titleVariants}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <span className="sr-only">{t.footer.thanks}</span>
          <span aria-hidden="true">
            {words.map((word, w) => (
              <React.Fragment key={w}>
                {w > 0 ? ' ' : null}
                <span className="inline-block whitespace-nowrap">
                  {Array.from(word.text).map((char, c) => {
                    const i = word.start + c
                    return (
                      <motion.span
                        key={i}
                        className="inline-block text-pop-yellow [text-shadow:0.08em_0.08em_0_var(--accent)]"
                        variants={letterVariants}
                        whileHover={
                          reduce
                            ? undefined
                            : { y: -8, transition: { duration: 0.1, ease: steps(2) } }
                        }
                      >
                        {char}
                      </motion.span>
                    )
                  })}
                </span>
              </React.Fragment>
            ))}
          </span>
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3, ease: steps(6) }}
        >
          <p className="mx-auto mt-8 max-w-[52ch] text-[16px] leading-relaxed text-coin sm:text-[17px]">
            {t.footer.credits}
          </p>

          <p id="built-with" className="mt-8 font-pixel text-[15px] font-bold text-pop-mint">
            {t.footer.builtWith}
          </p>
          <ul
            aria-labelledby="built-with"
            className="mx-auto mt-4 flex max-w-[720px] flex-wrap justify-center gap-2.5 sm:gap-3"
          >
            {footerStack.map((logo) => {
              const chip =
                'flex h-10 items-center gap-2 border-2 border-coin/35 px-3 font-hud text-[20px] leading-none text-pop-yellow'
              const mark = <TechLogoMark logo={logo} className="size-[18px] shrink-0 text-coin" />
              return (
                <li key={logo.name}>
                  {logo.href ? (
                    <a
                      href={logo.href}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        chip,
                        'transition-transform duration-100 ease-[steps(2)] hover:-translate-y-0.5 hover:border-coin focus-visible:border-coin motion-reduce:transition-none',
                      )}
                    >
                      {mark}
                      {logo.name}
                      <span className="sr-only"> {t.newTab}</span>
                    </a>
                  ) : (
                    <span className={chip}>
                      {mark}
                      {logo.name}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Tappable for touch; keyboard users have real arrow keys, so these stay out of the tab order. */}
          <ul
            className="mx-auto mt-8 flex max-w-max flex-wrap justify-center gap-1.5 sm:gap-2.5"
            aria-hidden="true"
          >
            {KONAMI.map((key, i) => (
              <li
                key={i}
                className={cn(
                  'flex size-6 items-center justify-center font-hud text-[20px] leading-none text-on-pop sm:size-8',
                  i < 8 ? 'bg-pop-yellow' : 'bg-pop-pink',
                )}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => {
                    play('blip')
                    konamiStep(key)
                  }}
                  className="flex size-full items-center justify-center active:translate-y-0.5"
                >
                  {keyGlyph[key] ?? key.toUpperCase()}
                </button>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-4 max-w-[76ch] font-hud text-[20px] leading-snug text-balance text-pop-mint">
            {t.footer.hint}
          </p>

          <p className="mt-8 inline-flex items-center gap-2 font-hud text-[20px] leading-none text-pop-blue">
            <PixelArt
              grid={coin}
              palette={coinPalette}
              className="pixelated animate-spin-y size-5"
            />
            <span suppressHydrationWarning>© {new Date().getFullYear()} kezhia.online</span>
          </p>
        </motion.div>
      </div>

      <div className="pixel-ground h-6" aria-hidden="true" />
    </footer>
  )
}
