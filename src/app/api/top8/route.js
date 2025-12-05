import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const top8 = await prisma.top8.findMany({
      where: { userId },
      orderBy: { position: 'asc' }
    })

    const top8WithUsers = await Promise.all(
      top8.map(async (item) => {
        const user = await prisma.user.findUnique({
          where: { id: item.friendId },
          include: { profile: true }
        })
        return { ...item, friend: user }
      })
    )

    return NextResponse.json(top8WithUsers)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // AUTHORIZATION: Verify user is managing their own Top 8
    const authenticatedUserId = request.headers.get('x-user-id')
    const { userId, friendId, position } = await request.json()

    if (!authenticatedUserId || authenticatedUserId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only manage your own Top 8' },
        { status: 403 }
      )
    }

    // Validation
    if (!userId || !friendId || position === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate position (1-8)
    if (position < 1 || position > 8) {
      return NextResponse.json(
        { error: 'Position must be between 1 and 8' },
        { status: 400 }
      )
    }

    // Verify friendship exists
    const friendship = await prisma.friend.findUnique({
      where: {
        userId_friendId: {
          userId,
          friendId
        }
      }
    })

    if (!friendship) {
      return NextResponse.json(
        { error: 'Can only add friends to Top 8' },
        { status: 400 }
      )
    }

    await prisma.top8.deleteMany({
      where: { userId, position }
    })

    const top8 = await prisma.top8.create({
      data: {
        userId,
        friendId,
        position
      }
    })

    return NextResponse.json(top8)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    // AUTHORIZATION: Verify user is managing their own Top 8
    const authenticatedUserId = request.headers.get('x-user-id')
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const position = searchParams.get('position')

    if (!authenticatedUserId || authenticatedUserId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only manage your own Top 8' },
        { status: 403 }
      )
    }

    await prisma.top8.deleteMany({
      where: {
        userId,
        position: parseInt(position, 10)
      }
    })

    return NextResponse.json({ message: 'Removed from Top 8' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
