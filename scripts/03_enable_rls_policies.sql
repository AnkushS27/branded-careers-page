-- Separate RLS policies file to be run AFTER Supabase auth is initialized
-- Run this script after the main schema is created and auth.users table is available

-- Policies for companies table
CREATE POLICY "Companies visible to owner" ON public.companies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Companies insertable by authenticated users" ON public.companies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Companies updatable by owner" ON public.companies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Companies deletable by owner" ON public.companies
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for page sections (recruiter only)
CREATE POLICY "Page sections visible to company owner" ON public.page_sections
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM public.companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Page sections insertable by company owner" ON public.page_sections
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT id FROM public.companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Page sections updatable by company owner" ON public.page_sections
  FOR UPDATE USING (
    company_id IN (
      SELECT id FROM public.companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Page sections deletable by company owner" ON public.page_sections
  FOR DELETE USING (
    company_id IN (
      SELECT id FROM public.companies WHERE user_id = auth.uid()
    )
  );

-- Policies for jobs (recruiter management, public read)
CREATE POLICY "Jobs visible to company owner and public when published" ON public.jobs
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM public.companies WHERE user_id = auth.uid()
    ) OR
    company_id IN (
      SELECT id FROM public.companies WHERE is_published = true
    )
  );

CREATE POLICY "Jobs insertable by company owner" ON public.jobs
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT id FROM public.companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Jobs updatable by company owner" ON public.jobs
  FOR UPDATE USING (
    company_id IN (
      SELECT id FROM public.companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Jobs deletable by company owner" ON public.jobs
  FOR DELETE USING (
    company_id IN (
      SELECT id FROM public.companies WHERE user_id = auth.uid()
    )
  );
