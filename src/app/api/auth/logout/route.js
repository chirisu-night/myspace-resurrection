import { NextResponse } from 'next/server'

export async function POST(request) {
  const response = NextResponse.json({ message: 'Logged out successfully' })
  
  // Clear session cookie
  response.cookies.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })
  
  // Clear CSRF token
  response.cookies.set('csrf-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  })
  
  return response
}
