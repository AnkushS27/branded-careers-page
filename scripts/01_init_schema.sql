-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_slug TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  company_description TEXT,
  logo_url TEXT,
  banner_image_url TEXT,
  culture_video_url TEXT,
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#ffffff',
  accent_color TEXT DEFAULT '#3b82f6',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create page sections table
CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL, -- about, culture, benefits, team
  section_title TEXT NOT NULL,
  section_content TEXT,
  section_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  job_slug TEXT NOT NULL,
  job_description TEXT,
  department TEXT,
  location TEXT,
  job_type TEXT, -- Full time, Part time, Contract
  employment_type TEXT, -- Permanent, Temporary, Contract
  experience_level TEXT, -- Entry, Mid, Senior
  salary_min INT,
  salary_max INT,
  salary_currency TEXT DEFAULT 'USD',
  posted_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(company_id, job_slug)
);

-- Enable RLS but do NOT create policies if auth schema doesn't exist
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
