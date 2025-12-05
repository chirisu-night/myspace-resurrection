'use client'

import { useEffect, useState } from 'react'

export default function AlbumViewPage({ params }) {
  const [album, setAlbum] = useState(null)
  const [photos, setPhotos] = useState([])
  const [currentUserId, setCurrentUserId] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPhoto, setNewPhoto] = useState({ url: '', caption: '' })
  const [editingPhoto, setEditingPhoto] = useState(null)
  const [editCaption, setEditCaption] = useState('')
  const [showEditAlbum, setShowEditAlbum] = useState(false)
  const [editAlbum, setEditAlbum] = useState({ title: '', description: '' })

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    setCurrentUserId(userId)
    setIsOwner(userId === params.userId)
    loadAlbum()
  }, [params.albumId])

  const loadAlbum = async () => {
    try {
      const res = await fetch(`/api/albums/${params.albumId}`)
      if (res.ok) {
        const data = await res.json()
        setAlbum(data)
        setPhotos(data.photos || [])
        setEditAlbum({ title: data.title, description: data.description || '' })
      }
    } catch (error) {
      console.error('Failed to load album:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditAlbum = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(`/api/albums/${params.albumId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editAlbum)
      })

      if (res.ok) {
        setShowEditAlbum(false)
        loadAlbum()
      }
    } catch (error) {
      console.error('Failed to edit album:', error)
    }
  }

  const handleDeleteAlbum = async () => {
    if (!confirm('Are you sure you want to delete this album? All photos will be deleted.')) {
      return
    }

    try {
      const res = await fetch(`/api/albums/${params.albumId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        window.location.href = `/albums/${params.userId}`
      }
    } catch (error) {
      console.error('Failed to delete album:', error)
    }
  }

  const handleEditPhoto = async (photoId) => {
    try {
      const res = await fetch(`/api/photos/${photoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption: editCaption, userId: currentUserId })
      })

      if (res.ok) {
        setEditingPhoto(null)
        setEditCaption('')
        loadAlbum()
      }
    } catch (error) {
      console.error('Failed to edit photo:', error)
    }
  }

  const handleDeletePhoto = async (photoId) => {
    if (!confirm('Are you sure you want to delete this photo?')) {
      return
    }

    try {
      const res = await fetch(`/api/photos/${photoId}?userId=${currentUserId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        loadAlbum()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete photo')
      }
    } catch (error) {
      console.error('Failed to delete photo:', error)
    }
  }

  const handleAddPhoto = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(`/api/albums/${params.albumId}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPhoto)
      })

      if (res.ok) {
        setNewPhoto({ url: '', caption: '' })
        setShowAddForm(false)
        loadAlbum()
      }
    } catch (error) {
      console.error('Failed to add photo:', error)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>
  }

  if (!album) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Album not found</div>
  }

  return (
    <div className="min-h-screen">
      <div className="myspace-header text-white py-2 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="myspace-logo text-white hover:underline">
            MySpace<span className="text-sm ml-1" style={{fontSize: '14px'}}>a place for friends</span>
          </a>
          <div className="flex gap-2">
            {isOwner && (
              <>
                <button onClick={() => setShowEditAlbum(!showEditAlbum)} className="myspace-button">
                  Edit Album
                </button>
                <button onClick={handleDeleteAlbum} className="myspace-button" style={{background: 'linear-gradient(to bottom, #cc6666, #bb5555)'}}>
                  Delete Album
                </button>
                <button onClick={() => setShowAddForm(!showAddForm)} className="myspace-button">
                  {showAddForm ? 'Cancel' : '+ Add Photo'}
                </button>
              </>
            )}
            <a href={`/albums/${params.userId}`} className="myspace-button">← Back to Albums</a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="myspace-box mb-4">
          <div className="myspace-box-header purple">{album.title}</div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
            {album.description && (
              <p className="text-sm text-gray-700 mb-2">{album.description}</p>
            )}
            <p className="text-xs text-gray-600">📷 {photos.length} {photos.length === 1 ? 'photo' : 'photos'}</p>
          </div>
        </div>

        {showEditAlbum && (
          <div className="myspace-box mb-4">
            <div className="myspace-box-header orange">Edit Album</div>
            <div className="p-4 bg-white">
            <form onSubmit={handleEditAlbum} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Album Title</label>
                <input
                  type="text"
                  required
                  value={editAlbum.title}
                  onChange={(e) => setEditAlbum({...editAlbum, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Description</label>
                <textarea
                  value={editAlbum.description}
                  onChange={(e) => setEditAlbum({...editAlbum, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-400 text-sm h-20"
                />
              </div>
              <button type="submit" className="myspace-button px-6">
                Save Changes
              </button>
            </form>
            </div>
          </div>
        )}

        {showAddForm && (
          <div className="myspace-box mb-4">
            <div className="myspace-box-header green">Add Photo</div>
            <div className="p-4 bg-white">
            <form onSubmit={handleAddPhoto} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">Photo URL</label>
                <input
                  type="url"
                  required
                  value={newPhoto.url}
                  onChange={(e) => setNewPhoto({...newPhoto, url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-400 text-sm"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Caption (optional)</label>
                <input
                  type="text"
                  value={newPhoto.caption}
                  onChange={(e) => setNewPhoto({...newPhoto, caption: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-400 text-sm"
                  placeholder="Add a caption..."
                />
              </div>
              <button type="submit" className="myspace-button px-6">
                Add Photo
              </button>
            </form>
            </div>
          </div>
        )}

        {photos.length === 0 ? (
          <div className="myspace-box">
            <div className="p-8 text-center bg-white text-gray-600 text-sm">
              No photos in this album yet.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div key={photo.id} className="myspace-box overflow-hidden">
                <div className="aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img src={photo.url} alt={photo.caption || 'Photo'} className="w-full h-full object-cover" />
                </div>
                <div className="p-2">
                  {editingPhoto === photo.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Caption..."
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditPhoto(photo.id)}
                          className="flex-1 bg-blue-600 text-white text-xs py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingPhoto(null)}
                          className="flex-1 bg-gray-400 text-white text-xs py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-700 mb-2">{photo.caption || 'No caption'}</p>
                      {isOwner && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingPhoto(photo.id)
                              setEditCaption(photo.caption || '')
                            }}
                            className="flex-1 text-blue-600 text-xs hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="flex-1 text-red-600 text-xs hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
