import type { LabelFunction } from 'payload'

// Resolves to a plain string because Payload puts some labels straight into aria-label text,
// where an { en, id } object would print "[object Object]".
export const bi =
  (en: string, id: string): LabelFunction =>
  ({ i18n }) =>
    i18n.language === 'id' ? id : en
