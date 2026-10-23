import type { GlobalConfig } from 'payload'

import { revalidateSite } from '@/lib/revalidate'
import { bi } from '../collections/bi'

export const Profile: GlobalConfig = {
  slug: 'profile',
  label: bi('Profile', 'Profil'),
  admin: {
    group: { en: 'Page content', id: 'Isi halaman' },
    description: {
      en: 'Your name, intro, about text, education, contact links and CV.',
      id: 'Nama, intro, cerita tentang kamu, pendidikan, link kontak, dan CV.',
    },
    preview: (_doc, { locale }) => `/${locale || 'en'}#profile`,
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    // Unnamed tabs are layout only, so the stored data keeps its flat shape.
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Basics', id: 'Info dasar' },
          admin: {
            description: {
              en: 'The title screen at the very top of the site.',
              id: 'Layar judul di bagian paling atas situs.',
            },
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: bi('Full name', 'Nama lengkap'),
                  admin: { width: '50%' },
                },
                {
                  name: 'role',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: bi('Role', 'Peran'),
                  admin: {
                    width: '50%',
                    placeholder: {
                      en: 'e.g. Web Developer & UI/UX Designer',
                      id: 'Contoh: Web Developer & UI/UX Designer',
                    },
                  },
                },
              ],
            },
            {
              name: 'intro',
              type: 'textarea',
              required: true,
              localized: true,
              label: bi('Short intro', 'Intro singkat'),
              admin: {
                rows: 3,
                description: {
                  en: 'One or two sentences under your name.',
                  id: 'Satu atau dua kalimat di bawah nama kamu.',
                },
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'location',
                  type: 'text',
                  localized: true,
                  label: bi('Location', 'Lokasi'),
                  admin: {
                    width: '50%',
                    placeholder: {
                      en: 'e.g. Bandung, Indonesia',
                      id: 'Contoh: Bandung, Indonesia',
                    },
                    description: {
                      en: 'Shown in your player stats.',
                      id: 'Tampil di statistik pemain.',
                    },
                  },
                },
                {
                  name: 'availability',
                  type: 'text',
                  localized: true,
                  label: bi('Availability', 'Status ketersediaan'),
                  admin: {
                    width: '50%',
                    placeholder: {
                      en: 'e.g. Open to web developer and UI/UX roles',
                      id: 'Contoh: Terbuka untuk posisi web developer dan UI/UX',
                    },
                    description: {
                      en: 'Scrolls in the title-screen ticker and shows in the Save point.',
                      id: 'Muncul di teks berjalan layar judul dan di Save point.',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'About', id: 'Tentang' },
          admin: {
            description: {
              en: 'The Player profile section shows these paragraphs one at a time, like a game dialogue.',
              id: 'Bagian Profil pemain menampilkan paragraf ini satu per satu, seperti dialog di game.',
            },
          },
          fields: [
            {
              name: 'about',
              type: 'array',
              localized: true,
              label: bi('About me', 'Tentang saya'),
              labels: {
                singular: bi('Paragraph', 'Paragraf'),
                plural: bi('Paragraphs', 'Paragraf'),
              },
              fields: [
                {
                  name: 'text',
                  type: 'textarea',
                  required: true,
                  label: bi('Paragraph', 'Paragraf'),
                  admin: {
                    rows: 4,
                    placeholder: {
                      en: 'Keep it short: two to four sentences per paragraph.',
                      id: 'Singkat saja: dua sampai empat kalimat per paragraf.',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Education', id: 'Pendidikan' },
          admin: {
            description: {
              en: 'Put your main school first: that is the one shown in your player stats.',
              id: 'Taruh kampus atau sekolah utama paling atas: itu yang tampil di statistik pemain.',
            },
          },
          fields: [
            {
              name: 'education',
              type: 'array',
              label: bi('Education', 'Pendidikan'),
              labels: {
                singular: bi('School', 'Sekolah'),
                plural: bi('Education', 'Pendidikan'),
              },
              fields: [
                {
                  name: 'school',
                  type: 'text',
                  required: true,
                  label: bi('School / university', 'Sekolah / kampus'),
                  admin: {
                    placeholder: { en: 'e.g. Telkom University', id: 'Contoh: Telkom University' },
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'program',
                      type: 'text',
                      localized: true,
                      label: bi('Program / major', 'Program studi'),
                      admin: {
                        width: '50%',
                        placeholder: {
                          en: 'e.g. D3 Computer Technology',
                          id: 'Contoh: D3 Teknologi Komputer',
                        },
                      },
                    },
                    {
                      name: 'period',
                      type: 'text',
                      label: bi('Period', 'Periode'),
                      admin: {
                        width: '50%',
                        placeholder: { en: 'e.g. 2023–2026', id: 'Contoh: 2023–2026' },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Links & CV', id: 'Link & CV' },
          admin: {
            description: {
              en: 'Contact buttons in the Save point section and the Download CV buttons.',
              id: 'Tombol kontak di bagian Save point dan tombol Download CV.',
            },
          },
          fields: [
            {
              name: 'links',
              type: 'group',
              label: bi('Contact links', 'Link kontak'),
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                  label: bi('Email', 'Email'),
                  admin: { placeholder: { en: 'name@example.com', id: 'nama@contoh.com' } },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'linkedin',
                      type: 'text',
                      label: bi('LinkedIn link', 'Link LinkedIn'),
                      admin: { width: '50%', placeholder: 'https://www.linkedin.com/in/…' },
                    },
                    {
                      name: 'github',
                      type: 'text',
                      label: bi('GitHub link', 'Link GitHub'),
                      admin: { width: '50%', placeholder: 'https://github.com/…' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'cv',
              type: 'upload',
              relationTo: 'media',
              label: bi('CV (PDF)', 'CV (PDF)'),
              admin: {
                description: {
                  en: 'Upload a PDF. Visitors download it from the menu and the Save point.',
                  id: 'Unggah file PDF. Pengunjung bisa mengunduhnya dari menu dan Save point.',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
