import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sanitizeText } from '@/lib/sanitize'

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
    
    const { content, authorId, profileId } = await request.json()

    if (!content || !authorId || !profileId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate content length
    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment too long (max 1000 characters)' },
        { status: 400 }
      )
    }

    // Sanitize comment content
    const sanitizedContent = sanitizeText(content)

    const comment = await prisma.comment.create({
      data: {
        content: sanitizedContent,
        authorId,
        profileId,
      },
      include: {
        author: {
          include: {
            profile: true
          }
        }
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profileId')

    if (!profileId) {
      return NextResponse.json(
        { error: 'profileId required' },
        { status: 400 }
      )
    }

    const comments = await prisma.comment.findMany({
      where: { profileId },
      include: {
        author: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(comments)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('commentId')
    const userId = searchParams.get('userId')

    if (!commentId || !userId) {
      return NextResponse.json(
        { error: 'commentId and userId required' },
        { status: 400 }
      )
    }

    // Get the comment to check permissions
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Allow deletion if user is the author OR the profile owner
    if (comment.authorId !== userId && comment.profileId !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this comment' },
        { status: 403 }
      )
    }

    await prisma.comment.delete({
      where: { id: commentId }
    })

    return NextResponse.json({ message: 'Comment deleted' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
