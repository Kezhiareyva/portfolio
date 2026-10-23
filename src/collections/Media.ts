import path from 'path'
import type { CollectionConfig } from 'payload'

import { bi } from './bi'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: bi('Media file', 'File media'),
    plural: bi('Media', 'Media'),
  },
  admin: {
    group: { en: 'System', id: 'Sistem' },
    description: {
      en: 'Uploaded images and files, such as your CV (PDF). You can also upload straight from the Profile or Projects form.',
      id: 'Gambar dan file yang sudah diunggah, misalnya CV (PDF). Kamu juga bisa langsung unggah dari form Profil atau Proyek.',
    },
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: bi('Alt text', 'Teks alternatif'),
      admin: {
        placeholder: { en: 'e.g. Kezhia’s CV', id: 'Contoh: CV Kezhia' },
        description: {
          en: 'A few words describing the file, read out by screen readers.',
          id: 'Beberapa kata yang menjelaskan isi file, dibacakan oleh pembaca layar.',
        },
      },
    },
  ],
  upload: {
    // Kept outside .next so uploads survive rebuilds; mounted as a volume in Docker.
    staticDir: path.resolve(process.cwd(), 'media'),
  },
}
