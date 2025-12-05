import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sanitizeText } from '@/lib/sanitize'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const albums = await prisma.album.findMany({
      where: { userId },
      include: {
        photos: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(albums)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // AUTHORIZATION: Verify user is creating album for themselves
    const authenticatedUserId = request.headers.get('x-user-id')
    const { title, description, userId } = await request.json()

    if (!authenticatedUserId || authenticatedUserId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only create albums for yourself' },
        { status: 403 }
      )
    }

    if (!title || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate length
    if (title.length > 100) {
      return NextResponse.json(
        { error: 'Title too long (max 100 characters)' },
        { status: 400 }
      )
    }

    if (description && description.length > 500) {
      return NextResponse.json(
        { error: 'Description too long (max 500 characters)' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeText(title)
    const sanitizedDescription = description ? sanitizeText(description) : null

    const album = await prisma.album.create({
      data: {
        title: sanitizedTitle,
        description: sanitizedDescription,
        userId
      }
    })

    return NextResponse.json(album)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
