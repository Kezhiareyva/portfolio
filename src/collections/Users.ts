import type { CollectionConfig } from 'payload'

import { bi } from './bi'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: bi('Admin', 'Admin'),
    plural: bi('Admins', 'Admin'),
  },
  admin: {
    useAsTitle: 'email',
    group: { en: 'System', id: 'Sistem' },
    description: {
      en: 'People who can sign in to this CMS. Only add people you trust.',
      id: 'Orang yang bisa masuk ke CMS ini. Tambahkan hanya orang yang kamu percaya.',
    },
    defaultColumns: ['email', 'updatedAt'],
  },
  auth: true,
  fields: [
    // Email added by default
  ],
}
