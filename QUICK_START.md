# Quick Start Guide

## 1. Setup Environment Variables

Copy the example file and add your database URL:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your Neon database URL:

```env
DATABASE_URL=postgresql://your-username:your-password@your-host.neon.tech/your-database
```

You can get this from your [Neon Console](https://console.neon.tech).

## 2. Install Dependencies

```bash
pnpm install
```

## 3. Setup Database

Create all tables:

```bash
pnpm db:sync
```

Add demo data (optional):

```bash
pnpm db:seed
```

This creates:

- Demo user: `demo@company.com` / `demo123`
- Demo company: `demo-company`
- Sample jobs and page sections

## 4. Start Development

```bash
pnpm dev
```

Visit:

- Home: http://localhost:3000
- Login: http://localhost:3000/auth/login
- Demo careers page: http://localhost:3000/demo-company/careers

## Database Commands

```bash
pnpm db:sync      # Create/update database schema
pnpm db:seed      # Add demo data
pnpm db:reset     # Drop and recreate all tables (⚠️ deletes data)
pnpm db:reseed    # Clear data and reseed
pnpm db:generate  # Generate SQL file from schema
pnpm db:status    # Check which tables exist
```

## Troubleshooting

### "No database URL found" error

Make sure you have `.env.local` file with `DATABASE_URL` set.

### Connection errors

Check your Neon database is running and the connection string is correct.

### Tables already exist

Run `pnpm db:reset` to drop and recreate, or just continue - sync uses `CREATE TABLE IF NOT EXISTS`.

## Next Steps

1. Check `DATABASE_MANAGEMENT.md` for detailed documentation
2. Check `AUTH_SETUP.md` for authentication details
3. Check `REQUIREMENTS_STATUS.md` for feature status
