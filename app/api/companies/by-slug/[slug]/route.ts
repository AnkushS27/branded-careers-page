import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const result = await query("SELECT * FROM companies WHERE slug = $1", [params.slug])

    if (result.length === 0) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching company:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
