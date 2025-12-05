const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const demoUsers = [
  {
    username: 'scene_queen_2005',
    email: 'scene@demo.com',
    password: 'password123',
    profile: {
      name: 'Ashley ★ Scene Queen',
      bio: 'rawr xD | emo 4 lyfe | add me on AIM: xXsceneXqueenXx',
      age: 19,
      location: 'Los Angeles, CA',
      mood: '💔 heartbroken',
      customCSS: `body { background: #000 !important; color: #ff00ff !important; font-family: 'Comic Sans MS', cursive !important; }
.profile-container { background: linear-gradient(45deg, #000, #330033, #000) !important; border: 3px solid #ff00ff !important; box-shadow: 0 0 20px #ff00ff !important; }
h1, h2, h3 { color: #ff00ff !important; text-shadow: 2px 2px #000, -2px -2px #ff00ff !important; }
a { color: #00ffff !important; }`,
      customHTML: '<marquee>♥ RAWR MEANS I LOVE YOU IN DINOSAUR ♥</marquee><center><img src="https://web.archive.org/web/20090830010722im_/http://geocities.com/xo_emo_star_ox/skull.gif" /></center>'
    }
  },
  {
    username: 'sk8er_boi_mike',
    email: 'mike@demo.com',
    password: 'password123',
    profile: {
      name: 'Mike the Skater',
      bio: 'Sk8 or die 🛹 | Tony Hawk is my hero | Vans Off The Wall',
      age: 21,
      location: 'San Diego, CA',
      mood: '😎 radical',
      customCSS: `body { background: linear-gradient(180deg, #ff71ce 0%, #01cdfe 50%, #05ffa1 100%) !important; color: #fff !important; }
.profile-container { background: rgba(255, 113, 206, 0.3) !important; border: 2px solid #01cdfe !important; backdrop-filter: blur(10px) !important; }
h1, h2, h3 { color: #ff71ce !important; text-shadow: 3px 3px #01cdfe !important; letter-spacing: 5px !important; }`,
      customHTML: '<center><h2>🌴 V A P O R W A V E 🌴</h2><p>aesthetic vibes only</p></center>'
    }
  },
  {
    username: 'emo_princess_x',
    email: 'emo@demo.com',
    password: 'password123',
    profile: {
      name: 'Emma ✖ Emo Princess',
      bio: 'My Chemical Romance saved my life | poetry & pain | misunderstood',
      age: 18,
      location: 'Portland, OR',
      mood: '🖤 melancholy',
      customCSS: `body { background: #000 !important; color: #00ff00 !important; font-family: 'Courier New', monospace !important; }
.profile-container { background: rgba(0, 20, 0, 0.9) !important; border: 2px solid #00ff00 !important; box-shadow: 0 0 30px #00ff00 !important; }
h1, h2, h3 { color: #00ff00 !important; text-shadow: 0 0 10px #00ff00 !important; }
a { color: #00ff00 !important; }`,
      customHTML: '<pre>SYSTEM ONLINE...\nLOADING EMOTIONS...\n> sadness.exe running...</pre>'
    }
  },
  {
    username: 'dj_techno_master',
    email: 'dj@demo.com',
    password: 'password123',
    profile: {
      name: 'DJ TechnoMaster',
      bio: 'Spinning beats since 2003 🎧 | Rave culture | PLUR forever',
      age: 24,
      location: 'Miami, FL',
      mood: '🎵 vibing',
      customCSS: `body { background: #ff1493 !important; animation: sparkle 2s infinite !important; }
@keyframes sparkle { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.5); } }
.profile-container { background: rgba(255, 20, 147, 0.8) !important; border: 5px double gold !important; box-shadow: 0 0 50px gold !important; }
h1, h2, h3 { color: gold !important; text-shadow: 2px 2px #ff1493 !important; animation: rainbow 3s infinite !important; }
@keyframes rainbow { 0% { color: gold; } 33% { color: #ff1493; } 66% { color: #00ffff; } 100% { color: gold; } }`,
      customHTML: '<blink>✨ PARTY MODE ACTIVATED ✨</blink><marquee>🔥🔥🔥</marquee>'
    }
  },
  {
    username: 'indie_girl_vibes',
    email: 'indie@demo.com',
    password: 'password123',
    profile: {
      name: 'Sarah ✿ Indie Girl',
      bio: 'Vintage soul in a modern world | thrift shopping queen | Polaroid enthusiast',
      age: 20,
      location: 'Brooklyn, NY',
      mood: '🌻 groovy',
      customCSS: `body { background: #ffff00 !important; color: #000 !important; font-family: 'Comic Sans MS', cursive !important; }
.profile-container { background: #fff !important; border: 5px ridge #ff0000 !important; }
h1, h2, h3 { color: #ff0000 !important; text-decoration: underline !important; }
a { color: #0000ff !important; text-decoration: underline !important; }`,
      customHTML: '<marquee>🌈 WELCOME TO MY HOMEPAGE 🌈</marquee><center><h3>Under Construction!</h3></center>'
    }
  },
  {
    username: 'gamer_legend_99',
    email: 'gamer@demo.com',
    password: 'password123',
    profile: {
      name: 'Marcus ⚡ Gamer',
      bio: 'Halo 2 champion | Xbox Live: GamerLegend99 | 1337 h4x0r',
      age: 22,
      location: 'Austin, TX',
      mood: '🎮 pwning noobs',
      customCSS: `body { background: #0a0a0a !important; color: #00ffff !important; }
.profile-container { background: linear-gradient(135deg, #1a0033 0%, #330066 100%) !important; border: 2px solid #ff00ff !important; box-shadow: 0 0 40px #ff00ff !important; }
h1, h2, h3 { color: #ff00ff !important; text-shadow: 0 0 20px #ff00ff, 0 0 40px #00ffff !important; text-transform: uppercase !important; }`,
      customHTML: '<center>⚡ CYBERPUNK 2077 ⚡<br/>GG EZ</center>'
    }
  },
  {
    username: 'artsy_soul_2000',
    email: 'artsy@demo.com',
    password: 'password123',
    profile: {
      name: 'Brittany ✧ Artist',
      bio: 'Art student | coffee addict ☕ | vintage camera collector 📷',
      age: 23,
      location: 'Seattle, WA',
      mood: '🎨 inspired',
      customCSS: `body { background: linear-gradient(45deg, #2d2d2d 0%, #1a1a1a 100%) !important; color: #ffb3ff !important; }
.profile-container { background: rgba(45, 45, 45, 0.9) !important; border: 3px solid #b3d9ff !important; box-shadow: 0 0 30px #ffb3ff !important; }
h1, h2, h3 { color: #b3d9ff !important; text-shadow: 2px 2px #ffb3ff !important; }`,
      customHTML: '<center><i>~ aesthetic vibes only ~</i><br/>✨🌙💫</center>'
    }
  },
  {
    username: 'punk_rock_rebel',
    email: 'punk@demo.com',
    password: 'password123',
    profile: {
      name: 'Alex 🤘 Punk',
      bio: 'Punk\'s not dead | Green Day forever | anarchy in the UK 🏴',
      age: 19,
      location: 'Chicago, IL',
      mood: '🤘 rebellious',
      customCSS: `body { background: #ffb3d9 !important; color: #ff1493 !important; font-family: 'Comic Sans MS', cursive !important; }
.profile-container { background: rgba(255, 255, 255, 0.9) !important; border: 5px solid #ff69b4 !important; border-radius: 20px !important; box-shadow: 0 0 20px #ff69b4 !important; }
h1::before { content: '✨ '; }
h1::after { content: ' ✨'; }
h1, h2, h3 { color: #ff1493 !important; text-shadow: 2px 2px #ffb3d9 !important; }`,
      customHTML: '<center>🌸 kawaii desu ne~ 🌸<br/>ヽ(♡‿♡)ノ</center>'
    }
  },
  {
    username: 'hip_hop_head',
    email: 'hiphop@demo.com',
    password: 'password123',
    profile: {
      name: 'DJ Spinz 🎤',
      bio: 'Hip hop head | beatmaker | underground rap scene | check my mixtape',
      age: 25,
      location: 'Atlanta, GA',
      mood: '🔥 spitting bars',
      customCSS: `body { background: #1a1a1a !important; color: #ffd700 !important; font-family: Arial Black, sans-serif !important; }
.profile-container { background: #000 !important; border: 3px solid #ffd700 !important; box-shadow: 0 0 20px #ffd700 !important; }
h1, h2, h3 { color: #ffd700 !important; text-shadow: 2px 2px #ff0000 !important; text-transform: uppercase !important; }`,
      customHTML: '<marquee>🔥 STRAIGHT FIRE 🔥</marquee><center>REAL HIP HOP</center>'
    }
  },
  {
    username: 'beach_babe_2005',
    email: 'beach@demo.com',
    password: 'password123',
    profile: {
      name: 'Mia ☀ Beach Babe',
      bio: 'Sun, sand, and surf 🌊 | California dreaming | living my best life',
      age: 20,
      location: 'Santa Monica, CA',
      mood: '🌺 chill',
      customCSS: `body { background: linear-gradient(180deg, #87CEEB 0%, #F0E68C 100%) !important; color: #fff !important; }
.profile-container { background: rgba(255, 255, 255, 0.7) !important; border: 3px solid #FF6B6B !important; border-radius: 15px !important; }
h1, h2, h3 { color: #FF6B6B !important; text-shadow: 2px 2px #fff !important; }`,
      customHTML: '<center>🌴 Life\'s a beach 🌴<br/>🌊☀️🏄‍♀️</center>'
    }
  }
];

async function seed() {
  console.log('🌱 Seeding demo users...\n');

  for (const userData of demoUsers) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await prisma.user.create({
        data: {
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          profile: {
            create: userData.profile
          }
        }
      });

      console.log(`✅ Created: ${userData.username}`);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`⚠️  ${userData.username} already exists, skipping...`);
      } else {
        console.error(`❌ Error creating ${userData.username}:`, error.message);
      }
    }
  }

  console.log('\n🎉 Seeding complete!');
  console.log('\nDemo accounts (password: password123):');
  demoUsers.forEach(u => console.log(`  - ${u.username}`));
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
