import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const friends = await prisma.friend.findMany({
      where: { userId },
      include: {
        friend: {
          include: {
            profile: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(friends)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // AUTHORIZATION: Verify user is adding themselves as friend
    const authenticatedUserId = request.headers.get('x-user-id')
    const { userId, friendId } = await request.json()

    if (!authenticatedUserId || authenticatedUserId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only add friends to your own account' },
        { status: 403 }
      )
    }

    // Validation
    if (!userId || !friendId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Prevent adding yourself as friend
    if (userId === friendId) {
      return NextResponse.json(
        { error: 'Cannot add yourself as friend' },
        { status: 400 }
      )
    }

    // Verify both users exist
    const [user, friendUser] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.user.findUnique({ where: { id: friendId } })
    ])

    if (!user || !friendUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const existing = await prisma.friend.findUnique({
      where: {
        userId_friendId: {
          userId,
          friendId
        }
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Already friends' }, { status: 400 })
    }

    const newFriend = await prisma.friend.create({
      data: {
        userId,
        friendId
      },
      include: {
        friend: {
          include: {
            profile: true
          }
        }
      }
    })

    return NextResponse.json(newFriend)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    // AUTHORIZATION: Verify user is removing from their own friends
    const authenticatedUserId = request.headers.get('x-user-id')
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const friendId = searchParams.get('friendId')

    if (!authenticatedUserId || authenticatedUserId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only remove your own friends' },
        { status: 403 }
      )
    }

    await prisma.friend.deleteMany({
      where: {
        userId,
        friendId
      }
    })

    return NextResponse.json({ message: 'Friend removed' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
