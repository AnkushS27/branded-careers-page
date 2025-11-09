import { query } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Login request received")

    const { email, password } = await request.json()
    console.log("[v0] Login attempt:", { email })

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    console.log("[v0] Looking up user")
    const userResult = (await query(`SELECT id, email, password_hash FROM users WHERE email = $1`, [
      email,
    ])) as any[]

    if (userResult.length === 0) {
      console.log("[v0] User not found")
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = userResult[0]

    // Verify password with bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      console.log("[v0] Invalid password")
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Find user's company
    console.log("[v0] Looking up company for user:", user.id)
    const companyResult = (await query(
      `SELECT id, company_name, company_slug FROM companies WHERE user_id = $1 LIMIT 1`,
      [user.id],
    )) as any[]

    if (companyResult.length === 0) {
      console.log("[v0] No company found for user")
      return NextResponse.json({ error: "No company found for this user" }, { status: 404 })
    }

    const company = companyResult[0]
    const token = Buffer.from(`${email}:${password}`).toString("base64")

    console.log("[v0] Login successful")
    
    // Create response with auth cookie
    const response = NextResponse.json({
      token,
      user_id: user.id,
      user_email: email,
      company_id: company.id,
      company_slug: company.company_slug,
      company_name: company.company_name,
    })

    // Set HTTP-only cookie for server-side auth
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    response.cookies.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}
