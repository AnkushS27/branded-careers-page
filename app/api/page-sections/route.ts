import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const companyId = request.nextUrl.searchParams.get("companyId")
    const result = await query("SELECT * FROM page_sections WHERE company_id = $1 ORDER BY order_index ASC", [
      companyId,
    ])
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { company_id, section_type, title, content, order_index } = await request.json()

    const result = await query(
      `INSERT INTO page_sections (company_id, section_type, title, content, order_index) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [company_id, section_type, title, content, order_index],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
