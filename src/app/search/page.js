'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('name')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) return

    setLoading(true)
    setSearched(true)

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="myspace-header text-white py-2 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="myspace-logo text-white hover:underline">
            MySpace<span className="text-sm ml-1" style={{fontSize: '14px'}}>a place for friends</span>
          </a>
          <a href="/" className="myspace-button">← Home</a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="myspace-box mb-4">
          <div className="myspace-box-header purple">Search MySpace</div>
          <div className="p-6 bg-white">

          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for people..."
                className="flex-1 min-w-[200px] px-3 py-2 border border-gray-400 text-sm"
              />
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-3 py-2 border border-gray-400 text-sm"
              >
                <option value="name">Name</option>
                <option value="location">Location</option>
                <option value="username">Username</option>
              </select>
              <button type="submit" className="myspace-button px-6">
                Search
              </button>
            </div>
          </form>
          </div>
        </div>

        {loading && (
          <div className="myspace-box">
            <div className="p-8 text-center bg-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching...</p>
            </div>
          </div>
        )}

        {!loading && searched && (
          <div className="myspace-box">
            <div className="myspace-box-header teal">
              {results.length} {results.length === 1 ? 'Result' : 'Results'} Found
            </div>
            <div className="p-4 bg-white">

            {results.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No users found matching your search.</p>
            ) : (
              <div className="space-y-3">
                {results.map((user) => (
                  <div
                    key={user.id}
                    className="border border-gray-300 p-3 hover:border-blue-500 hover:shadow-md transition cursor-pointer bg-gray-50"
                    onClick={() => router.push(`/profile/${user.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gray-200 border border-gray-400 flex items-center justify-center text-xl overflow-hidden flex-shrink-0">
                        {user.profile?.profilePhoto ? (
                          <img src={user.profile.profilePhoto} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                          <span>😎</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-blue-700 hover:underline">
                          {user.profile?.name || user.username}
                        </h3>
                        <p className="text-xs text-gray-600">@{user.username}</p>
                        {user.profile?.location && (
                          <p className="text-xs text-gray-500">📍 {user.profile.location}</p>
                        )}
                        {user.profile?.bio && (
                          <p className="text-xs text-gray-600 mt-1 italic truncate">
                            "{user.profile.bio.substring(0, 80)}{user.profile.bio.length > 80 ? '...' : ''}"
                          </p>
                        )}
                      </div>
                      <div className="text-right text-xs text-gray-600 flex-shrink-0">
                        {user.profile?.age && <p>{user.profile.age} years old</p>}
                        {user.profile?.gender && <p>{user.profile.gender}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
