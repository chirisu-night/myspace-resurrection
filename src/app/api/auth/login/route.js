import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { RateLimiterMemory } from 'rate-limiter-flexible'

// Rate limiter: 5 attempts per 15 minutes per IP
const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 15 * 60, // 15 minutes
})

export async function POST(request) {
  try {
    // Get IP address for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Check rate limit
    try {
      await rateLimiter.consume(ip)
    } catch (rateLimiterRes) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const { username, password } = await request.json()

    const user = await prisma.user.findUnique({
      where: { username },
      include: { profile: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Compare hashed password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    // Create secure session token
    const { createSession, setSessionCookie } = await import('@/lib/session')
    const token = await createSession(user.id.toString())
    
    const response = NextResponse.json({ 
      message: 'Login successful',
      userId: user.id,
      username: user.username
    })
    
    // Set httpOnly cookie
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })
    
    return response
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
