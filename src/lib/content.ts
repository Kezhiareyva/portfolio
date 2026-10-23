import config from '@payload-config'
import { getPayload } from 'payload'

import type { Locale } from '@/lib/i18n'
import type {
  Certification,
  Experience,
  Media,
  Profile,
  Project,
  Site,
  Skill,
} from '@/payload-types'

export type SiteContent = {
  profile: Profile
  skills: Skill
  site: Site
  experiences: Experience[]
  projects: Project[]
  certifications: Certification[]
  cvUrl: string | null
}

export async function getContent(locale: Locale): Promise<SiteContent> {
  const payload = await getPayload({ config })

  const [profile, skills, site, experiences, projects, certifications] = await Promise.all([
    payload.findGlobal({ slug: 'profile', locale, depth: 1 }),
    payload.findGlobal({ slug: 'skills', locale }),
    payload.findGlobal({ slug: 'site', locale }),
    payload.find({ collection: 'experiences', locale, sort: ['-startDate', '-order'], limit: 50 }),
    payload.find({ collection: 'projects', locale, sort: 'order', limit: 50, depth: 1 }),
    payload.find({ collection: 'certifications', locale, sort: 'order', limit: 50 }),
  ])

  const cv = profile.cv && typeof profile.cv === 'object' ? (profile.cv as Media) : null

  return {
    profile,
    skills,
    site,
    experiences: experiences.docs,
    projects: projects.docs,
    certifications: certifications.docs,
    cvUrl: cv?.url ?? null,
  }
}
