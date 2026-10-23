import type { CollectionConfig } from 'payload'

import { revalidateSite } from '@/lib/revalidate'
import { bi } from './bi'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  labels: {
    singular: bi('Certification', 'Sertifikat'),
    plural: bi('Certifications', 'Sertifikat'),
  },
  admin: {
    useAsTitle: 'name',
    group: { en: 'Portfolio', id: 'Portofolio' },
    description: {
      en: 'Certificates and badges, shown as trophies in the Achievements section. Lower sort order numbers come first.',
      id: 'Sertifikat dan badge, tampil sebagai trofi di bagian Pencapaian. Angka urutan yang lebih kecil tampil duluan.',
    },
    defaultColumns: ['name', 'issuer', 'issuedAt', 'order'],
    listSearchableFields: ['name', 'issuer', 'credentialId'],
    preview: (_doc, { locale }) => `/${locale || 'en'}#achievements`,
  },
  defaultSort: 'order',
  hooks: {
    afterChange: [revalidateSite],
    afterDelete: [revalidateSite],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: bi('Certificate name', 'Nama sertifikat'),
      admin: {
        placeholder: { en: 'e.g. Junior Web Developer', id: 'Contoh: Junior Web Developer' },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'issuer',
          type: 'text',
          required: true,
          label: bi('Issued by', 'Diterbitkan oleh'),
          admin: {
            width: '50%',
            placeholder: {
              en: 'e.g. BNSP, Dicoding, Coursera',
              id: 'Contoh: BNSP, Dicoding, Coursera',
            },
          },
        },
        {
          name: 'issuedAt',
          type: 'date',
          label: bi('Issue date', 'Tanggal terbit'),
          admin: {
            width: '50%',
            placeholder: { en: 'Pick a month', id: 'Pilih bulan' },
            date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'credentialId',
          type: 'text',
          label: bi('Credential ID', 'ID kredensial'),
          admin: {
            width: '50%',
            placeholder: { en: 'Optional', id: 'Opsional' },
          },
        },
        {
          name: 'credentialUrl',
          type: 'text',
          label: bi('Credential link', 'Link kredensial'),
          admin: {
            width: '50%',
            placeholder: 'https://',
            description: {
              en: 'Where people can check the certificate is real.',
              id: 'Halaman tempat orang bisa mengecek keaslian sertifikat.',
            },
          },
        },
      ],
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
