# Database Migration Required

The schema has been updated to add thumbnail and gallery features. You need to run:

```powershell
npx prisma migrate dev --name add-thumbnails-and-galleries
npx prisma generate
```

This will:
1. Create a new migration for the schema changes
2. Apply it to your database
3. Regenerate the Prisma Client with the new fields

After running these commands, restart your dev server.
