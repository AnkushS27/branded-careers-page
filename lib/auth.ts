// Simple auth helper - in production use proper auth library
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export function setAuthToken(token: string): void {
  localStorage.setItem("auth_token", token)
}

export function clearAuthToken(): void {
  localStorage.removeItem("auth_token")
  localStorage.removeItem("user_id")
  localStorage.removeItem("user_email")
  localStorage.removeItem("company_id")
  localStorage.removeItem("company_slug")
  localStorage.removeItem("company_name")
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}

export function getCompanyId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("company_id")
}

export function getCompanySlug(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("company_slug")
}

export function getCompanyName(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("company_name")
}

export async function logout(): Promise<void> {
  // Call logout API to clear cookies
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
    })
  } catch (error) {
    console.error("Logout API error:", error)
  }

  // Clear localStorage
  clearAuthToken()

  // Redirect to home page
  if (typeof window !== "undefined") {
    window.location.href = "/"
  }
}
