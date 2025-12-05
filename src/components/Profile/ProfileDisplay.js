'use client'

import { useEffect, useState } from 'react'
import CommentsSection from './CommentsSection'
import FriendsSection from './FriendsSection'
import MusicPlayer from './MusicPlayer'

function isRecentlyActive(lastLogin) {
  const now = new Date()
  const loginDate = new Date(lastLogin)
  const diffMinutes = (now - loginDate) / 1000 / 60
  return diffMinutes < 15
}

function formatLastLogin(lastLogin) {
  const date = new Date(lastLogin)
  return date.toLocaleDateString('en-US', { 
    month: 'numeric', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

function ContactingBox({ profile, userId, isOwnProfile }) {
  const [currentUserId, setCurrentUserId] = useState(null)
  const [isFriend, setIsFriend] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    const id = localStorage.getItem('userId')
    setCurrentUserId(id)
    if (id && !isOwnProfile) {
      checkFriendship(id)
      checkBlocked(id)
    }
  }, [userId])

  const checkFriendship = async (id) => {
    try {
      const res = await fetch(`/api/friends?userId=${id}`)
      if (res.ok) {
        const friends = await res.json()
        setIsFriend(friends.some(f => f.friendId === userId))
      }
    } catch (error) {
      console.error('Failed to check friendship:', error)
    }
  }

  const checkBlocked = async (id) => {
    try {
      const res = await fetch(`/api/blocks?blockerId=${id}&blockedId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setIsBlocked(data.isBlocked)
      }
    } catch (error) {
      console.error('Failed to check block status:', error)
    }
  }

  const handleAddFriend = async () => {
    if (!currentUserId) {
      alert('Please log in first')
      return
    }

    try {
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          friendId: userId
        })
      })

      if (res.ok) {
        alert('Friend added!')
        setIsFriend(true)
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to add friend')
      }
    } catch (error) {
      console.error('Failed to add friend:', error)
    }
  }

  const handleRemoveFriend = async () => {
    if (!currentUserId) return

    try {
      const res = await fetch(`/api/friends?userId=${currentUserId}&friendId=${userId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        alert('Friend removed')
        setIsFriend(false)
      }
    } catch (error) {
      console.error('Failed to remove friend:', error)
    }
  }

  const handleBlock = async () => {
    if (!currentUserId) return

    if (!confirm(`Are you sure you want to block ${profile.name}? They won't be able to message you.`)) {
      return
    }

    try {
      const res = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockerId: currentUserId,
          blockedId: userId
        })
      })

      if (res.ok) {
        alert('User blocked')
        setIsBlocked(true)
      }
    } catch (error) {
      console.error('Failed to block user:', error)
    }
  }

  const handleUnblock = async () => {
    if (!currentUserId) return

    try {
      const res = await fetch(`/api/blocks?blockerId=${currentUserId}&blockedId=${userId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        alert('User unblocked')
        setIsBlocked(false)
      }
    } catch (error) {
      console.error('Failed to unblock user:', error)
    }
  }

  if (isOwnProfile) {
    return (
      <div className="myspace-box">
        <div className="myspace-box-header">{profile.contactingTitle || `Contacting ${profile.name}`}</div>
        <div className="p-3 space-y-2 text-xs bg-white">
          <p className="text-gray-600">This is your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="myspace-box">
      <div className="myspace-box-header">{profile.contactingTitle || `Contacting ${profile.name}`}</div>
      <div className="p-3 space-y-2 text-xs bg-white">
        <div className="flex items-center gap-2">
          <span>✉️</span>
          <a 
            href={`/messages/compose?to=${userId}`}
            className="text-blue-600 hover:underline"
          >
            Send Message
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span>👥</span>
          {isFriend ? (
            <button 
              onClick={handleRemoveFriend}
              className="text-red-600 hover:underline"
            >
              Remove Friend
            </button>
          ) : (
            <button 
              onClick={handleAddFriend}
              className="text-blue-600 hover:underline"
            >
              Add to Friends
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span>🚫</span>
          {isBlocked ? (
            <button 
              onClick={handleUnblock}
              className="text-blue-600 hover:underline"
            >
              Unblock User
            </button>
          ) : (
            <button 
              onClick={handleBlock}
              className="text-red-600 hover:underline"
            >
              Block User
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProfileDisplay({ profile, userId, isOwnProfile, userData }) {
  useEffect(() => {
    let cssToApply = profile.customCSS || ''
    
    // Debug: Log the CSS
    console.log('Custom CSS from profile:', profile.customCSS)
    
    // Add !important to body styles to override global CSS
    if (cssToApply) {
      // Wrap custom CSS in a higher specificity selector
      cssToApply = `
        /* Custom Profile CSS */
        ${cssToApply}
      `
    }
    
    if (profile.backgroundImage) {
      cssToApply += `\nbody { background-image: url('${profile.backgroundImage}') !important; background-size: cover !important; background-attachment: fixed !important; }`
    }
    
    if (cssToApply) {
      console.log('Applying CSS:', cssToApply)
      const styleEl = document.createElement('style')
      styleEl.id = 'custom-profile-css'
      styleEl.textContent = cssToApply
      document.head.appendChild(styleEl)
      console.log('CSS applied to head')
      
      return () => {
        const existingStyle = document.getElementById('custom-profile-css')
        if (existingStyle) {
          existingStyle.remove()
        }
      }
    } else {
      console.log('No CSS to apply')
    }
  }, [profile.customCSS, profile.backgroundImage])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* Left Column */}
      <div className="space-y-3">
        {/* Profile Info */}
        <div className="myspace-box">
          <div className="text-center p-4 bg-white">
            <h2 className="text-2xl font-bold text-blue-900 mb-1">{profile.name}</h2>
            <p className="text-xs text-gray-600 mb-3">{profile.username || 'username'}</p>
            <div className="w-40 h-40 bg-gray-200 border-2 border-gray-400 mx-auto mb-3 flex items-center justify-center text-6xl overflow-hidden">
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>😎</span>
              )}
            </div>
            <p className="text-sm italic mb-2">"{profile.bio}"</p>
            {profile.mood && (
              <p className="text-xs text-gray-600 mb-2">
                <span className="font-semibold">Mood:</span> {profile.mood}
              </p>
            )}
            {userData?.lastLogin ? (
              <>
                {isRecentlyActive(userData.lastLogin) && (
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="font-bold text-green-600">Online Now!</span>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Last Login: {formatLastLogin(userData.lastLogin)}
                </p>
              </>
            ) : (
              <p className="text-xs text-gray-500 mt-2">Never logged in</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Profile Views: <span className="font-semibold">{profile.profileViews || 0}</span>
            </p>
          </div>
        </div>

        {/* Contacting Box */}
        <ContactingBox 
          profile={profile} 
          userId={userId} 
          isOwnProfile={isOwnProfile} 
        />

        {/* Music Player */}
        <MusicPlayer 
          musicUrl={profile.profileMusic} 
          customTitle={profile.musicTitle}
          autoplay={profile.musicAutoplay}
        />

        {/* Photo Albums Link */}
        <div className="myspace-box">
          <div className="myspace-box-header">Photo Albums</div>
          <div className="p-3 bg-white text-center">
            <a 
              href={`/albums/${userId}`}
              className="text-blue-600 hover:underline font-semibold"
            >
              📷 View Photo Albums
            </a>
          </div>
        </div>

        {/* Details Table */}
        <div className="myspace-box">
          <div className="myspace-box-header">{profile.detailsTitle || `${profile.name}'s Details`}</div>
          <table className="w-full text-xs">
            <tbody>
              {profile.age && (
                <tr className="myspace-table-row">
                  <td className="myspace-table-label">Age:</td>
                  <td className="p-2">{profile.age}</td>
                </tr>
              )}
              {profile.gender && (
                <tr className="myspace-table-row">
                  <td className="myspace-table-label">Gender:</td>
                  <td className="p-2">{profile.gender}</td>
                </tr>
              )}
              <tr className="myspace-table-row">
                <td className="myspace-table-label">Status:</td>
                <td className="p-2">{profile.status || 'Single'}</td>
              </tr>
              {profile.location && (
                <tr className="myspace-table-row">
                  <td className="myspace-table-label">Location:</td>
                  <td className="p-2">{profile.location}</td>
                </tr>
              )}
              <tr className="myspace-table-row">
                <td className="myspace-table-label">Hometown:</td>
                <td className="p-2">{profile.hometown || 'Brooklyn, NY'}</td>
              </tr>
              <tr className="myspace-table-row">
                <td className="myspace-table-label">Zodiac Sign:</td>
                <td className="p-2">{profile.zodiacSign || 'Taurus'}</td>
              </tr>
              <tr className="myspace-table-row">
                <td className="myspace-table-label">Here for:</td>
                <td className="p-2">{profile.hereFor || 'Friends'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-2 space-y-3">
        {/* Blurbs */}
        <div className="myspace-box">
          <div className="myspace-box-header" style={{background: 'linear-gradient(to bottom, #ff9966, #ff8844)'}}>
            {profile.blurbsTitle || `${profile.name}'s Blurbs`}
          </div>
          <div className="p-4 bg-orange-50">
            <h3 className="font-bold text-orange-700 mb-2 text-sm">About me:</h3>
            <div
              className="custom-content mb-4"
              dangerouslySetInnerHTML={{ __html: profile.customHTML }}
            />

            {profile.whoIdLikeToMeet && (
              <>
                <h3 className="font-bold text-orange-700 mb-2 text-sm mt-4">Who I'd like to meet:</h3>
                <p className="text-sm whitespace-pre-wrap">{profile.whoIdLikeToMeet}</p>
              </>
            )}
          </div>
        </div>

        {/* Interests */}
        {(profile.musicInterests || profile.movieInterests || profile.tvInterests || profile.bookInterests || profile.heroesInterests) && (
          <div className="myspace-box">
            <div className="myspace-box-header" style={{background: 'linear-gradient(to bottom, #9966ff, #8844ff)'}}>
              {profile.interestsTitle || `${profile.name}'s Interests`}
            </div>
            <div className="p-4 bg-purple-50">
              {profile.musicInterests && (
                <div className="mb-3">
                  <h4 className="font-bold text-purple-700 text-sm">Music:</h4>
                  <p className="text-sm">{profile.musicInterests}</p>
                </div>
              )}
              {profile.movieInterests && (
                <div className="mb-3">
                  <h4 className="font-bold text-purple-700 text-sm">Movies:</h4>
                  <p className="text-sm">{profile.movieInterests}</p>
                </div>
              )}
              {profile.tvInterests && (
                <div className="mb-3">
                  <h4 className="font-bold text-purple-700 text-sm">TV Shows:</h4>
                  <p className="text-sm">{profile.tvInterests}</p>
                </div>
              )}
              {profile.bookInterests && (
                <div className="mb-3">
                  <h4 className="font-bold text-purple-700 text-sm">Books:</h4>
                  <p className="text-sm">{profile.bookInterests}</p>
                </div>
              )}
              {profile.heroesInterests && (
                <div className="mb-3">
                  <h4 className="font-bold text-purple-700 text-sm">Heroes:</h4>
                  <p className="text-sm">{profile.heroesInterests}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Schools */}
        {profile.schools && (
          <div className="myspace-box">
            <div className="myspace-box-header" style={{background: 'linear-gradient(to bottom, #66cccc, #55bbbb)'}}>
              {profile.schoolsTitle || `${profile.name}'s Schools`}
            </div>
            <div className="p-4 bg-cyan-50">
              <p className="text-sm whitespace-pre-wrap">{profile.schools}</p>
            </div>
          </div>
        )}

        {/* Friend Space */}
        <FriendsSection 
          userId={userId} 
          profileName={profile.name} 
          isOwnProfile={isOwnProfile}
          customTitle={profile.friendSpaceTitle}
        />

        {/* Comments */}
        <CommentsSection 
          profileId={userId} 
          profileName={profile.name}
          customTitle={profile.commentsTitle}
        />
      </div>
    </div>
  )
}
