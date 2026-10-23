import { revalidatePath } from 'next/cache'

import { locales } from '@/lib/i18n'

export function revalidateSite() {
  for (const locale of locales) {
    try {
      revalidatePath(`/${locale}`)
    } catch {
      // revalidatePath throws outside a Next.js request, e.g. when the seed script runs hooks.
    }
  }
}
