import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Login request received")

    const { email, password } = await request.json()
    console.log("[v0] Login attempt:", { email })

    // In production, use proper password hashing
    // For demo purposes, we're using a simple check
    if (email === "demo@company.com" && password === "demo123") {
      console.log("[v0] Demo credentials matched, querying company")

      const result = await query(`SELECT id, name, slug FROM companies WHERE slug = $1 LIMIT 1`, ["demo-company"])
      console.log("[v0] Query result:", result)

      if (result.length === 0) {
        console.log("[v0] Demo company not found")
        return NextResponse.json({ error: "Company not found" }, { status: 404 })
      }

      const token = Buffer.from(`${email}:${password}`).toString("base64")

      console.log("[v0] Login successful")
      return NextResponse.json({
        token,
        company_id: result[0].id,
        company_slug: result[0].slug,
        company_name: result[0].name,
      })
    }

    console.log("[v0] Invalid credentials")
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}
