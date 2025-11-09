import { query } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const companyId = request.nextUrl.searchParams.get("companyId")
    const result = await query("SELECT * FROM jobs WHERE company_id = $1 ORDER BY created_at DESC", [companyId])
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      company_id,
      title,
      department,
      location,
      job_type,
      employment_type,
      experience_level,
      salary_min,
      salary_max,
      description,
    } = await request.json()

    const result = await query(
      `INSERT INTO jobs (company_id, title, department, location, job_type, employment_type, experience_level, salary_min, salary_max, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        company_id,
        title,
        department,
        location,
        job_type,
        employment_type,
        experience_level,
        salary_min,
        salary_max,
        description,
      ],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
