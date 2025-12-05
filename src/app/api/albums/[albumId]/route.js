import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const album = await prisma.album.findUnique({
      where: { id: params.albumId },
      include: {
        photos: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }

    return NextResponse.json(album)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    // AUTHORIZATION: Verify user owns this album
    const authenticatedUserId = request.headers.get('x-user-id')
    const { title, description } = await request.json()

    // Get album to verify ownership
    const album = await prisma.album.findUnique({
      where: { id: params.albumId }
    })

    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }

    if (!authenticatedUserId || authenticatedUserId !== album.userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only edit your own albums' },
        { status: 403 }
      )
    }

    // Basic validation
    if (title && title.length > 100) {
      return NextResponse.json(
        { error: 'Title too long (max 100 characters)' },
        { status: 400 }
      )
    }

    const updatedAlbum = await prisma.album.update({
      where: { id: params.albumId },
      data: {
        title,
        description
      }
    })

    return NextResponse.json(updatedAlbum)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    // AUTHORIZATION: Verify user owns this album
    const authenticatedUserId = request.headers.get('x-user-id')

    // Get album to verify ownership
    const album = await prisma.album.findUnique({
      where: { id: params.albumId }
    })

    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }

    if (!authenticatedUserId || authenticatedUserId !== album.userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only delete your own albums' },
        { status: 403 }
      )
    }

    await prisma.album.delete({
      where: { id: params.albumId }
    })

    return NextResponse.json({ message: 'Album deleted' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
