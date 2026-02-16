const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production' && !process.env.FORCE_SEED) {
    console.warn('Skipping seed in production. Use FORCE_SEED=true to override.');
    return;
  }

  const passwordHash = await bcrypt.hash('password123', 10);

  // Create User 1: Adam
  const user1 = await prisma.user.upsert({
    where: { email: 'adam@example.com' },
    update: {},
    create: {
      email: 'adam@example.com',
      username: 'adam',
      name: 'Adam Smith',
      passwordHash,
      plan: 'FREE',
      pages: {
        create: {
          slug: 'main',
          title: 'Adam's Profile',
          published: true,
          themeId: 'spotlight',
          blocks: {
            create: [
              {
                type: 'text',
                content: JSON.stringify({ title: 'Welcome!', text: 'This is my first Glow page.' }),
                sortOrder: 0,
              },
              {
                type: 'link',
                content: JSON.stringify({ label: 'My Website', url: 'https://example.com' }),
                sortOrder: 1,
              },
            ],
          },
        },
      },
    },
  });

  // Create User 2: Jane
  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      username: 'jane',
      name: 'Jane Doe',
      passwordHash,
      plan: 'PRO',
      pages: {
        create: {
          slug: 'main',
          title: 'Jane's Portfolio',
          published: true,
          themeId: 'minimal',
          blocks: {
            create: [
              {
                type: 'text',
                content: JSON.stringify({ title: 'About Me', text: 'I am a designer based in NYC.' }),
                sortOrder: 0,
              },
              {
                type: 'link',
                content: JSON.stringify({ label: 'Instagram', url: 'https://instagram.com/jane' }),
                sortOrder: 1,
              },
            ],
          },
        },
      },
    },
  });

  console.log('Seeding finished:', { user1: user1.email, user2: user2.email });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
