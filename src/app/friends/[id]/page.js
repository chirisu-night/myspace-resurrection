'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FriendsPage({ params }) {
  const router = useRouter()
  const [friends, setFriends] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [params.id])

  const loadData = async () => {
    try {
      const [friendsRes, profileRes] = await Promise.all([
        fetch(`/api/friends?userId=${params.id}`),
        fetch(`/api/profile/${params.id}`)
      ])

      if (friendsRes.ok) {
        const friendsData = await friendsRes.json()
        setFriends(friendsData)
      }

      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setProfile(profileData)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen">
      <div className="myspace-header text-white py-2 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="myspace-logo text-white hover:underline">
            MySpace<span className="text-sm ml-1" style={{fontSize: '14px'}}>a place for friends</span>
          </a>
          <a href={`/profile/${params.id}`} className="myspace-button">
            ← Back to Profile
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="myspace-box">
          <div className="myspace-box-header green">
            {profile?.name}'s Friends ({friends.length})
          </div>
          <div className="p-4 bg-white">

          {friends.length === 0 ? (
            <p className="text-gray-600 text-center py-8 text-sm">No friends yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {friends.map((friendData) => {
                const friend = friendData.friend
                return (
                  <div
                    key={friend.id}
                    className="border border-gray-300 p-3 hover:border-blue-500 hover:shadow-md transition cursor-pointer text-center bg-gray-50"
                    onClick={() => router.push(`/profile/${friend.id}`)}
                  >
                    <div className="w-20 h-20 bg-gray-200 border border-gray-400 mx-auto mb-2 flex items-center justify-center text-2xl overflow-hidden">
                      {friend.profile?.profilePhoto ? (
                        <img src={friend.profile.profilePhoto} alt={friend.username} className="w-full h-full object-cover" />
                      ) : (
                        <span>😎</span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-blue-700 hover:underline">
                      {friend.profile?.name || friend.username}
                    </h3>
                    <p className="text-xs text-gray-600">@{friend.username}</p>
                  </div>
                )
              })}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}
