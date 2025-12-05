'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MessagesPage() {
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [currentUserId, setCurrentUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('inbox')

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    setCurrentUserId(userId)
    if (userId) {
      loadMessages(userId)
    }
  }, [activeTab])

  const loadMessages = async (userId) => {
    try {
      const res = await fetch(`/api/messages?userId=${userId}&type=${activeTab}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (messageId) => {
    try {
      await fetch(`/api/messages/${messageId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId })
      })
      loadMessages(currentUserId)
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen">
      <div className="myspace-header text-white py-2 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="/" className="myspace-logo text-white hover:underline">
            MySpace<span className="text-sm ml-1" style={{fontSize: '14px'}}>a place for friends</span>
          </a>
          <div className="flex gap-2">
            <a href="/messages/compose" className="myspace-button">+ New Message</a>
            <a href="/" className="myspace-button">← Home</a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="myspace-box">
          <div className="myspace-box-header pink">Messages</div>
          <div className="p-4 bg-white">

          <div className="flex gap-2 mb-4 border-b border-gray-300">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`pb-2 px-3 text-sm ${activeTab === 'inbox' ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-600'}`}
            >
              📥 Inbox
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`pb-2 px-3 text-sm ${activeTab === 'sent' ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-600'}`}
            >
              📤 Sent
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <p className="text-gray-600 text-center py-8 text-sm">No messages yet.</p>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => {
                const otherUser = activeTab === 'inbox' 
                  ? { id: message.senderId, username: message.senderUsername, name: message.senderName }
                  : { id: message.receiverId, username: message.receiverUsername, name: message.receiverName }

                return (
                  <div
                    key={message.id}
                    className={`border p-3 cursor-pointer hover:bg-gray-50 ${!message.read && activeTab === 'inbox' ? 'bg-blue-50 border-blue-300' : 'border-gray-300'}`}
                    onClick={() => {
                      if (activeTab === 'inbox' && !message.read) {
                        markAsRead(message.id)
                      }
                      router.push(`/messages/${message.id}`)
                    }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        {!message.read && activeTab === 'inbox' && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full blink"></span>
                        )}
                        <span className="font-bold text-blue-600 text-sm">
                          {activeTab === 'inbox' ? 'From: ' : 'To: '}
                          {otherUser.name || otherUser.username}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{message.subject}</h3>
                    <p className="text-xs text-gray-600 truncate">{message.content}</p>
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
