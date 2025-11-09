import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Signup request received")

    const { company_name, slug, email, password } = await request.json()
    console.log("[v0] Signup data:", { company_name, slug, email })

    // Check if slug already exists
    console.log("[v0] Checking if slug exists:", slug)
    const existing = await query("SELECT id FROM companies WHERE slug = $1", [slug])
    console.log("[v0] Slug check result:", existing)

    if (existing.length > 0) {
      console.log("[v0] Slug already exists")
      return NextResponse.json({ error: "Company slug already exists" }, { status: 400 })
    }

    // Create company
    console.log("[v0] Creating company:", { company_name, slug })
    const result = await query(
      `INSERT INTO companies (name, slug, primary_color, secondary_color, accent_color) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, slug`,
      [company_name, slug, "#000000", "#FFFFFF", "#3B82F6"],
    )
    console.log("[v0] Company created:", result)

    const token = Buffer.from(`${email}:${password}`).toString("base64")

    console.log("[v0] Signup successful")
    return NextResponse.json({
      token,
      company_id: result[0].id,
      company_slug: result[0].slug,
    })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}
