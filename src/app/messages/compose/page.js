'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ComposeMessagePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toUserId = searchParams.get('to')
  
  const [currentUserId, setCurrentUserId] = useState(null)
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({
    receiverId: toUserId || '',
    subject: '',
    content: ''
  })

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    setCurrentUserId(userId)
    loadUsers(userId)
  }, [])

  const loadUsers = async (currentId) => {
    try {
      const res = await fetch('/api/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.filter(u => u.id !== currentId))
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!currentUserId) {
      alert('Please log in')
      return
    }

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          senderId: currentUserId
        })
      })

      if (res.ok) {
        router.push('/messages')
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message')
    }
  }

  return (
    <div className="min-h-screen">
      <div className="myspace-header text-white py-2 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="myspace-logo text-white hover:underline">
            MySpace<span className="text-sm ml-1" style={{fontSize: '14px'}}>a place for friends</span>
          </a>
          <a href="/messages" className="myspace-button">← Back to Messages</a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        <div className="myspace-box">
          <div className="myspace-box-header pink">New Message</div>
          <div className="p-4 bg-white">

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold mb-1">To:</label>
              <select
                required
                value={formData.receiverId}
                onChange={(e) => setFormData({...formData, receiverId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-400 text-sm"
              >
                <option value="">Select a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.profile?.name || user.username} (@{user.username})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Subject:</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-3 py-2 border border-gray-400 text-sm"
                placeholder="Message subject..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Message:</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full px-3 py-2 border border-gray-400 text-sm h-48"
                placeholder="Write your message..."
              />
            </div>

            <button type="submit" className="myspace-button px-6">
              Send Message
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  )
}
