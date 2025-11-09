"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem("auth_token")
    setIsAuthenticated(!!authToken)
  }, [])

  const handleLogout = async () => {
    await logout()
    setIsAuthenticated(false)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container-main section-spacing">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">Careers Builder</h1>
          <p className="text-xl text-muted mb-4 leading-relaxed">
            Create beautiful, branded careers pages that attract top talent. Manage your company story, customize your
            page, and share it with the world.
          </p>
          <p className="text-lg text-muted mb-12">
            For recruiters and companies looking to build a professional online presence.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button className="px-8 py-3 h-auto">Go to Dashboard</Button>
                </Link>
                <Button variant="outline" className="px-8 py-3 h-auto" onClick={handleLogout}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button className="px-8 py-3 h-auto">Get Started</Button>
                </Link>
                <Button variant="outline" className="px-8 py-3 h-auto bg-transparent" disabled>
                  View Demo Company
                </Button>
              </>
            )}
          </div>

          <div className="mt-16 p-8 bg-secondary rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-accent mb-3">1</div>
                <h3 className="font-semibold mb-2">Sign In</h3>
                <p className="text-muted">Create or access your recruiter account</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-3">2</div>
                <h3 className="font-semibold mb-2">Customize</h3>
                <p className="text-muted">Add your branding, story, and open roles</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-3">3</div>
                <h3 className="font-semibold mb-2">Share</h3>
                <p className="text-muted">Share your careers page with candidates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
