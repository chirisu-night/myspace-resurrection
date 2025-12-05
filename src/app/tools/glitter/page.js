'use client'

import { useState } from 'react'

export default function GlitterTextPage() {
  const [text, setText] = useState('')
  const [color, setColor] = useState('rainbow')
  const [size, setSize] = useState('large')
  const [generatedHTML, setGeneratedHTML] = useState('')

  const colors = {
    rainbow: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'],
    pink: ['#ff69b4', '#ff1493', '#c71585', '#ff69b4', '#ff1493'],
    blue: ['#00bfff', '#1e90ff', '#0000ff', '#4169e1', '#00bfff'],
    gold: ['#ffd700', '#ffed4e', '#ffd700', '#ffed4e', '#ffd700'],
    purple: ['#9370db', '#8a2be2', '#9400d3', '#9370db', '#8a2be2'],
    green: ['#00ff00', '#32cd32', '#00fa9a', '#00ff00', '#32cd32'],
  }

  const sizes = {
    small: '24px',
    medium: '36px',
    large: '48px',
    huge: '64px'
  }

  const generateGlitterText = () => {
    if (!text) return

    const colorArray = colors[color]
    const fontSize = sizes[size]
    
    // Sanitize text to prevent any HTML injection
    const sanitizedText = text.replace(/[<>]/g, '')
    
    const letters = sanitizedText.split('').map((char, index) => {
      const letterColor = colorArray[index % colorArray.length]
      // Escape the character to prevent any HTML injection
      const safeChar = char === ' ' ? '&nbsp;' : char.replace(/&/g, '&amp;')
      return `<span style="color: ${letterColor}; text-shadow: 0 0 10px ${letterColor}, 0 0 20px ${letterColor}; font-weight: bold; display: inline-block; animation: glitter ${0.5 + (index * 0.1)}s infinite alternate;">${safeChar}</span>`
    }).join('')

    const html = `<style>
@keyframes glitter {
  0% { transform: scale(1) rotate(0deg); opacity: 1; }
  100% { transform: scale(1.1) rotate(5deg); opacity: 0.8; }
}
</style>
<div style="font-size: ${fontSize}; font-family: 'Comic Sans MS', cursive; text-align: center; padding: 20px;">
  ${letters}
</div>`

    setGeneratedHTML(html)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedHTML)
    alert('HTML copied! Paste it in your profile editor.')
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
        <div className="myspace-box">
          <div className="myspace-box-header pink">✨ Glitter Text Generator ✨</div>
          <div className="p-6 bg-gradient-to-br from-pink-50 to-purple-50">
            <p className="text-center text-sm text-gray-700 mb-4">Create sparkly text for your MySpace profile!</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1">Your Text:</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text..."
                className="w-full px-3 py-2 border border-gray-400 text-sm"
                maxLength={50}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">Color:</label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-400 text-sm"
                >
                  <option value="rainbow">🌈 Rainbow</option>
                  <option value="pink">💖 Pink</option>
                  <option value="blue">💙 Blue</option>
                  <option value="gold">⭐ Gold</option>
                  <option value="purple">💜 Purple</option>
                  <option value="green">💚 Green</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Size:</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-400 text-sm"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="huge">Huge</option>
                </select>
              </div>
            </div>

            <button
              onClick={generateGlitterText}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 text-sm"
            >
              ✨ Generate Glitter Text ✨
            </button>

            {generatedHTML && (
              <>
                <div className="border-2 border-pink-300 p-4 bg-white">
                  <h3 className="font-bold text-sm mb-2 text-center">Preview:</h3>
                  <div dangerouslySetInnerHTML={{ __html: generatedHTML }} />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">HTML Code (copy this):</label>
                  <textarea
                    value={generatedHTML}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-400 font-mono text-xs h-40"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="mt-2 w-full myspace-button py-2"
                  >
                    📋 Copy HTML Code
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-300 p-3">
                  <p className="text-xs text-yellow-800">
                    <strong>How to use:</strong> Copy the HTML code above and paste it into your profile's "Custom HTML" section when editing your profile!
                  </p>
                </div>
              </>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
