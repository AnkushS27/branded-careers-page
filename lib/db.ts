import { neon } from "@neondatabase/serverless"

console.log("[v0] Database initialization starting...")
console.log("[v0] DATABASE_URL available:", !!process.env.DATABASE_URL)
console.log("[v0] NEON_DATABASE_URL available:", !!process.env.NEON_DATABASE_URL)
console.log("[v0] NEON_POSTGRES_URL available:", !!process.env.NEON_POSTGRES_URL)

const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.NEON_POSTGRES_URL || ""

if (!dbUrl) {
  console.error(
    "[v0] CRITICAL: No database URL found. Available env vars:",
    Object.keys(process.env).filter((k) => k.includes("DATABASE") || k.includes("NEON") || k.includes("POSTGRES")),
  )
}

console.log("[v0] Using database URL (first 50 chars):", dbUrl.slice(0, 50))

const sql = neon(dbUrl)

export async function query(text: string, params?: unknown[]) {
  try {
    console.log("[v0] Query executing:", text.substring(0, 100) + "...")
    console.log("[v0] Query params:", params)

    const result = await sql.query(text, params)

    console.log("[v0] Query success, rows returned:", result?.length || 0)
    return result
  } catch (error) {
    console.error("[v0] Database error:", error)
    console.error("[v0] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : "Unknown",
      stack: error instanceof Error ? error.stack : "No stack",
    })
    throw error
  }
}

export default sql
