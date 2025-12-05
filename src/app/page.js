'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    setCurrentUserId(userId)
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users?limit=16')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('userId')
      localStorage.removeItem('username')
      setCurrentUserId(null)
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="myspace-header text-white py-2 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="myspace-logo">
            MySpace<span className="text-sm ml-1" style={{fontSize: '14px'}}>a place for friends</span>
          </div>
          <div className="flex gap-4">
            {currentUserId ? (
              <>
                <a href="/search" className="myspace-button">
                  Search
                </a>
                <a href="/messages" className="myspace-button">
                  Messages
                </a>
                <a href="/bulletins" className="myspace-button">
                  Bulletins
                </a>
                <a href={`/profile/${currentUserId}`} className="myspace-button">
                  My Profile
                </a>
                <button onClick={handleLogout} className="myspace-button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="myspace-button">
                  Login
                </a>
                <a href="/signup" className="myspace-button">
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="myspace-box mb-4">
          <div className="myspace-box-header orange">Welcome to MySpace!</div>
          <div className="p-6 text-center bg-gradient-to-br from-orange-50 to-yellow-50">
            <h2 className="text-4xl font-bold text-orange-700 mb-2 sparkle">Welcome to MySpace</h2>
            <p className="text-xl text-gray-700 mb-4">A place for friends... and chaos ✨</p>
          {!currentUserId && (
            <div className="flex gap-3 justify-center mt-4">
              <a href="/signup" className="myspace-button text-base py-2 px-6">
                Join Now!
              </a>
              <a href="/login" className="myspace-button text-base py-2 px-6">
                Log In
              </a>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-orange-200">
            <p className="text-xs text-gray-600 mb-2 font-bold">✨ COOL STUFF:</p>
            <div className="flex gap-2 justify-center flex-wrap text-xs">
              <a href="/tools/glitter" className="text-blue-600 hover:underline font-bold">
                Glitter Text
              </a>
              <span>|</span>
              <a href="/search" className="text-blue-600 hover:underline font-bold">
                Search
              </a>
              <span>|</span>
              <a href="/bulletins" className="text-blue-600 hover:underline font-bold">
                Bulletins
              </a>
            </div>
          </div>
        </div>
        </div>

        <div className="myspace-box">
          <div className="myspace-box-header teal">
            {currentUserId ? 'Discover People' : 'Cool New People'} ({users.length})
          </div>
          <div className="p-4 bg-white">
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No users yet. Be the first to sign up!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border border-gray-300 p-2 hover:border-blue-500 hover:shadow-md transition cursor-pointer bg-gray-50"
                  onClick={() => router.push(`/profile/${user.id}`)}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-200 border border-gray-400 mx-auto mb-2 flex items-center justify-center text-2xl overflow-hidden">
                      {user.profile?.profilePhoto ? (
                        <img src={user.profile.profilePhoto} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <span>😎</span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-blue-700 hover:underline">
                      {user.profile?.name || user.username}
                    </h4>
                    <p className="text-xs text-gray-500">{user.profile?.age || '??'} years old</p>
                    {user.profile?.location && (
                      <p className="text-xs text-gray-600 mt-1">{user.profile.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}
