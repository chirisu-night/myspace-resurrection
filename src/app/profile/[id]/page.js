'use client'

import { useState, useEffect, useCallback } from 'react'
import ProfileEditor from '@/components/Profile/ProfileEditor'
import ProfileDisplay from '@/components/Profile/ProfileDisplay'

export default function ProfilePage({ params }) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [showSaveNotification, setShowSaveNotification] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Loading...',
    bio: '',
    customCSS: '',
    customHTML: '',
  })

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    setCurrentUserId(userId)
    setIsOwnProfile(userId === params.id)
    
    loadProfile()
    
    // Only increment view if not own profile
    if (userId && userId !== params.id) {
      incrementProfileView()
    }
  }, [params.id])

  const incrementProfileView = async () => {
    try {
      await fetch(`/api/profile/${params.id}/view`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('Failed to increment view:', error)
    }
  }

  const [userData, setUserData] = useState(null)

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/profile/${params.id}`, {
        cache: 'no-store'
      })
      if (res.ok) {
        const data = await res.json()
        setUserData(data.user)
        setProfile({
          name: data.name,
          bio: data.bio || '',
          customCSS: data.customCSS || '',
          customHTML: data.customHTML || '',
          status: data.status || 'Single',
          hometown: data.hometown || 'Brooklyn, NY',
          zodiacSign: data.zodiacSign || 'Taurus',
          hereFor: data.hereFor || 'Friends',
          blurbsTitle: data.blurbsTitle || '',
          friendSpaceTitle: data.friendSpaceTitle || '',
          commentsTitle: data.commentsTitle || '',
          contactingTitle: data.contactingTitle || '',
          detailsTitle: data.detailsTitle || '',
          interestsTitle: data.interestsTitle || '',
          schoolsTitle: data.schoolsTitle || '',
          musicTitle: data.musicTitle || '',
          profileMusic: data.profileMusic || '',
          musicAutoplay: data.musicAutoplay || false,
          mood: data.mood || '',
          whoIdLikeToMeet: data.whoIdLikeToMeet || '',
          age: data.age || '',
          gender: data.gender || '',
          location: data.location || '',
          musicInterests: data.musicInterests || '',
          movieInterests: data.movieInterests || '',
          tvInterests: data.tvInterests || '',
          bookInterests: data.bookInterests || '',
          heroesInterests: data.heroesInterests || '',
          schools: data.schools || '',
          profileViews: data.profileViews || 0,
          username: data.user?.username || '',
          profilePhoto: data.profilePhoto || '',
          backgroundImage: data.backgroundImage || '',
        })
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  const saveProfile = async () => {
    try {
      const res = await fetch(`/api/profile/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (res.ok) {
        setIsEditing(false)
        setShowSaveNotification(true)
        setTimeout(() => setShowSaveNotification(false), 3000)
        loadProfile()
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
      alert('Failed to save profile')
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen">
      {/* Save Notification */}
      {showSaveNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          ✓ Profile saved successfully!
        </div>
      )}

      {/* MySpace Header */}
      <div className="myspace-header text-white py-3 px-4 mb-0">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex gap-6 text-sm font-bold">
            <a href="/" className="text-white hover:underline">Home</a>
            {currentUserId && (
              <>
                <a href="/search" className="text-white hover:underline">Search</a>
                <a href={`/profile/${currentUserId}`} className="text-white hover:underline">My Profile</a>
                <a href={`/friends/${currentUserId}`} className="text-white hover:underline">My Friends</a>
                <a href="/messages" className="text-white hover:underline">Messages</a>
                <a href="/bulletins" className="text-white hover:underline">Bulletins</a>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {isOwnProfile ? (
              <>
                {isEditing && (
                  <button onClick={saveProfile} className="myspace-button">
                    Save Changes
                  </button>
                )}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="myspace-button"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to log out?')) {
                      localStorage.removeItem('userId')
                      localStorage.removeItem('username')
                      window.location.href = '/'
                    }
                  }}
                  className="myspace-button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/" className="myspace-button">
                  Back to Home
                </a>
                {currentUserId && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to log out?')) {
                        localStorage.removeItem('userId')
                        localStorage.removeItem('username')
                        window.location.href = '/'
                      }
                    }}
                    className="myspace-button"
                  >
                    Logout
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        {isEditing && isOwnProfile ? (
          <ProfileEditor profile={profile} setProfile={setProfile} />
        ) : (
          <ProfileDisplay profile={profile} userId={params.id} isOwnProfile={isOwnProfile} userData={userData} />
        )}
      </div>
    </div>
  )
}
