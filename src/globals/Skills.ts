import type { GlobalConfig } from 'payload'

import { revalidateSite } from '@/lib/revalidate'
import { bi } from '../collections/bi'

export const Skills: GlobalConfig = {
  slug: 'skills',
  label: bi('Tech stack', 'Tech stack'),
  admin: {
    group: { en: 'Page content', id: 'Isi halaman' },
    description: {
      en: 'Your skills in groups, shown as items in the Inventory section. The first few also scroll on the title screen.',
      id: 'Skill kamu per kelompok, tampil sebagai item di bagian Inventori. Beberapa yang pertama juga berjalan di layar judul.',
    },
    preview: (_doc, { locale }) => `/${locale || 'en'}#inventory`,
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    {
      name: 'groups',
      type: 'array',
      label: bi('Skill groups', 'Kelompok skill'),
      labels: {
        singular: bi('Group', 'Kelompok'),
        plural: bi('Groups', 'Kelompok'),
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          label: bi('Group name', 'Nama kelompok'),
          admin: { placeholder: { en: 'e.g. Frontend', id: 'Contoh: Frontend' } },
        },
        {
          name: 'items',
          type: 'text',
          hasMany: true,
          required: true,
          label: bi('Skills', 'Skill'),
          admin: {
            placeholder: {
              en: 'Type a skill, then press Enter',
              id: 'Ketik skill, lalu tekan Enter',
            },
            description: {
              en: 'Use the same spelling in Projects and Experiences, so each skill links to where you used it.',
              id: 'Pakai ejaan yang sama di Proyek dan Pengalaman, supaya tiap skill tertaut ke tempat kamu memakainya.',
            },
          },
        },
      ],
    },
  ],
}
