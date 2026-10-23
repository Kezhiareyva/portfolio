import type { ServerProps } from 'payload'
import type { ReactNode } from 'react'

import { Link } from '@payloadcms/ui'
import { Pixelify_Sans, VT323 } from 'next/font/google'
import { formatAdminURL } from 'payload/shared'

import './admin.scss'

const pixel = Pixelify_Sans({ subsets: ['latin'], variable: '--kz-font-pixel', display: 'swap' })
const hud = VT323({ subsets: ['latin'], weight: '400', variable: '--kz-font-hud', display: 'swap' })

type Lang = 'en' | 'id'
type Bilingual = Record<Lang, string>

// 12x12 bitmaps, '#' is a filled pixel.
const bitmaps = {
  profile: [
    '....####....',
    '...######...',
    '...######...',
    '...######...',
    '....####....',
    '............',
    '..########..',
    '.##########.',
    '.##########.',
    '.##########.',
    '.##########.',
    '............',
  ],
  quest: [
    '............',
    '....####....',
    '...#....#...',
    '############',
    '############',
    '############',
    '#....##....#',
    '############',
    '############',
    '############',
    '############',
    '............',
  ],
  level: [
    '............',
    '............',
    '.##########.',
    '############',
    '##.######.##',
    '#...####.#.#',
    '##.######.##',
    '############',
    '####....####',
    '.##......##.',
    '............',
    '............',
  ],
  star: [
    '.....##.....',
    '.....##.....',
    '....####....',
    '############',
    '.##########.',
    '..########..',
    '...######...',
    '...######...',
    '..###..###..',
    '..##....##..',
    '.##......##.',
    '............',
  ],
  chest: [
    '............',
    '..########..',
    '.##########.',
    '############',
    '#..........#',
    '#####..#####',
    '#####..#####',
    '############',
    '############',
    '############',
    '............',
    '............',
  ],
  window: [
    '............',
    '############',
    '#.#.########',
    '############',
    '#..........#',
    '#..........#',
    '#..........#',
    '#..........#',
    '#..........#',
    '#..........#',
    '############',
    '............',
  ],
} satisfies Record<string, string[]>

type IconName = keyof typeof bitmaps

// Each horizontal run of filled pixels becomes one rectangle in a single path.
function bitmapPath(rows: string[]) {
  let d = ''
  rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      if (row[x] !== '#') {
        x++
        continue
      }
      let w = 1
      while (row[x + w] === '#') w++
      d += `M${x} ${y}h${w}v1h-${w}z`
      x += w
    }
  })
  return d
}

const iconPaths = Object.fromEntries(
  Object.entries(bitmaps).map(([name, rows]) => [name, bitmapPath(rows)]),
) as Record<IconName, string>

function PixelIcon({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className="kz-pixel-icon"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
      fill="currentColor"
    >
      <path d={iconPaths[name]} />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="kz-external-icon"
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
    >
      <path d="M4 1h7v7H9V4.4l-6.3 6.3-1.4-1.4L7.6 3H4z" />
    </svg>
  )
}

const collections: {
  slug: 'experiences' | 'projects' | 'certifications'
  icon: IconName
  label: Bilingual
  section: Bilingual
}[] = [
  {
    slug: 'experiences',
    icon: 'quest',
    label: { en: 'Experiences', id: 'Pengalaman' },
    section: { en: 'Quest log', id: 'Catatan quest' },
  },
  {
    slug: 'projects',
    icon: 'level',
    label: { en: 'Projects', id: 'Proyek' },
    section: { en: 'Level select', id: 'Pilih level' },
  },
  {
    slug: 'certifications',
    icon: 'star',
    label: { en: 'Certifications', id: 'Sertifikat' },
    section: { en: 'Achievements', id: 'Pencapaian' },
  },
]

const actions: {
  path: `/${string}`
  icon: IconName
  kind: 'edit' | 'new'
  title: Bilingual
  desc: Bilingual
}[] = [
  {
    path: '/globals/profile',
    icon: 'profile',
    kind: 'edit',
    title: { en: 'Edit profile', id: 'Ubah profil' },
    desc: {
      en: 'Name, intro, about, education, links and CV',
      id: 'Nama, intro, tentang, pendidikan, tautan, dan CV',
    },
  },
  {
    path: '/collections/experiences/create',
    icon: 'quest',
    kind: 'new',
    title: { en: 'Add experience', id: 'Tambah pengalaman' },
    desc: {
      en: 'A job, internship or organisation for the Quest log',
      id: 'Kerja, magang, atau organisasi untuk Catatan quest',
    },
  },
  {
    path: '/collections/projects/create',
    icon: 'level',
    kind: 'new',
    title: { en: 'Add project', id: 'Tambah proyek' },
    desc: { en: 'A new level in Level select', id: 'Level baru di Pilih level' },
  },
  {
    path: '/collections/certifications/create',
    icon: 'star',
    kind: 'new',
    title: { en: 'Add certificate', id: 'Tambah sertifikat' },
    desc: { en: 'A new badge in Achievements', id: 'Badge baru di Pencapaian' },
  },
  {
    path: '/globals/skills',
    icon: 'chest',
    kind: 'edit',
    title: { en: 'Tech stack', id: 'Tech stack' },
    desc: { en: 'Skills and tools in the Inventory', id: 'Skill dan tools di Inventori' },
  },
  {
    path: '/globals/site',
    icon: 'window',
    kind: 'edit',
    title: { en: 'Site & SEO', id: 'Situs & SEO' },
    desc: {
      en: 'Site title and the description search engines show',
      id: 'Judul situs dan deskripsi yang muncul di Google',
    },
  },
]

const en = {
  kicker: 'Control room',
  hi: 'Hi',
  hiAnon: 'Hi there!',
  lead: 'Everything on kezhia.online is edited here. Pick a shortcut below, or use the menu on the left.',
  viewSite: 'Open the live site',
  newTab: '(opens in a new tab)',
  statsLabel: 'Content on the site',
  updated: (ago: string) => `updated ${ago}`,
  empty: 'nothing yet',
  failed: 'could not load',
  quickTitle: 'Quick actions',
  verb: { edit: 'EDIT', new: 'NEW' },
  tipsTitle: 'Good to know',
  tipLocale: (locale: string) => (
    <>
      Every text has an English and an Indonesian version. Switch the <strong>{locale}</strong> menu
      at the top of the screen, then fill in that language.
    </>
  ),
  tipLive: (save: string) => (
    <>
      Pressing <strong>{save}</strong> updates the live site right away. There is no separate
      publish step.
    </>
  ),
  tipCvMissing: <>No CV yet. Upload it as a PDF in Profile so the Download CV button works.</>,
  tipCvReady: <>Your CV is uploaded. To replace it, upload a new PDF in Profile.</>,
  openProfile: 'Open Profile',
}

const id: typeof en = {
  kicker: 'Ruang kendali',
  hi: 'Halo',
  hiAnon: 'Halo!',
  lead: 'Semua isi kezhia.online diubah di sini. Pilih jalan pintas di bawah, atau pakai menu di sebelah kiri.',
  viewSite: 'Buka situsnya',
  newTab: '(buka di tab baru)',
  statsLabel: 'Isi situs',
  updated: (ago: string) => `diubah ${ago}`,
  empty: 'belum ada',
  failed: 'gagal dimuat',
  quickTitle: 'Jalan pintas',
  verb: { edit: 'UBAH', new: 'BARU' },
  tipsTitle: 'Perlu diketahui',
  tipLocale: (locale: string) => (
    <>
      Setiap teks punya versi Inggris dan Indonesia. Ganti menu <strong>{locale}</strong> di bagian
      atas layar, lalu isi teks untuk bahasa itu.
    </>
  ),
  tipLive: (save: string) => (
    <>
      Begitu kamu klik <strong>{save}</strong>, situs langsung ikut berubah. Tidak perlu publish
      lagi.
    </>
  ),
  tipCvMissing: <>CV belum ada. Unggah CV (PDF) di Profil supaya tombol Download CV berfungsi.</>,
  tipCvReady: <>CV kamu sudah diunggah. Kalau mau ganti, unggah PDF yang baru di Profil.</>,
  openProfile: 'Buka Profil',
}

const copy: Record<Lang, typeof en> = { en, id }

function timeAgo(iso: string, lang: Lang) {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit)
  }
  return lang === 'id' ? 'barusan' : 'just now'
}

export async function Welcome({ i18n, payload, user }: ServerProps) {
  const lang: Lang = i18n.language === 'id' ? 'id' : 'en'
  const t = copy[lang]
  const adminRoute = payload.config.routes.admin
  const href = (path: `/${string}`) => formatAdminURL({ adminRoute, path, relative: true })

  const stats = await Promise.all(
    collections.map(async (c) => {
      try {
        // find() is paginated, so totalDocs already gives the count.
        const latest = await payload.find({
          collection: c.slug,
          sort: '-updatedAt',
          limit: 1,
          depth: 0,
        })
        return {
          ...c,
          total: latest.totalDocs as number | null,
          updatedAt: latest.docs[0]?.updatedAt ?? null,
        }
      } catch {
        return { ...c, total: null, updatedAt: null }
      }
    }),
  )

  const profile = await payload.findGlobal({ slug: 'profile', depth: 0 }).catch(() => null)
  const firstName = profile?.name?.trim().split(/\s+/)[0] || user?.email?.split('@')[0] || undefined
  const hasCv = Boolean(profile?.cv)

  return (
    <section
      className={`kz-dash kz-welcome ${pixel.variable} ${hud.variable}`}
      aria-labelledby="kz-welcome-title"
    >
      <div className="kz-hero">
        <span className="kz-hero__tag" aria-hidden="true">
          KEZHIA.EXE
        </span>
        <div className="kz-hero__main">
          <p className="kz-hero__kicker">
            <span aria-hidden="true">&gt; </span>
            {t.kicker}
            <span className="kz-hero__cursor" aria-hidden="true">
              _
            </span>
          </p>
          <h1 id="kz-welcome-title" className="kz-hero__title">
            {firstName ? (
              <>
                {t.hi}, <span className="kz-hero__name">{firstName}</span>!
              </>
            ) : (
              t.hiAnon
            )}
          </h1>
          <p className="kz-hero__lead">{t.lead}</p>
          <div className="kz-hero__site">
            <span className="kz-hero__site-label">{t.viewSite}</span>
            <div className="kz-hero__site-links">
              {[
                { path: '/id', code: 'ID', label: 'Bahasa Indonesia' },
                { path: '/en', code: 'EN', label: 'English' },
              ].map((site) => (
                <a
                  key={site.path}
                  className="kz-btn"
                  href={site.path}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="kz-btn__code">{site.code}</span>
                  {site.label}
                  <ExternalIcon />
                  <span className="kz-sr">{t.newTab}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <ul className="kz-stats" aria-label={t.statsLabel}>
          {stats.map((s) => (
            <li key={s.slug}>
              <Link className="kz-stat" href={href(`/collections/${s.slug}`)}>
                <span className="kz-stat__icon">
                  <PixelIcon name={s.icon} />
                </span>
                <span className="kz-stat__text">
                  <span className="kz-stat__label">{s.label[lang]}</span>
                  <span className="kz-stat__meta">
                    {s.section[lang]} ·{' '}
                    {s.total === null
                      ? t.failed
                      : s.total === 0 || !s.updatedAt
                        ? t.empty
                        : t.updated(timeAgo(s.updatedAt, lang))}
                  </span>
                </span>
                <span className="kz-stat__num">{s.total ?? '–'}</span>
              </Link>
            </li>
          ))}
        </ul>
        <span className="kz-hero__caret" aria-hidden="true" />
      </div>

      <div className="kz-section">
        <h2 className="kz-section__title">{t.quickTitle}</h2>
        <ul className="kz-actions">
          {actions.map((a) => (
            <li key={a.path}>
              <Link className="kz-action" href={href(a.path)}>
                <span className="kz-action__icon">
                  <PixelIcon name={a.icon} />
                </span>
                <span className="kz-action__body">
                  <span className="kz-action__title">{a.title[lang]}</span>
                  <span className="kz-action__desc">{a.desc[lang]}</span>
                </span>
                <span className={`kz-action__verb kz-action__verb--${a.kind}`} aria-hidden="true">
                  {t.verb[a.kind]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="kz-section">
        <h2 className="kz-section__title">{t.tipsTitle}</h2>
        <ol className="kz-tips">
          <Tip num="1">{t.tipLocale(i18n.t('general:locale'))}</Tip>
          <Tip num="2">{t.tipLive(i18n.t('general:save'))}</Tip>
          <Tip num={hasCv ? '3' : '!'} warn={!hasCv}>
            {hasCv ? t.tipCvReady : t.tipCvMissing}{' '}
            <Link className="kz-tip__link" href={href('/globals/profile')}>
              {t.openProfile}
            </Link>
          </Tip>
        </ol>
      </div>
    </section>
  )
}

function Tip({ num, warn, children }: { num: string; warn?: boolean; children: ReactNode }) {
  return (
    <li className={`kz-tip${warn ? ' kz-tip--warn' : ''}`}>
      <span className="kz-tip__num" aria-hidden="true">
        {num}
      </span>
      <p className="kz-tip__text">{children}</p>
    </li>
  )
}
