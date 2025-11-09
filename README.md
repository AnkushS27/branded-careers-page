# Careers Page Builder

A full-stack SaaS platform that allows companies to create branded careers pages and manage job postings, while candidates can browse and search open positions.

## 🚀 Quick Start

See **[QUICK_START.md](./QUICK_START.md)** for setup instructions.

```bash
# 1. Setup environment
cp .env.local.example .env.local
# Edit .env.local with your DATABASE_URL

# 2. Install & Setup
pnpm install
pnpm db:sync
pnpm db:seed

# 3. Run
pnpm dev
```

## Features

### For Recruiters

- Email/password authentication
- Create and manage company profiles
- Customize brand theme (colors, logo, banner, culture video)
- Add, edit, and remove page content sections (About Us, Culture, Benefits, etc.)
- Create, edit, and delete job postings with full details
- Publish/unpublish careers pages
- Real-time preview of public pages

### For Candidates

- Browse published careers pages by company
- Full-text search across job titles
- Filter jobs by location and type
- View detailed job information including salary ranges
- Responsive, mobile-first UI
- SEO-optimized pages with meta tags

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Neon (PostgreSQL)
- **Authentication**: Custom (email/password with hashed passwords)
- **UI Library**: shadcn/ui + Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: lucide-react
- **Schema Management**: TypeScript-based schema with migrations

## Setup Instructions

### Prerequisites

- Node.js 18+
- Supabase account
- Environment variables set up

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables in `.env.local`:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
   \`\`\`

4. Run the database migrations:

   - Open Supabase SQL editor
   - Run the scripts from `/scripts/01_init_schema.sql`
   - Optionally seed sample data from `/scripts/02_seed_data.sql`

5. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
app/
page.tsx # Landing page
layout.tsx # Root layout
globals.css # Global styles

auth/
login/ # Login page
sign-up/ # Sign up page
check-email/ # Email confirmation page

dashboard/
page.tsx # Dashboard home
[companyId]/
edit/ # Company settings
page-sections/ # Content editor
jobs/ # Jobs manager

[slug]/
careers/ # Public careers page

lib/
supabase/ # Supabase client setup
types.ts # TypeScript interfaces

components/
ui/ # shadcn components
dashboard/ # Recruiter components
public/ # Public page components

scripts/
01_init_schema.sql # Database schema
02_seed_data.sql # Sample data
\`\`\`

## Database Schema

### companies

Stores company profiles with branding and settings.

### page_sections

Reusable content sections for careers pages (About, Culture, Benefits, etc.).

### jobs

Job postings with details like title, location, salary, experience level.

## Security

- Row-Level Security (RLS) on all database tables
- User-isolated data access
- Authentication required for recruiter features
- Public read access for published careers pages only

## User Flows

### Recruiter Flow

1. Sign up / Login
2. Create company
3. Configure brand settings (colors, logo, banner)
4. Add content sections to careers page
5. Create and manage job postings
6. Publish careers page
7. Share public URL with candidates

### Candidate Flow

1. Visit company's public careers page
2. Browse and filter jobs
3. Search by job title
4. Filter by location and job type
5. View job details

## Future Improvements

- Job application forms with resume upload
- Email notifications for job applicants
- Analytics dashboard (views, applications, conversions)
- Drag-and-drop job listing reordering
- Integration with ATS systems
- Social sharing features
- Advanced search with salary filters
- Company profile ratings and reviews
- Multi-language support

## API Endpoints

### Public

- `GET /:slug/careers` - View company careers page

### Protected (Recruiter Only)

- `POST /api/companies` - Create company
- `PUT /api/companies/:id` - Update company settings
- `POST /api/jobs` - Create job posting
- `PUT /api/jobs/:id` - Update job posting
- `DELETE /api/jobs/:id` - Delete job posting

## Performance Optimizations

- Tailwind CSS with purging
- Image optimization with next/image
- Server-side rendering where possible
- Database query optimization with indexes
- Client-side caching with SWR patterns

## Deployment

Deploy to Vercel:

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## Support

For issues or questions, please open an issue on GitHub.
