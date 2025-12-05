'use client'

import { useEffect, useRef, useState, memo } from 'react'

function getYouTubeVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

function getSpotifyId(url) {
  // Supports tracks, albums, and playlists
  const match = url.match(/spotify\.com\/(track|album|playlist|embed\/(track|album|playlist))\/([a-zA-Z0-9]+)/)
  if (match) {
    const type = match[2] || match[1] // Handle both regular and embed URLs
    const id = match[3]
    return { type, id }
  }
  return null
}

function getSoundCloudUrl(url) {
  // SoundCloud URLs can be tracks or playlists
  if (url.includes('soundcloud.com/')) {
    return url
  }
  return null
}

const MusicPlayer = memo(function MusicPlayer({ musicUrl, customTitle, autoplay = false }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState(false)
  const [embedType, setEmbedType] = useState(null)
  const [embedData, setEmbedData] = useState(null)

  useEffect(() => {
    if (musicUrl) {
      const ytId = getYouTubeVideoId(musicUrl)
      const spotifyData = getSpotifyId(musicUrl)
      const soundcloudUrl = getSoundCloudUrl(musicUrl)
      
      if (ytId) {
        setEmbedType('youtube')
        setEmbedData({ id: ytId })
      } else if (spotifyData) {
        setEmbedType('spotify')
        setEmbedData(spotifyData)
      } else if (soundcloudUrl) {
        setEmbedType('soundcloud')
        setEmbedData({ url: soundcloudUrl })
      } else {
        setEmbedType('audio')
        setEmbedData(null)
        if (audioRef.current) {
          audioRef.current.load()
          setError(false)
        }
      }
    }
  }, [musicUrl])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => setError(true))
      }
      setIsPlaying(!isPlaying)
    }
  }

  if (!musicUrl) return null

  // Determine height for Spotify embeds based on type
  const getSpotifyHeight = () => {
    if (!embedData) return 152
    if (embedData.type === 'track') return 152
    if (embedData.type === 'album' || embedData.type === 'playlist') return 352
    return 152
  }

  return (
    <div className="myspace-box shadow-lg">
      <div className="myspace-box-header flex items-center gap-2">
        <span className="text-lg">🎵</span>
        <span>{customTitle || 'Profile Song'}</span>
      </div>
      <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50">
        {embedType === 'youtube' ? (
          <div className="aspect-video w-full rounded-lg overflow-hidden shadow-md">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${embedData.id}?autoplay=${autoplay ? 1 : 0}`}
              title="YouTube video player"
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : embedType === 'spotify' ? (
          <div className="rounded-xl overflow-hidden shadow-md">
            <iframe
              style={{ borderRadius: '12px', border: 0 }}
              src={`https://open.spotify.com/embed/${embedData.type}/${embedData.id}?utm_source=generator&theme=0`}
              width="100%"
              height={getSpotifyHeight()}
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        ) : embedType === 'soundcloud' ? (
          <div className="rounded-lg overflow-hidden shadow-md">
            <iframe
              width="100%"
              height="166"
              scrolling="no"
              style={{ border: 0 }}
              allow="autoplay"
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(embedData.url)}&color=%23ff5500&auto_play=${autoplay}&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg p-4 shadow-md">
            <audio
              ref={audioRef}
              onEnded={() => setIsPlaying(false)}
              onError={() => setError(true)}
              autoPlay={autoplay}
            >
              <source src={musicUrl} type="audio/mpeg" />
            </audio>
            
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="myspace-button flex items-center gap-2 px-4 py-2"
                disabled={error}
              >
                <span className="text-lg">{isPlaying ? '⏸️' : '▶️'}</span>
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <div className="flex-1 text-sm">
                {error ? (
                  <span className="text-red-600 font-semibold">❌ Error loading music</span>
                ) : isPlaying ? (
                  <span className="text-green-600 font-semibold animate-pulse">🎶 Now Playing...</span>
                ) : (
                  <span className="text-gray-600">Click to play your profile song</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

export default MusicPlayer
