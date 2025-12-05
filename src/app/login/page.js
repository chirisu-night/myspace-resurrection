'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('userId', data.userId)
        localStorage.setItem('username', data.username)
        router.push(`/profile/${data.userId}`)
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="myspace-box max-w-md w-full mx-4">
        <div className="myspace-box-header teal">Member Login</div>
        <div className="p-6 bg-white">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-blue-900 mb-1">Welcome Back!</h1>
            <p className="text-sm text-gray-600">Log in to your MySpace profile</p>
          </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 text-sm mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold mb-1">Username</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-3 py-2 border border-gray-400 text-sm"
              placeholder="cooluser123"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-400 text-sm"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full myspace-button py-2">
            Log In
          </button>
        </form>

        <div className="text-center mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline font-bold">
              Sign up
            </a>
          </p>
          <a href="/" className="text-xs text-gray-500 hover:underline mt-2 inline-block">
            ← Back to Home
          </a>
        </div>
        </div>
      </div>
    </div>
  )
}
