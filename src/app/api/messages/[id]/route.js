import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const message = await prisma.message.findUnique({
      where: { id: params.id }
    })

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Verify user is sender or receiver
    if (!userId || (message.senderId !== userId && message.receiverId !== userId)) {
      return NextResponse.json(
        { error: 'Not authorized to view this message' },
        { status: 403 }
      )
    }

    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({
        where: { id: message.senderId },
        include: { profile: true }
      }),
      prisma.user.findUnique({
        where: { id: message.receiverId },
        include: { profile: true }
      })
    ])

    return NextResponse.json({
      ...message,
      sender,
      receiver
    })
  } catch (error) {
    const { handleError } = await import('@/lib/errorHandler')
    return NextResponse.json(handleError(error), { status: 500 })
  }
}
