import { query } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const companyId = request.nextUrl.searchParams.get("company_id")
    const result = await query("SELECT * FROM jobs WHERE company_id = $1 ORDER BY posted_at DESC", [companyId])
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      company_id,
      job_title,
      job_slug,
      job_description,
      department,
      location,
      job_type,
      employment_type,
      experience_level,
      salary_min,
      salary_max,
      salary_currency,
    } = await request.json()

    const result = (await query(
      `INSERT INTO jobs (company_id, job_title, job_slug, job_description, department, location, job_type, employment_type, experience_level, salary_min, salary_max, salary_currency) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        company_id,
        job_title,
        job_slug,
        job_description,
        department,
        location,
        job_type,
        employment_type,
        experience_level,
        salary_min || null,
        salary_max || null,
        salary_currency || "USD",
      ],
    )) as any[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
