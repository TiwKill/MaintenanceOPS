import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const { pathname } = request.nextUrl

  // Protected routes: require login
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // Redirect to login if no token found
      const loginUrl = new URL('/auth/login', request.url)
      // Optional: Store the original destination to redirect back after login
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Public/Auth routes: if logged in, redirect to dashboard
  if (pathname.startsWith('/auth')) {
    if (token) {
      // If user is already logged in, they shouldn't be on the login/register page
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/dashboard/:path*',
    '/auth/:path*',
  ],
}
