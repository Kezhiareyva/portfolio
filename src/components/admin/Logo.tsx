import type { ServerProps } from 'payload'

import { BrandFonts, KBadge } from './Icon'

type LogoProps = Partial<Pick<ServerProps, 'i18n'>>

export function Logo({ i18n }: LogoProps) {
  const isId = i18n?.language === 'id'

  return (
    <div className="kz-brand kz-brand--logo">
      <BrandFonts />
      <KBadge className="kz-brand__badge" />
      <span className="kz-brand__text">
        <span className="kz-brand__word">
          kezhia<span className="kz-brand__tld">.online</span>
        </span>
        <span className="kz-brand__meta">
          <span className="kz-brand__tag">CMS</span>
          <span className="kz-brand__sub">{isId ? 'Ruang kendali' : 'Control room'}</span>
        </span>
      </span>
    </div>
  )
}
