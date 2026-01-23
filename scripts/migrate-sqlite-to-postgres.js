#!/usr/bin/env node

const sqlite3 = require('sqlite3');
const { Client } = require('pg');

const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!postgresUrl || !postgresUrl.startsWith('postgres')) {
  console.error('❌ POSTGRES_URL must be set to a PostgreSQL connection string');
  console.error('Example: POSTGRES_URL="postgresql://..." node scripts/migrate-sqlite-to-postgres.js');
  process.exit(1);
}

async function migrateData() {
  console.log('🚀 Starting data migration from SQLite to PostgreSQL...\n');

  // Connect to SQLite
  const sqlite = new sqlite3.Database('./prisma/dev.db', (err) => {
    if (err) {
      console.error('❌ Failed to connect to SQLite:', err.message);
      process.exit(1);
    }
  });
  
  console.log('✓ Connected to SQLite\n');

  // Connect to PostgreSQL
  const pg = new Client({
    connectionString: postgresUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await pg.connect();
    console.log('✓ Connected to PostgreSQL\n');

    // Helper to get all rows from SQLite
    const getAllRows = (table) => {
      return new Promise((resolve, reject) => {
        sqlite.all(`SELECT * FROM "${table}"`, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    };

    // Helper to convert SQLite timestamp to ISO string
    const toISODate = (value) => {
      if (!value) return null;
      if (typeof value === 'number') {
        return new Date(value).toISOString();
      }
      return value;
    };

    // Migrate Users
    console.log('👤 Migrating Users...');
    const users = await getAllRows('User');
    for (const user of users) {
      await pg.query(
        `INSERT INTO "User" (id, name, email, "emailVerified", image, "githubId", role, "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name, email = EXCLUDED.email, "emailVerified" = EXCLUDED."emailVerified",
         image = EXCLUDED.image, "githubId" = EXCLUDED."githubId", role = EXCLUDED.role`,
        [user.id, user.name, user.email, toISODate(user.emailVerified), user.image, user.githubId, user.role, toISODate(user.createdAt)]
      );
    }
    console.log(`✓ Migrated ${users.length} users\n`);

    // Migrate Accounts
    console.log('🔐 Migrating Accounts...');
    const accounts = await getAllRows('Account');
    for (const acc of accounts) {
      await pg.query(
        `INSERT INTO "Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (provider, "providerAccountId") DO NOTHING`,
        [acc.id, acc.userId, acc.type, acc.provider, acc.providerAccountId, acc.refresh_token, acc.access_token, acc.expires_at, acc.token_type, acc.scope, acc.id_token, acc.session_state]
      );
    }
    console.log(`✓ Migrated ${accounts.length} accounts\n`);

    // Migrate Media
    console.log('📸 Migrating Media...');
    const media = await getAllRows('Media');
    for (const item of media) {
      // Map old schema to new schema
      await pg.query(
        `INSERT INTO "Media" (id, filename, url, "mimeType", width, height, size, "altText", caption, "uploadedById", "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET
         filename = EXCLUDED.filename, url = EXCLUDED.url, "mimeType" = EXCLUDED."mimeType"`,
        [
          item.id, 
          item.filename || item.url.split('/').pop(), // Use filename or extract from URL
          item.url, 
          item.type || 'image/jpeg', // Old 'type' column becomes mimeType
          null, // width
          null, // height
          null, // size
          null, // altText
          null, // caption
          item.uploadedById, 
          toISODate(item.createdAt)
        ]
      );
    }
    console.log(`✓ Migrated ${media.length} media items\n`);

    // Migrate Projects
    console.log('📁 Migrating Projects...');
    const projects = await getAllRows('Project');
    for (const proj of projects) {
      await pg.query(
        `INSERT INTO "Project" (id, title, slug, summary, "contentMDX", status, featured, tech, tags, images, "thumbnailId", "creatorId", "createdAt", "updatedAt", "publishedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title, summary = EXCLUDED.summary, "contentMDX" = EXCLUDED."contentMDX",
         status = EXCLUDED.status, featured = EXCLUDED.featured, tech = EXCLUDED.tech,
         tags = EXCLUDED.tags, images = EXCLUDED.images, "thumbnailId" = EXCLUDED."thumbnailId",
         "updatedAt" = EXCLUDED."updatedAt", "publishedAt" = EXCLUDED."publishedAt"`,
        [proj.id, proj.title, proj.slug, proj.summary, proj.contentMDX, proj.status, proj.featured, proj.tech, proj.tags, proj.images, proj.thumbnailId, proj.creatorId, toISODate(proj.createdAt), toISODate(proj.updatedAt), toISODate(proj.publishedAt)]
      );
    }
    console.log(`✓ Migrated ${projects.length} projects\n`);

    // Migrate Research
    console.log('🔬 Migrating Research...');
    const research = await getAllRows('Research');
    for (const paper of research) {
      await pg.query(
        `INSERT INTO "Research" (id, title, slug, summary, "contentMDX", authors, venue, year, doi, "pdfUrl", tags, status, "thumbnailId", "creatorId", "createdAt", "updatedAt", "publishedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title, summary = EXCLUDED.summary, "contentMDX" = EXCLUDED."contentMDX",
         authors = EXCLUDED.authors, venue = EXCLUDED.venue, year = EXCLUDED.year, doi = EXCLUDED.doi,
         "pdfUrl" = EXCLUDED."pdfUrl", tags = EXCLUDED.tags, status = EXCLUDED.status,
         "thumbnailId" = EXCLUDED."thumbnailId", "updatedAt" = EXCLUDED."updatedAt", "publishedAt" = EXCLUDED."publishedAt"`,
        [paper.id, paper.title, paper.slug, paper.summary, paper.contentMDX, paper.authors, paper.venue, paper.year, paper.doi, paper.pdfUrl, paper.tags, paper.status, paper.thumbnailId, paper.creatorId, toISODate(paper.createdAt), toISODate(paper.updatedAt), toISODate(paper.publishedAt)]
      );
    }
    console.log(`✓ Migrated ${research.length} research papers\n`);

    // Migrate Experiences
    console.log('💼 Migrating Experiences...');
    const experiences = await getAllRows('Experience');
    for (const exp of experiences) {
      await pg.query(
        `INSERT INTO "Experience" (id, company, role, "startDate", "endDate", location, "descriptionMDX", highlights, "order", "thumbnailId", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO UPDATE SET
         company = EXCLUDED.company, role = EXCLUDED.role, "startDate" = EXCLUDED."startDate",
         "endDate" = EXCLUDED."endDate", location = EXCLUDED.location, "descriptionMDX" = EXCLUDED."descriptionMDX",
         highlights = EXCLUDED.highlights, "order" = EXCLUDED."order", "thumbnailId" = EXCLUDED."thumbnailId",
         "updatedAt" = EXCLUDED."updatedAt"`,
        [exp.id, exp.company, exp.role, toISODate(exp.startDate), toISODate(exp.endDate), exp.location, exp.descriptionMDX, exp.highlights, exp.order, exp.thumbnailId, toISODate(exp.createdAt), toISODate(exp.updatedAt)]
      );
    }
    console.log(`✓ Migrated ${experiences.length} experiences\n`);

    // Migrate Activities
    console.log('🎯 Migrating Activities...');
    const activities = await getAllRows('Activity');
    for (const activity of activities) {
      await pg.query(
        `INSERT INTO "Activity" (id, title, type, date, "descriptionMDX", links, "thumbnailId", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title, type = EXCLUDED.type, date = EXCLUDED.date,
         "descriptionMDX" = EXCLUDED."descriptionMDX", links = EXCLUDED.links,
         "thumbnailId" = EXCLUDED."thumbnailId", "updatedAt" = EXCLUDED."updatedAt"`,
        [activity.id, activity.title, activity.type, toISODate(activity.date), activity.descriptionMDX, activity.links, activity.thumbnailId, toISODate(activity.createdAt), toISODate(activity.updatedAt)]
      );
    }
    console.log(`✓ Migrated ${activities.length} activities\n`);

    console.log('✅ Migration completed successfully!');
    console.log('\nSummary:');
    console.log(`  Users: ${users.length}`);
    console.log(`  Accounts: ${accounts.length}`);
    console.log(`  Media: ${media.length}`);
    console.log(`  Projects: ${projects.length}`);
    console.log(`  Research: ${research.length}`);
    console.log(`  Experiences: ${experiences.length}`);
    console.log(`  Activities: ${activities.length}`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    sqlite.close();
    await pg.end();
  }
}

migrateData();
