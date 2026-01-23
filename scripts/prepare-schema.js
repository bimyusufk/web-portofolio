#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const schema = fs.readFileSync(schemaPath, 'utf-8');

// Check if we're in production (Vercel)
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

if (isProduction) {
  // Replace SQLite with PostgreSQL
  const updatedSchema = schema.replace(
    /provider = "sqlite"/,
    'provider = "postgresql"'
  );
  
  if (updatedSchema !== schema) {
    fs.writeFileSync(schemaPath, updatedSchema);
    console.log('✓ Updated schema to use PostgreSQL for production');
  }
} else {
  console.log('✓ Using SQLite for local development');
}
