import type { CollectionConfig } from 'payload'

import { revalidateSite } from '@/lib/revalidate'
import { bi } from './bi'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  labels: {
    singular: bi('Experience', 'Pengalaman'),
    plural: bi('Experiences', 'Pengalaman'),
  },
  admin: {
    useAsTitle: 'role',
    group: { en: 'Portfolio', id: 'Portofolio' },
    description: {
      en: 'Jobs, internships and organisations. They show in the Quest log section, newest first.',
      id: 'Pekerjaan, magang, dan organisasi. Tampil di bagian Catatan quest, yang terbaru paling atas.',
    },
    defaultColumns: ['role', 'organization', 'startDate', 'location', 'current'],
    listSearchableFields: ['role', 'organization'],
    preview: (_doc, { locale }) => `/${locale || 'en'}#quests`,
  },
  defaultSort: '-startDate',
  hooks: {
    afterChange: [revalidateSite],
    afterDelete: [revalidateSite],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'role',
          type: 'text',
          required: true,
          localized: true,
          label: bi('Role', 'Posisi'),
          admin: {
            width: '50%',
            placeholder: { en: 'e.g. Web Developer Intern', id: 'Contoh: Web Developer Intern' },
          },
        },
        {
          name: 'organization',
          type: 'text',
          required: true,
          label: bi('Organisation', 'Organisasi'),
          admin: {
            width: '50%',
            placeholder: { en: 'e.g. Telkom University', id: 'Contoh: Telkom University' },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'employmentType',
          type: 'text',
          localized: true,
          label: bi('Type', 'Jenis'),
          admin: {
            width: '50%',
            placeholder: {
              en: 'Internship, Freelance, Part-time…',
              id: 'Magang, Freelance, Paruh waktu…',
            },
          },
        },
        {
          name: 'location',
          type: 'text',
          localized: true,
          label: bi('Location', 'Lokasi'),
          admin: {
            width: '50%',
            placeholder: { en: 'e.g. Bandung (on-site)', id: 'Contoh: Bandung (on-site)' },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          label: bi('Start', 'Mulai'),
          admin: {
            width: '50%',
            placeholder: { en: 'Pick a month', id: 'Pilih bulan' },
            date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: bi('End', 'Selesai'),
          admin: {
            width: '50%',
            placeholder: { en: 'Pick a month', id: 'Pilih bulan' },
            date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
            condition: (_, siblingData) => !siblingData?.current,
          },
        },
      ],
    },
    {
      name: 'highlights',
      type: 'array',
      localized: true,
      label: bi('Highlights', 'Poin utama'),
      labels: {
        singular: bi('Highlight', 'Poin'),
        plural: bi('Highlights', 'Poin'),
      },
      admin: {
        description: {
          en: 'What you did or achieved, one point per row. Start with a verb and add a number if you can.',
          id: 'Apa yang kamu kerjakan atau capai, satu poin per baris. Mulai dengan kata kerja, dan tambahkan angka kalau ada.',
        },
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          required: true,
          label: bi('Point', 'Poin'),
          admin: {
            rows: 2,
            placeholder: {
              en: 'e.g. Built a booking dashboard used by 40 lecturers',
              id: 'Contoh: Membuat dashboard booking yang dipakai 40 dosen',
            },
          },
        },
      ],
    },
    {
      name: 'skills',
      type: 'text',
      hasMany: true,
      label: bi('Skills used', 'Skill yang dipakai'),
      admin: {
        placeholder: { en: 'Type a skill, then press Enter', id: 'Ketik skill, lalu tekan Enter' },
        description: {
          en: 'Write them the same way as in Tech stack, so the Inventory can link back to this quest.',
          id: 'Tulis sama persis seperti di Tech stack, supaya Inventori bisa menautkan ke quest ini.',
        },
      },
    },
    {
      name: 'current',
      type: 'checkbox',
      label: bi('Current', 'Masih aktif'),
      admin: {
        position: 'sidebar',
        components: { Cell: '/components/admin/ListCells#CurrentCell' },
        description: {
          en: 'Tick this if you are still there. The quest shows as active and the end date is hidden.',
          id: 'Centang kalau kamu masih di sini. Quest tampil sebagai aktif dan tanggal selesai disembunyikan.',
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
        description: {
          en: 'Only matters when two entries start in the same month: the higher number shows first.',
          id: 'Hanya dipakai kalau ada dua entri yang mulai di bulan yang sama: angka lebih besar tampil duluan.',
        },
      },
    },
  ],
}
