"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import CompanyCard from "@/components/dashboard/company-card"
import type { Company } from "@/lib/types"
import { logout } from "@/lib/auth"
import Link from "next/link"
import { Copy, Check } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    const companyId = localStorage.getItem("company_id")
    if (!companyId) {
      router.push("/auth/login")
      return
    }

    const fetchCompany = async () => {
      try {
        const response = await fetch(`/api/companies/${companyId}`)
        if (!response.ok) throw new Error("Failed to fetch company")
        const data = await response.json()
        setCompany(data)
      } catch (error) {
        console.error("Error fetching company:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompany()
  }, [router])

  const handleLogout = async () => {
    await logout()
  }

  const handleCopyUrl = async () => {
    if (!company) return
    
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/${company.company_slug}/careers`
    
    try {
      await navigator.clipboard.writeText(url)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container-main section-spacing text-center">
          <p className="text-muted">Loading...</p>
        </div>
      </main>
    )
  }

  if (!company) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container-main section-spacing text-center">
          <p className="text-muted">Company not found</p>
          <Button className="mt-4" onClick={() => router.push("/auth/login")}>
            Back to Login
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container-main section-spacing">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{company.company_name}</h1>
            <p className="text-muted">Manage your careers page</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <CompanyCard
            title="Edit Page"
            description="Customize colors, add sections, manage content, and preview changes"
            href={`/${company.company_slug}/edit`}
            action="Edit"
          />
          <CompanyCard
            title="View Public Page"
            description="See your published careers page as candidates see it"
            href={`/${company.company_slug}/careers`}
            action="View Live"
          />
        </div>

        <div className="mt-12 p-6 bg-secondary rounded border border-border">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div>
            <p className="text-muted mb-2">Public careers page URL:</p>
            <div className="bg-background px-3 py-2 rounded flex items-start justify-between gap-3">
              <code className="text-sm break-all flex-1">
                {`${typeof window !== "undefined" ? window.location.origin : ""}`}/{company.company_slug}/careers
              </code>
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-1.5 text-xs hover:text-accent transition-colors shrink-0 mt-0.5"
                title={isCopied ? "Copied!" : "Copy URL"}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
