import { query } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const {
      user_id,
      company_name,
      company_slug,
      company_description,
      logo_url,
      banner_image_url,
      culture_video_url,
      primary_color,
      secondary_color,
      accent_color,
    } = await request.json()

    // Check if slug is already taken
    const existing = (await query("SELECT id FROM companies WHERE company_slug = $1", [company_slug])) as any[]
    if (existing.length > 0) {
      return NextResponse.json({ error: "Company slug already taken" }, { status: 400 })
    }

    const result = (await query(
      `INSERT INTO companies (user_id, company_name, company_slug, company_description, logo_url, banner_image_url, culture_video_url, primary_color, secondary_color, accent_color) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        user_id,
        company_name,
        company_slug,
        company_description || null,
        logo_url || null,
        banner_image_url || null,
        culture_video_url || null,
        primary_color || "#000000",
        secondary_color || "#ffffff",
        accent_color || "#3b82f6",
      ],
    )) as any[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating company:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 })
    }

    const result = await query("SELECT * FROM companies WHERE user_id = $1 ORDER BY created_at DESC", [userId])
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching companies:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
