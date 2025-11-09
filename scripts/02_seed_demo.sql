-- Insert demo company
INSERT INTO companies (user_id, name, slug, primary_color, secondary_color, accent_color, about_section, is_published)
VALUES (
  '00000000-0000-0000-0000-000000000001'::UUID,
  'Demo Company',
  'demo-company',
  '#1f2937',
  '#ffffff',
  '#3b82f6',
  'Welcome to our company. We are building amazing products.',
  true
);

-- Get the demo company ID for inserting related data
WITH company AS (
  SELECT id FROM companies WHERE slug = 'demo-company'
)
INSERT INTO page_sections (company_id, section_type, title, content, order_index, is_visible)
SELECT 
  company.id,
  section.section_type,
  section.title,
  section.content,
  section.order_index,
  true
FROM company,
LATERAL (
  VALUES
    ('about', 'About Us', 'We are a team of passionate engineers building the future.', 0),
    ('culture', 'Culture', 'Our culture is built on innovation, collaboration, and excellence.', 1),
    ('benefits', 'Benefits', 'Competitive salary, health insurance, and flexible work arrangements.', 2)
) AS section(section_type, title, content, order_index);

-- Insert demo jobs
WITH company AS (
  SELECT id FROM companies WHERE slug = 'demo-company'
)
INSERT INTO jobs (company_id, title, slug, department, location, job_type, employment_type, experience_level, salary_min, salary_max, salary_currency, description, posted_days_ago, is_active)
SELECT 
  company.id,
  job.title,
  job.slug,
  job.department,
  job.location,
  job.job_type,
  job.employment_type,
  job.experience_level,
  job.salary_min,
  job.salary_max,
  'USD',
  job.description,
  job.posted_days_ago,
  true
FROM company,
LATERAL (
  VALUES
    ('Full Stack Engineer', 'full-stack-engineer', 'Product', 'San Francisco, USA', 'Full time', 'Permanent', 'Senior', 150000, 200000, 'Build our next-generation platform. We are looking for experienced engineers.', 5),
    ('Product Manager', 'product-manager', 'Product', 'Remote', 'Full time', 'Permanent', 'Mid', 120000, 160000, 'Lead product strategy and execution. Shape the future of our platform.', 10),
    ('DevOps Engineer', 'devops-engineer', 'Infrastructure', 'Berlin, Germany', 'Full time', 'Permanent', 'Mid', 100000, 140000, 'Build and maintain our infrastructure. We use Kubernetes and cloud platforms.', 15)
) AS job(title, slug, department, location, job_type, employment_type, experience_level, salary_min, salary_max, description, posted_days_ago);
