const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function importData() {
  try {
    console.log('📥 Importing data to PostgreSQL...\n');

    // Read exported data
    const data = JSON.parse(fs.readFileSync('data-export.json', 'utf8'));

    console.log('🗑️  Cleaning existing data...');
    // Clear existing data in reverse order (respecting foreign keys)
    await prisma.photo.deleteMany();
    await prisma.album.deleteMany();
    await prisma.block.deleteMany();
    await prisma.message.deleteMany();
    await prisma.bulletin.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.top8.deleteMany();
    await prisma.friend.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    console.log('👥 Importing users...');
    for (const user of data.users) {
      await prisma.user.create({ data: user });
    }

    console.log('📝 Importing profiles...');
    for (const profile of data.profiles) {
      await prisma.profile.create({ data: profile });
    }

    console.log('🤝 Importing friends...');
    for (const friend of data.friends) {
      await prisma.friend.create({ data: friend });
    }

    console.log('⭐ Importing top8...');
    for (const top8Entry of data.top8) {
      await prisma.top8.create({ data: top8Entry });
    }

    console.log('💬 Importing comments...');
    for (const comment of data.comments) {
      await prisma.comment.create({ data: comment });
    }

    console.log('📢 Importing bulletins...');
    for (const bulletin of data.bulletins) {
      await prisma.bulletin.create({ data: bulletin });
    }

    console.log('✉️  Importing messages...');
    for (const message of data.messages) {
      await prisma.message.create({ data: message });
    }

    console.log('🚫 Importing blocks...');
    for (const block of data.blocks) {
      await prisma.block.create({ data: block });
    }

    console.log('📸 Importing albums...');
    for (const album of data.albums) {
      await prisma.album.create({ data: album });
    }

    console.log('🖼️  Importing photos...');
    for (const photo of data.photos) {
      await prisma.photo.create({ data: photo });
    }

    console.log('\n✅ Import complete!');
    console.log(`📊 Imported:`);
    console.log(`   - ${data.users.length} users`);
    console.log(`   - ${data.profiles.length} profiles (with wild CSS themes!)`);
    console.log(`   - ${data.friends.length} friendships`);
    console.log(`   - ${data.top8.length} top8 entries`);
    console.log(`   - ${data.comments.length} comments`);
    console.log(`   - ${data.bulletins.length} bulletins`);
    console.log(`   - ${data.messages.length} messages`);
    console.log(`   - ${data.blocks.length} blocks`);
    console.log(`   - ${data.albums.length} albums`);
    console.log(`   - ${data.photos.length} photos`);
    console.log('\n🎉 All your demo users and wild themes are preserved!');

  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
