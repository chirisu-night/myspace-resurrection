import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sanitizeText } from '@/lib/sanitize'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') || 'inbox'

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    let messages

    if (type === 'inbox') {
      messages = await prisma.message.findMany({
        where: { receiverId: userId },
        orderBy: { createdAt: 'desc' }
      })

      const messagesWithUsers = await Promise.all(
        messages.map(async (msg) => {
          const sender = await prisma.user.findUnique({
            where: { id: msg.senderId },
            include: { profile: true }
          })
          return {
            ...msg,
            senderUsername: sender.username,
            senderName: sender.profile?.name
          }
        })
      )

      return NextResponse.json(messagesWithUsers)
    } else {
      messages = await prisma.message.findMany({
        where: { senderId: userId },
        orderBy: { createdAt: 'desc' }
      })

      const messagesWithUsers = await Promise.all(
        messages.map(async (msg) => {
          const receiver = await prisma.user.findUnique({
            where: { id: msg.receiverId },
            include: { profile: true }
          })
          return {
            ...msg,
            receiverUsername: receiver.username,
            receiverName: receiver.profile?.name
          }
        })
      )

      return NextResponse.json(messagesWithUsers)
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Rate limiting for message sending
    const { checkRateLimit } = await import('@/lib/rateLimit')
    const rateLimit = await checkRateLimit(request, 'message')
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many messages sent. Please slow down.' },
        { status: 429, headers: { 'Retry-After': rateLimit.retryAfter.toString() } }
      )
    }

    // AUTHORIZATION: Verify user is sending on their own behalf
    const authenticatedUserId = request.headers.get('x-user-id')
    const { subject, content, senderId, receiverId } = await request.json()

    if (!authenticatedUserId || authenticatedUserId !== senderId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only send messages as yourself' },
        { status: 403 }
      )
    }

    if (!subject || !content || !senderId || !receiverId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate message length
    if (subject.length > 200) {
      return NextResponse.json(
        { error: 'Subject too long (max 200 characters)' },
        { status: 400 }
      )
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: 'Message too long (max 5000 characters)' },
        { status: 400 }
      )
    }

    // Prevent sending messages to yourself
    if (senderId === receiverId) {
      return NextResponse.json(
        { error: 'Cannot send message to yourself' },
        { status: 400 }
      )
    }

    const blocked = await prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: receiverId,
          blockedId: senderId
        }
      }
    })

    if (blocked) {
      return NextResponse.json(
        { error: 'You are blocked by this user' },
        { status: 403 }
      )
    }

    // Sanitize message content
    const sanitizedSubject = sanitizeText(subject)
    const sanitizedContent = sanitizeText(content)

    const message = await prisma.message.create({
      data: {
        subject: sanitizedSubject,
        content: sanitizedContent,
        senderId,
        receiverId
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
