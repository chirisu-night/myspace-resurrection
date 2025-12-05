import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sanitizeText } from '@/lib/sanitize'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    let bulletins

    if (userId) {
      const friends = await prisma.friend.findMany({
        where: { userId },
        select: { friendId: true }
      })

      const friendIds = friends.map(f => f.friendId)
      friendIds.push(userId)

      bulletins = await prisma.bulletin.findMany({
        where: {
          authorId: { in: friendIds }
        },
        include: {
          author: {
            include: {
              profile: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 20
      })
    } else {
      bulletins = await prisma.bulletin.findMany({
        include: {
          author: {
            include: {
              profile: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 20
      })
    }

    return NextResponse.json(bulletins)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Rate limiting
    const { checkRateLimit } = await import('@/lib/rateLimit')
    const rateLimit = await checkRateLimit(request, 'write')
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': rateLimit.retryAfter.toString() } }
      )
    }
    
    const { title, content, authorId } = await request.json()

    if (!title || !content || !authorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate content length
    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Title too long (max 200 characters)' },
        { status: 400 }
      )
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Content too long (max 2000 characters)' },
        { status: 400 }
      )
    }

    // Sanitize bulletin content
    const sanitizedTitle = sanitizeText(title)
    const sanitizedContent = sanitizeText(content)

    const bulletin = await prisma.bulletin.create({
      data: {
        title: sanitizedTitle,
        content: sanitizedContent,
        authorId
      },
      include: {
        author: {
          include: {
            profile: true
          }
        }
      }
    })

    return NextResponse.json(bulletin)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const bulletinId = searchParams.get('bulletinId')
    const userId = searchParams.get('userId')

    if (!bulletinId || !userId) {
      return NextResponse.json(
        { error: 'bulletinId and userId required' },
        { status: 400 }
      )
    }

    const bulletin = await prisma.bulletin.findUnique({
      where: { id: bulletinId }
    })

    if (!bulletin) {
      return NextResponse.json({ error: 'Bulletin not found' }, { status: 404 })
    }

    if (bulletin.authorId !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this bulletin' },
        { status: 403 }
      )
    }

    await prisma.bulletin.delete({
      where: { id: bulletinId }
    })

    return NextResponse.json({ message: 'Bulletin deleted' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
