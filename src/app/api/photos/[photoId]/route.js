import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sanitizeText } from '@/lib/sanitize'

export async function PUT(request, { params }) {
  try {
    const { caption, userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify ownership
    const photo = await prisma.photo.findUnique({
      where: { id: params.photoId },
      include: { album: true }
    })

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    if (photo.album.userId.toString() !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to edit this photo' },
        { status: 403 }
      )
    }

    // Validate and sanitize caption
    if (caption && caption.length > 200) {
      return NextResponse.json(
        { error: 'Caption too long (max 200 characters)' },
        { status: 400 }
      )
    }

    const sanitizedCaption = caption ? sanitizeText(caption) : null

    const updatedPhoto = await prisma.photo.update({
      where: { id: params.photoId },
      data: { caption: sanitizedCaption }
    })

    return NextResponse.json(updatedPhoto)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify ownership
    const photo = await prisma.photo.findUnique({
      where: { id: params.photoId },
      include: { album: true }
    })

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    if (photo.album.userId.toString() !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this photo' },
        { status: 403 }
      )
    }

    await prisma.photo.delete({
      where: { id: params.photoId }
    })

    return NextResponse.json({ message: 'Photo deleted' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
