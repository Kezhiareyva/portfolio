import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { id } from '@payloadcms/translations/languages/id'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Certifications } from './collections/Certifications'
import { Experiences } from './collections/Experiences'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Users } from './collections/Users'
import { Profile } from './globals/Profile'
import { Site } from './globals/Site'
import { Skills } from './globals/Skills'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // Relative to importMap.baseDir (src). Run `npm run generate:importmap` after changing them.
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
      beforeLogin: ['/components/admin/BeforeLogin#BeforeLogin'],
      beforeDashboard: ['/components/admin/Welcome#Welcome'],
      afterDashboard: ['/components/admin/BuiltWith#BuiltWith'],
    },
    meta: {
      // Payload inserts the space before the suffix itself.
      titleSuffix: '· kezhia.online CMS',
      description:
        'Content manager for kezhia.online, the portfolio of Kezhia Reyva Cahya Erliyana.',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' }],
    },
  },
  // Admin UI language, picked per user in Account settings. Content locales are set below.
  i18n: {
    supportedLanguages: { en, id },
    fallbackLanguage: 'en',
  },
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Bahasa Indonesia', code: 'id' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  collections: [Experiences, Projects, Certifications, Media, Users],
  globals: [Profile, Skills, Site],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Dev pushes the schema directly; production builds it from these on startup.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [],
})
