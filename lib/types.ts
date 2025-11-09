export interface Company {
  id: string
  user_id: string
  company_name: string
  company_slug: string
  company_description?: string
  logo_url?: string
  banner_image_url?: string
  culture_video_url?: string
  primary_color: string
  secondary_color: string
  accent_color: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  company_id: string
  job_title: string
  job_slug: string
  job_description?: string
  department?: string
  location?: string
  job_type?: string
  employment_type?: string
  experience_level?: string
  salary_min?: number
  salary_max?: number
  salary_currency: string
  posted_at: string
  updated_at: string
}

export interface PageSection {
  id: string
  company_id: string
  section_type: string
  section_title?: string
  section_content?: string
  section_order: number
  is_visible: boolean
  created_at: string
}
