'use client'

import { MotionConfig } from 'motion/react'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'

import { PixelArt } from '@/components/game/PixelArt'
import { coin, coinPalette, iconPalette, trophy } from '@/components/game/sprites'
import {
  isMotionPaused,
  MOTION_PAUSED_ATTR,
  prefersReducedMotion,
  subscribeMotionPaused,
} from '@/components/game/useReducedMotion'
import type { Dictionary } from '@/lib/i18n'
import { playSound, type SoundName } from '@/lib/sound'

type ToastKind = 'achievement' | 'coin' | 'info'
type Toast = { id: number; kind: ToastKind; title: string; body: string; announce?: boolean }

type GameState = {
  soundOn: boolean
  toggleSound: () => void
  play: (name: SoundName) => void
  coins: ReadonlySet<string>
  totalCoins: number
  collect: (id: string) => void
  toast: (toast: Omit<Toast, 'id'>) => void
  celebrate: () => void
  t: Dictionary
  motionPaused: boolean
  toggleMotion: () => void
  konamiStep: (key: string) => void
}

const GameContext = createContext<GameState | null>(null)

export const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
] as const
const SOUND_KEY = 'kezhia-sound'
const MOTION_KEY = 'kezhia-motion'
const TOAST_MS = 3500

export function GameProvider({
  children,
  t,
  totalCoins,
}: {
  children: React.ReactNode
  t: Dictionary
  totalCoins: number
}) {
  const [soundOn, setSoundOn] = useState(false)
  const [coins, setCoins] = useState<Set<string>>(() => new Set())
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)
  const soundRef = useRef(false)
  // Mirrors `coins` so collect() can decide synchronously, with side effects outside the updater.
  const coinsRef = useRef<Set<string>>(coins)
  const konamiBuffer = useRef<string[]>([])
  const motionPaused = useSyncExternalStore(subscribeMotionPaused, isMotionPaused, () => false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SOUND_KEY) === 'on'
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read the stored preference after hydration
      setSoundOn(saved)
      soundRef.current = saved
    } catch {
      // Storage can be unavailable (private mode); sound stays off.
    }
  }, [])

  // Layout effect so the attribute is set before any child's passive effect reads it.
  useLayoutEffect(() => {
    try {
      if (window.localStorage.getItem(MOTION_KEY) === 'paused')
        document.documentElement.setAttribute(MOTION_PAUSED_ATTR, '')
    } catch {}
  }, [])

  // Pauses ambient CSS loops in sections far off-screen (see [data-offscreen] in globals.css).
  // Parent effects run after children mount, so the sections are already in the DOM.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.target.toggleAttribute('data-offscreen', !e.isIntersecting)),
      { rootMargin: '200px 0px' },
    )
    document.querySelectorAll('main > section, main ~ footer').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // No sound before the first user gesture, so audio never wakes up on page load.
  const play = useCallback((name: SoundName) => {
    if (soundRef.current && navigator.userActivation?.hasBeenActive !== false) playSound(name)
  }, [])

  const toggleSound = useCallback(() => {
    const next = !soundRef.current
    soundRef.current = next
    setSoundOn(next)
    try {
      window.localStorage.setItem(SOUND_KEY, next ? 'on' : 'off')
    } catch {}
    if (next) playSound('blip')
  }, [])

  // Pauses ambient CSS loops and, through MotionConfig below, every motion transform.
  const toggleMotion = useCallback(() => {
    const next = !isMotionPaused()
    document.documentElement.toggleAttribute(MOTION_PAUSED_ATTR, next)
    try {
      window.localStorage.setItem(MOTION_KEY, next ? 'paused' : 'on')
    } catch {}
    play('blip')
  }, [play])

  const toast = useCallback((item: Omit<Toast, 'id'>) => {
    const id = nextId.current++
    setToasts((prev) => [...prev.slice(-1), { ...item, id }])
    window.setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), TOAST_MS)
  }, [])

  const celebrate = useCallback(() => {
    if (prefersReducedMotion() || isMotionPaused()) return
    // Loaded on the first celebration only, so it stays out of the initial bundle.
    void import('canvas-confetti').then(({ default: confetti }) => {
      const colors = ['#ffc531', '#ff5c8a', '#42e6b5', '#6ec3ff', '#ffffff']
      const burst = (x: number) =>
        confetti({
          particleCount: 70,
          spread: 75,
          startVelocity: 45,
          origin: { x, y: 0.7 },
          colors,
          shapes: ['square'],
          scalar: 1.1,
          zIndex: 60,
        })
      burst(0.2)
      burst(0.8)
    })
  }, [])

  const collect = useCallback(
    (id: string) => {
      if (coinsRef.current.has(id)) return
      const next = new Set(coinsRef.current).add(id)
      coinsRef.current = next
      setCoins(next)
      if (next.size === totalCoins) {
        window.setTimeout(() => {
          play('fanfare')
          celebrate()
          toast({ kind: 'coin', title: `${next.size}/${totalCoins}`, body: t.coins.allFound })
        }, 250)
      } else {
        play('coin')
      }
    },
    [celebrate, play, t.coins.allFound, toast, totalCoins],
  )

  // Rolling buffer of recent keys, fed by the keyboard and the footer tiles.
  const konamiStep = useCallback(
    (raw: string) => {
      const key = raw.length === 1 ? raw.toLowerCase() : raw
      const buffer = konamiBuffer.current
      buffer.push(key)
      if (buffer.length > KONAMI.length) buffer.shift()
      if (buffer.length === KONAMI.length && buffer.every((k, i) => k === KONAMI[i])) {
        buffer.length = 0
        play('fanfare')
        celebrate()
        toast({ kind: 'info', title: 'Konami', body: t.coins.cheat })
      }
    },
    [celebrate, play, t.coins.cheat, toast],
  )

  useEffect(() => {
    // Autofill can fire a keydown without a key.
    const onKey = (event: KeyboardEvent) => {
      if (typeof event.key === 'string') konamiStep(event.key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [konamiStep])

  const value = useMemo(
    () => ({
      soundOn,
      toggleSound,
      play,
      coins,
      totalCoins,
      collect,
      toast,
      celebrate,
      t,
      motionPaused,
      toggleMotion,
      konamiStep,
    }),
    [
      soundOn,
      toggleSound,
      play,
      coins,
      totalCoins,
      collect,
      toast,
      celebrate,
      t,
      motionPaused,
      toggleMotion,
      konamiStep,
    ],
  )

  return (
    <GameContext.Provider value={value}>
      {/* Reduced motion keeps fades but skips transforms; the HUD pause forces this for everyone. */}
      <MotionConfig reducedMotion={motionPaused ? 'always' : 'user'}>{children}</MotionConfig>
      <div
        aria-live="polite"
        className="pointer-events-none fixed top-20 right-3 z-50 flex w-[min(22rem,calc(100vw-1.5rem))] flex-col gap-4 max-sm:[&>*:not(:last-child)]:hidden sm:right-6"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            aria-hidden={item.announce === false ? true : undefined}
            className="pixel-box flex animate-[toast-in_300ms_steps(4)] motion-reduce:animate-none items-center gap-3 p-3"
          >
            <PixelArt
              grid={item.kind === 'achievement' ? trophy : coin}
              palette={item.kind === 'achievement' ? iconPalette : coinPalette}
              className="pixelated size-9 shrink-0"
            />
            <div className="min-w-0">
              <p className="font-hud text-[18px] leading-none text-accent">
                {item.kind === 'achievement' ? t.achievements.unlocked : item.title}
              </p>
              <p className="mt-1 text-[16px] leading-snug font-semibold text-ink">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>')
  return ctx
}
