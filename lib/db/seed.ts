/**
 * Database Seed Functions
 * 
 * Provides functions to seed the database with demo/test data
 */

import { query } from '../database'
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

/**
 * Hash password using bcrypt
 */
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Seed demo user and company
 */
export async function seedDemoData(): Promise<void> {
  console.log('[DB Seed] Starting demo data seeding...')
  
  try {
    // Check if demo user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', ['demo@company.com']) as any[]
    
    if (existingUser.length > 0) {
      console.log('[DB Seed] Demo data already exists, skipping...')
      return
    }
    
    // Create demo user
    console.log('[DB Seed] Creating demo user...')
    const passwordHash = await hashPassword('demo123')
    const userResult = await query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id`,
      ['demo@company.com', passwordHash]
    ) as any[]
    const userId = userResult[0].id
    console.log('[DB Seed] ✅ Demo user created:', userId)
    
    // Create demo company
    console.log('[DB Seed] Creating demo company...')
    const companyResult = await query(
      `INSERT INTO companies (
        user_id, company_name, company_slug, company_description,
        primary_color, secondary_color, accent_color, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        userId,
        'Demo Tech Company',
        'demo-company',
        'We are a cutting-edge technology company building the future of work.',
        '#1a1a1a',
        '#ffffff',
        '#3b82f6',
        true,
      ]
    ) as any[]
    const companyId = companyResult[0].id
    console.log('[DB Seed] ✅ Demo company created:', companyId)
    
    // Create page sections
    console.log('[DB Seed] Creating page sections...')
    await query(
      `INSERT INTO page_sections (company_id, section_type, section_title, section_content, section_order, is_visible)
       VALUES 
       ($1, 'about', 'About Us', 'We are passionate about building innovative solutions that make a difference. Our team of talented individuals works together to create products that people love.', 0, true),
       ($2, 'culture', 'Our Culture', 'We believe in a culture of collaboration, innovation, and continuous learning. We support remote work, flexible schedules, and a healthy work-life balance.', 1, true),
       ($3, 'benefits', 'Benefits & Perks', 'Competitive salary, health insurance, unlimited PTO, learning budget, remote work options, and much more!', 2, true)`,
      [companyId, companyId, companyId]
    )
    console.log('[DB Seed] ✅ Page sections created')
    
    // Create demo jobs
    console.log('[DB Seed] Creating demo jobs...')
    await query(
      `INSERT INTO jobs (
        company_id, job_title, job_slug, job_description, department, location,
        job_type, employment_type, experience_level, salary_min, salary_max, salary_currency
      ) VALUES 
      ($1, 'Senior Software Engineer', 'senior-software-engineer', 
       'We are looking for an experienced software engineer to join our team and help build amazing products.',
       'Engineering', 'Remote', 'Full-time', 'Permanent', 'Senior', 120000, 180000, 'USD'),
      ($2, 'Product Manager', 'product-manager',
       'Join our product team to define and build the next generation of our platform.',
       'Product', 'San Francisco, CA', 'Full-time', 'Permanent', 'Mid-Senior', 110000, 160000, 'USD'),
      ($3, 'UX Designer', 'ux-designer',
       'Help us create beautiful and intuitive user experiences for our customers.',
       'Design', 'Remote', 'Full-time', 'Permanent', 'Mid', 90000, 130000, 'USD')`,
      [companyId, companyId, companyId]
    )
    console.log('[DB Seed] ✅ Demo jobs created')
    
    console.log('[DB Seed] ✅ Demo data seeding completed!')
    console.log('[DB Seed] 📧 Demo credentials: demo@company.com / demo123')
    console.log('[DB Seed] 🌐 Demo company slug: demo-company')
  } catch (error) {
    console.error('[DB Seed] ❌ Seeding failed:', error)
    throw error
  }
}

/**
 * Clear all data from tables (keeps schema)
 */
export async function clearAllData(): Promise<void> {
  console.log('[DB Seed] ⚠️  Clearing all data...')
  
  try {
    await query('DELETE FROM jobs;')
    await query('DELETE FROM page_sections;')
    await query('DELETE FROM companies;')
    await query('DELETE FROM users;')
    
    console.log('[DB Seed] ✅ All data cleared')
  } catch (error) {
    console.error('[DB Seed] ❌ Failed to clear data:', error)
    throw error
  }
}

/**
 * Reset and reseed database
 */
export async function reseedDatabase(): Promise<void> {
  console.log('[DB Seed] 🔄 Reseeding database...')
  await clearAllData()
  await seedDemoData()
  console.log('[DB Seed] ✅ Database reseeded successfully')
}

/**
 * Create a test user and company
 */
export async function createTestCompany(
  email: string,
  password: string,
  companyName: string,
  companySlug: string
): Promise<{ userId: string; companyId: string }> {
  console.log('[DB Seed] Creating test company...')
  
  try {
    // Create user
    const passwordHash = await hashPassword(password)
    const userResult = await query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id`,
      [email, passwordHash]
    ) as any[]
    const userId = userResult[0].id
    
    // Create company
    const companyResult = await query(
      `INSERT INTO companies (
        user_id, company_name, company_slug,
        primary_color, secondary_color, accent_color
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [userId, companyName, companySlug, '#000000', '#ffffff', '#3b82f6']
    ) as any[]
    const companyId = companyResult[0].id
    
    console.log('[DB Seed] ✅ Test company created')
    return { userId, companyId }
  } catch (error) {
    console.error('[DB Seed] ❌ Failed to create test company:', error)
    throw error
  }
}
