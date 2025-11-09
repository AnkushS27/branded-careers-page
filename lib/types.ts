export interface Company {
  id: string
  name: string
  slug: string
  logo_url?: string
  banner_url?: string
  culture_video_url?: string
  about_section?: string
  primary_color: string
  secondary_color: string
  accent_color: string
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  company_id: string
  title: string
  department?: string
  location?: string
  job_type?: string
  employment_type?: string
  experience_level?: string
  salary_min?: number
  salary_max?: number
  salary_currency: string
  description?: string
  slug?: string
  posted_days_ago: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PageSection {
  id: string
  company_id: string
  section_type: string
  title?: string
  content?: string
  order_index: number
  is_visible: boolean
}
