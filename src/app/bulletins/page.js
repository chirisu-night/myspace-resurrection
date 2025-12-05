'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BulletinsPage() {
  const router = useRouter()
  const [bulletins, setBulletins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    setCurrentUserId(userId)
    loadBulletins(userId)
  }, [])

  const loadBulletins = async (userId) => {
    try {
      const url = userId ? `/api/bulletins?userId=${userId}` : '/api/bulletins'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setBulletins(data)
      }
    } catch (error) {
      console.error('Failed to load bulletins:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!currentUserId) {
      alert('Please log in to post bulletins')
      return
    }

    try {
      const res = await fetch('/api/bulletins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          authorId: currentUserId
        })
      })

      if (res.ok) {
        setFormData({ title: '', content: '' })
        setShowForm(false)
        loadBulletins(currentUserId)
      }
    } catch (error) {
      console.error('Failed to post bulletin:', error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  const handleDelete = async (bulletinId) => {
    if (!confirm('Delete this bulletin?')) return

    try {
      const res = await fetch(`/api/bulletins?bulletinId=${bulletinId}&userId=${currentUserId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        loadBulletins(currentUserId)
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete bulletin')
      }
    } catch (error) {
      console.error('Failed to delete bulletin:', error)
      alert('Failed to delete bulletin')
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
            {currentUserId && (
              <button onClick={() => setShowForm(!showForm)} className="myspace-button">
                {showForm ? 'Cancel' : '+ Post Bulletin'}
              </button>
            )}
            <a href="/" className="myspace-button">← Home</a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="myspace-box mb-4">
          <div className="myspace-box-header pink">Bulletin Board</div>
          <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50">
            <p className="text-sm text-gray-700">📢 See what your friends are posting!</p>
          </div>
        </div>

        {showForm && (
          <div className="myspace-box mb-4">
            <div className="myspace-box-header orange">Post a Bulletin</div>
            <div className="p-4 bg-white">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-400 text-sm"
                    placeholder="What's on your mind?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Message</label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-400 text-sm h-32"
                    placeholder="Write your bulletin..."
                  />
                </div>
                <button type="submit" className="myspace-button px-6">
                  Post Bulletin
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {loading ? (
            <div className="myspace-box">
              <div className="p-8 text-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading bulletins...</p>
              </div>
            </div>
          ) : bulletins.length === 0 ? (
            <div className="myspace-box">
              <div className="p-8 text-center bg-white text-gray-600">
                No bulletins yet. Be the first to post!
              </div>
            </div>
          ) : (
            bulletins.map((bulletin) => (
              <div key={bulletin.id} className="myspace-box">
                <div className="myspace-box-header green">
                  {bulletin.title}
                </div>
                <div className="p-4 bg-white">
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 bg-gray-200 border border-gray-400 flex items-center justify-center overflow-hidden cursor-pointer flex-shrink-0"
                      onClick={() => router.push(`/profile/${bulletin.authorId}`)}
                    >
                      {bulletin.author.profile?.profilePhoto ? (
                        <img src={bulletin.author.profile.profilePhoto} alt={bulletin.author.username} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg">😎</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <a 
                            href={`/profile/${bulletin.authorId}`}
                            className="font-bold text-sm text-blue-600 hover:underline"
                          >
                            {bulletin.author.profile?.name || bulletin.author.username}
                          </a>
                          <span className="text-gray-500 text-xs">• {formatDate(bulletin.createdAt)}</span>
                        </div>
                        {currentUserId === bulletin.authorId && (
                          <button
                            onClick={() => handleDelete(bulletin.id)}
                            className="text-red-600 hover:text-red-800 text-xs font-semibold"
                            title="Delete bulletin"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{bulletin.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
