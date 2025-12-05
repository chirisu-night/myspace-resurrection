import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const type = searchParams.get('type') || 'name'

    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 })
    }

    // Sanitize query to prevent injection
    const sanitizedQuery = query.trim().substring(0, 100)
    
    if (sanitizedQuery.length < 2) {
      return NextResponse.json({ error: 'Query too short (min 2 characters)' }, { status: 400 })
    }

    let users

    // Use database-level filtering instead of loading all users
    if (type === 'name') {
      users = await prisma.user.findMany({
        where: {
          profile: {
            name: {
              contains: sanitizedQuery,
              mode: 'insensitive'
            }
          }
        },
        include: {
          profile: true
        },
        take: 50
      })
    } else if (type === 'location') {
      users = await prisma.user.findMany({
        where: {
          OR: [
            {
              profile: {
                location: {
                  contains: sanitizedQuery,
                  mode: 'insensitive'
                }
              }
            },
            {
              profile: {
                hometown: {
                  contains: sanitizedQuery,
                  mode: 'insensitive'
                }
              }
            }
          ]
        },
        include: {
          profile: true
        },
        take: 50
      })
    } else if (type === 'username') {
      users = await prisma.user.findMany({
        where: {
          username: {
            contains: sanitizedQuery,
            mode: 'insensitive'
          }
        },
        include: {
          profile: true
        },
        take: 50
      })
    }

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
