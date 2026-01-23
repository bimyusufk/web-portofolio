const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Build an absolute sqlite path so it works even if DATABASE_URL is unset or relative
const sqlitePath = `file:${path.resolve(__dirname, '..', 'prisma', 'dev.db').replace(/\\/g, '/')}`;

(async () => {
  console.log('Using sqlite path:', sqlitePath);
  const prisma = new PrismaClient({
    datasources: {
      db: { url: sqlitePath },
    },
  });
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const experience = await prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    });

    console.log(JSON.stringify({ projects, experience }, null, 2));
  } catch (err) {
    console.error('Error dumping data:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
