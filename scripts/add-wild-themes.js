const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const wildThemes = {
  // Emo/Scene Kid Theme
  emo: `
    body { 
      background: #000 url('https://i.imgur.com/emo-bg.jpg') fixed !important;
      color: #ff00ff !important;
      font-family: 'Comic Sans MS', cursive !important;
    }
    .profile-container {
      background: linear-gradient(45deg, #000, #330033, #000) !important;
      border: 3px solid #ff00ff !important;
      box-shadow: 0 0 20px #ff00ff !important;
    }
    h1, h2, h3 { 
      color: #ff00ff !important;
      text-shadow: 2px 2px #000, -2px -2px #ff00ff !important;
      font-family: 'Comic Sans MS', cursive !important;
    }
    a { 
      color: #00ffff !important;
      text-decoration: none !important;
    }
    a:hover { 
      color: #ff00ff !important;
      text-shadow: 0 0 10px #ff00ff !important;
    }
  `,

  // Vaporwave Aesthetic
  vaporwave: `
    body {
      background: linear-gradient(180deg, #ff71ce 0%, #01cdfe 50%, #05ffa1 100%) !important;
      color: #fff !important;
      font-family: 'Courier New', monospace !important;
    }
    .profile-container {
      background: rgba(255, 113, 206, 0.3) !important;
      border: 2px solid #01cdfe !important;
      backdrop-filter: blur(10px) !important;
    }
    h1, h2, h3 {
      color: #ff71ce !important;
      text-shadow: 3px 3px #01cdfe, 6px 6px #05ffa1 !important;
      font-family: 'Courier New', monospace !important;
      letter-spacing: 5px !important;
    }
    a {
      color: #01cdfe !important;
      text-decoration: underline wavy #ff71ce !important;
    }
  `,

  // Matrix Hacker Theme
  matrix: `
    body {
      background: #000 !important;
      color: #00ff00 !important;
      font-family: 'Courier New', monospace !important;
    }
    .profile-container {
      background: rgba(0, 20, 0, 0.9) !important;
      border: 2px solid #00ff00 !important;
      box-shadow: 0 0 30px #00ff00 !important;
    }
    h1, h2, h3 {
      color: #00ff00 !important;
      text-shadow: 0 0 10px #00ff00 !important;
      font-family: 'Courier New', monospace !important;
    }
    a {
      color: #00ff00 !important;
      text-decoration: none !important;
    }
    a:hover {
      background: #00ff00 !important;
      color: #000 !important;
    }
  `,

  // Glitter Bomb
  glitter: `
    body {
      background: #ff1493 url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="10" cy="10" r="2" fill="gold"/><circle cx="30" cy="20" r="3" fill="silver"/><circle cx="50" cy="15" r="2" fill="gold"/><circle cx="70" cy="25" r="3" fill="pink"/><circle cx="90" cy="10" r="2" fill="gold"/></svg>') !important;
      animation: sparkle 2s infinite !important;
    }
    @keyframes sparkle {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.5); }
    }
    .profile-container {
      background: rgba(255, 20, 147, 0.8) !important;
      border: 5px double gold !important;
      box-shadow: 0 0 50px gold, inset 0 0 50px rgba(255, 215, 0, 0.3) !important;
    }
    h1, h2, h3 {
      color: gold !important;
      text-shadow: 2px 2px #ff1493, -2px -2px gold, 0 0 20px gold !important;
      animation: rainbow 3s infinite !important;
    }
    @keyframes rainbow {
      0% { color: gold; }
      33% { color: #ff1493; }
      66% { color: #00ffff; }
      100% { color: gold; }
    }
  `,

  // Retro 90s Geocities
  geocities: `
    body {
      background: #ffff00 url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="10" height="10" fill="red"/><rect x="10" y="10" width="10" height="10" fill="red"/></svg>') !important;
      color: #000 !important;
      font-family: 'Comic Sans MS', cursive !important;
    }
    .profile-container {
      background: #fff !important;
      border: 5px ridge #ff0000 !important;
    }
    h1, h2, h3 {
      color: #ff0000 !important;
      font-family: 'Comic Sans MS', cursive !important;
      text-decoration: underline !important;
    }
    marquee {
      color: #0000ff !important;
      font-weight: bold !important;
    }
    a {
      color: #0000ff !important;
      text-decoration: underline !important;
    }
    a:visited {
      color: #800080 !important;
    }
  `,

  // Cyberpunk Neon
  cyberpunk: `
    body {
      background: #0a0a0a !important;
      color: #00ffff !important;
      font-family: 'Arial Black', sans-serif !important;
    }
    .profile-container {
      background: linear-gradient(135deg, #1a0033 0%, #330066 100%) !important;
      border: 2px solid #ff00ff !important;
      box-shadow: 0 0 40px #ff00ff, inset 0 0 40px rgba(255, 0, 255, 0.2) !important;
    }
    h1, h2, h3 {
      color: #ff00ff !important;
      text-shadow: 0 0 20px #ff00ff, 0 0 40px #00ffff !important;
      text-transform: uppercase !important;
      letter-spacing: 3px !important;
    }
    a {
      color: #00ffff !important;
      text-shadow: 0 0 10px #00ffff !important;
    }
  `,

  // Pastel Goth
  pastelgoth: `
    body {
      background: linear-gradient(45deg, #2d2d2d 0%, #1a1a1a 100%) !important;
      color: #ffb3ff !important;
      font-family: 'Georgia', serif !important;
    }
    .profile-container {
      background: rgba(45, 45, 45, 0.9) !important;
      border: 3px solid #b3d9ff !important;
      box-shadow: 0 0 30px #ffb3ff !important;
    }
    h1, h2, h3 {
      color: #b3d9ff !important;
      text-shadow: 2px 2px #ffb3ff !important;
      font-family: 'Georgia', serif !important;
    }
    a {
      color: #ffccff !important;
    }
  `,

  // Kawaii Overload
  kawaii: `
    body {
      background: #ffb3d9 url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><text x="10" y="30" font-size="30">🌸</text></svg>') !important;
      color: #ff1493 !important;
      font-family: 'Comic Sans MS', cursive !important;
    }
    .profile-container {
      background: rgba(255, 255, 255, 0.9) !important;
      border: 5px solid #ff69b4 !important;
      border-radius: 20px !important;
      box-shadow: 0 0 20px #ff69b4 !important;
    }
    h1, h2, h3 {
      color: #ff1493 !important;
      text-shadow: 2px 2px #ffb3d9 !important;
      font-family: 'Comic Sans MS', cursive !important;
    }
    h1::before { content: '✨ '; }
    h1::after { content: ' ✨'; }
    a {
      color: #ff69b4 !important;
    }
  `
};

async function addWildThemes() {
  try {
    const users = await prisma.user.findMany({
      include: { profile: true },
      take: 10
    });

    console.log(`Found ${users.length} users`);

    const themeNames = Object.keys(wildThemes);
    
    for (let i = 0; i < users.length && i < themeNames.length; i++) {
      const user = users[i];
      const themeName = themeNames[i];
      const themeCSS = wildThemes[themeName];

      if (user.profile) {
        await prisma.profile.update({
          where: { id: user.profile.id },
          data: { customCSS: themeCSS }
        });
        console.log(`✅ Applied ${themeName} theme to ${user.username}`);
      }
    }

    console.log('\n🎨 Wild themes applied successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addWildThemes();
