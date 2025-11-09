-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  logo_url TEXT,
  banner_url TEXT,
  culture_video_url TEXT,
  about_section TEXT,
  primary_color VARCHAR(7) DEFAULT '#000000',
  secondary_color VARCHAR(7) DEFAULT '#FFFFFF',
  accent_color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  location VARCHAR(255),
  job_type VARCHAR(50),
  employment_type VARCHAR(50),
  experience_level VARCHAR(50),
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR(3) DEFAULT 'AED',
  description TEXT,
  slug VARCHAR(255),
  posted_days_ago INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Page sections table for flexible content management
CREATE TABLE page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  section_type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  content TEXT,
  order_index INTEGER,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_active ON jobs(is_active);
CREATE INDEX idx_page_sections_company_id ON page_sections(company_id);
CREATE INDEX idx_companies_slug ON companies(slug);
