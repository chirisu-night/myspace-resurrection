import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const blockerId = searchParams.get('blockerId')
    const blockedId = searchParams.get('blockedId')

    if (blockerId && blockedId) {
      const block = await prisma.block.findUnique({
        where: {
          blockerId_blockedId: {
            blockerId,
            blockedId
          }
        }
      })

      return NextResponse.json({ isBlocked: !!block })
    }

    if (blockerId) {
      const blocks = await prisma.block.findMany({
        where: { blockerId }
      })

      const blockedUsers = await Promise.all(
        blocks.map(async (block) => {
          const user = await prisma.user.findUnique({
            where: { id: block.blockedId },
            include: { profile: true }
          })
          return { ...block, user }
        })
      )

      return NextResponse.json(blockedUsers)
    }

    return NextResponse.json({ error: 'blockerId required' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // AUTHORIZATION: Verify user is blocking on their own behalf
    const authenticatedUserId = request.headers.get('x-user-id')
    const { blockerId, blockedId } = await request.json()

    if (!authenticatedUserId || authenticatedUserId !== blockerId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only block users on your own behalf' },
        { status: 403 }
      )
    }

    if (!blockerId || !blockedId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Prevent blocking yourself
    if (blockerId === blockedId) {
      return NextResponse.json(
        { error: 'Cannot block yourself' },
        { status: 400 }
      )
    }

    // Verify both users exist
    const [blocker, blocked] = await Promise.all([
      prisma.user.findUnique({ where: { id: blockerId } }),
      prisma.user.findUnique({ where: { id: blockedId } })
    ])

    if (!blocker || !blocked) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const block = await prisma.block.create({
      data: {
        blockerId,
        blockedId
      }
    })

    return NextResponse.json(block)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    // AUTHORIZATION: Verify user is unblocking on their own behalf
    const authenticatedUserId = request.headers.get('x-user-id')
    const { searchParams } = new URL(request.url)
    const blockerId = searchParams.get('blockerId')
    const blockedId = searchParams.get('blockedId')

    if (!authenticatedUserId || authenticatedUserId !== blockerId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only unblock users on your own behalf' },
        { status: 403 }
      )
    }

    await prisma.block.delete({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId
        }
      }
    })

    return NextResponse.json({ message: 'User unblocked' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
