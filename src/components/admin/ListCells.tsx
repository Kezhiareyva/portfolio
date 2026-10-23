import type { DefaultServerCellComponentProps } from 'payload'

function FlagCell({ cellData, label }: { cellData: unknown; label: string }) {
  if (cellData === true) return <span className="kz-cell-flag">{label}</span>
  return <span className="kz-cell-empty">–</span>
}

export function CurrentCell({ cellData, i18n }: DefaultServerCellComponentProps) {
  return <FlagCell cellData={cellData} label={i18n.language === 'id' ? 'Sekarang' : 'Now'} />
}

export function FeaturedCell({ cellData, i18n }: DefaultServerCellComponentProps) {
  return (
    <FlagCell cellData={cellData} label={i18n.language === 'id' ? '★ Unggulan' : '★ Featured'} />
  )
}
