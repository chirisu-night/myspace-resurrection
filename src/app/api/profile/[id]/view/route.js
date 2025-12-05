import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request, { params }) {
  try {
    // Rate limiting to prevent view count manipulation
    const { checkRateLimit } = await import('@/lib/rateLimit')
    const rateLimit = await checkRateLimit(request, 'read')
    if (!rateLimit.allowed) {
      // Silently fail rate limit for view counts (don't show error to user)
      return NextResponse.json({ success: true })
    }

    await prisma.profile.update({
      where: { userId: params.id },
      data: {
        profileViews: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
