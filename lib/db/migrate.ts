/**
 * Database Migration Functions
 * 
 * Handles schema creation, updates, and migrations
 */

import { query } from '../database'
import { allTables } from './schema'
import { generateCreateTableSQL, generateCreateIndexSQL, generateEnableRLSSQL } from './sql-generator'

/**
 * Sync database schema - creates all tables if they don't exist
 */
export async function syncSchema(): Promise<void> {
  console.log('[DB] Starting schema synchronization...')
  
  try {
    // Create tables in order (respects foreign keys)
    for (const table of allTables) {
      console.log(`[DB] Creating table: ${table.name}`)
      const createTableSQL = generateCreateTableSQL(table)
      await query(createTableSQL)
      
      // Create indexes
      if (table.indexes) {
        for (const index of table.indexes) {
          console.log(`[DB] Creating index: ${index.name}`)
          const createIndexSQL = generateCreateIndexSQL(
            table.name,
            index.name,
            index.columns,
            index.unique
          )
          await query(createIndexSQL)
        }
      }
      
      // Enable RLS
      console.log(`[DB] Enabling RLS for: ${table.name}`)
      await query(generateEnableRLSSQL(table.name))
    }
    
    console.log('[DB] ✅ Schema synchronization completed successfully')
  } catch (error) {
    console.error('[DB] ❌ Schema synchronization failed:', error)
    throw error
  }
}

/**
 * Drop all tables (DANGEROUS - use only in development)
 */
export async function dropAllTables(): Promise<void> {
  console.log('[DB] ⚠️  Dropping all tables...')
  
  try {
    // Drop in reverse order to respect foreign keys
    for (const table of [...allTables].reverse()) {
      console.log(`[DB] Dropping table: ${table.name}`)
      await query(`DROP TABLE IF EXISTS ${table.name} CASCADE;`)
    }
    
    console.log('[DB] ✅ All tables dropped')
  } catch (error) {
    console.error('[DB] ❌ Failed to drop tables:', error)
    throw error
  }
}

/**
 * Reset database - drops and recreates all tables
 */
export async function resetDatabase(): Promise<void> {
  console.log('[DB] 🔄 Resetting database...')
  await dropAllTables()
  await syncSchema()
  console.log('[DB] ✅ Database reset completed')
}

/**
 * Check if a table exists
 */
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const result = await query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      );`,
      [tableName]
    )

    // result can be returned in different shapes depending on the DB helper:
    // - an array of rows: [{ exists: true }]
    // - an object with a `rows` array: { rows: [{ exists: true }], ... }
    // - a single row object: { exists: true }
    if (Array.isArray(result)) {
      return (result[0] as any)?.exists ?? false
    }

    if (result && typeof result === 'object') {
      const rows = (result as any).rows
      if (Array.isArray(rows)) {
        return (rows[0] as any)?.exists ?? false
      }
      if ('exists' in result) {
        return (result as any).exists ?? false
      }
    }

    return false
  } catch (error) {
    console.error(`[DB] Error checking if table ${tableName} exists:`, error)
    return false
  }
}

/**
 * Get current schema version (for future migration tracking)
 */
export async function getSchemaVersion(): Promise<number> {
  try {
    // Check if migrations table exists
    const exists = await tableExists('schema_migrations')
    
    if (!exists) {
      // Create migrations table
      await query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          version INT PRIMARY KEY,
          applied_at TIMESTAMP DEFAULT NOW()
        );
      `)
      return 0
    }
    
    const result = await query('SELECT MAX(version) as version FROM schema_migrations;')

    // result can be returned in different shapes depending on the DB helper:
    // - an array of rows: [{ version: 3 }]
    // - an object with a `rows` array: { rows: [{ version: 3 }], ... }
    // - a single row object: { version: 3 }
    let version = 0
    if (Array.isArray(result)) {
      version = (result[0] as any)?.version ?? 0
    } else if (result && typeof result === 'object') {
      const rows = (result as any).rows
      if (Array.isArray(rows)) {
        version = (rows[0] as any)?.version ?? 0
      } else if ('version' in result) {
        version = (result as any).version ?? 0
      }
    }

    return version
  } catch (error) {
    console.error('[DB] Error getting schema version:', error)
    return 0
  }
}

/**
 * Record a migration
 */
export async function recordMigration(version: number): Promise<void> {
  await query(
    'INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT (version) DO NOTHING;',
    [version]
  )
}
