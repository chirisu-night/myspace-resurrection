import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export async function middleware(request) {
  const token = request.cookies.get('session')?.value

  // Protected API routes
  const protectedPaths = [
    '/api/profile',
    '/api/friends',
    '/api/top8',
    '/api/albums',
    '/api/photos',
    '/api/messages',
    '/api/bulletins',
    '/api/comments',
    '/api/blocks'
  ]

  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && request.method !== 'GET') {
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No session' },
        { status: 401 }
      )
    }

    try {
      const verified = await jwtVerify(token, secret)
      
      // Add userId to request headers for API routes to use
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', verified.payload.userId)
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (err) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid session' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
