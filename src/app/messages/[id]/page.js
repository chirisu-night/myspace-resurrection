'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ViewMessagePage({ params }) {
  const router = useRouter()
  const [message, setMessage] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    setCurrentUserId(userId)
    loadMessage()
  }, [])

  const loadMessage = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const res = await fetch(`/api/messages/${params.id}?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setMessage(data)
      }
    } catch (error) {
      console.error('Failed to load message:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>
  }

  if (!message) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Message not found</div>
  }

  const isReceiver = currentUserId === message.receiverId
  const otherUser = isReceiver ? message.sender : message.receiver

  return (
    <div className="min-h-screen">
      <div className="myspace-header text-white py-2 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="myspace-logo text-white hover:underline">
            MySpace<span className="text-sm ml-1" style={{fontSize: '14px'}}>a place for friends</span>
          </a>
          <div className="flex gap-2">
            {isReceiver && (
              <a href={`/messages/compose?to=${message.senderId}`} className="myspace-button">
                ↩ Reply
              </a>
            )}
            <a href="/messages" className="myspace-button">← Back to Messages</a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="myspace-box">
          <div className="myspace-box-header pink">{message.subject}</div>
          <div className="p-4 bg-white">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 bg-gray-200 border border-gray-400 flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/profile/${otherUser.id}`)}
                >
                  {otherUser.profile?.profilePhoto ? (
                    <img src={otherUser.profile.profilePhoto} alt={otherUser.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg">😎</span>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-600">
                    {isReceiver ? 'From: ' : 'To: '}
                    <a 
                      href={`/profile/${otherUser.id}`}
                      className="font-bold text-blue-600 hover:underline"
                    >
                      {otherUser.profile?.name || otherUser.username}
                    </a>
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(message.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="text-sm">
              <p className="whitespace-pre-wrap text-gray-800">{message.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
