'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AlbumsPage({ params }) {
  const router = useRouter()
  const [albums, setAlbums] = useState([])
  const [currentUserId, setCurrentUserId] = useState(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAlbum, setNewAlbum] = useState({ title: '', description: '' })

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    setCurrentUserId(userId)
    setIsOwnProfile(userId === params.userId)
    loadAlbums()
  }, [params.userId])

  const loadAlbums = async () => {
    try {
      const res = await fetch(`/api/albums?userId=${params.userId}`)
      if (res.ok) {
        const data = await res.json()
        setAlbums(data)
      }
    } catch (error) {
      console.error('Failed to load albums:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAlbum = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newAlbum,
          userId: currentUserId
        })
      })

      if (res.ok) {
        setNewAlbum({ title: '', description: '' })
        setShowCreateForm(false)
        loadAlbums()
      }
    } catch (error) {
      console.error('Failed to create album:', error)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="myspace-header text-white py-2 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="myspace-logo text-white hover:underline">
            MySpace<span className="text-sm ml-1" style={{fontSize: '14px'}}>a place for friends</span>
          </a>
          <div className="flex gap-2">
            {isOwnProfile && (
              <button onClick={() => setShowCreateForm(!showCreateForm)} className="myspace-button">
                {showCreateForm ? 'Cancel' : '+ Create Album'}
              </button>
            )}
            <a href={`/profile/${params.userId}`} className="myspace-button">← Back to Profile</a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="myspace-box mb-4">
          <div className="myspace-box-header purple">Photo Albums</div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
            <p className="text-sm text-gray-700">📷 {albums.length} {albums.length === 1 ? 'album' : 'albums'}</p>
          </div>
        </div>

        {showCreateForm && (
          <div className="myspace-box mb-4">
            <div className="myspace-box-header orange">Create New Album</div>
            <div className="p-4 bg-white">
            <form onSubmit={handleCreateAlbum} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Album Title</label>
                <input
                  type="text"
                  required
                  value={newAlbum.title}
                  onChange={(e) => setNewAlbum({...newAlbum, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-400 text-sm"
                  placeholder="Summer 2025"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Description (optional)</label>
                <textarea
                  value={newAlbum.description}
                  onChange={(e) => setNewAlbum({...newAlbum, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-400 text-sm h-20"
                  placeholder="Describe your album..."
                />
              </div>
              <button type="submit" className="myspace-button px-6">
                Create Album
              </button>
            </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="myspace-box">
            <div className="p-8 text-center bg-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Loading albums...</p>
            </div>
          </div>
        ) : albums.length === 0 ? (
          <div className="myspace-box">
            <div className="p-8 text-center bg-white text-gray-600 text-sm">
              No albums yet.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {albums.map((album) => (
              <div
                key={album.id}
                className="myspace-box cursor-pointer hover:shadow-lg transition"
                onClick={() => router.push(`/albums/${params.userId}/${album.id}`)}
              >
                <div className="h-40 bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
                  {album.photos && album.photos.length > 0 ? (
                    <img src={album.photos[0].url} alt={album.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">📷</span>
                  )}
                </div>
                <div className="p-3 bg-white">
                  <h3 className="font-bold text-sm text-blue-900 mb-1">{album.title}</h3>
                  {album.description && (
                    <p className="text-xs text-gray-600 mb-1 truncate">{album.description}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {album.photos?.length || 0} {album.photos?.length === 1 ? 'photo' : 'photos'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
