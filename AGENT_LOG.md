# Development Journey - Branded Careers Page

## How This Project Came Together

### Starting Point

So I started this whole thing with v0. Just threw in some prompts about what I wanted - a careers page builder where companies can create their own branded job listings. v0 gave me the basic structure, some rough API routes, and a basic wireframe to work with. It wasn't perfect but it was a good starting point I guess.

### Getting It Working Locally

First thing I did was import everything to my local machine and see what actually works and what doesn't. Honestly, there were quite a few errors right off the bat, especially with the database connection. The connection strings were wrong, some environment variables weren't set up properly, and the Neon database wasn't connecting at all initially.

I spent good amount of time just identifying errors one by one. Would run the app, see an error, fix it, run again, see another error. You know how it goes. The v0 generated code had these scripts for generating tables and doing migrations which was nice in theory but didnt work smoothly.

### Database Setup & Schema Management

The biggest change I made was overhauling how database migrations work. v0 had some basic scripts but they were kinda messy and hard to maintain. So I created this whole schema model file system where I define all my tables in TypeScript files with proper types and everything.

Made custom functions that can:

- Migrate changes automatically
- Seed data for testing
- Sync database when schema changes
- Reset everything if needed

Then added them all to package.json so I can just run commands like `pnpm db:sync` or `pnpm db:reset` instead of running some long complicated commands. Way easier to work with.

Also built this SQL generator function that creates, modifies, and alters tables automatically. It generates SQL queries based on the schema definitions so I don't have to write raw SQL every time. Saves alot of time honestly.

### Building Out Features

After getting the database stable, I focused on making the actual features work properly:

**Authentication & Middleware**

- Moved from Supabase auth to custom bcrypt authentication (seemed simpler for this use case)
- Set up HTTP-only cookies for security
- Created comprehensive middleware to protect routes
- Made sure /dashboard, /edit, /preview routes are protected but /careers is public

**Draft/Published Feature**
This was my idea - I thought it would be useful if companies could work on their careers page without it being live immediately. So I added an `is_published` flag to the companies table. When its false, the public careers page returns 404. When true, anyone can see it. Pretty straightforward but really useful.

Also added a nice toggle switch on the edit page with a tooltip explaining what it does. Used Shadcn's Switch component for that.

**Content Management**

- Built a sections manager where companies can add different content sections
- Added drag and drop reordering using @dnd-kit (this took some time to get right)
- Made sure the order saves to database with a `section_order` column
- All queries now use ORDER BY section_order ASC so sections display correctly

**Banner & Styling**

- Added banner image support (was missing initially)
- Made sure banner displays full width with proper text overlay
- Added secondary color field to theme editor
- Fixed alot of responsive design issues

### Using AI Tools (Claude Sonnet 4.5)

I used GitHub Copilot with Claude Sonnet 4.5 model for most of the implementation work. My workflow was basically:

1. Figure out what I need to build (brainstorming myself)
2. Ask the agent to implement it
3. Review the generated code carefully
4. Test it thoroughly
5. Ask for fixes if something doesn't work

The agent was super helpful for:

- Generating API routes quickly
- Creating UI components with proper TypeScript types
- Fixing bugs and errors
- Adding features like drag-and-drop
- Updating existing code when requirements changed

But I made sure to review everything. Sometimes the agent would generate code that looked good but had bugs or didn't handle edge cases. So I always tested each part completely before moving on.

### Testing Everything

Made sure to test each part of the application:

- Middleware works correctly (redirects, auth checks, etc)
- All API routes handle errors properly
- Database queries return correct data
- UI components render correctly
- Forms validate input
- Authentication flow works end to end
- Published/draft toggle works as expected
- Drag and drop saves order correctly

Also checked code modularity - making sure components are reusable, functions are single-purpose, and everything is properly typed with TypeScript.

### Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS
- **UI Components**: Shadcn/ui (with lots of components)
- **Database**: Neon PostgreSQL
- **Authentication**: Custom bcrypt with HTTP-only cookies
- **Drag & Drop**: @dnd-kit
- **Forms**: React Hook Form with Zod validation

### What I Learned

- Database schema planning is super important. Getting it right early saves tons of time later
- Custom migration scripts are way better than relying on ORMs for simple projects
- Middleware in Next.js 15 is powerful but you need to handle all the edge cases
- Drag and drop is harder than it looks (especially saving the order properly)
- AI tools are great but you still need to understand what the code does
- Testing each feature completely before moving to next one prevents huge debugging sessions later

### Things That Gave Me Trouble

- Next.js 15 params being Promises took some time to understand and fix everywhere
- Getting the banner image to not crop text was annoying (had to try multiple approaches)
- Database column naming inconsistencies caused bugs until I standardized everything
- Drag and drop library had some quirks with updating state
- Middleware matching patterns needed careful configuration

### Current State

The app is pretty much complete now. Companies can:

- Sign up and create account
- Create company profile with branding (colors, logo, banner, etc)
- Add content sections in any order
- Manage jobs (create, edit, delete)
- Toggle published/draft state
- Preview before publishing

Public users can:

- View published careers pages
- Search and filter jobs
- See company branding and culture content

Everything is tested and working. Code is modular and maintainable. Ready for deployment basically.

### Future Ideas

Some things that could be added later:

- Job application system (right now just displays jobs)
- Analytics for companies (page views, apply clicks)
- Custom domains for companies
- More theme customization options
- Email notifications
- Team collaboration (multiple users per company)

But for now its a solid MVP that does what its supposed to do.
