# Technical Specification - Branded Careers Page

## What This Thing Actually Is

So basically this is a multi-tenant SaaS platform where companies can create their own branded careers pages. Each company gets their own URL like `/company-slug/careers` and they can customize everything - colors, content, jobs, etc. Pretty straightforward concept but theres alot of technical stuff going on underneath.

## Tech Stack (What I Used)

### Frontend

- **Next.js 15** (App Router) - Using the new app directory structure
- **React 19** - Latest version with all the new hooks
- **TypeScript** - For type safety (saved me from tons of bugs)
- **Tailwind CSS 4** - For styling everything
- **Shadcn/ui** - Component library (saved so much time)

### Backend

- **Next.js API Routes** - Custom API endpoints instead of Supabase functions
- **Neon PostgreSQL** - Serverless Postgres database
- **bcryptjs** - Password hashing (10 salt rounds)
- **HTTP-only Cookies** - For authentication tokens

### Other Libraries

- **@dnd-kit** - Drag and drop for section reordering
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Lucide React** - Icons

## Database Schema

I ended up with 4 main tables:

### Users Table

```sql
- id (UUID) - Primary key
- email (TEXT) - Unique email for login
- password_hash (TEXT) - Bcrypt hashed password
- created_at, updated_at (TIMESTAMP)
```

### Companies Table

```sql
- id (UUID) - Primary key
- user_id (UUID) - Foreign key to users (who owns this company)
- company_slug (TEXT) - URL slug like "acme-corp"
- company_name (TEXT) - Display name
- company_description (TEXT) - About the company
- logo_url (TEXT) - Company logo
- banner_image_url (TEXT) - Hero banner image
- culture_video_url (TEXT) - Embedded video URL
- primary_color (TEXT) - Brand color #1 (hex)
- secondary_color (TEXT) - Brand color #2 (hex)
- accent_color (TEXT) - Accent color (hex)
- is_published (BOOLEAN) - Whether careers page is public
- created_at, updated_at (TIMESTAMP)
```

The `is_published` flag was my idea - companies can work on their page without it being live. When false, public route returns 404.

### Page Sections Table

```sql
- id (UUID) - Primary key
- company_id (UUID) - Foreign key to companies
- section_type (TEXT) - Type like "about", "culture", etc
- section_title (TEXT) - Section heading
- section_content (TEXT) - Main content
- section_order (INT) - Order for display (important!)
- is_visible (BOOLEAN) - Can hide sections without deleting
- created_at (TIMESTAMP)
```

The `section_order` column is used everywhere with `ORDER BY section_order ASC` to maintain the drag-drop order.

### Jobs Table

```sql
- id (UUID) - Primary key
- company_id (UUID) - Foreign key to companies
- job_title (TEXT) - Job name
- job_slug (TEXT) - URL friendly slug
- job_description (TEXT) - Full description
- department (TEXT) - Like "Engineering", "Sales"
- location (TEXT) - Job location
- job_type (TEXT) - "Full-time", "Part-time", etc
- employment_type (TEXT) - "Remote", "Hybrid", "On-site"
- experience_level (TEXT) - "Entry", "Mid", "Senior"
- salary_min, salary_max (INT) - Salary range
- salary_currency (TEXT) - "USD", "EUR", etc
- posted_at, updated_at (TIMESTAMP)
```

## Authentication System

I moved away from Supabase Auth to custom bcrypt authentication. Heres how it works:

### Sign Up Flow

1. User enters email and password
2. Password gets hashed with bcrypt (10 salt rounds)
3. User record created in database
4. Auth token and user_id stored in HTTP-only cookies
5. Also stored in localStorage for client-side checks
6. Redirect to dashboard

### Login Flow

1. User enters email and password
2. Fetch user by email from database
3. Compare password with stored hash using bcrypt.compare()
4. If match, set cookies (auth_token, user_id)
5. Also set localStorage
6. Redirect to dashboard

### Logout

1. Clear HTTP-only cookies
2. Clear localStorage
3. Redirect to home

### Middleware Protection

Created comprehensive middleware that handles like 6 different edge cases:

```typescript
Protected Routes:
- /dashboard - Requires auth
- /[slug]/edit - Requires auth
- /[slug]/preview - Requires auth

Public Routes:
- /[slug]/careers - Anyone can view (if published)
- /auth/* - Login/signup pages

Redirects:
- Authenticated user on / -> /dashboard
- Unauthenticated user on protected route -> /auth/login
- Authenticated user on /auth/* -> /dashboard
```

The middleware checks for `auth_token` cookie to determine if user is authenticated.

## Custom Database Scripts

This was probably the biggest improvement I made. Instead of using some ORM or migration tool, I built custom TypeScript scripts that:

### Schema Definition (lib/db/schema.ts)

All tables defined as TypeScript objects with full type information:

```typescript
export const companiesTable: TableSchema = {
  name: 'companies',
  columns: [
    { name: 'id', type: 'UUID', primaryKey: true },
    { name: 'user_id', type: 'UUID', references: {...} },
    // etc
  ]
}
```

### SQL Generator (lib/db/sql-generator.ts)

Custom function that takes schema definitions and generates SQL:

- CREATE TABLE statements
- ALTER TABLE for modifications
- DROP TABLE for cleanup
- Handles foreign keys, defaults, constraints

### Migration Script (scripts/db.ts)

Main script with these commands:

```bash
pnpm db:sync    # Sync schema changes to database
pnpm db:seed    # Add sample data
pnpm db:reset   # Drop all tables and recreate
pnpm db:reseed  # Reset + seed
pnpm db:status  # Check current state
```

Way easier than writing raw SQL every time you need to change something.

## API Routes Structure

All API routes follow REST conventions:

### Companies

- `POST /api/companies` - Create new company
- `GET /api/companies` - Get all companies for logged in user
- `GET /api/companies/[id]` - Get single company
- `PUT /api/companies/[id]` - Update company
- `GET /api/companies/by-slug/[slug]` - Get by slug

### Jobs

- `POST /api/jobs` - Create new job
- `GET /api/jobs?company_id=xxx` - Get all jobs for company
- `PUT /api/jobs/[id]` - Update job
- `DELETE /api/jobs/[id]` - Delete job

### Page Sections

- `POST /api/page-sections` - Create section
- `GET /api/page-sections?company_id=xxx` - Get all sections (ordered!)
- `PUT /api/page-sections/[id]` - Update section
- `DELETE /api/page-sections/[id]` - Delete section

### Auth

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

All routes return JSON and use proper HTTP status codes (200, 400, 401, 500, etc).

## Key Features Implementation

### Drag and Drop Reordering

Used @dnd-kit library for this. When user drags a section:

1. `handleDragEnd` event fires
2. Calculate new order for all sections
3. Send PUT requests to update each section's `section_order`
4. Refetch sections to show new order

The tricky part was updating ALL sections orders, not just the dragged one. Had to loop through and update each one.

### Publish/Unpublish Toggle

Simple but effective:

- Switch component in edit page header
- Toggles `is_published` boolean on company
- Public careers page checks this flag
- If false, returns 404
- If true, shows page

Added a nice tooltip explaining what the toggle does cause it wasn't obvious initially.

### Banner Image Display

Banner image gets special treatment:

- If `banner_image_url` exists, show full width hero with image
- Dark overlay (bg-black/50) for text readability
- Logo, title, description overlaid on banner
- If no banner, fallback to solid color header using `primary_color`
- Responsive sizing (min-h-400 on mobile, min-h-500 on desktop)

Had issues with text getting cropped so changed from fixed height to min-height and added proper padding.

### Theme Customization

Companies can customize:

- Primary Color (main brand color)
- Secondary Color (supporting color)
- Accent Color (CTAs and highlights)
- Logo URL
- Banner Image URL
- Culture Video URL (embedded YouTube/Vimeo)

All stored as text fields in database. Colors validated as hex codes.

## Route Structure

The routing is pretty clean:

```
/ - Landing page (redirects to /dashboard if authenticated)
/auth/login - Login page
/auth/sign-up - Signup page
/dashboard - User dashboard (shows companies)
/dashboard/[companyId] - Company management (not used yet)
/[slug]/careers - Public careers page
/[slug]/preview - Preview page (protected, shows saved content)
/[slug]/edit - Edit page (protected, 3 tabs)
```

Used Next.js 15 dynamic routes with `[slug]` and `[companyId]` parameters.

Important: In Next.js 15, params are Promises so you need to await them or use React.use() hook. Spent some time fixing this everywhere.

## Security Stuff

### Password Security

- Never store plain text passwords
- Bcrypt with 10 salt rounds
- Hash happens on signup and verified on login
- Passwords never sent to client

### Cookie Security

- HTTP-only cookies (JavaScript cant access them)
- Used for auth_token and user_id
- Set in API routes, read in middleware
- Cleared on logout

### Route Protection

- Middleware checks auth on every request
- Protected routes redirect to login
- API routes check authentication
- Database queries filter by user_id

### SQL Injection Prevention

- All queries use parameterized statements
- No string concatenation for queries
- Neon client handles escaping

### XSS Prevention

- React auto-escapes output
- No dangerouslySetInnerHTML used
- User input sanitized

## Performance Considerations

### Database Queries

- Added indexes on commonly queried columns (company_id, user_id)
- ORDER BY section_order uses index
- Limited number of JOIN operations

### Code Splitting

- Dynamic imports for heavy components
- Modals loaded on demand
- Icons tree-shaken

### Image Optimization

- Using URLs instead of Next/Image (for now)
- Could add Cloudinary or similar CDN later
- Banner images should be optimized before upload

### Bundle Size

- Only importing used Shadcn components
- Tree-shaking works cause of ES modules
- No heavy dependencies

## Testing Approach

I manually tested everything but heres what should be tested:

**Unit Tests**

- Component rendering
- Form validation
- Utility functions
- Type checking

**Integration Tests**

- API routes responses
- Database CRUD operations
- Authentication flow

**E2E Tests**

- User signup -> create company -> publish
- Login -> edit content -> preview
- Public page viewing

**Performance Tests**

- Page load times
- Database query speed
- Bundle size analysis

## Known Issues & Limitations

1. **No Image Upload** - Currently users paste URLs. Should add proper upload later.
2. **No Job Applications** - Jobs are displayed but cant apply yet.
3. **No Email Verification** - Users can signup without verifying email.
4. **No Password Reset** - Forgot password functionality not implemented.
5. **No Team Collaboration** - Only one user per company right now.
6. **Limited Validation** - Some forms could use better validation.
7. **No Analytics** - Companies cant see page views or metrics.

## Deployment Setup

### Environment Variables

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_BASE_URL=http://localhost:3000 (or production URL)
```

### Vercel Deployment

1. Connect GitHub repo
2. Add environment variables
3. Deploy
4. Run database migrations (manually for now)

### Database Setup

1. Create Neon database
2. Get connection string
3. Run `pnpm db:sync` to create tables
4. Optionally run `pnpm db:seed` for test data

## Future Improvements

Things I'd add if I had more time:

1. **Image Upload** - Use Cloudinary or S3 for proper image hosting
2. **Job Applications** - Form + resume upload + email notifications
3. **Email System** - Verification emails, password reset, notifications
4. **Analytics Dashboard** - Page views, apply clicks, popular jobs
5. **Team Features** - Multiple users managing one company
6. **Custom Domains** - Companies use their own domain
7. **Templates** - Pre-built section templates companies can use
8. **API Documentation** - Swagger/OpenAPI docs
9. **Rate Limiting** - Prevent abuse of API endpoints
10. **Better Error Handling** - More specific error messages

## Technical Decisions & Why

**Why Custom Auth Instead of Supabase Auth?**
Simpler for this use case, more control, fewer dependencies.

**Why HTTP-only Cookies + localStorage?**
Cookies for server-side auth (secure), localStorage for client-side state.

**Why Custom Migration Scripts?**
More control, easier to understand, no ORM overhead.

**Why Neon Instead of Supabase?**
Just PostgreSQL, no extra features needed, cheaper probably.

**Why @dnd-kit Instead of react-beautiful-dnd?**
Better maintained, more flexible, works with React 19.

**Why Not Using Next/Image?**
Keeping it simple with URLs, can optimize later.

**Why Shadcn Instead of MUI/Chakra?**
Copy-paste components, full control, no runtime overhead.

## Code Organization

```
app/
  - Route handlers and pages
  - [slug]/ - Dynamic routes for companies
  - api/ - API route handlers
  - auth/ - Auth pages

components/
  - ui/ - Shadcn components
  - careers/ - Public facing components
  - editor/ - Dashboard/edit components
  - dashboard/ - Dashboard specific

lib/
  - db/ - Database schema, migrations, queries
  - auth.ts - Auth utilities
  - types.ts - TypeScript types
  - utils.ts - Helper functions

scripts/
  - db.ts - Database management CLI
```

Everything is pretty modular and easy to find.

## Conclusion

Overall the tech stack is pretty modern and the architecture is solid. Theres definitely room for improvement (especially around testing and error handling) but for a MVP its working well. The custom database scripts were probably the best decision cause they make schema changes super easy. Authentication could be more robust but its secure enough for now.

Main thing is everything is typed with TypeScript which catches alot of bugs, and the component structure is modular so its easy to add features later.
