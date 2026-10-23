'use client'

import { animate, inView, steps, type AnimationPlaybackControls } from 'motion/react'
import { useEffect, useRef } from 'react'

import { useGame } from '@/components/game/GameProvider'
import { PixelArt, type Palette, type PixelGrid } from '@/components/game/PixelArt'
import { SectionFrame } from '@/components/game/SectionFrame'
import { coin, coinPalette } from '@/components/game/sprites'
import { prefersReducedMotion } from '@/components/game/useReducedMotion'
import type { Locale } from '@/lib/i18n'
import { cn, formatMonth, isoMonth } from '@/lib/utils'
import type { Experience } from '@/payload-types'

const questMark: PixelGrid = [
  'oooo',
  'occo',
  'occo',
  'occo',
  'occo',
  'oooo',
  '....',
  'oooo',
  'occo',
  'oooo',
]

const pin: PixelGrid = [
  '..oooooo..',
  '.oaaaaaao.',
  'oaaawwaaao',
  'oaawwwwaao',
  'oaawwwwaao',
  'oaaawwaaao',
  '.oaaaaaao.',
  '..oaaaao..',
  '...oaao...',
  '....oo....',
]

const flag: PixelGrid = [
  'oooooo...',
  'oaaaaaoo.',
  'oaaaaaaao',
  'oaaaaaaao',
  'oaaaaaoo.',
  'oooooo...',
  'o........',
  'o........',
  'o........',
  'o........',
  'o........',
  'ooo......',
]

const markPalette: Palette = { o: 'var(--edge)', c: 'var(--coin)' }
const pinPalette = (fill: string): Palette => ({ o: 'var(--edge)', a: fill, w: 'var(--panel)' })

const chipColors = [
  'bg-pop-pink',
  'bg-pop-blue',
  'bg-pop-yellow',
  'bg-pop-orange',
  'bg-pop-purple',
  'bg-pop-mint',
]

const trail =
  'bg-[repeating-linear-gradient(to_bottom,var(--edge)_0_6px,transparent_6px_12px,var(--pop-mint)_12px_18px,transparent_18px_24px)]'

const SLIDE = 40

function hide(el: HTMLElement, transform: string) {
  el.style.opacity = '0'
  el.style.transform = transform
}

// Runs after hydration and only for cards below the fold, so the server markup
// always shows everything and never mismatches.
function useQuestEntrance(side: 1 | -1) {
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion()) return
    if (root.getBoundingClientRect().top < window.innerHeight) return

    const card = root.querySelector<HTMLElement>('[data-quest="card"]')
    if (!card) return
    const pins = Array.from(root.querySelectorAll<HTMLElement>('[data-quest="pin"]'))
    const stamps = Array.from(root.querySelectorAll<HTMLElement>('[data-quest="stamp"]'))
    const rewards = Array.from(root.querySelectorAll<HTMLElement>('[data-quest="reward"]'))
    const all = [card, ...pins, ...stamps, ...rewards]

    hide(card, `translateX(${side * SLIDE}px)`)
    pins.forEach((el) => hide(el, 'scale(0)'))
    stamps.forEach((el) => hide(el, 'scale(2.4)'))
    rewards.forEach((el) => hide(el, 'translateY(8px)'))

    let revealed = false
    const running: AnimationPlaybackControls[] = []
    // Returning nothing makes inView fire once.
    const stop = inView(
      root,
      () => {
        revealed = true
        running.push(
          animate(
            card,
            { opacity: [0, 1], x: [side * SLIDE, 0] },
            { duration: 0.4, ease: steps(5) },
          ),
        )
        if (pins.length) {
          running.push(
            animate(
              pins,
              { opacity: [0, 1], scale: [0, 1.3, 1] },
              { duration: 0.3, delay: 0.15, ease: steps(2) },
            ),
          )
        }
        if (stamps.length) {
          running.push(
            animate(
              stamps,
              { opacity: [0, 1], scale: [2.4, 1] },
              { duration: 0.24, delay: 0.35, ease: steps(3) },
            ),
          )
        }
        if (rewards.length) {
          running.push(
            animate(
              rewards,
              { opacity: [0, 1], y: [8, 0] },
              { duration: 0.2, ease: steps(2), delay: (i: number) => 0.2 + Math.min(i, 4) * 0.05 },
            ),
          )
        }
      },
      { margin: '0px 0px -15% 0px' },
    )

    return () => {
      stop()
      // Never leave a card hidden or half-faded if the effect is torn down early.
      running.forEach((controls) => controls.complete())
      if (!revealed) {
        all.forEach((el) => {
          el.style.opacity = ''
          el.style.transform = ''
        })
      }
    }
  }, [side])

  return ref
}

function QuestCard({
  experience,
  index,
  last,
  locale,
}: {
  experience: Experience
  index: number
  last: boolean
  locale: Locale
}) {
  const { t } = useGame()
  const ref = useQuestEntrance(index % 2 === 0 ? -1 : 1)
  const active = Boolean(experience.current)
  const highlights = experience.highlights ?? []
  const skills = experience.skills ?? []
  const start = formatMonth(experience.startDate, locale)
  const end = active ? t.quests.present : formatMonth(experience.endDate, locale)
  const objectivesId = `quest-${experience.id}-objectives`
  const rewardsId = `quest-${experience.id}-rewards`

  return (
    <li
      ref={ref}
      id={`quest-${experience.id}`}
      className="group relative scroll-mt-4 md:pl-20 print:[&_[data-quest]]:!transform-none print:[&_[data-quest]]:!opacity-100"
    >
      <div aria-hidden="true" className="absolute top-1 left-0 hidden w-14 justify-center md:flex">
        <span className="block transition-[translate] duration-150 ease-[steps(2)] motion-safe:group-hover:-translate-y-1.5">
          <span data-quest="pin" className="block">
            <PixelArt
              grid={pin}
              palette={pinPalette(active ? 'var(--pop-mint)' : 'var(--pop-purple)')}
              className="pixelated block size-10"
            />
          </span>
        </span>
      </div>
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-[50px] left-[25px] hidden w-1.5 md:block',
          trail,
          last ? '-bottom-[14px]' : '-bottom-[46px]',
        )}
      />
      {last ? (
        <PixelArt
          grid={flag}
          palette={{ o: 'var(--edge)', a: 'var(--pop-pink)' }}
          className="pixelated absolute -bottom-[54px] left-[26px] hidden h-9 w-[27px] md:block"
        />
      ) : null}

      <div data-quest="card" className="pixel-box">
        <div
          className={cn(
            'flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b-4 border-edge px-3 py-2.5 sm:px-5',
            active ? 'bg-pop-mint' : 'bg-pop-purple',
          )}
        >
          {/* Repeated as sr-only text after the heading so it pairs with the right job. */}
          <p
            aria-hidden="true"
            className={cn(
              'inline-flex items-center gap-2 bg-edge px-2 py-1 font-pixel text-[14px] leading-none font-bold tracking-wide uppercase',
              active ? 'text-pop-mint' : 'text-pop-purple',
            )}
          >
            {active ? (
              <PixelArt
                grid={questMark}
                palette={markPalette}
                className="pixelated animate-bob h-5 w-2 shrink-0"
              />
            ) : (
              <span
                data-quest="stamp"
                aria-hidden="true"
                className="inline-flex size-5 shrink-0 -rotate-6 items-center justify-center bg-pop-purple font-sans text-[12px] text-on-pop"
              >
                ✔
              </span>
            )}
            {active ? t.quests.active : t.quests.done}
          </p>
          <p aria-hidden="true" className="font-hud text-[20px] leading-none text-on-pop">
            <time dateTime={isoMonth(experience.startDate)}>{start}</time>
            {end ? (
              <>
                {' – '}
                {active || !experience.endDate ? (
                  end
                ) : (
                  <time dateTime={isoMonth(experience.endDate)}>{end}</time>
                )}
              </>
            ) : null}
          </p>
        </div>

        <div
          className={cn(
            'grid gap-6 p-4 font-sans sm:p-5',
            skills.length > 0 &&
              'md:grid-cols-[minmax(0,1fr)_13rem] md:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] lg:gap-8',
          )}
        >
          <div className="min-w-0">
            <h3 className="font-pixel text-[clamp(1.3rem,2.6vw,1.65rem)] leading-tight font-bold break-words text-ink">
              {experience.role}
            </h3>
            <p className="sr-only">
              {active ? t.quests.active : t.quests.done}, {start}
              {end ? ` – ${end}` : ''}
            </p>
            <ul className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[16px] leading-snug text-muted">
              {experience.organization ? (
                <li className="min-w-0 break-words">
                  <span className="font-hud text-[20px] leading-none">{t.quests.giver}:</span>{' '}
                  <strong className="font-bold text-ink">{experience.organization}</strong>
                </li>
              ) : null}
              {experience.employmentType ? (
                <li className="bg-pop-yellow px-2 py-0.5 font-hud text-[19px] leading-none text-on-pop">
                  {experience.employmentType}
                </li>
              ) : null}
              {experience.location ? (
                <li className="inline-flex min-w-0 items-center gap-1.5">
                  <PixelArt
                    grid={pin}
                    palette={pinPalette('var(--pop-pink)')}
                    className="pixelated size-5 shrink-0"
                  />
                  <span className="min-w-0 break-words">{experience.location}</span>
                </li>
              ) : null}
            </ul>

            {highlights.length > 0 ? (
              <div className="mt-5">
                <p
                  id={objectivesId}
                  className="font-pixel text-[14px] font-bold tracking-wide text-muted uppercase"
                >
                  {t.quests.objectives}
                </p>
                <ul aria-labelledby={objectivesId} className="mt-3 space-y-2.5">
                  {highlights.map((item, i) => (
                    <li
                      key={item.id ?? i}
                      className="flex gap-3 text-[16px] leading-relaxed text-ink"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'mt-[3px] flex size-5 shrink-0 items-center justify-center border-2 border-edge font-sans text-[11px] leading-none text-on-pop',
                          active ? 'bg-pop-mint' : 'bg-pop-purple',
                        )}
                      >
                        {active ? '◆' : '✔'}
                      </span>
                      <span className="max-w-[68ch] min-w-0 break-words">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {skills.length > 0 ? (
            <div className="pixel-box-flat self-start bg-panel-2 p-3 sm:p-4">
              <p
                id={rewardsId}
                className="flex items-center gap-2 font-pixel text-[14px] font-bold tracking-wide text-muted uppercase"
              >
                <PixelArt grid={coin} palette={coinPalette} className="pixelated size-4 shrink-0" />
                {t.quests.rewards}
              </p>
              <ul aria-labelledby={rewardsId} className="mt-3 flex flex-wrap gap-2.5">
                {skills.map((skill, j) => (
                  <li
                    key={`${skill}-${j}`}
                    data-quest="reward"
                    className={cn(
                      'max-w-full border-2 border-edge px-2 py-1 font-hud text-[19px] leading-none break-words text-on-pop shadow-[2px_2px_0_0_var(--edge)]',
                      chipColors[(index + j) % chipColors.length],
                    )}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </li>
  )
}

export function QuestLog({ experiences, locale }: { experiences: Experience[]; locale: Locale }) {
  const { t } = useGame()
  const activeCount = experiences.filter((e) => e.current).length
  const doneCount = experiences.length - activeCount

  return (
    <SectionFrame
      id="quests"
      title={t.sections.quests.title}
      subtitle={t.sections.quests.subtitle}
      tone="band"
      className="overflow-x-clip"
    >
      {experiences.length > 0 ? (
        <>
          {/* Separate list items so screen readers don't run the two counts together. */}
          <ul className="mb-9 flex flex-wrap gap-4 md:pl-20">
            {activeCount > 0 ? (
              <li className="pixel-box-flat inline-flex items-center gap-2 bg-pop-mint px-2.5 py-1 font-hud text-[20px] leading-none text-on-pop">
                <span aria-hidden="true" className="font-sans text-[13px]">
                  ◆
                </span>
                {activeCount} {t.quests.active}
              </li>
            ) : null}
            {doneCount > 0 ? (
              <li className="pixel-box-flat inline-flex items-center gap-2 bg-pop-purple px-2.5 py-1 font-hud text-[20px] leading-none text-on-pop">
                <span aria-hidden="true" className="font-sans text-[13px]">
                  ✔
                </span>
                {doneCount} {t.quests.done}
              </li>
            ) : null}
          </ul>
          <ol className="space-y-8 md:space-y-12 md:pb-14">
            {experiences.map((experience, index) => (
              <QuestCard
                key={experience.id}
                experience={experience}
                index={index}
                last={index === experiences.length - 1}
                locale={locale}
              />
            ))}
          </ol>
        </>
      ) : null}
    </SectionFrame>
  )
}
