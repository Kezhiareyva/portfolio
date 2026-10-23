import type { GlobalConfig } from 'payload'

import { revalidateSite } from '@/lib/revalidate'
import { bi } from '../collections/bi'

export const Site: GlobalConfig = {
  slug: 'site',
  label: bi('Site & SEO', 'Situs & SEO'),
  admin: {
    group: { en: 'Page content', id: 'Isi halaman' },
    description: {
      en: 'The title and description people see in Google results, the browser tab and link previews (WhatsApp, LinkedIn).',
      id: 'Judul dan deskripsi yang muncul di hasil Google, tab browser, dan pratinjau link (WhatsApp, LinkedIn).',
    },
    preview: (_doc, { locale }) => `/${locale || 'en'}`,
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: bi('Page title', 'Judul halaman'),
      admin: {
        placeholder: { en: 'e.g. Kezhia · Web Developer', id: 'Contoh: Kezhia · Web Developer' },
        description: {
          en: 'Keep it under about 60 characters so Google does not cut it off.',
          id: 'Usahakan di bawah sekitar 60 karakter supaya tidak terpotong di Google.',
        },
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      label: bi('Page description', 'Deskripsi halaman'),
      admin: {
        rows: 3,
        description: {
          en: 'One or two sentences, around 150 characters.',
          id: 'Satu atau dua kalimat, sekitar 150 karakter.',
        },
      },
    },
  ],
}
