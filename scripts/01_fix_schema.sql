-- Drop existing tables to rebuild with correct structure
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.page_sections CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;

-- Create companies table with correct columns
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  banner_url TEXT,
  culture_video_url TEXT,
  about_section TEXT,
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#ffffff',
  accent_color TEXT DEFAULT '#3b82f6',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create page sections table
CREATE TABLE public.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  order_index INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  department TEXT,
  location TEXT,
  job_type TEXT,
  employment_type TEXT,
  experience_level TEXT,
  salary_min INT,
  salary_max INT,
  salary_currency TEXT DEFAULT 'USD',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  posted_days_ago INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, slug)
);

-- Removed RLS policies that reference auth schema (not initialized yet)
-- Tables created without RLS for now - will add RLS policies separately once auth is working
