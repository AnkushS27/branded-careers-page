import { neon } from "@neondatabase/serverless"

let sql: ReturnType<typeof neon> | null = null

function getConnection() {
  if (sql) return sql

  const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.NEON_POSTGRES_URL || ""

  if (!dbUrl) {
    throw new Error(
      "No database URL found. Please set DATABASE_URL, NEON_DATABASE_URL, or NEON_POSTGRES_URL in your .env.local file"
    )
  }

  console.log("[DB] Connecting to database...")
  sql = neon(dbUrl)
  return sql
}

export async function query(text: string, params?: unknown[]) {
  try {
    const connection = getConnection()
    const result = await connection.query(text, params)
    return result
  } catch (error) {
    console.error("[DB] Query error:", error)
    throw error
  }
}

export default getConnection
