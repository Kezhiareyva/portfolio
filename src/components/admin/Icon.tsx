import type { ServerProps } from 'payload'

import { Nunito, Pixelify_Sans } from 'next/font/google'

// Exposed as CSS variables for custom.scss.
const body = Nunito({ subsets: ['latin'], display: 'swap' })
const pixel = Pixelify_Sans({ subsets: ['latin'], display: 'swap' })

const fontVars = `:root{--kz-font-body:${body.style.fontFamily};--kz-font-pixel:${pixel.style.fontFamily}}`

// React hoists this into <head> and dedupes it, so it can render in several places.
export function BrandFonts() {
  return (
    <style href="kz-admin-fonts" precedence="default">
      {fontVars}
    </style>
  )
}

type BadgeColors = { edge: string; fill: string; glyph: string; shadow: string }

// Set per light/dark theme in custom.scss.
const themed: BadgeColors = {
  edge: 'var(--kz-edge, #24123d)',
  fill: 'var(--kz-accent, #b4234f)',
  glyph: 'var(--kz-on-accent, #fffdf7)',
  shadow: 'var(--kz-shadow, #24123d)',
}

// 13x13 grid: 12px framed tile, 1px hard shadow, 6x6 "K" centred in the inner 10x10.
const K_PATH = 'M3 3h2v6H3zM7 3h2v1H7zM6 4h2v1H6zM5 5h2v2H5zM6 7h2v1H6zM7 8h2v1H7z'

export function KBadge({
  className,
  colors = themed,
  size,
}: {
  className?: string
  colors?: BadgeColors
  size?: number
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      height={size}
      shapeRendering="crispEdges"
      viewBox="0 0 13 13"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill={colors.shadow} height="12" width="12" x="1" y="1" />
      <rect fill={colors.edge} height="12" width="12" x="0" y="0" />
      <rect fill={colors.fill} height="10" width="10" x="1" y="1" />
      <path d={K_PATH} fill={colors.glyph} />
    </svg>
  )
}

type IconProps = Partial<Pick<ServerProps, 'i18n'>> & {
  /** Only passed by Payload's Open Graph image route, which renders with inline styles. */
  fill?: string
}

export function Icon({ fill, i18n }: IconProps) {
  if (fill) {
    return (
      <KBadge
        colors={{ edge: '#05030f', fill: '#ff5c8a', glyph: '#1a0b24', shadow: '#05030f' }}
        size={38}
      />
    )
  }

  return (
    <span className="kz-brand kz-brand--icon">
      <BrandFonts />
      <KBadge className="kz-brand__badge" />
      {/* Not aria-hidden: the visible wordmark has to be part of the link name. */}
      <span className="kz-brand__text">
        <span className="kz-brand__word">
          kezhia<span className="kz-brand__tld">.online</span>
        </span>{' '}
        <span className="kz-brand__tag">CMS</span>
        <span className="sr-only"> · </span>
      </span>
      <span className="sr-only">{i18n ? i18n.t('general:dashboard') : 'Dashboard'}</span>
    </span>
  )
}
