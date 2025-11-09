import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get auth token from cookies
  const authToken = request.cookies.get("auth_token")?.value
  const isAuthenticated = !!authToken

  // Define public routes (accessible without auth)
  const publicRoutes = ["/auth/login", "/auth/sign-up", "/auth/check-email"]
  const isPublicRoute = publicRoutes.includes(pathname)

  // Define auth routes (login/signup pages)
  const isAuthRoute = pathname.startsWith("/auth/")

  // Define protected routes (require authentication)
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.includes("/edit") || pathname.includes("/preview")

  // Define public career pages (accessible to everyone)
  const isPublicCareerPage = pathname.includes("/careers")

  // Case 1: User is authenticated and tries to access auth pages (login/signup)
  // Redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Case 2: User is authenticated and accessing home page (/)
  // Redirect to dashboard
  if (isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Case 3: User is NOT authenticated and tries to access protected routes
  // Redirect to login
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Case 4: Allow access to public career pages and API routes
  if (isPublicCareerPage || pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Case 5: User is not authenticated and accessing home page
  // Allow access to show landing page
  if (!isAuthenticated && pathname === "/") {
    return NextResponse.next()
  }

  // Default: allow the request to continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
