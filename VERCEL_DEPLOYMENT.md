# Vercel Deployment Guide

## Prerequisites

1. A Vercel account
2. GitHub repository connected to Vercel
3. Vercel Postgres database (or any PostgreSQL database)

## Setup Steps

### 1. Create Vercel Postgres Database

1. Go to your Vercel project dashboard
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose a name and region
6. Click **Create**

### 2. Set Environment Variables

Go to **Settings** → **Environment Variables** and add:

#### Required Variables

```env
# Database (Auto-populated if using Vercel Postgres)
DATABASE_URL=postgresql://user:password@host:5432/database

# Auth
AUTH_SECRET=<generate with: openssl rand -base64 32>
AUTH_URL=https://your-domain.vercel.app

# GitHub OAuth (for admin login)
AUTH_GITHUB_ID=<your-github-oauth-app-client-id>
AUTH_GITHUB_SECRET=<your-github-oauth-app-client-secret>
```

#### Optional Variables

```env
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 3. Set Up GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click **New OAuth App**
3. Set:
   - Application name: `Your Portfolio Admin`
   - Homepage URL: `https://your-domain.vercel.app`
   - Authorization callback URL: `https://your-domain.vercel.app/api/auth/callback/github`
4. Copy **Client ID** → use for `AUTH_GITHUB_ID`
5. Generate **Client Secret** → use for `AUTH_GITHUB_SECRET`

### 4. Push Database Schema

After setting up the database, run migrations using the helper script:

**PowerShell:**
```powershell
# Pull environment variables from Vercel
vercel env pull .env.production

# Push schema to production (uses unpooled connection)
$env:DATABASE_URL="<your-database-url-unpooled>"; node scripts/push-production-schema.js
```

**Bash/Mac/Linux:**
```bash
vercel env pull .env.production
DATABASE_URL="<your-database-url-unpooled>" node scripts/push-production-schema.js
```

The script will:
- Temporarily switch schema to PostgreSQL
- Push schema to production
- Restore local SQLite schema

### 5. Deploy

Push to your `main` branch or click **Deploy** in Vercel dashboard.

## Troubleshooting

### "Environment variable not found: DATABASE_URL"

- Make sure `DATABASE_URL` is set in Vercel environment variables
- Check that it's available for **Production**, **Preview**, and **Development** environments
- Redeploy after adding environment variables

### Prisma Client not generated

- The `postinstall` script in `package.json` should handle this automatically
- If issues persist, add a custom build command in Vercel:
  ```
  npm run build
  ```

### Database connection issues

- Verify the `DATABASE_URL` format is correct for PostgreSQL
- Ensure the database allows connections from Vercel's IP ranges
- Check that SSL is configured if required

## Local Development

For local development with PostgreSQL:

1. Copy `.env.example` to `.env.local`
2. Set up a local PostgreSQL database or use a cloud service
3. Update `DATABASE_URL` in `.env.local`
4. Run migrations:
   ```bash
   npx prisma db push
   ```
5. Start dev server:
   ```bash
   npm run dev
   ```

## Migration from SQLite

If migrating from SQLite to PostgreSQL:

1. Export data from SQLite
2. Set up PostgreSQL database
3. Update `DATABASE_URL` to PostgreSQL
4. Run `npx prisma db push`
5. Import data into PostgreSQL
