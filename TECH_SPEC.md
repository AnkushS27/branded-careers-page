# Technical Specification

## Architecture Overview

### Multi-Tenant SaaS Architecture
The platform supports multiple companies (tenants) using a single application instance. Each company is isolated through database-level row-level security (RLS) policies.

### Data Model

#### Companies Table
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to auth.users
- `company_slug` (TEXT): URL-safe company identifier
- `company_name` (TEXT): Display name
- `company_description` (TEXT): Company bio
- `logo_url`, `banner_image_url`, `culture_video_url` (TEXT): Media URLs
- `primary_color`, `secondary_color`, `accent_color` (TEXT): Brand colors (hex)
- `is_published` (BOOLEAN): Public visibility flag

#### Page Sections Table
- `id` (UUID): Primary key
- `company_id` (UUID): Foreign key to companies
- `section_type` (TEXT): about, culture, benefits, team, values
- `section_title` (TEXT): Display title
- `section_content` (TEXT): HTML-safe content
- `section_order` (INT): Display order
- `is_visible` (BOOLEAN): Visibility flag

#### Jobs Table
- `id` (UUID): Primary key
- `company_id` (UUID): Foreign key to companies
- `job_title`, `job_slug` (TEXT): Job identifier
- `job_description` (TEXT): Full job description
- `department`, `location` (TEXT): Job metadata
- `job_type`, `employment_type`, `experience_level` (TEXT): Classification
- `salary_min`, `salary_max` (INT): Salary range
- `salary_currency` (TEXT): Currency code
- `posted_at`, `updated_at` (TIMESTAMP): Audit timestamps

### Authentication Flow

1. **Sign Up**: Supabase Auth creates user with email/password
2. **Email Confirmation**: User confirms email (required before using app)
3. **Token Refresh**: Middleware automatically refreshes tokens
4. **Session Management**: Cookies stored securely
5. **Logout**: Auth state cleared on client and server

### RLS Policies

**Companies**:
- SELECT: User can view only their companies
- INSERT: Authenticated users can create companies
- UPDATE/DELETE: Only company owner can modify

**Page Sections**:
- All operations: Only accessible by company owner
- Query: Nested through company ownership check

**Jobs**:
- SELECT: Owner can view all; public read if company is published
- INSERT/UPDATE/DELETE: Only company owner
- Query: Candidates see published jobs from published companies

### API Design

All business logic implemented as Server Components or Server Actions.

**Benefits**:
- Reduced client-side code
- Secure by default (no token exposure)
- Direct database access with RLS enforcement
- Better SEO (server-rendered pages)

### Performance Strategy

1. **Database**: Indexes on company_id, user_id, published status
2. **Caching**: ISR (Incremental Static Regeneration) for careers pages
3. **Code Splitting**: Dynamic imports for modals and dialogs
4. **Bundle Size**: Tree-shaking of unused UI components
5. **Images**: URL-based, delegated to CDN

### Security Measures

1. **RLS**: All tables protected at database level
2. **Middleware**: Protects /dashboard routes
3. **CSRF**: Automatic Next.js protection
4. **SQL Injection**: Parameterized queries via Supabase client
5. **XSS**: React's built-in HTML escaping

### Scalability Considerations

1. **Database**: PostgreSQL handles millions of rows efficiently
2. **Multi-region**: Supabase supports read replicas
3. **Rate Limiting**: Implement per-user API limits
4. **Caching Layer**: Redis for session/job caching
5. **CDN**: Media URLs via Supabase Storage or external CDN

### Testing Strategy

**Unit Tests**: Component logic, type checking
**Integration Tests**: API routes, database queries
**E2E Tests**: User flows (signup, create company, publish)
**Performance Tests**: Page load times, query efficiency

### Error Handling

- Global error boundary at app level
- User-friendly error messages
- Fallback UI for loading states
- Toast notifications for actions
- Console logging for debugging

### Monitoring & Analytics

- Error tracking (Sentry integration recommended)
- Performance monitoring (Web Vitals)
- User analytics (Mixpanel/Amplitude)
- Database query logging

## Deployment

### Vercel (Recommended)
- Automatic deployments on git push
- Environment variables managed in Vercel dashboard
- Edge Functions for middleware
- Automatic previews for PRs

### Self-hosted
- Docker containerization
- PM2 or systemd for process management
- Nginx reverse proxy
- SSL certificates via Let's Encrypt

### Environment Configuration

\`\`\`
Development:
  - NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL = http://localhost:3000

Production:
  - NEXT_PUBLIC_SUPABASE_URL = [Supabase URL]
  - NEXT_PUBLIC_SUPABASE_ANON_KEY = [Anon Key]
\`\`\`

## Future Roadmap

1. **Q1**: Application forms with resume upload
2. **Q2**: Analytics dashboard, email notifications
3. **Q3**: ATS integrations, advanced search
4. **Q4**: Multi-language, mobile app
