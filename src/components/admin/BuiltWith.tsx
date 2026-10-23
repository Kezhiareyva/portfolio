import type { CSSProperties } from 'react'
import type { ServerProps } from 'payload'

import { Pixelify_Sans } from 'next/font/google'

import { TechLogoMark, techLogos } from '@/components/TechLogos'

import './admin.scss'

const pixel = Pixelify_Sans({ subsets: ['latin'], variable: '--kz-font-pixel', display: 'swap' })

const copy = {
  en: {
    title: 'Built with',
    sub: 'The tools behind kezhia.online and this CMS.',
    newTab: '(opens in a new tab)',
  },
  id: {
    title: 'Dibangun dengan',
    sub: 'Tools di balik kezhia.online dan CMS ini.',
    newTab: '(buka di tab baru)',
  },
}

export function BuiltWith({ i18n }: ServerProps) {
  const t = copy[i18n.language === 'id' ? 'id' : 'en']

  return (
    <section className={`kz-dash kz-built ${pixel.variable}`} aria-labelledby="kz-built-title">
      <div>
        <h2 id="kz-built-title" className="kz-built__title">
          {t.title}
        </h2>
        <p className="kz-built__sub">{t.sub}</p>
      </div>
      <ul className="kz-built__list">
        {techLogos.map((logo) => (
          <li key={logo.name}>
            <a
              className="kz-built__link"
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              // Black marks would vanish on the dark hover chip.
              data-mono={logo.color.toLowerCase() === '#000000' || undefined}
              style={{ '--kz-brand': logo.color } as CSSProperties}
            >
              <TechLogoMark logo={logo} className="kz-built__logo" />
              {logo.name}
              <span className="kz-sr">{t.newTab}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
