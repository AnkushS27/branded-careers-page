# Branded Careers Page Builder

A multi-tenant SaaS platform where companies can create their own branded careers pages with custom styling, content sections, and job listings. Built with Next.js 15, Neon PostgreSQL, and Shadcn/ui.

## 🚀 Quick Start

```bash
# 1. Clone and install
pnpm install

# 2. Setup environment
cp .env.local.example .env.local
# Add your DATABASE_URL from Neon

# 3. Setup database
pnpm db:sync    # Creates tables
pnpm db:seed    # Adds demo data (optional)

# 4. Run development server
pnpm dev
```

Visit http://localhost:3000 to get started!

**Demo Account** (if you seeded): `demo@company.com` / `demo123`

For detailed setup instructions, see [QUICK_START.md](./QUICK_START.md)

## What It Does

**For Companies:**

- Create branded careers page with custom colors, logo, and banner
- Add content sections (About, Culture, Benefits, etc.) with drag-and-drop ordering
- Manage job postings with full details (salary, location, type, etc.)
- Toggle published/draft state to control public visibility
- Preview changes before publishing
- Get shareable URL: `yourdomain.com/company-slug/careers`

**For Job Seekers:**

- Browse company careers pages
- Search jobs by title or department
- Filter by location and job type
- View all job details including salary ranges
- Responsive design works on any device

## Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19
- **Database**: Neon PostgreSQL (serverless)
- **Authentication**: Custom bcrypt with HTTP-only cookies
- **Styling**: Tailwind CSS v4 + Shadcn/ui components
- **Language**: TypeScript
- **Drag & Drop**: @dnd-kit
- **Forms**: React Hook Form + Zod validation

## Key Features

✅ Multi-tenant architecture (each company isolated)  
✅ Custom authentication with secure password hashing  
✅ Published/Draft state for careers pages  
✅ Drag-and-drop section reordering  
✅ Full CRUD for companies, jobs, and page sections  
✅ Theme customization (3 colors, logo, banner, video)  
✅ Real-time preview before publishing  
✅ Protected routes with middleware  
✅ Responsive design throughout  
✅ Type-safe with TypeScript

## Project Structure

```
app/
  ├── page.tsx                    # Landing page
  ├── auth/                       # Login & signup pages
  ├── dashboard/                  # Company management
  ├── [slug]/
  │   ├── careers/               # Public careers page
  │   ├── preview/               # Preview (protected)
  │   └── edit/                  # Edit page (protected)
  └── api/                       # API routes
      ├── companies/             # Company CRUD
      ├── jobs/                  # Jobs CRUD
      ├── page-sections/         # Sections CRUD
      └── auth/                  # Auth endpoints

components/
  ├── ui/                        # Shadcn components
  ├── careers/                   # Public page components
  ├── dashboard/                 # Dashboard components
  └── editor/                    # Edit page components

lib/
  ├── db/
  │   ├── schema.ts              # Table definitions
  │   ├── sql-generator.ts       # SQL generation
  │   └── index.ts               # Database client
  ├── types.ts                   # TypeScript types
  └── utils.ts                   # Utilities

scripts/
  └── db.ts                      # Database CLI (sync, seed, reset)
```

## Database Schema

**users** - User accounts with bcrypt hashed passwords  
**companies** - Company profiles with branding and settings  
**page_sections** - Customizable content sections (ordered)  
**jobs** - Job postings with full details

All tables use UUID primary keys and proper foreign key relationships.

## Database Management

Custom TypeScript-based schema system with CLI commands:

```bash
pnpm db:sync      # Sync schema changes to database
pnpm db:seed      # Add demo data
pnpm db:reset     # Drop all tables and recreate (⚠️ deletes data)
pnpm db:reseed    # Reset + seed in one command
pnpm db:generate  # Generate SQL from schema files
pnpm db:status    # Check current database state
```

Schema defined in `lib/db/schema.ts` as TypeScript objects, then auto-converted to SQL.

## Authentication Flow

1. User signs up with email/password
2. Password hashed with bcrypt (10 salt rounds)
3. Auth token stored in HTTP-only cookies + localStorage
4. Middleware protects `/dashboard`, `/edit`, `/preview` routes
5. Public `/careers` pages accessible when `is_published = true`

## API Routes

All routes return JSON with proper status codes.

**Auth**

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

**Companies**

- `GET /api/companies` - List user's companies
- `POST /api/companies` - Create company
- `GET /api/companies/[id]` - Get single company
- `PUT /api/companies/[id]` - Update company
- `GET /api/companies/by-slug/[slug]` - Get by slug

**Jobs**

- `GET /api/jobs?company_id=xxx` - List company jobs
- `POST /api/jobs` - Create job
- `PUT /api/jobs/[id]` - Update job
- `DELETE /api/jobs/[id]` - Delete job

**Page Sections**

- `GET /api/page-sections?company_id=xxx` - List sections (ordered)
- `POST /api/page-sections` - Create section
- `PUT /api/page-sections/[id]` - Update section (including order)
- `DELETE /api/page-sections/[id]` - Delete section

## Environment Variables

```env
DATABASE_URL=postgresql://user:pass@host.neon.tech/db
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # or production URL
```

Get `DATABASE_URL` from your [Neon Console](https://console.neon.tech).

## Deployment

**Vercel (Recommended)**

1. Push code to GitHub
2. Import project in Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy
5. Run `pnpm db:sync` to create tables in production DB

**Manual Deployment**

1. Build: `pnpm build`
2. Start: `pnpm start`
3. Make sure environment variables are set
4. Database should be accessible from server

## Development Workflow

1. Make schema changes in `lib/db/schema.ts`
2. Run `pnpm db:sync` to apply changes
3. Update TypeScript types in `lib/types.ts` if needed
4. Test changes locally
5. Commit and push

## Security Features

- Passwords hashed with bcrypt (never stored plain text)
- HTTP-only cookies prevent XSS attacks
- Parameterized SQL queries prevent injection
- Middleware protects all authenticated routes
- Published flag controls public page visibility
- Each company's data isolated by user_id

## Known Limitations

- No image upload (users paste URLs for now)
- No job application system yet
- No email verification on signup
- No password reset functionality
- Single user per company (no teams)
- No analytics or metrics
- Limited form validation in some places

## Future Improvements

- Image upload to cloud storage (Cloudinary/S3)
- Job application forms with resume upload
- Email system (verification, notifications, password reset)
- Analytics dashboard (views, clicks, conversions)
- Team collaboration (multiple users per company)
- Custom domains for companies
- Section templates library
- API rate limiting
- Better error handling and logging
- Comprehensive test suite

## Documentation

- [QUICK_START.md](./QUICK_START.md) - Detailed setup guide
- [TECH_SPEC.md](./TECH_SPEC.md) - Technical specification and architecture
- [AGENT_LOG.md](./AGENT_LOG.md) - Development journey and decisions

## License

MIT

## Support

For issues or questions, open an issue on GitHub.
