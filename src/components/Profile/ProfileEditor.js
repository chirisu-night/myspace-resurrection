export default function ProfileEditor({ profile, setProfile }) {
  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Age</label>
          <input
            type="number"
            value={profile.age || ''}
            onChange={(e) => handleChange('age', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="25"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Gender</label>
          <select
            value={profile.gender || ''}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={profile.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select...</option>
            <option value="Single">Single</option>
            <option value="In a Relationship">In a Relationship</option>
            <option value="Married">Married</option>
            <option value="It's Complicated">It's Complicated</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Mood</label>
          <select
            value={profile.mood || ''}
            onChange={(e) => handleChange('mood', e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select...</option>
            <option value="Happy 😊">Happy 😊</option>
            <option value="Sad 😢">Sad 😢</option>
            <option value="Excited 🎉">Excited 🎉</option>
            <option value="Tired 😴">Tired 😴</option>
            <option value="Angry 😠">Angry 😠</option>
            <option value="Loved ❤️">Loved ❤️</option>
            <option value="Bored 😑">Bored 😑</option>
            <option value="Nostalgic 🎵">Nostalgic 🎵</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            value={profile.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Brooklyn, NY"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Hometown</label>
          <input
            type="text"
            value={profile.hometown || ''}
            onChange={(e) => handleChange('hometown', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Los Angeles, CA"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Zodiac Sign</label>
          <input
            type="text"
            value={profile.zodiacSign || ''}
            onChange={(e) => handleChange('zodiacSign', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Taurus"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded border">
        <h3 className="font-semibold mb-3">Section Titles (Optional)</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={profile.blurbsTitle || ''}
            onChange={(e) => handleChange('blurbsTitle', e.target.value)}
            className="px-3 py-2 border rounded text-sm"
            placeholder="Blurbs Title"
          />
          <input
            type="text"
            value={profile.friendSpaceTitle || ''}
            onChange={(e) => handleChange('friendSpaceTitle', e.target.value)}
            className="px-3 py-2 border rounded text-sm"
            placeholder="Friend Space Title"
          />
          <input
            type="text"
            value={profile.commentsTitle || ''}
            onChange={(e) => handleChange('commentsTitle', e.target.value)}
            className="px-3 py-2 border rounded text-sm"
            placeholder="Comments Title"
          />
          <input
            type="text"
            value={profile.contactingTitle || ''}
            onChange={(e) => handleChange('contactingTitle', e.target.value)}
            className="px-3 py-2 border rounded text-sm"
            placeholder="Contacting Title"
          />
          <input
            type="text"
            value={profile.detailsTitle || ''}
            onChange={(e) => handleChange('detailsTitle', e.target.value)}
            className="px-3 py-2 border rounded text-sm"
            placeholder="Details Title"
          />
          <input
            type="text"
            value={profile.interestsTitle || ''}
            onChange={(e) => handleChange('interestsTitle', e.target.value)}
            className="px-3 py-2 border rounded text-sm"
            placeholder="Interests Title"
          />
          <input
            type="text"
            value={profile.schoolsTitle || ''}
            onChange={(e) => handleChange('schoolsTitle', e.target.value)}
            className="px-3 py-2 border rounded text-sm"
            placeholder="Schools Title"
          />
          <input
            type="text"
            value={profile.musicTitle || ''}
            onChange={(e) => handleChange('musicTitle', e.target.value)}
            className="px-3 py-2 border rounded text-sm"
            placeholder="Music Player Title"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            className="w-full px-3 py-2 border rounded h-24"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Here For</label>
          <input
            type="text"
            value={profile.hereFor || ''}
            onChange={(e) => handleChange('hereFor', e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Friends, Networking, etc."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Custom HTML
          <span className="text-gray-500 text-xs ml-2">
            (Add your own content!)
          </span>
        </label>
        <textarea
          value={profile.customHTML}
          onChange={(e) => handleChange('customHTML', e.target.value)}
          className="w-full px-3 py-2 border rounded h-48 font-mono text-sm"
          placeholder="<h1>Hello World!</h1>"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Custom CSS
          <span className="text-gray-500 text-xs ml-2">
            (Style your profile!)
          </span>
        </label>
        <textarea
          value={profile.customCSS}
          onChange={(e) => handleChange('customCSS', e.target.value)}
          className="w-full px-3 py-2 border rounded h-48 font-mono text-sm"
          placeholder=".custom-content { color: red; background: pink; }"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Profile Photo URL</label>
          <input
            type="text"
            value={profile.profilePhoto || ''}
            onChange={(e) => handleChange('profilePhoto', e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm"
            placeholder="https://example.com/photo.jpg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Background Image URL</label>
          <input
            type="text"
            value={profile.backgroundImage || ''}
            onChange={(e) => handleChange('backgroundImage', e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm"
            placeholder="https://example.com/background.jpg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Profile Music URL</label>
          <input
            type="text"
            value={profile.profileMusic || ''}
            onChange={(e) => handleChange('profileMusic', e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm"
            placeholder="YouTube, Spotify, SoundCloud, or MP3"
          />
          <p className="text-xs text-gray-500 mt-1">
            Supports YouTube, Spotify (tracks/albums/playlists), SoundCloud, and MP3
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-purple-50 p-3 rounded border border-purple-200">
        <input
          type="checkbox"
          id="musicAutoplay"
          checked={profile.musicAutoplay || false}
          onChange={(e) => handleChange('musicAutoplay', e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="musicAutoplay" className="text-sm font-medium cursor-pointer">
          🎵 Autoplay profile music (may be blocked by browsers)
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Who I'd Like to Meet</label>
        <textarea
          value={profile.whoIdLikeToMeet || ''}
          onChange={(e) => handleChange('whoIdLikeToMeet', e.target.value)}
          className="w-full px-3 py-2 border rounded h-24"
          placeholder="Tell people who you'd like to meet..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Schools</label>
        <textarea
          value={profile.schools || ''}
          onChange={(e) => handleChange('schools', e.target.value)}
          className="w-full px-3 py-2 border rounded h-20"
          placeholder="High School, College, etc."
        />
      </div>

      <div className="bg-gray-50 p-4 rounded border">
        <h3 className="font-semibold mb-3">Interests</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">Music</label>
            <input
              type="text"
              value={profile.musicInterests || ''}
              onChange={(e) => handleChange('musicInterests', e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Rock, Hip Hop, etc."
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Movies</label>
            <input
              type="text"
              value={profile.movieInterests || ''}
              onChange={(e) => handleChange('movieInterests', e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Action, Comedy, etc."
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">TV Shows</label>
            <input
              type="text"
              value={profile.tvInterests || ''}
              onChange={(e) => handleChange('tvInterests', e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Your favorite shows..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Books</label>
            <input
              type="text"
              value={profile.bookInterests || ''}
              onChange={(e) => handleChange('bookInterests', e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Your favorite books..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Heroes</label>
            <input
              type="text"
              value={profile.heroesInterests || ''}
              onChange={(e) => handleChange('heroesInterests', e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Who inspires you..."
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <p className="text-sm text-blue-800">
          💡 Tip: Use .custom-content in your CSS to style the About Me section!
          <br />
          💡 Background image is auto-applied from the field above, or use CSS!
        </p>
      </div>
    </div>
  )
}
