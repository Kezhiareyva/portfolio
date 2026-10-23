import { Nunito, Pixelify_Sans, VT323 } from 'next/font/google'
import { notFound } from 'next/navigation'
import { ThemeProvider } from 'next-themes'
import React from 'react'

import { isLocale } from '@/lib/i18n'
import '../globals.css'

const pixel = Pixelify_Sans({ subsets: ['latin'], variable: '--font-pixelify', display: 'swap' })
const hud = VT323({ subsets: ['latin'], weight: '400', variable: '--font-vt323', display: 'swap' })
const sans = Nunito({ subsets: ['latin'], variable: '--font-nunito', display: 'swap' })

// Without JS the motion entrances never run and the typed dialog stays empty, so show everything.
const noScriptCss =
  '[style*="opacity:0"]{opacity:1!important;transform:none!important}' +
  '[data-nojs-hide]{display:none!important}' +
  '[data-nojs-show]{position:static!important;width:auto!important;height:auto!important;margin:0!important;' +
  'overflow:visible!important;clip-path:none!important;white-space:normal!important;display:grid!important;' +
  'gap:1rem;padding:1.5rem!important}'

export default async function LocaleLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  if (!isLocale(locale)) notFound()

  return (
    // data-scroll-behavior lets Next skip smooth scrolling on route changes (EN/ID switch).
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${pixel.variable} ${hud.variable} ${sans.variable}`}
    >
      <head>
        <noscript dangerouslySetInnerHTML={{ __html: `<style>${noScriptCss}</style>` }} />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {props.children}
        </ThemeProvider>
      </body>
    </html>
  )
}
