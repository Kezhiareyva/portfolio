'use client'

import React from 'react'

import { Coin } from '@/components/game/Coin'
import { cn } from '@/lib/utils'

export function SectionFrame({
  id,
  title,
  subtitle,
  tone = 'sky',
  children,
  className,
}: {
  id: string
  title: string
  subtitle: string
  tone?: 'sky' | 'band'
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        // No scroll-mt here: html scroll-padding-top already equals the HUD height.
        'relative border-b-4 border-edge py-16 sm:py-20',
        tone === 'band' ? 'bg-panel-2' : 'bg-sky-3',
        className,
      )}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mb-10 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              id={`${id}-title`}
              className="text-3d-sm font-pixel text-[clamp(1.9rem,4.6vw,3.1rem)] leading-none font-bold text-ink"
            >
              {title}
            </h2>
            <p className="mt-3 inline-block bg-edge px-2 py-0.5 font-hud text-[21px] leading-tight text-coin">
              {subtitle}
            </p>
          </div>
          <Coin id={id} className="mt-1 shrink-0" />
        </div>
        {children}
      </div>
    </section>
  )
}
