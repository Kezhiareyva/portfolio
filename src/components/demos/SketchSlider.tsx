'use client'

import { motion, steps } from 'motion/react'
import React, { useId, useRef, useState } from 'react'

import { useReducedMotion } from '@/components/game/useReducedMotion'
import { cn } from '@/lib/utils'

type Labels = { sketch: string; screen: string; compare: string; illustration: string }

const orders = [
  { id: 'LND-1042', customer: 'Rina', status: 'Ready', tone: 'bg-pop-mint' },
  { id: 'LND-1043', customer: 'Dimas', status: 'Washing', tone: 'bg-pop-blue' },
  { id: 'LND-1044', customer: 'Sari', status: 'Received', tone: 'bg-pop-yellow' },
]

const stats = [
  { label: 'Today', value: '12', tone: 'bg-pop-pink' },
  { label: 'Active', value: '5', tone: 'bg-pop-blue' },
  { label: 'Ready', value: '3', tone: 'bg-pop-mint' },
]

const PAPER = {
  backgroundImage:
    'linear-gradient(color-mix(in srgb, var(--pop-blue) 16%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--pop-blue) 16%, transparent) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const thumb =
  '[&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:cursor-ew-resize [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-edge [&::-webkit-slider-thumb]:bg-coin ' +
  '[&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:cursor-ew-resize [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-edge [&::-moz-range-thumb]:bg-coin ' +
  '[&::-moz-range-track]:bg-transparent'

// The picture drags with the pointer; the range input is the accessible control.
export function SketchSlider({ labels, className }: { labels: Labels; className?: string }) {
  const [reveal, setReveal] = useState(55)
  const id = useId()
  const reduce = useReducedMotion()
  const areaRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const moveTo = (clientX: number) => {
    const el = areaRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const percent = ((clientX - rect.left) / rect.width) * 100
    setReveal(Math.round(Math.min(100, Math.max(0, percent))))
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    // Touch only drags from the grip so the picture never traps page scrolling.
    const onGrip = event.target instanceof Element && event.target.closest('[data-grip]')
    if (event.pointerType === 'touch' && !onGrip) return
    dragging.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    moveTo(event.clientX)
  }

  const stopDragging = () => {
    dragging.current = false
  }

  return (
    <figure className={cn('pixel-box-flat bg-pop-pink p-3', className)}>
      {/* w-full keeps min-h from widening the box through the aspect ratio. */}
      <div
        ref={areaRef}
        onPointerDown={onPointerDown}
        onPointerMove={(event) => dragging.current && moveTo(event.clientX)}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        className="relative aspect-[16/11] min-h-56 w-full cursor-ew-resize touch-pan-y overflow-hidden border-[3px] border-edge bg-panel select-none"
      >
        <Sketch label={labels.sketch} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${reveal}%)` }}>
          <Screen label={labels.screen} />
        </div>

        <div
          aria-hidden="true"
          data-grip=""
          className="absolute inset-y-0 w-14 -translate-x-1/2 touch-none"
          style={{ left: `${reveal}%` }}
        >
          <span className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-edge" />
          {/* One-time wiggle hinting that the grip drags. */}
          <motion.span
            className="absolute top-1/2 left-1/2 -mt-6 -ml-3.5 flex h-12 w-7 flex-col items-center justify-center gap-[3px] border-[3px] border-edge bg-coin"
            whileInView={reduce ? undefined : { x: [0, -8, 8, -4, 0] }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: 0.3, ease: steps(8) }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-[3px] w-3 bg-[#24123d]" />
            ))}
          </motion.span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span aria-hidden="true" className="font-pixel text-[14px] font-bold text-on-pop">
          {labels.sketch}
        </span>
        <label htmlFor={id} className="sr-only">
          {labels.compare}
        </label>
        {/* The accent focus ring is hard to see on the pink bezel in dark mode. */}
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={reveal}
          onChange={(event) => setReveal(Number(event.target.value))}
          aria-valuetext={`${labels.sketch} ${reveal}%, ${labels.screen} ${100 - reveal}%`}
          className={cn(
            'h-4 min-w-0 flex-1 cursor-ew-resize appearance-none border-[3px] border-edge focus-visible:outline-edge',
            thumb,
          )}
          style={{
            background: `linear-gradient(to right, var(--edge) 0 ${reveal}%, var(--panel) ${reveal}% 100%)`,
          }}
        />
        <span aria-hidden="true" className="font-pixel text-[14px] font-bold text-on-pop">
          {labels.screen}
        </span>
      </div>
      <figcaption className="mt-2.5 font-sans text-[16px] leading-snug font-semibold text-on-pop">
        {labels.illustration}
      </figcaption>
    </figure>
  )
}

function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'shrink-0 border-2 border-edge px-1.5 py-0.5 font-pixel text-[12px] leading-none font-bold uppercase',
        className,
      )}
    >
      {children}
    </span>
  )
}

function Sketch({ label }: { label: string }) {
  const dash = 'border-2 border-dashed border-muted/70'
  return (
    <div
      className="absolute inset-0 flex flex-col gap-2 p-3 sm:gap-3 sm:p-4"
      style={PAPER}
      aria-hidden="true"
    >
      <div className="flex items-center gap-2">
        <Tag className="bg-panel text-ink">{label}</Tag>
        <div className={cn('h-5 w-2/5', dash)} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn('h-10 sm:h-12', dash)} />
        ))}
      </div>
      <div className={cn('flex-1 space-y-2.5 p-2.5', dash)}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-2.5 w-full border-b-2 border-dashed border-muted/60" />
        ))}
      </div>
      <p className="font-hud text-[18px] leading-none text-muted">order list + status?</p>
    </div>
  )
}

function Screen({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col gap-2 bg-panel-2 p-3 sm:gap-3 sm:p-4"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate font-pixel text-[15px] leading-none font-bold text-ink">
          Laundry orders
        </p>
        <Tag className="bg-edge text-coin">{label}</Tag>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              'min-w-0 border-2 border-edge px-2 py-1 text-on-pop sm:py-1.5',
              stat.tone,
            )}
          >
            <p className="truncate font-hud text-[18px] leading-none">{stat.label}</p>
            <p className="font-pixel text-[18px] leading-tight font-bold sm:text-[20px]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col justify-around border-2 border-edge bg-panel">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center gap-2 px-2 font-hud text-[18px] leading-none"
          >
            <span className="text-muted">{order.id}</span>
            <span className="min-w-0 flex-1 truncate text-ink">{order.customer}</span>
            <span className={cn('border-2 border-edge px-1.5 py-0.5 text-on-pop', order.tone)}>
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
