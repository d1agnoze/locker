import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'
import { AuthState } from './utils/supabase/auth_checker'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()

    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req, res })
    await supabase.auth.getSession()
    if (req.nextUrl.pathname.startsWith('/dashboard') && AuthState() == null) {
      req.nextUrl.searchParams.set('from', req.nextUrl.pathname.slice(1))
      req.nextUrl.pathname = '/login'
      return NextResponse.redirect(req.nextUrl)
    }
    if (req.nextUrl.pathname.startsWith('/api') && AuthState() == null) {
      return new Response('Unauthorized', { status: 401 })
    }
    return res
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: req.headers,
      },
    })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
