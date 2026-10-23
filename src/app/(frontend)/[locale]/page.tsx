import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Achievements } from '@/components/game/Achievements'
import { GameProvider } from '@/components/game/GameProvider'
import { Hud } from '@/components/game/Hud'
import { Inventory } from '@/components/game/Inventory'
import { LevelSelect } from '@/components/game/LevelSelect'
import { ProfileSection } from '@/components/game/ProfileSection'
import { QuestLog } from '@/components/game/QuestLog'
import { Footer, SavePoint } from '@/components/game/SavePoint'
import { ScrollRunner } from '@/components/game/ScrollRunner'
import { TitleScreen } from '@/components/game/TitleScreen'
import { getContent } from '@/lib/content'
import { getDictionary, isLocale, locales } from '@/lib/i18n'
import { skillKey } from '@/lib/utils'

// Rendered on first request, then cached; Payload hooks revalidate on every edit.
export const revalidate = 3600

// One coin on the title screen plus one per section (SectionFrame).
const TOTAL_COINS = 7

const SIDE_QUEST_ORG = 'Kodland' // must match Experience.organization, otherwise the stat is hidden

type Params = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const { site } = await getContent(locale)
  return {
    title: site.title,
    description: site.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: { title: site.title, description: site.description, locale },
  }
}

export default async function HomePage({ params }: Params) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const content = await getContent(locale)
  const t = getDictionary(locale)
  const { profile, skills, experiences, projects, certifications } = content

  const currentGuild = experiences.find((e) => e.current)?.organization
  const sideQuest = experiences.find((e) => e.organization === SIDE_QUEST_ORG)
  const school = profile.education?.[0]
  const stats = [
    { label: t.profile.class, value: profile.role },
    { label: t.profile.guild, value: currentGuild ?? '' },
    { label: t.profile.home, value: profile.location ?? '' },
    {
      label: t.profile.training,
      value: school ? [school.program, school.school].filter(Boolean).join(', ') : '',
    },
    {
      label: t.profile.sideQuest,
      value: sideQuest ? `${sideQuest.role}, ${sideQuest.organization}` : '',
    },
  ].filter((s) => s.value)

  const groups = (skills.groups ?? []).map((g) => ({
    id: g.id ?? g.label,
    label: g.label,
    items: g.items ?? [],
  }))
  const ticker = [
    profile.availability ?? t.title.ticker,
    ...groups.flatMap((g) => g.items).slice(0, 8),
  ]

  // Where each skill is used, so the inventory can link to those cards.
  const usedIn: Record<string, { label: string; href: string }[]> = {}
  const addUse = (skill: string, label: string, href: string) => {
    const list = (usedIn[skillKey(skill)] ??= [])
    if (!list.some((u) => u.label === label)) list.push({ label, href })
  }
  projects.forEach((p) => (p.stack ?? []).forEach((s) => addUse(s, p.title, `#project-${p.slug}`)))
  experiences.forEach((e) =>
    (e.skills ?? []).forEach((s) => addUse(s, e.organization, `#quest-${e.id}`)),
  )

  return (
    <GameProvider t={t} totalCoins={TOTAL_COINS}>
      <a
        href="#start"
        className="sr-only z-50 bg-accent px-3 py-2 text-on-accent focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {t.skipToContent}
      </a>
      <Hud locale={locale} cvUrl={content.cvUrl} />
      <main>
        <TitleScreen
          name={profile.name}
          role={profile.role}
          intro={profile.intro}
          ticker={ticker}
        />
        <ProfileSection
          name={profile.name}
          paragraphs={(profile.about ?? []).map((p) => p.text)}
          stats={stats}
        />
        <QuestLog experiences={experiences} locale={locale} />
        <LevelSelect projects={projects} />
        <Inventory groups={groups} usedIn={usedIn} />
        <Achievements certifications={certifications} locale={locale} />
        <SavePoint
          availability={profile.availability ?? ''}
          email={profile.links.email}
          linkedin={profile.links.linkedin}
          github={profile.links.github}
          cvUrl={content.cvUrl}
        />
      </main>
      <Footer />
      <ScrollRunner />
    </GameProvider>
  )
}
