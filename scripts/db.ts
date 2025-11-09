#!/usr/bin/env node
/**
 * Database CLI Tool
 * 
 * Usage:
 *   pnpm db:sync     - Sync schema (create tables)
 *   pnpm db:seed     - Seed demo data
 *   pnpm db:reset    - Reset database (drop & recreate)
 *   pnpm db:reseed   - Clear data & reseed
 *   pnpm db:generate - Generate SQL from schema
 */

// Load environment variables from .env.local
import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

import { syncSchema, resetDatabase, tableExists } from '../lib/db/migrate'
import { seedDemoData, reseedDatabase } from '../lib/db/seed'
import { allTables } from '../lib/db/schema'
import { generateAllTablesSQL } from '../lib/db/sql-generator'
import * as fs from 'fs'

const command = process.argv[2]

async function main() {
  console.log('🚀 Database CLI Tool\n')
  
  switch (command) {
    case 'sync':
      console.log('📊 Syncing database schema...\n')
      await syncSchema()
      break
      
    case 'seed':
      console.log('🌱 Seeding demo data...\n')
      await seedDemoData()
      break
      
    case 'reset':
      console.log('⚠️  WARNING: This will delete ALL data!\n')
      await resetDatabase()
      break
      
    case 'reseed':
      console.log('🔄 Reseeding database...\n')
      await reseedDatabase()
      break
      
    case 'generate':
      console.log('📝 Generating SQL from schema...\n')
      const sql = generateAllTablesSQL(allTables)
      const outputPath = path.join(process.cwd(), 'generated-schema.sql')
      fs.writeFileSync(outputPath, sql, 'utf-8')
      console.log(`✅ SQL generated at: ${outputPath}\n`)
      break
      
    case 'status':
      console.log('📊 Checking database status...\n')
      for (const table of allTables) {
        const exists = await tableExists(table.name)
        console.log(`  ${exists ? '✅' : '❌'} ${table.name}`)
      }
      console.log()
      break
      
    default:
      console.log('Available commands:')
      console.log('  sync     - Create/update database schema')
      console.log('  seed     - Add demo data')
      console.log('  reset    - Drop and recreate all tables')
      console.log('  reseed   - Clear data and reseed')
      console.log('  generate - Generate SQL file from schema')
      console.log('  status   - Check which tables exist')
      console.log('\nUsage: pnpm db <command>')
      process.exit(1)
  }
  
  console.log('✨ Done!\n')
  process.exit(0)
}

main().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
