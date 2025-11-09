/**
 * SQL Generator
 * 
 * Generates SQL statements from TypeScript schema definitions
 */

import type { TableSchema, TableColumn } from './schema'

export function generateCreateTableSQL(table: TableSchema): string {
  const columns = table.columns.map((col) => generateColumnDefinition(col)).join(',\n  ')
  
  let sql = `CREATE TABLE IF NOT EXISTS ${table.name} (\n  ${columns}`
  
  // Add unique constraints
  const uniqueConstraints = table.columns
    .filter((col) => col.unique && !col.primaryKey)
    .map((col) => `UNIQUE(${col.name})`)
  
  if (uniqueConstraints.length > 0) {
    sql += ',\n  ' + uniqueConstraints.join(',\n  ')
  }
  
  sql += '\n);'
  
  return sql
}

export function generateColumnDefinition(column: TableColumn): string {
  let def = column.name + ' ' + column.type
  
  if (column.primaryKey) {
    def += ' PRIMARY KEY'
  }
  
  if (column.default) {
    def += ' DEFAULT ' + column.default
  }
  
  if (column.nullable === false && !column.primaryKey) {
    def += ' NOT NULL'
  }
  
  if (column.references) {
    def += ` REFERENCES ${column.references.table}(${column.references.column})`
    if (column.references.onDelete) {
      def += ` ON DELETE ${column.references.onDelete}`
    }
  }
  
  return def
}

export function generateCreateIndexSQL(
  tableName: string,
  indexName: string,
  columns: string[],
  unique = false
): string {
  const uniqueKeyword = unique ? 'UNIQUE ' : ''
  return `CREATE ${uniqueKeyword}INDEX IF NOT EXISTS ${indexName} ON ${tableName}(${columns.join(', ')});`
}

export function generateDropTableSQL(tableName: string): string {
  return `DROP TABLE IF EXISTS ${tableName} CASCADE;`
}

export function generateEnableRLSSQL(tableName: string): string {
  return `ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;`
}

export function generateAllTablesSQL(tables: TableSchema[]): string {
  let sql = '-- Generated Schema SQL\n'
  sql += '-- This file is auto-generated from schema.ts\n\n'
  
  // Create tables
  tables.forEach((table) => {
    sql += `-- ${table.name.toUpperCase()} TABLE\n`
    sql += generateCreateTableSQL(table) + '\n\n'
    
    // Create indexes
    if (table.indexes) {
      table.indexes.forEach((index) => {
        sql += generateCreateIndexSQL(table.name, index.name, index.columns, index.unique) + '\n'
      })
      sql += '\n'
    }
  })
  
  // Enable RLS
  sql += '-- ENABLE ROW LEVEL SECURITY\n'
  tables.forEach((table) => {
    sql += generateEnableRLSSQL(table.name) + '\n'
  })
  
  return sql
}
