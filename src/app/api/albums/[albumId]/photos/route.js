import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sanitizeText } from '@/lib/sanitize'

export async function POST(request, { params }) {
  try {
    // AUTHORIZATION: Verify user owns the album
    const authenticatedUserId = request.headers.get('x-user-id')
    const { url, caption } = await request.json()

    // Get album to verify ownership
    const album = await prisma.album.findUnique({
      where: { id: params.albumId }
    })

    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }

    if (!authenticatedUserId || authenticatedUserId !== album.userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only add photos to your own albums' },
        { status: 403 }
      )
    }

    if (!url) {
      return NextResponse.json(
        { error: 'Photo URL required' },
        { status: 400 }
      )
    }

    // Validate caption length
    if (caption && caption.length > 200) {
      return NextResponse.json(
        { error: 'Caption too long (max 200 characters)' },
        { status: 400 }
      )
    }

    // Sanitize caption
    const sanitizedCaption = caption ? sanitizeText(caption) : null

    const photo = await prisma.photo.create({
      data: {
        url,
        caption: sanitizedCaption,
        albumId: params.albumId
      }
    })

    return NextResponse.json(photo)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
