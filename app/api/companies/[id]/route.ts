import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await query("SELECT * FROM companies WHERE id = $1", [params.id])

    if (result.length === 0) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching company:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()

    const allowedFields = [
      "name",
      "logo_url",
      "banner_url",
      "culture_video_url",
      "about_section",
      "primary_color",
      "secondary_color",
      "accent_color",
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

    const result = await query(
      `UPDATE companies SET ${setClause}, updated_at = NOW() WHERE id = $${updateKeys.length + 1} RETURNING *`,
      [...updateValues, params.id],
    )

    if (result.length === 0) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating company:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
