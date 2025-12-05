'use client'

import { useState, useEffect } from 'react'

export default function CommentsSection({ profileId, profileName, customTitle }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [currentUserId, setCurrentUserId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    setCurrentUserId(userId)
    loadComments()
  }, [profileId])

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/comments?profileId=${profileId}`, {
        cache: 'no-store'
      })
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      }
    } catch (error) {
      console.error('Failed to load comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return

    try {
      const res = await fetch(`/api/comments?commentId=${commentId}&userId=${currentUserId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        loadComments()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete comment')
      }
    } catch (error) {
      console.error('Failed to delete comment:', error)
      alert('Failed to delete comment')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!currentUserId) {
      alert('Please log in to comment')
      return
    }

    if (!newComment.trim()) return

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          authorId: currentUserId,
          profileId: profileId,
        }),
      })

      if (res.ok) {
        setNewComment('')
        loadComments()
      }
    } catch (error) {
      console.error('Failed to post comment:', error)
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

  return (
    <div className="myspace-box">
      <div className="myspace-box-header" style={{background: 'linear-gradient(to bottom, #66cc66, #55bb55)'}}>
        {customTitle || `${profileName}'s Comments`}
      </div>
      <div className="p-4 bg-green-50">
        {loading ? (
          <p className="text-sm text-gray-600">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-600 mb-3">No comments yet. Be the first!</p>
        ) : (
          <div className="space-y-3 mb-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white border border-gray-300 p-3 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 border border-gray-400 rounded flex items-center justify-center text-sm overflow-hidden">
                      {comment.author.profile?.profilePhoto ? (
                        <img src={comment.author.profile.profilePhoto} alt={comment.author.username} className="w-full h-full object-cover" />
                      ) : (
                        <span>😎</span>
                      )}
                    </div>
                    <div>
                      <a href={`/profile/${comment.authorId}`} className="font-bold text-blue-600 hover:underline">
                        {comment.author.profile?.name || comment.author.username}
                      </a>
                      <span className="text-gray-500 ml-2">• {formatDate(comment.createdAt)}</span>
                    </div>
                  </div>
                  {currentUserId && (comment.authorId === currentUserId || comment.profileId === currentUserId) && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-600 hover:text-red-800 text-xs font-semibold"
                      title="Delete comment"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
        
        {currentUserId ? (
          <form onSubmit={handleSubmit}>
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border border-gray-400 p-2 text-xs"
              placeholder="Leave a comment..."
              rows="3"
            />
            <button type="submit" className="mt-2 myspace-button">
              Post Comment
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-600">
            <a href="/login" className="text-blue-600 hover:underline">Log in</a> to leave a comment
          </p>
        )}
      </div>
    </div>
  )
}
