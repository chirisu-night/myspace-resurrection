import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    
    const users = await prisma.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            name: true,
            profilePhoto: true,
            age: true,
            location: true,
          }
        }
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    const { handleError } = await import('@/lib/errorHandler')
    return NextResponse.json(handleError(error), { status: 500 })
  }
}
