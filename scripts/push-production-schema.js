#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const backupPath = path.join(__dirname, '..', 'prisma', 'schema.backup.prisma');

// Read original schema
const originalSchema = fs.readFileSync(schemaPath, 'utf-8');

// Check if DATABASE_URL is PostgreSQL
const databaseUrl = process.env.DATABASE_URL || '';
const isPostgres = databaseUrl.startsWith('postgres');

if (!isPostgres) {
  console.error('❌ DATABASE_URL must be a PostgreSQL connection string');
  process.exit(1);
}

try {
  // Backup original schema
  fs.writeFileSync(backupPath, originalSchema);
  console.log('📦 Backed up original schema');

  // Update schema to PostgreSQL
  const postgresSchema = originalSchema.replace(
    /provider = "sqlite"/,
    'provider = "postgresql"'
  );
  fs.writeFileSync(schemaPath, postgresSchema);
  console.log('✓ Temporarily switched to PostgreSQL provider');

  // Run prisma db push
  console.log('🚀 Pushing schema to production database...\n');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('\n✅ Schema pushed successfully!');
} catch (error) {
  console.error('\n❌ Error pushing schema:', error.message);
  process.exit(1);
} finally {
  // Restore original schema
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, schemaPath);
    fs.unlinkSync(backupPath);
    console.log('✓ Restored original schema');
  }
}
