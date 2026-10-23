'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

// Set on <html> by the HUD pause button.
export const MOTION_PAUSED_ATTR = 'data-motion-paused'

export function prefersReducedMotion() {
  return window.matchMedia(QUERY).matches
}

export function isMotionPaused() {
  return document.documentElement.hasAttribute(MOTION_PAUSED_ATTR)
}

export function subscribeMotionPaused(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [MOTION_PAUSED_ATTR],
  })
  return () => observer.disconnect()
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', onChange)
  const unsubscribePaused = subscribeMotionPaused(onChange)
  return () => {
    media.removeEventListener('change', onChange)
    unsubscribePaused()
  }
}

/**
 * True for OS reduced motion or the HUD pause. Unlike motion's useReducedMotion it is false on
 * the server and during hydration, so the first client render matches the server HTML.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => prefersReducedMotion() || isMotionPaused(),
    () => false,
  )
}
