'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { useGame } from '@/components/game/GameProvider'
import { PixelArt } from '@/components/game/PixelArt'
import {
  coin,
  coinPalette,
  moon,
  pauseIcon,
  playIcon,
  speakerOff,
  speakerOn,
  sun,
} from '@/components/game/sprites'
import type { Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const sections = ['profile', 'quests', 'levels', 'inventory', 'achievements', 'save'] as const

// Endonyms, so they read the same in either locale.
const LANGUAGE_NAMES = { en: 'English', id: 'Bahasa Indonesia' } as const

// Lets `mounted` stay false on the server and during hydration without a setState effect.
const subscribeNever = () => () => {}

export function Hud({ locale, cvUrl }: { locale: Locale; cvUrl: string | null }) {
  const { t, coins, totalCoins, soundOn, toggleSound, motionPaused, toggleMotion, play } = useGame()
  const { resolvedTheme, setTheme } = useTheme()
  const router = useRouter()
  const mounted = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  )
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const isNight = mounted && resolvedTheme === 'dark'

  useEffect(() => {
    if (!menuOpen) return
    const startY = window.scrollY
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMenuOpen(false)
      burgerRef.current?.focus()
    }
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 48) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [menuOpen])

  // Switching language mid-page keeps the reader on the current section.
  const switchLocale = (event: React.MouseEvent<HTMLAnchorElement>, code: Locale) => {
    if (
      code === locale ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    const line = 68 + window.innerHeight * 0.25
    const current = [...sections].reverse().find((id) => {
      const el = document.getElementById(id)
      return el ? el.getBoundingClientRect().top <= line : false
    })
    if (!current) return // still on the title screen: normal navigation
    event.preventDefault()
    play('blip')
    router.push(`/${code}#${current}`)
  }

  const iconButton =
    'flex size-9 items-center justify-center bg-panel-2 text-ink pixel-box-flat hover:bg-coin/40 active:translate-y-0.5'

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b-4 border-edge bg-panel">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-2 px-3 sm:gap-3 sm:px-6">
        <Link href={`/${locale}`} className="flex items-center gap-2" onClick={() => play('blip')}>
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center bg-accent font-pixel text-[16px] font-bold text-on-accent pixel-box-flat"
          >
            K
          </span>
          {/* Visually hidden on phones but still the link's name. */}
          <span className="sr-only font-pixel text-[18px] font-bold sm:not-sr-only">
            kezhia.online
          </span>
        </Link>

        <nav aria-label={t.nav.sections} className="mx-auto hidden items-center gap-1 xl:flex">
          {sections.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => play('blip')}
              className="px-2 py-1 font-hud text-[21px] leading-none text-muted hover:bg-coin/40 hover:text-ink"
            >
              {t.nav[id]}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-2.5 xl:ml-0">
          <p
            className="flex h-9 items-center gap-1.5 bg-panel-2 px-2 font-hud text-[20px] leading-none pixel-box-flat"
            title={t.hud.coins}
          >
            <PixelArt grid={coin} palette={coinPalette} className="pixelated size-5" />
            <span className="sr-only">{t.hud.coins}:</span>
            <span className="tabular-nums">
              {coins.size}/{totalCoins}
            </span>
          </p>
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={t.hud.sound}
            title={soundOn ? t.hud.soundOn : t.hud.soundOff}
            className={iconButton}
          >
            <PixelArt
              grid={soundOn ? speakerOn : speakerOff}
              palette={{ i: 'var(--ink)' }}
              className="pixelated size-5"
            />
          </button>
          {/* Below 400px this button lives in the mobile menu. */}
          <button
            type="button"
            onClick={toggleMotion}
            aria-pressed={motionPaused}
            aria-label={t.hud.pause}
            title={motionPaused ? t.hud.resume : t.hud.pause}
            className={cn(iconButton, 'hidden min-[400px]:flex')}
          >
            <PixelArt
              grid={motionPaused ? playIcon : pauseIcon}
              palette={{ i: 'var(--ink)' }}
              className="pixelated size-5"
            />
          </button>
          <button
            type="button"
            onClick={() => {
              play('blip')
              setTheme(isNight ? 'light' : 'dark')
            }}
            aria-label={isNight ? t.hud.day : t.hud.night}
            className={iconButton}
          >
            <PixelArt
              grid={isNight ? sun : moon}
              palette={{ c: isNight ? 'var(--coin)' : 'var(--ink)' }}
              className="pixelated size-5"
            />
          </button>
          <nav
            aria-label={t.hud.language}
            className="flex h-9 items-center bg-panel-2 pixel-box-flat"
          >
            {/* Plain links: a full load avoids next-themes re-injecting its theme <script>.
                Mid-page, switchLocale takes over to keep the section. */}
            {(['en', 'id'] as const).map((code) => (
              <a
                key={code}
                href={`/${code}`}
                hrefLang={code}
                lang={code}
                onClick={(e) => switchLocale(e, code)}
                aria-current={code === locale ? 'true' : undefined}
                className={cn(
                  'flex h-9 items-center px-2 font-hud text-[20px] leading-none text-muted hover:text-ink',
                  code === locale && 'bg-accent text-on-accent hover:text-on-accent',
                )}
              >
                {code.toUpperCase()}
                <span className="sr-only"> {LANGUAGE_NAMES[code]}</span>
              </a>
            ))}
          </nav>
          {cvUrl ? (
            <a
              href={cvUrl}
              download
              className="pixel-btn hidden h-9 bg-coin px-3 text-[14px] font-bold text-[#24123d] md:inline-flex"
            >
              {t.hud.downloadCv}
            </a>
          ) : null}
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.nav.close : t.nav.menu}
            className="pixel-btn h-9 justify-center bg-panel-2 px-2.5 text-[14px] font-bold sm:px-3 xl:hidden"
          >
            {/* Pixel burger on phones so the HUD fits; wider screens show the word. */}
            <span aria-hidden="true" className="flex w-4 flex-col gap-[3px] sm:hidden">
              {menuOpen ? (
                <span className="text-center font-pixel text-[16px] leading-none">X</span>
              ) : (
                [0, 1, 2].map((i) => <span key={i} className="h-[3px] w-full bg-ink" />)
              )}
            </span>
            <span className="hidden sm:inline">{menuOpen ? t.nav.close : t.nav.menu}</span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-menu"
          aria-label={t.nav.sections}
          className="border-t-4 border-edge bg-panel xl:hidden"
        >
          <ul className="mx-auto grid max-w-[1200px] grid-cols-2 gap-1 p-3 sm:grid-cols-3">
            {sections.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => {
                    play('blip')
                    setMenuOpen(false)
                  }}
                  className="block px-3 py-2 font-hud text-[22px] hover:bg-coin/40"
                >
                  {t.nav[id]}
                </a>
              </li>
            ))}
            {cvUrl ? (
              <li className="col-span-full md:hidden">
                <a
                  href={cvUrl}
                  download
                  onClick={() => {
                    play('blip')
                    setMenuOpen(false)
                  }}
                  className="pixel-btn mt-1 h-11 w-full justify-center bg-coin text-[16px] font-bold text-[#24123d]"
                >
                  {t.hud.downloadCv}
                </a>
              </li>
            ) : null}
            <li className="col-span-full min-[400px]:hidden">
              <button
                type="button"
                onClick={() => toggleMotion()}
                className="block w-full px-3 py-2 text-left font-hud text-[22px] hover:bg-coin/40"
              >
                {motionPaused ? t.hud.resume : t.hud.pause}
              </button>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
