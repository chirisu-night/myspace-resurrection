import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { username, email, password, name } = await request.json()

    // Input validation
    if (!username || !email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: 'Username must be between 3 and 20 characters' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      )
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        lastLogin: new Date(),
        profile: {
          create: {
            name,
            bio: 'New to MySpace!',
            customHTML: '<h2>Welcome to my profile!</h2>',
            customCSS: '',
          }
        }
      },
      include: { profile: true }
    })

    // Create secure session token
    const { createSession } = await import('@/lib/session')
    const token = await createSession(user.id.toString())
    
    const response = NextResponse.json({ 
      message: 'User created!',
      userId: user.id 
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
