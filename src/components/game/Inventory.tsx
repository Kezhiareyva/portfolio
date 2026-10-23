'use client'

import { motion, type Variants } from 'motion/react'
import { useState } from 'react'

import { useGame } from '@/components/game/GameProvider'
import { PixelArt, type Palette, type PixelGrid } from '@/components/game/PixelArt'
import { SectionFrame } from '@/components/game/SectionFrame'
import { useReducedMotion } from '@/components/game/useReducedMotion'
import { cn, skillKey } from '@/lib/utils'

type Group = { id: string; label: string; items: string[] }
type Use = { label: string; href: string }

// Night tints are lighter so slots don't turn muddy on the dark panel.
const BAG_COLORS = [
  {
    solid: 'bg-pop-yellow',
    soft: 'bg-pop-yellow/25 hover:bg-pop-yellow/40 dark:bg-pop-yellow/12 dark:hover:bg-pop-yellow/25',
  },
  {
    solid: 'bg-pop-pink',
    soft: 'bg-pop-pink/25 hover:bg-pop-pink/40 dark:bg-pop-pink/15 dark:hover:bg-pop-pink/30',
  },
  {
    solid: 'bg-pop-blue',
    soft: 'bg-pop-blue/25 hover:bg-pop-blue/40 dark:bg-pop-blue/15 dark:hover:bg-pop-blue/30',
  },
  {
    solid: 'bg-pop-mint',
    soft: 'bg-pop-mint/25 hover:bg-pop-mint/40 dark:bg-pop-mint/15 dark:hover:bg-pop-mint/30',
  },
  {
    solid: 'bg-pop-purple',
    soft: 'bg-pop-purple/25 hover:bg-pop-purple/40 dark:bg-pop-purple/15 dark:hover:bg-pop-purple/30',
  },
  {
    solid: 'bg-pop-orange',
    soft: 'bg-pop-orange/25 hover:bg-pop-orange/40 dark:bg-pop-orange/12 dark:hover:bg-pop-orange/25',
  },
] as const

const colorFor = (index: number) => BAG_COLORS[index % BAG_COLORS.length]

const chestPalette: Palette = {
  o: 'var(--edge)',
  w: '#d9822b',
  W: '#a85a17',
  g: 'var(--coin)',
  G: 'var(--coin-dark)',
  c: 'var(--coin)',
  C: '#fff3b0',
}

const chestBody = [
  'oggggggggggggggo',
  'owwwwwgGGgwwwwwo',
  'owwwwwgoogwwwwwo',
  'oWWWWWggggWWWWWo',
  'owwwwwwwwwwwwwwo',
  'owwwwwwwwwwwwwwo',
  'oggggggggggggggo',
  '.oooooooooooooo.',
]

const chestOpen: PixelGrid = [
  '..oooooooooooo..',
  '.oWWWWWWWWWWWWo.',
  '.oWwwwwwwwwwwWo.',
  '.oWWWWWWWWWWWWo.',
  '.oggggggggggggo.',
  'oooooooooooooooo',
  'oCcCccCcCccCccCo',
  'occcCccccCcccCco',
  ...chestBody,
]

const sparkle: PixelGrid = [
  '....o....',
  '...owo...',
  '...owo...',
  '.ooowooo.',
  'owwwwwwwo',
  '.ooowooo.',
  '...owo...',
  '...owo...',
  '....o....',
]

const sparklePalette: Palette = { o: 'var(--edge)', w: '#ffffff' }

// Reduced motion keeps the same start pose so server and client markup match.
const INSTANT = { duration: 0 }

const frameHidden = { opacity: 0, y: 24 }
const frameVariants: Variants = {
  hidden: frameHidden,
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}
const frameStill: Variants = {
  hidden: frameHidden,
  show: { opacity: 1, y: 0, transition: INSTANT },
}

// `custom` is each slot's delay in seconds.
const slotHidden = { opacity: 0, scale: 0.4, y: 10 }
const slotVariants: Variants = {
  hidden: slotHidden,
  show: (delay: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
  }),
}
const slotStill: Variants = {
  hidden: slotHidden,
  show: { opacity: 1, scale: 1, y: 0, transition: INSTANT },
}

// A visibility ratio never fires for a very tall block, so use a margin.
const VIEWPORT = { once: true, margin: '0px 0px -15% 0px' }

const pickVariants: Variants = {
  rest: { scale: 1 },
  picked: { scale: [1, 1.12, 0.96, 1], transition: { duration: 0.35, times: [0, 0.35, 0.7, 1] } },
}

const fill = (count: number, cols: number) => (cols - (count % cols)) % cols

// Columns go 2, 3, 2, 3 across breakpoints; a filler shows only where it completes a row.
function fillerClass(k: number, count: number) {
  return cn(
    k < fill(count, 2) ? 'block' : 'hidden',
    k < fill(count, 3) ? 'sm:block' : 'sm:hidden',
    k < fill(count, 2) ? 'md:block' : 'md:hidden',
    k < fill(count, 3) ? 'lg:block' : 'lg:hidden',
  )
}

function Sparkle({
  className,
  delay,
  size,
  animate,
}: {
  className: string
  delay: number
  size: string
  animate: boolean
}) {
  return (
    <motion.span
      aria-hidden="true"
      initial={animate ? { scale: 0, rotate: -90 } : false}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 15, delay: 0.08 + delay / 8 }}
      className={cn('pointer-events-none absolute', className)}
    >
      <span className="animate-twinkle block" style={{ animationDelay: `${delay}s` }}>
        <PixelArt grid={sparkle} palette={sparklePalette} className={cn('pixelated block', size)} />
      </span>
    </motion.span>
  )
}

function PickedCursor({ animate }: { animate: boolean }) {
  const corner = 'absolute size-3 border-accent'
  return (
    <>
      <motion.span
        aria-hidden="true"
        initial={animate ? { scale: 1.3, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="pointer-events-none absolute -inset-2.5"
      >
        <span className="animate-blink absolute inset-0">
          <span className={cn(corner, 'top-0 left-0 border-t-4 border-l-4')} />
          <span className={cn(corner, 'top-0 right-0 border-t-4 border-r-4')} />
          <span className={cn(corner, 'bottom-0 left-0 border-b-4 border-l-4')} />
          <span className={cn(corner, 'right-0 bottom-0 border-r-4 border-b-4')} />
        </span>
      </motion.span>
      <Sparkle animate={animate} delay={0} size="size-[18px]" className="-top-3.5 -right-3.5" />
      <Sparkle animate={animate} delay={0.9} size="size-[18px]" className="-bottom-3.5 -left-3.5" />
      {/* Kept on the bottom edge so it doesn't cover the label on short tiles. */}
      <Sparkle animate={animate} delay={1.6} size="size-[18px]" className="right-4 -bottom-3.5" />
    </>
  )
}

export function Inventory({ groups, usedIn }: { groups: Group[]; usedIn: Record<string, Use[]> }) {
  const { t, play } = useGame()
  const reduce = useReducedMotion()
  const animate = !reduce
  // One pick across all bags, so only one cursor animates at a time.
  const [picked, setPicked] = useState<{ group: string; slot: number } | null>(null)

  // Picking the same slot again clears it, so aria-pressed stays a real toggle.
  const pick = (group: string, slot: number) => {
    setPicked((prev) => (prev?.group === group && prev.slot === slot ? null : { group, slot }))
    play('blip')
  }

  return (
    <SectionFrame
      id="inventory"
      title={t.sections.inventory.title}
      subtitle={t.sections.inventory.subtitle}
      tone="band"
    >
      {groups.length > 0 ? (
        <motion.div
          initial="hidden"
          whileInView={animate ? 'show' : undefined}
          animate={animate ? undefined : 'show'}
          viewport={VIEWPORT}
          variants={animate ? frameVariants : frameStill}
        >
          <p className="mb-6 flex items-start gap-2 text-[16px] leading-relaxed text-ink">
            <span aria-hidden="true" className="text-accent">
              ▶
            </span>
            {t.inventory.hint}
          </p>

          <div className="grid items-start gap-8 md:grid-cols-2">
            {groups.map((group, i) => {
              const color = colorFor(i)
              const count = group.items.length
              const fillers = Math.max(fill(count, 2), fill(count, 3))
              const slot = picked?.group === group.id ? picked.slot : undefined
              const item = slot !== undefined ? group.items[slot] : undefined
              const uses = item ? (usedIn[skillKey(item)] ?? []) : []
              return (
                <div key={group.id} className="pixel-box min-w-0">
                  <div
                    className={cn(
                      'flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b-4 border-edge px-4 py-2 text-on-pop',
                      color.solid,
                    )}
                  >
                    <h3 className="font-pixel text-[18px] leading-tight font-bold sm:text-[20px]">
                      {group.label}
                    </h3>
                    <p className="font-hud text-[20px] leading-none">
                      {count} {t.inventory.slots}
                    </p>
                  </div>
                  <motion.ul
                    className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:gap-4 sm:p-5 md:grid-cols-2 lg:grid-cols-3"
                    initial="hidden"
                    whileInView={animate ? 'show' : undefined}
                    animate={animate ? undefined : 'show'}
                    viewport={VIEWPORT}
                  >
                    {group.items.map((name, j) => {
                      const isPicked = slot === j
                      return (
                        <motion.li
                          key={`${name}-${j}`}
                          variants={animate ? slotVariants : slotStill}
                          custom={0.1 + Math.min(j * 0.04, 0.3)}
                          className={cn('relative', isPicked && 'z-10')}
                        >
                          <motion.button
                            type="button"
                            aria-pressed={isPicked}
                            onClick={() => pick(group.id, j)}
                            initial={false}
                            animate={isPicked && animate ? 'picked' : 'rest'}
                            variants={pickVariants}
                            className={cn(
                              // Top padding keeps the 01/02 badge clear of the name.
                              'pixel-box-flat relative flex h-full min-h-16 w-full items-center justify-center px-2 pt-6 pb-3 text-center',
                              'transition-[translate,background-color] duration-150 ease-[steps(3)] hover:-translate-y-1 active:translate-y-0.5',
                              isPicked
                                ? cn(color.solid, 'text-on-pop')
                                : cn(color.soft, 'text-ink'),
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={cn(
                                'absolute top-0 left-0 px-1 font-hud text-[18px] leading-none text-on-pop',
                                isPicked ? 'bg-edge/15' : color.solid,
                              )}
                            >
                              {String(j + 1).padStart(2, '0')}
                            </span>
                            <span className="text-[16px] leading-tight font-extrabold hyphens-auto wrap-break-word">
                              {name}
                            </span>
                            {/* Pixel bevel */}
                            <span
                              aria-hidden="true"
                              className={cn(
                                'pointer-events-none absolute inset-x-0 bottom-0 h-1.5',
                                isPicked ? 'bg-edge/15' : color.solid,
                              )}
                            />
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-edge/15"
                            />
                          </motion.button>
                          {isPicked ? <PickedCursor animate={animate} /> : null}
                        </motion.li>
                      )
                    })}
                    {Array.from({ length: fillers }, (_, k) => (
                      <motion.li
                        key={`empty-${k}`}
                        aria-hidden="true"
                        variants={animate ? slotVariants : slotStill}
                        custom={0.1 + Math.min((count + k) * 0.04, 0.3)}
                        className={fillerClass(k, count)}
                      >
                        <div className="pixel-box-flat h-full min-h-16 w-full bg-edge/10 opacity-50" />
                      </motion.li>
                    ))}
                  </motion.ul>

                  {item !== undefined && slot !== undefined ? (
                    <div className="flex items-start gap-4 border-t-4 border-edge bg-panel-2 p-4 sm:p-5">
                      <motion.div
                        key={`chest-${group.id}-${slot}`}
                        initial={animate ? { y: -12, rotate: -8 } : false}
                        animate={{ y: 0, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 520, damping: 14 }}
                        className="shrink-0"
                      >
                        <PixelArt
                          grid={chestOpen}
                          palette={chestPalette}
                          className="pixelated w-14 sm:w-16"
                        />
                      </motion.div>
                      <motion.div
                        key={`info-${group.id}-${slot}`}
                        initial={animate ? { opacity: 0, y: 8, scale: 0.92 } : false}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                        className="min-w-0 flex-1"
                      >
                        <p className="font-pixel text-[20px] leading-tight font-bold wrap-break-word text-ink sm:text-[22px]">
                          {item}
                        </p>
                        {uses.length > 0 ? (
                          <>
                            <p className="mt-3 font-hud text-[20px] leading-none text-muted">
                              {t.inventory.usedIn}
                            </p>
                            <ul className="mt-2 flex flex-wrap gap-3">
                              {uses.slice(0, 3).map((u) => (
                                <li key={u.href}>
                                  <a
                                    href={u.href}
                                    onClick={() => play('blip')}
                                    className={cn(
                                      'pixel-box-flat inline-flex min-h-9 items-center px-2.5 py-1 font-hud text-[20px] leading-tight text-ink',
                                      color.soft,
                                    )}
                                  >
                                    {u.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <p className="mt-2 text-[16px] leading-relaxed text-muted">
                            {t.inventory.notUsedYet}
                          </p>
                        )}
                      </motion.div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </motion.div>
      ) : null}
    </SectionFrame>
  )
}
