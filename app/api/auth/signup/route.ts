import { query } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

const SALT_ROUNDS = 10

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Signup request received")

    const { company_name, slug, email, password } = await request.json()
    console.log("[v0] Signup data:", { company_name, slug, email })

    // Validate input
    if (!company_name || !slug || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if email already exists
    console.log("[v0] Checking if email exists:", email)
    const existingUser = (await query("SELECT id FROM users WHERE email = $1", [email])) as any[]

    if (existingUser.length > 0) {
      console.log("[v0] Email already exists")
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Check if slug already exists
    console.log("[v0] Checking if slug exists:", slug)
    const existingSlug = (await query("SELECT id FROM companies WHERE company_slug = $1", [slug])) as any[]

    if (existingSlug.length > 0) {
      console.log("[v0] Slug already exists")
      return NextResponse.json({ error: "Company slug already exists" }, { status: 400 })
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    // Create user
    console.log("[v0] Creating user")
    const userResult = (await query(`INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id`, [
      email,
      passwordHash,
    ])) as any[]
    const userId = userResult[0].id

    // Create company
    console.log("[v0] Creating company:", { company_name, slug, userId })
    const companyResult = (await query(
      `INSERT INTO companies (user_id, company_name, company_slug, primary_color, secondary_color, accent_color) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, company_name, company_slug`,
      [userId, company_name, slug, "#000000", "#FFFFFF", "#3B82F6"],
    )) as any[]
    console.log("[v0] Company created:", companyResult)

    const token = Buffer.from(`${email}:${password}`).toString("base64")

    console.log("[v0] Signup successful")
    
    // Create response with auth cookie
    const response = NextResponse.json({
      token,
      user_id: userId,
      user_email: email,
      company_id: companyResult[0].id,
      company_slug: companyResult[0].company_slug,
      company_name: companyResult[0].company_name,
    })

    // Set HTTP-only cookie for server-side auth
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    response.cookies.set("user_id", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}
