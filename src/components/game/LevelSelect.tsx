'use client'

import { motion } from 'motion/react'
import React, { useRef, useState } from 'react'

import { AltimeterDemo } from '@/components/demos/AltimeterDemo'
import { SketchSlider } from '@/components/demos/SketchSlider'
import { useGame } from '@/components/game/GameProvider'
import { PixelArt } from '@/components/game/PixelArt'
import { SectionFrame } from '@/components/game/SectionFrame'
import { iconForProject, iconPalette } from '@/components/game/sprites'
import { useReducedMotion } from '@/components/game/useReducedMotion'
import { cn } from '@/lib/utils'
import type { Project } from '@/payload-types'

const TONES = [
  { bar: 'bg-pop-blue', chip: 'bg-pop-blue/25' },
  { bar: 'bg-pop-pink', chip: 'bg-pop-pink/25' },
  { bar: 'bg-pop-mint', chip: 'bg-pop-mint/25' },
  { bar: 'bg-pop-yellow', chip: 'bg-pop-yellow/30' },
  { bar: 'bg-pop-purple', chip: 'bg-pop-purple/25' },
  { bar: 'bg-pop-orange', chip: 'bg-pop-orange/25' },
] as const

// Back-out easing quantised to 7 frames.
function pixelPop(p: number) {
  const q = Math.round(p * 7) / 7
  const c = 1.70158
  return 1 + (c + 1) * (q - 1) ** 3 + c * (q - 1) ** 2
}

type Placement = { wide: boolean; slot: number; flip: boolean }

// Featured tiles, and a lone tile at the end of a row, span both columns so the grid has no holes.
// `slot` is the tile's column, used for the entrance stagger.
function planLayout(projects: Project[]): Placement[] {
  let slot = 0
  let featuredCount = 0
  return projects.map((project, i) => {
    if (project.featured) {
      slot = 0
      return { wide: true, slot: 0, flip: featuredCount++ % 2 === 1 }
    }
    const next = projects[i + 1]
    const current = slot
    const wide = current === 0 && (!next || Boolean(next.featured))
    slot = wide ? 0 : (current + 1) % 2
    return { wide, slot: current, flip: false }
  })
}

export function LevelSelect({ projects }: { projects: Project[] }) {
  const { t, play } = useGame()
  const reduce = useReducedMotion()
  // The latest pointer or focus move picks the level; leaving a tile falls back to the other one.
  const [selected, setSelected] = useState<number | null>(null)
  const hovered = useRef<number | null>(null)
  const focused = useRef<number | null>(null)
  const layout = planLayout(projects)

  const select = (index: number) => {
    if (selected !== index) play('blip')
    setSelected(index)
  }

  return (
    <SectionFrame
      id="levels"
      title={t.sections.levels.title}
      subtitle={t.sections.levels.subtitle}
      tone="sky"
    >
      <ol className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
        {projects.map((project, index) => {
          const placement = layout[index]
          return (
            // Anchor on the untransformed li: a hash jump measures the transformed box, so an anchor
            // inside the entrance animation would end up under the HUD.
            <li
              key={project.id}
              id={`project-${project.slug}`}
              className={cn('min-w-0 scroll-mt-4', placement.wide && 'md:col-span-2')}
            >
              <motion.div
                className="h-full"
                initial={reduce ? false : { opacity: 0, y: 28, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                transition={{ duration: 0.42, delay: placement.slot * 0.06, ease: pixelPop }}
              >
                <LevelTile
                  project={project}
                  index={index}
                  placement={placement}
                  selected={selected === index}
                  onPointerEnter={(event) => {
                    if (event.pointerType === 'touch') return
                    hovered.current = index
                    select(index)
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType === 'touch') return
                    if (hovered.current === index) hovered.current = null
                    const fallback = focused.current
                    setSelected((s) => (s === index ? fallback : s))
                  }}
                  onFocus={() => {
                    focused.current = index
                    select(index)
                  }}
                  onBlur={(event) => {
                    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
                    if (focused.current === index) focused.current = null
                    const fallback = hovered.current
                    setSelected((s) => (s === index ? fallback : s))
                  }}
                />
              </motion.div>
            </li>
          )
        })}
      </ol>
    </SectionFrame>
  )
}

function LevelTile({
  project,
  index,
  placement,
  selected,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
}: {
  project: Project
  index: number
  placement: Placement
  selected: boolean
  onPointerEnter: (event: React.PointerEvent<HTMLElement>) => void
  onPointerLeave: (event: React.PointerEvent<HTMLElement>) => void
  onFocus: () => void
  onBlur: (event: React.FocusEvent<HTMLElement>) => void
}) {
  const { t, play } = useGame()
  const tone = TONES[index % TONES.length]
  const titleId = `level-${project.slug}`
  const meta = [project.context, project.year].filter(Boolean).join(' · ')
  const stack = project.stack ?? []
  const hasDemo = project.demo === 'altimeter' || project.demo === 'sketch'
  const split = placement.wide && hasDemo

  return (
    <article
      aria-labelledby={titleId}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      className={cn(
        'pixel-box flex h-full flex-col transition-transform duration-150 ease-[steps(2,end)]',
        selected && 'motion-safe:-translate-x-1 motion-safe:-translate-y-1',
      )}
    >
      <header
        className={cn(
          'flex items-center gap-2.5 border-b-4 border-edge px-4 py-2.5 text-on-pop',
          tone.bar,
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'w-4 shrink-0 font-pixel text-[18px] leading-none transition-[opacity,translate] duration-150 ease-[steps(2,end)] motion-reduce:transition-none',
            selected ? 'animate-blink translate-x-0 opacity-100' : '-translate-x-1 opacity-0',
          )}
        >
          ▶
        </span>
        <p className="font-pixel text-[16px] leading-none font-bold tracking-wide uppercase">
          {t.levels.level} 1-{index + 1}
        </p>
        {project.featured ? (
          <span aria-hidden="true" className="font-pixel text-[18px] leading-none">
            ★
          </span>
        ) : null}
        <span className="ml-auto flex size-11 shrink-0 items-center justify-center border-[3px] border-edge bg-panel">
          {/* Offset phases so the icons don't bob in lockstep. */}
          <span className="animate-bob block" style={{ animationDelay: `${-(index % 4) * 0.3}s` }}>
            <PixelArt
              grid={iconForProject(project.slug)}
              palette={iconPalette}
              className="pixelated block size-8"
            />
          </span>
        </span>
      </header>

      <div
        className={cn(
          'flex flex-1 flex-col gap-7 p-5 sm:p-6',
          split && 'md:grid md:items-start md:gap-8',
          split &&
            (placement.flip
              ? 'md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]'
              : 'md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'),
        )}
      >
        <div
          className={cn('flex min-w-0 flex-1 flex-col', split && placement.flip && 'md:order-2')}
        >
          <h3
            id={titleId}
            className="font-pixel text-[22px] leading-tight font-bold break-words text-ink sm:text-[24px]"
          >
            {project.title}
          </h3>
          {meta ? (
            <p className="mt-2 font-hud text-[20px] leading-tight break-words text-muted">{meta}</p>
          ) : null}
          <p className="mt-3 max-w-[65ch] font-sans text-[16px] leading-relaxed break-words text-ink">
            {project.summary}
          </p>

          {stack.length > 0 ? (
            <div className="mt-5">
              <p
                id={`${titleId}-power`}
                className="font-pixel text-[14px] font-bold tracking-wide text-muted uppercase"
              >
                {t.levels.powerUps}
              </p>
              <ul aria-labelledby={`${titleId}-power`} className="mt-2 flex flex-wrap gap-2">
                {stack.map((item) => (
                  <li
                    key={item}
                    className={cn(
                      'max-w-full border-2 border-edge px-2 py-1 font-hud text-[19px] leading-none break-words text-ink',
                      tone.chip,
                    )}
                  >
                    <span aria-hidden="true">+ </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {project.liveUrl || project.repoUrl ? (
            <div className="mt-auto flex flex-wrap gap-4 pt-6">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.levels.live}: ${project.title} ${t.newTab}`}
                  onClick={() => play('start')}
                  className="pixel-btn h-10 bg-accent px-4 text-[15px] font-bold text-on-accent"
                >
                  <span aria-hidden="true">▶</span>
                  {t.levels.live}
                  <span aria-hidden="true">↗</span>
                </a>
              ) : null}
              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.levels.repo}: ${project.title} ${t.newTab}`}
                  onClick={() => play('blip')}
                  className="pixel-btn h-10 bg-panel-2 px-4 text-[15px] font-bold text-ink"
                >
                  <span aria-hidden="true">{'</>'}</span>
                  {t.levels.repo}
                  <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        {hasDemo ? (
          <div className="min-w-0">
            {project.demo === 'altimeter' ? (
              <AltimeterDemo labels={t.levels} className={tone.bar} />
            ) : (
              <SketchSlider labels={t.levels} className={tone.bar} />
            )}
          </div>
        ) : null}
      </div>
    </article>
  )
}
