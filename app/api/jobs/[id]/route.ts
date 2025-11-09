import { query } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const updates = await request.json()

    const allowedFields = [
      "job_title",
      "job_description",
      "department",
      "location",
      "job_type",
      "employment_type",
      "experience_level",
      "salary_min",
      "salary_max",
      "salary_currency",
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
      `UPDATE jobs SET ${setClause}, updated_at = NOW() WHERE id = $${updateKeys.length + 1} RETURNING *`,
      [...updateValues, id],
    )) as any[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await query("DELETE FROM jobs WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
