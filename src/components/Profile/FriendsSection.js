'use client'

import { useState, useEffect } from 'react'

export default function FriendsSection({ userId, profileName, isOwnProfile, customTitle }) {
  const [top8, setTop8] = useState([])
  const [allFriends, setAllFriends] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState(null)

  useEffect(() => {
    loadTop8()
    if (isOwnProfile) {
      loadAllFriends()
    }
  }, [userId])

  const loadTop8 = async () => {
    try {
      const res = await fetch(`/api/top8?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setTop8(data)
      }
    } catch (error) {
      console.error('Failed to load top 8:', error)
    }
  }

  const loadAllFriends = async () => {
    try {
      const res = await fetch(`/api/friends?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setAllFriends(data)
      }
    } catch (error) {
      console.error('Failed to load friends:', error)
    }
  }

  const handleAddToTop8 = async (friendId, position) => {
    try {
      const res = await fetch('/api/top8', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          friendId,
          position
        })
      })

      if (res.ok) {
        loadTop8()
        setSelectedPosition(null)
      }
    } catch (error) {
      console.error('Failed to add to top 8:', error)
    }
  }

  const handleRemoveFromTop8 = async (position) => {
    try {
      const res = await fetch(`/api/top8?userId=${userId}&position=${position}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        loadTop8()
      }
    } catch (error) {
      console.error('Failed to remove from top 8:', error)
    }
  }

  const getTop8AtPosition = (pos) => {
    return top8.find(f => f.position === pos)
  }

  return (
    <div className="myspace-box">
      <div className="myspace-box-header" style={{background: 'linear-gradient(to bottom, #ff9966, #ff8844)'}}>
        {customTitle || `${profileName}'s Friend Space`}
      </div>
      <div className="p-4 bg-orange-50">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-sm">
              <b>{profileName}</b> has <b>{isOwnProfile ? allFriends.length : 'many'}</b> friend{allFriends.length !== 1 ? 's' : ''}.
            </p>
            <a href={`/friends/${userId}`} className="text-xs text-blue-600 hover:underline">
              View All Friends
            </a>
          </div>
          {isOwnProfile && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="myspace-button text-xs"
            >
              {isEditing ? 'Done' : 'Edit Top 8'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((position) => {
            const top8Data = getTop8AtPosition(position)
            const friend = top8Data?.friend

            return (
              <div key={position} className="text-center">
                <div 
                  className="w-20 h-20 bg-gray-300 border border-gray-400 mx-auto mb-1 flex items-center justify-center text-2xl overflow-hidden cursor-pointer hover:border-blue-500"
                  onClick={() => {
                    if (isEditing) {
                      setSelectedPosition(position)
                    } else if (friend) {
                      window.location.href = `/profile/${friend.id}`
                    }
                  }}
                >
                  {friend?.profile?.profilePhoto ? (
                    <img src={friend.profile.profilePhoto} alt={friend.username} className="w-full h-full object-cover" />
                  ) : friend ? (
                    <span>😎</span>
                  ) : (
                    <span className="text-gray-400 text-sm">+</span>
                  )}
                </div>
                {friend ? (
                  <div>
                    <a href={`/profile/${friend.id}`} className="text-xs text-blue-600 hover:underline font-bold">
                      {friend.profile?.name || friend.username}
                    </a>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveFromTop8(position)}
                        className="block mx-auto text-xs text-red-600 hover:underline mt-1"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Empty</p>
                )}
              </div>
            )
          })}
        </div>

        {selectedPosition && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedPosition(null)}>
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4">Select Friend for Position {selectedPosition}</h3>
              {allFriends.length === 0 ? (
                <p className="text-sm text-gray-600">You don't have any friends yet. Add some friends first!</p>
              ) : (
                <div className="space-y-2">
                  {allFriends.map((friendData) => {
                    const user = friendData.friend
                    return (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer rounded"
                        onClick={() => handleAddToTop8(user.id, selectedPosition)}
                      >
                        <div className="w-10 h-10 bg-gray-200 border border-gray-400 rounded flex items-center justify-center overflow-hidden">
                          {user.profile?.profilePhoto ? (
                            <img src={user.profile.profilePhoto} alt={user.username} className="w-full h-full object-cover" />
                          ) : (
                            <span>😎</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{user.profile?.name || user.username}</p>
                          <p className="text-xs text-gray-600">@{user.username}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
