import { query } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = (await query("SELECT * FROM companies WHERE id = $1", [id])) as any[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching company:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const updates = await request.json()

    const allowedFields = [
      "company_name",
      "company_description",
      "logo_url",
      "banner_image_url",
      "culture_video_url",
      "primary_color",
      "secondary_color",
      "accent_color",
      "is_published",
    ]

    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj: any, key: string) => {
        obj[key] = updates[key]
        return obj
      }, {})

    const updateKeys = Object.keys(filteredUpdates)
    const updateValues = Object.values(filteredUpdates)

    if (updateKeys.length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const setClause = updateKeys.map((key, i) => `${key} = $${i + 1}`).join(", ")

    const result = (await query(
      `UPDATE companies SET ${setClause}, updated_at = NOW() WHERE id = $${updateKeys.length + 1} RETURNING *`,
      [...updateValues, id],
    )) as any[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating company:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
