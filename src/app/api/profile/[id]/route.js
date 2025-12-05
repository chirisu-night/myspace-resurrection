import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sanitizeHTML, sanitizeText, sanitizeCSS } from '@/lib/sanitize'

export async function GET(request, { params }) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: params.id },
      include: { 
        user: {
          select: {
            id: true,
            username: true,
            lastLogin: true
          }
        }
      }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile', details: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    // AUTHORIZATION: Verify user owns this profile
    const userId = request.headers.get('x-user-id')
    if (!userId || userId !== params.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only edit your own profile' },
        { status: 403 }
      )
    }
    
    const data = await request.json()
    
    // Sanitize user inputs
    const sanitizedData = {
      name: sanitizeText(data.name),
      bio: sanitizeText(data.bio),
      customHTML: sanitizeHTML(data.customHTML),
      customCSS: sanitizeCSS(data.customCSS),
    }
    
    const profile = await prisma.profile.update({
      where: { userId: params.id },
      data: {
        name: sanitizedData.name,
        bio: sanitizedData.bio,
        customHTML: sanitizedData.customHTML,
        customCSS: sanitizedData.customCSS,
        status: data.status,
        hometown: data.hometown,
        zodiacSign: data.zodiacSign,
        hereFor: data.hereFor,
        blurbsTitle: data.blurbsTitle,
        friendSpaceTitle: data.friendSpaceTitle,
        commentsTitle: data.commentsTitle,
        contactingTitle: data.contactingTitle,
        detailsTitle: data.detailsTitle,
        interestsTitle: data.interestsTitle,
        schoolsTitle: data.schoolsTitle,
        musicTitle: data.musicTitle,
        profilePhoto: data.profilePhoto,
        backgroundImage: data.backgroundImage,
        profileMusic: data.profileMusic,
        musicAutoplay: data.musicAutoplay,
        mood: data.mood,
        whoIdLikeToMeet: data.whoIdLikeToMeet,
        age: data.age ? parseInt(data.age, 10) : null,
        gender: data.gender,
        location: data.location,
        musicInterests: data.musicInterests,
        movieInterests: data.movieInterests,
        tvInterests: data.tvInterests,
        bookInterests: data.bookInterests,
        heroesInterests: data.heroesInterests,
        schools: data.schools,
      }
    })

    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
