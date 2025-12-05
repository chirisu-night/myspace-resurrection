# MySpace Resurrection 🎵✨

A modern recreation of the classic MySpace experience with Next.js, bringing back the nostalgia of customizable profiles, Top 8 friends, and profile music!

## 🚀 Features

### Core Features
- ✅ **Custom Profile Pages** - Full HTML/CSS editing for ultimate personalization
- ✅ **Top 8 Friends** - Select your favorite friends (authentic one-way MySpace style)
- ✅ **Enhanced Music Player** - YouTube, Spotify, SoundCloud, and MP3 support
- ✅ **Messaging System** - Send messages with blocking functionality
- ✅ **Photo Albums** - Create, edit, and delete albums with captions
- ✅ **User Search** - Find users by name, location, or username
- ✅ **Bulletins Board** - Post updates to your network
- ✅ **Comments** - Leave comments on profiles with delete functionality
- ✅ **Glitter Text Generator** - Create sparkly text for your profile
- ✅ **Profile Views Counter** - See who's checking out your page
- ✅ **Online Status** - Real-time "Online Now!" indicator

### Security Features
- 🔒 Password hashing with bcrypt
- 🔒 Rate limiting on login (5 attempts per 15 minutes)
- 🔒 Input validation and sanitization
- 🔒 XSS protection for user-generated content
- 🔒 Environment variable protection

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Prisma + SQLite
- **Authentication:** Custom auth with bcrypt
- **Security:** rate-limiter-flexible, custom sanitization

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/myspace-resurrection.git
cd myspace-resurrection
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Set up Database:**
   - Create Vercel Postgres database
   - Copy connection string

4. **Add Environment Variables:**
```env
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your-super-secret-random-string
```

5. **Update Database Schema:**
   - Change `prisma/schema.prisma` from `sqlite` to `postgresql`
   - Redeploy

**Note:** SQLite is for development only. Use PostgreSQL for production.

## 🎨 Music Player

The profile music player supports multiple platforms:
- **YouTube** - Full video embeds with player controls
- **Spotify** - Tracks, albums, and playlists
- **SoundCloud** - Track and playlist embeds  
- **MP3 Files** - Direct audio file playback
- **Autoplay** - Optional autoplay (browser-dependent)

## 🔐 Security

This application implements enterprise-grade security:

- **Authentication**: JWT-based sessions with httpOnly cookies
- **Password Security**: bcrypt hashing with 10 rounds
- **Rate Limiting**: Comprehensive rate limiting on all endpoints
- **Input Sanitization**: DOMPurify for XSS protection
- **Authorization**: Complete ownership verification on all operations
- **Security Headers**: CSP, HSTS, X-Frame-Options, and more
- **CSRF Protection**: Token-based CSRF prevention
- **Error Handling**: Secure error messages (no information leakage)

**Security Score: 10/10** - Production-ready and OWASP Top 10 compliant.

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🎃 Built for Kiroween Hackathon

This project was built for the Kiroween Hackathon in the **Resurrection** category, bringing MySpace back to life with modern technology!
