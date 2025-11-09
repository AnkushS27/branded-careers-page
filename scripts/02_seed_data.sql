-- Insert demo company
INSERT INTO companies (name, slug, primary_color, secondary_color, accent_color, about_section)
VALUES (
  'Demo Company',
  'demo-company',
  '#1A1A1A',
  '#FFFFFF',
  '#3B82F6',
  'We''re building the future of technology with a team of passionate engineers and designers. Join us to work on products that impact millions of users worldwide.'
);

-- Get the company ID we just created
DO $$
DECLARE
  company_id UUID;
BEGIN
  SELECT id INTO company_id FROM companies WHERE slug = 'demo-company';

  -- Insert sample jobs
  INSERT INTO jobs (company_id, title, department, location, job_type, employment_type, experience_level, salary_min, salary_max, salary_currency, posted_days_ago)
  VALUES
    (company_id, 'Full Stack Engineer', 'Product', 'Berlin, Germany', 'Permanent', 'Full time', 'Senior', 8, 12, 'AED', 40),
    (company_id, 'Frontend Engineer', 'Product', 'Remote', 'Permanent', 'Full time', 'Mid-level', 6, 10, 'AED', 25),
    (company_id, 'Backend Engineer', 'Product', 'San Francisco, USA', 'Permanent', 'Full time', 'Senior', 10, 15, 'AED', 15),
    (company_id, 'Product Manager', 'Product', 'Remote', 'Permanent', 'Full time', 'Mid-level', 7, 11, 'AED', 30),
    (company_id, 'UX Designer', 'Design', 'Berlin, Germany', 'Permanent', 'Full time', 'Senior', 6, 9, 'AED', 20),
    (company_id, 'DevOps Engineer', 'Infrastructure', 'Remote', 'Permanent', 'Full time', 'Senior', 9, 14, 'AED', 45);

  -- Insert page sections
  INSERT INTO page_sections (company_id, section_type, title, content, order_index)
  VALUES
    (company_id, 'culture', 'Life at Our Company', 'We believe in fostering a collaborative, inclusive environment where every team member can grow and thrive. Our culture is built on transparency, continuous learning, and a commitment to building products that matter.', 1),
    (company_id, 'benefits', 'Why Join Us', 'Competitive compensation packages, comprehensive health insurance, unlimited PTO, professional development opportunities, and a remote-first culture that respects work-life balance.', 2),
    (company_id, 'team', 'Our Team', 'Our diverse team comes from 15+ countries and brings unique perspectives to every challenge. We celebrate different backgrounds and experiences, and we''re committed to building an equitable workplace for all.', 3);
END $$;
