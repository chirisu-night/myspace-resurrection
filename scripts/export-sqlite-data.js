const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function exportData() {
  try {
    console.log('📦 Exporting SQLite data...\n');

    // Export all tables
    const users = await prisma.user.findMany();
    const profiles = await prisma.profile.findMany();
    const friends = await prisma.friend.findMany();
    const top8 = await prisma.top8.findMany();
    const comments = await prisma.comment.findMany();
    const bulletins = await prisma.bulletin.findMany();
    const messages = await prisma.message.findMany();
    const blocks = await prisma.block.findMany();
    const albums = await prisma.album.findMany();
    const photos = await prisma.photo.findMany();

    const data = {
      users,
      profiles,
      friends,
      top8,
      comments,
      bulletins,
      messages,
      blocks,
      albums,
      photos,
      exportedAt: new Date().toISOString()
    };

    // Save to JSON file
    fs.writeFileSync('data-export.json', JSON.stringify(data, null, 2));

    console.log('✅ Export complete!');
    console.log(`📊 Exported:`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${profiles.length} profiles`);
    console.log(`   - ${friends.length} friendships`);
    console.log(`   - ${top8.length} top8 entries`);
    console.log(`   - ${comments.length} comments`);
    console.log(`   - ${bulletins.length} bulletins`);
    console.log(`   - ${messages.length} messages`);
    console.log(`   - ${blocks.length} blocks`);
    console.log(`   - ${albums.length} albums`);
    console.log(`   - ${photos.length} photos`);
    console.log('\n💾 Saved to: data-export.json');

  } catch (error) {
    console.error('❌ Export failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
