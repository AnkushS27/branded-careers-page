/**
 * Database Schema Definitions
 * 
 * This file contains all table schemas as TypeScript objects.
 * Benefits:
 * - Type-safe schema definitions
 * - Single source of truth
 * - Easy to modify and maintain
 * - Can generate SQL or use for validation
 */

export interface TableColumn {
  name: string
  type: string
  nullable?: boolean
  primaryKey?: boolean
  unique?: boolean
  default?: string
  references?: {
    table: string
    column: string
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT'
  }
}

export interface TableSchema {
  name: string
  columns: TableColumn[]
  indexes?: {
    name: string
    columns: string[]
    unique?: boolean
  }[]
}

// ============================================================================
// USERS TABLE
// ============================================================================
export const usersTable: TableSchema = {
  name: 'users',
  columns: [
    {
      name: 'id',
      type: 'UUID',
      primaryKey: true,
      default: 'gen_random_uuid()',
    },
    {
      name: 'email',
      type: 'TEXT',
      nullable: false,
      unique: true,
    },
    {
      name: 'password_hash',
      type: 'TEXT',
      nullable: false,
    },
    {
      name: 'created_at',
      type: 'TIMESTAMP',
      default: 'NOW()',
    },
    {
      name: 'updated_at',
      type: 'TIMESTAMP',
      default: 'NOW()',
    },
  ],
  indexes: [
    {
      name: 'idx_users_email',
      columns: ['email'],
      unique: true,
    },
  ],
}

// ============================================================================
// COMPANIES TABLE
// ============================================================================
export const companiesTable: TableSchema = {
  name: 'companies',
  columns: [
    {
      name: 'id',
      type: 'UUID',
      primaryKey: true,
      default: 'gen_random_uuid()',
    },
    {
      name: 'user_id',
      type: 'UUID',
      nullable: false,
      references: {
        table: 'users',
        column: 'id',
        onDelete: 'CASCADE',
      },
    },
    {
      name: 'company_slug',
      type: 'TEXT',
      nullable: false,
      unique: true,
    },
    {
      name: 'company_name',
      type: 'TEXT',
      nullable: false,
    },
    {
      name: 'company_description',
      type: 'TEXT',
      nullable: true,
    },
    {
      name: 'logo_url',
      type: 'TEXT',
      nullable: true,
    },
    {
      name: 'banner_image_url',
      type: 'TEXT',
      nullable: true,
    },
    {
      name: 'culture_video_url',
      type: 'TEXT',
      nullable: true,
    },
    {
      name: 'primary_color',
      type: 'TEXT',
      default: "'#000000'",
    },
    {
      name: 'secondary_color',
      type: 'TEXT',
      default: "'#ffffff'",
    },
    {
      name: 'accent_color',
      type: 'TEXT',
      default: "'#3b82f6'",
    },
    {
      name: 'is_published',
      type: 'BOOLEAN',
      default: 'false',
    },
    {
      name: 'created_at',
      type: 'TIMESTAMP',
      default: 'NOW()',
    },
    {
      name: 'updated_at',
      type: 'TIMESTAMP',
      default: 'NOW()',
    },
  ],
  indexes: [
    {
      name: 'idx_companies_slug',
      columns: ['company_slug'],
      unique: true,
    },
    {
      name: 'idx_companies_user_id',
      columns: ['user_id'],
    },
  ],
}

// ============================================================================
// PAGE_SECTIONS TABLE
// ============================================================================
export const pageSectionsTable: TableSchema = {
  name: 'page_sections',
  columns: [
    {
      name: 'id',
      type: 'UUID',
      primaryKey: true,
      default: 'gen_random_uuid()',
    },
    {
      name: 'company_id',
      type: 'UUID',
      nullable: false,
      references: {
        table: 'companies',
        column: 'id',
        onDelete: 'CASCADE',
      },
    },
    {
      name: 'section_type',
      type: 'TEXT',
      nullable: false,
    },
    {
      name: 'section_title',
      type: 'TEXT',
      nullable: false,
    },
    {
      name: 'section_content',
      type: 'TEXT',
      nullable: true,
    },
    {
      name: 'section_order',
      type: 'INT',
      default: '0',
    },
    {
      name: 'is_visible',
      type: 'BOOLEAN',
      default: 'true',
    },
    {
      name: 'created_at',
      type: 'TIMESTAMP',
      default: 'NOW()',
    },
  ],
  indexes: [
    {
      name: 'idx_page_sections_company_id',
      columns: ['company_id'],
    },
  ],
}

// ============================================================================
// JOBS TABLE
// ============================================================================
export const jobsTable: TableSchema = {
  name: 'jobs',
  columns: [
    {
      name: 'id',
      type: 'UUID',
      primaryKey: true,
      default: 'gen_random_uuid()',
    },
    {
      name: 'company_id',
      type: 'UUID',
      nullable: false,
      references: {
        table: 'companies',
        column: 'id',
        onDelete: 'CASCADE',
      },
    },
    {
      name: 'job_title',
      type: 'TEXT',
      nullable: false,
    },
    {
      name: 'job_slug',
      type: 'TEXT',
      nullable: false,
    },
    {
      name: 'job_description',
      type: 'TEXT',
      nullable: true,
    },
    {
      name: 'department',
      type: 'TEXT',
      nullable: true,
    },
    {
      name: 'location',
      type: 'TEXT',
      nullable: true,
    },
    {
      name: 'job_type',
      type: 'TEXT',
      nullable: true,
    },
    {
      name: 'employment_type',
      type: 'TEXT',
      nullable: true,
    },
    {
      name: 'experience_level',
      type: 'TEXT',
      nullable: true,
    },
    {
      name: 'salary_min',
      type: 'INT',
      nullable: true,
    },
    {
      name: 'salary_max',
      type: 'INT',
      nullable: true,
    },
    {
      name: 'salary_currency',
      type: 'TEXT',
      default: "'USD'",
    },
    {
      name: 'posted_at',
      type: 'TIMESTAMP',
      default: 'NOW()',
    },
    {
      name: 'updated_at',
      type: 'TIMESTAMP',
      default: 'NOW()',
    },
  ],
  indexes: [
    {
      name: 'idx_jobs_company_id',
      columns: ['company_id'],
    },
    {
      name: 'idx_jobs_company_slug',
      columns: ['company_id', 'job_slug'],
      unique: true,
    },
  ],
}

// ============================================================================
// ALL TABLES - Order matters for foreign keys!
// ============================================================================
export const allTables: TableSchema[] = [
  usersTable,
  companiesTable,
  pageSectionsTable,
  jobsTable,
]
