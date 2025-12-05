import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request, { params }) {
  try {
    // AUTHORIZATION: Use authenticated userId from middleware
    const authenticatedUserId = request.headers.get('x-user-id')
    
    if (!authenticatedUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is the receiver
    const message = await prisma.message.findUnique({
      where: { id: params.id }
    })

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    if (message.receiverId !== authenticatedUserId) {
      return NextResponse.json(
        { error: 'Not authorized to mark this message as read' },
        { status: 403 }
      )
    }

    await prisma.message.update({
      where: { id: params.id },
      data: { read: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const { handleError } = await import('@/lib/errorHandler')
    return NextResponse.json(handleError(error), { status: 500 })
  }
}
