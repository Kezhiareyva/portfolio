import type { CollectionConfig } from 'payload'

import { revalidateSite } from '@/lib/revalidate'
import { bi } from './bi'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: bi('Project', 'Proyek'),
    plural: bi('Projects', 'Proyek'),
  },
  admin: {
    useAsTitle: 'title',
    group: { en: 'Portfolio', id: 'Portofolio' },
    description: {
      en: 'Your work, shown as levels in the Level select section. Lower sort order numbers come first.',
      id: 'Karya kamu, tampil sebagai level di bagian Pilih level. Angka urutan yang lebih kecil tampil duluan.',
    },
    defaultColumns: ['title', 'context', 'featured', 'order'],
    listSearchableFields: ['title', 'slug', 'context'],
    preview: (_doc, { locale }) => `/${locale || 'en'}#levels`,
  },
  defaultSort: 'order',
  hooks: {
    afterChange: [revalidateSite],
    afterDelete: [revalidateSite],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: bi('Project name', 'Nama proyek'),
      admin: { placeholder: { en: 'e.g. Altimeter Dashboard', id: 'Contoh: Dashboard Altimeter' } },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      localized: true,
      label: bi('Summary', 'Ringkasan'),
      admin: {
        rows: 4,
        placeholder: {
          en: 'What it is, what you did, and what came out of it.',
          id: 'Proyek apa, bagian kamu apa, dan hasilnya apa.',
        },
        description: { en: 'Two or three short sentences.', id: 'Dua atau tiga kalimat pendek.' },
      },
    },
    {
      name: 'context',
      type: 'text',
      label: bi('Built at / for', 'Dibuat di / untuk'),
      admin: {
        placeholder: {
          en: 'e.g. RA-ATAP or Telkom University',
          id: 'Contoh: RA-ATAP atau Telkom University',
        },
        description: {
          en: 'Shown next to the year on the level card.',
          id: 'Tampil di samping tahun pada kartu level.',
        },
      },
    },
    {
      name: 'stack',
      type: 'text',
      hasMany: true,
      label: bi('Tech used', 'Teknologi yang dipakai'),
      admin: {
        placeholder: {
          en: 'Type a tool, then press Enter',
          id: 'Ketik nama tool, lalu tekan Enter',
        },
        description: {
          en: 'Write them the same way as in Tech stack, so the Inventory can link to this project.',
          id: 'Tulis sama persis seperti di Tech stack, supaya Inventori bisa menautkan ke proyek ini.',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'liveUrl',
          type: 'text',
          label: bi('Live site link', 'Link situs live'),
          admin: { width: '50%', placeholder: 'https://' },
        },
        {
          name: 'repoUrl',
          type: 'text',
          label: bi('Source code link', 'Link source code'),
          admin: { width: '50%', placeholder: 'https://github.com/…' },
        },
      ],
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: bi('Cover image', 'Gambar sampul'),
      admin: {
        description: {
          en: 'Optional. Not shown on the site at the moment.',
          id: 'Opsional. Untuk saat ini belum tampil di situs.',
        },
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: bi('Slug', 'Slug'),
      admin: {
        position: 'sidebar',
        placeholder: 'altimeter-dashboard',
        description: {
          en: 'Short unique ID for the project link: lowercase, words joined with dashes.',
          id: 'ID unik pendek untuk link proyek: huruf kecil, kata dipisah tanda hubung.',
        },
      },
    },
    {
      name: 'year',
      type: 'text',
      label: bi('Year', 'Tahun'),
      admin: {
        position: 'sidebar',
        placeholder: { en: 'e.g. 2025 or 2023–2026', id: 'Contoh: 2025 atau 2023–2026' },
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: bi('Featured project', 'Proyek unggulan'),
      admin: {
        position: 'sidebar',
        components: { Cell: '/components/admin/ListCells#FeaturedCell' },
        description: {
          en: 'Featured projects get a wide frame.',
          id: 'Proyek unggulan tampil dengan bingkai lebar.',
        },
      },
    },
    {
      name: 'demo',
      type: 'select',
      defaultValue: 'none',
      label: bi('Interactive demo', 'Demo interaktif'),
      options: [
        { label: { en: 'None', id: 'Tidak ada' }, value: 'none' },
        { label: { en: 'Live altimeter chart', id: 'Grafik altimeter live' }, value: 'altimeter' },
        { label: { en: 'Sketch to screen slider', id: 'Slider sketsa ke layar' }, value: 'sketch' },
      ],
      admin: {
        position: 'sidebar',
        description: {
          en: 'A small playable preview inside the project frame.',
          id: 'Pratinjau kecil yang bisa dicoba di dalam bingkai proyek.',
        },
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: bi('Sort order', 'Urutan'),
      admin: {
        position: 'sidebar',
        step: 1,
        description: { en: 'Lower numbers show first.', id: 'Angka lebih kecil tampil duluan.' },
      },
    },
  ],
}
