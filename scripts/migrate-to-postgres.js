#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const backupPath = path.join(__dirname, '..', 'prisma', 'schema.backup.prisma');

// Check if POSTGRES_URL is set
const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!postgresUrl || !postgresUrl.startsWith('postgres')) {
  console.error('❌ POSTGRES_URL must be set to a PostgreSQL connection string');
  console.error('Example: POSTGRES_URL="postgresql://..." node scripts/migrate-to-postgres.js');
  process.exit(1);
}

async function migrateData() {
  console.log('🚀 Starting data migration from SQLite to PostgreSQL...\n');

  const { PrismaClient } = require('@prisma/client');
  
  // Read original schema
  const originalSchema = fs.readFileSync(schemaPath, 'utf-8');
  const isSqlite = originalSchema.includes('provider = "sqlite"');

  if (!isSqlite) {
    // Backup and temporarily switch to SQLite for reading
    fs.writeFileSync(backupPath, originalSchema);
    const sqliteSchema = originalSchema.replace(/provider = "postgresql"/, 'provider = "sqlite"');
    fs.writeFileSync(schemaPath, sqliteSchema);
    
    // Regenerate Prisma Client
    console.log('📦 Generating SQLite client for reading source data...');
    execSync('npx prisma generate', { stdio: 'inherit' });
  }

  try {
    // Source: SQLite (use current DATABASE_URL from .env which should be file:./dev.db)
    const sourcePrisma = new PrismaClient();

    await sourcePrisma.$connect();
    console.log('✓ Connected to SQLite source\n');
    
    // Target: PostgreSQL
    const targetPrisma = new PrismaClient({
      datasources: {
        db: {
          url: postgresUrl
        }
      }
    });
    
    await targetPrisma.$connect();
    console.log('✓ Connected to PostgreSQL target\n');

    // 1. Migrate Users
    console.log('👤 Migrating Users...');
    const users = await sourcePrisma.user.findMany();
    for (const user of users) {
      await targetPrisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user
      });
    }
    console.log(`✓ Migrated ${users.length} users\n`);

    // 2. Migrate Accounts
    console.log('🔐 Migrating Accounts...');
    const accounts = await sourcePrisma.account.findMany();
    for (const account of accounts) {
      await targetPrisma.account.upsert({
        where: { 
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId
          }
        },
        update: account,
        create: account
      });
    }
    console.log(`✓ Migrated ${accounts.length} accounts\n`);

    // 3. Migrate Sessions
    console.log('🎫 Migrating Sessions...');
    const sessions = await sourcePrisma.session.findMany();
    for (const session of sessions) {
      await targetPrisma.session.upsert({
        where: { id: session.id },
        update: session,
        create: session
      });
    }
    console.log(`✓ Migrated ${sessions.length} sessions\n`);

    // 4. Migrate Media
    console.log('📸 Migrating Media...');
    const media = await sourcePrisma.media.findMany();
    for (const item of media) {
      await targetPrisma.media.upsert({
        where: { id: item.id },
        update: item,
        create: item
      });
    }
    console.log(`✓ Migrated ${media.length} media items\n`);

    // 5. Migrate Projects
    console.log('📁 Migrating Projects...');
    const projects = await sourcePrisma.project.findMany();
    for (const project of projects) {
      await targetPrisma.project.upsert({
        where: { id: project.id },
        update: project,
        create: project
      });
    }
    console.log(`✓ Migrated ${projects.length} projects\n`);

    // 6. Migrate Research
    console.log('🔬 Migrating Research...');
    const research = await sourcePrisma.research.findMany();
    for (const paper of research) {
      await targetPrisma.research.upsert({
        where: { id: paper.id },
        update: paper,
        create: paper
      });
    }
    console.log(`✓ Migrated ${research.length} research papers\n`);

    // 7. Migrate Experiences
    console.log('💼 Migrating Experiences...');
    const experiences = await sourcePrisma.experience.findMany();
    for (const exp of experiences) {
      await targetPrisma.experience.upsert({
        where: { id: exp.id },
        update: exp,
        create: exp
      });
    }
    console.log(`✓ Migrated ${experiences.length} experiences\n`);

    // 8. Migrate Activities
    console.log('🎯 Migrating Activities...');
    const activities = await sourcePrisma.activity.findMany();
    for (const activity of activities) {
      await targetPrisma.activity.upsert({
        where: { id: activity.id },
        update: activity,
        create: activity
      });
    }
    console.log(`✓ Migrated ${activities.length} activities\n`);

    // 9. Migrate Revisions
    console.log('📝 Migrating Revisions...');
    const revisions = await sourcePrisma.revision.findMany();
    for (const revision of revisions) {
      await targetPrisma.revision.upsert({
        where: { id: revision.id },
        update: revision,
        create: revision
      });
    }
    console.log(`✓ Migrated ${revisions.length} revisions\n`);

    console.log('✅ Migration completed successfully!');
    console.log('\nSummary:');
    console.log(`  Users: ${users.length}`);
    console.log(`  Accounts: ${accounts.length}`);
    console.log(`  Sessions: ${sessions.length}`);
    console.log(`  Media: ${media.length}`);
    console.log(`  Projects: ${projects.length}`);
    console.log(`  Research: ${research.length}`);
    console.log(`  Experiences: ${experiences.length}`);
    console.log(`  Activities: ${activities.length}`);
    console.log(`  Revisions: ${revisions.length}`);

    await sourcePrisma.$disconnect();
    await targetPrisma.$disconnect();

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    // Restore original schema if we modified it
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, schemaPath);
      fs.unlinkSync(backupPath);
      console.log('\n✓ Restored original schema');
      
      // Regenerate client with original schema
      console.log('📦 Regenerating Prisma Client...');
      execSync('npx prisma generate', { stdio: 'inherit' });
    }
  }
}

// Run migration
migrateData();
