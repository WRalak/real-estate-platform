// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Redirect unauthenticated users to login
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    // Role-based access control
    if (pathname.startsWith('/dashboard/admin')) {
      if (token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard/user', req.url))
      }
    }

    if (pathname.startsWith('/dashboard/agent')) {
      if (!['AGENT', 'ADMIN'].includes(token.role)) {
        return NextResponse.redirect(new URL('/dashboard/user', req.url))
      }
    }

    if (pathname.startsWith('/dashboard/landlord')) {
      if (!['LANDLORD', 'ADMIN'].includes(token.role)) {
        return NextResponse.redirect(new URL('/dashboard/user', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/protected/:path*',
  ]
}