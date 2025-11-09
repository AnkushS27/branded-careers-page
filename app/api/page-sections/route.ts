import { query } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const companyId = request.nextUrl.searchParams.get("company_id")
    const result = await query("SELECT * FROM page_sections WHERE company_id = $1 ORDER BY section_order ASC", [
      companyId,
    ])
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching page sections:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { company_id, section_type, section_title, section_content, section_order, is_visible } =
      await request.json()

    const result = (await query(
      `INSERT INTO page_sections (company_id, section_type, section_title, section_content, section_order, is_visible) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [company_id, section_type, section_title, section_content || "", section_order, is_visible ?? true],
    )) as any[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating page section:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
