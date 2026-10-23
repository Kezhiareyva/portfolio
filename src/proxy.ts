import { NextResponse, type NextRequest } from 'next/server'

import { defaultLocale } from '@/lib/i18n'

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])

// In dev, keep /admin and the API local-only so a tunnel or LAN link can't reach them.
function isRemoteDevRequest(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') return false
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? ''
  return !LOCAL_HOSTS.has(host.replace(/:\d+$/, '').toLowerCase())
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname !== '/') {
    // Uploaded files such as the CV stay reachable.
    if (isRemoteDevRequest(request) && !pathname.startsWith('/api/media/file/')) {
      return new NextResponse('Not found', { status: 404 })
    }
    return NextResponse.next()
  }

  const accept = request.headers.get('accept-language') ?? ''
  const prefersIndonesian = /(^|,)\s*(id|in)(-|;|,|$)/i.test(accept)
  const locale = prefersIndonesian ? 'id' : defaultLocale
  return NextResponse.redirect(new URL(`/${locale}`, request.url))
}

export const config = {
  matcher: ['/', '/admin/:path*', '/api/:path*'],
}
