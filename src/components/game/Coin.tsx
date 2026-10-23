'use client'

import { useState } from 'react'

import { useGame } from '@/components/game/GameProvider'
import { PixelArt } from '@/components/game/PixelArt'
import { coin, coinPalette } from '@/components/game/sprites'
import { cn } from '@/lib/utils'

export function Coin({ id, className }: { id: string; className?: string }) {
  const { coins, totalCoins, collect, t } = useGame()
  const taken = coins.has(id)
  // A collected coin keeps keyboard focus until the user moves on, then leaves the tab order.
  const [settled, setSettled] = useState(false)

  return (
    <button
      type="button"
      onClick={(e) => {
        if (taken) return
        collect(id)
        if (e.detail > 0) setSettled(true)
      }}
      onBlur={() => {
        if (taken) setSettled(true)
      }}
      disabled={taken && settled}
      aria-disabled={taken || undefined}
      aria-label={taken ? `${t.coins.collected} (${coins.size}/${totalCoins})` : t.coins.collect}
      className={cn(
        'group relative inline-flex size-9 items-center justify-center aria-disabled:cursor-default',
        className,
      )}
    >
      {taken ? (
        <span
          className="animate-[coin-pop_600ms_steps(6)_forwards] font-hud text-[20px] text-coin-dark"
          aria-hidden="true"
        >
          +1
        </span>
      ) : (
        <PixelArt
          grid={coin}
          palette={coinPalette}
          className="pixelated animate-spin-y size-7 group-hover:scale-110"
        />
      )}
    </button>
  )
}
