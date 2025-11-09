"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import CompanyCard from "@/components/dashboard/company-card"
import type { Company } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const companyId = localStorage.getItem("company_id")
    if (!companyId) {
      router.push("/login")
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
          <Button className="mt-4" onClick={() => router.push("/login")}>
            Back to Login
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container-main section-spacing">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
          <p className="text-muted">Manage your careers page</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <CompanyCard
            title="Edit Page"
            description="Customize colors, add sections, and manage content"
            href={`/${company.slug}/edit`}
            action="Edit"
          />
          <CompanyCard
            title="Preview"
            description="See how your page looks to candidates"
            href={`/${company.slug}/preview`}
            action="Preview"
          />
          <CompanyCard
            title="View Public"
            description="Share this link with candidates"
            href={`/${company.slug}/careers`}
            action="View Public"
          />
        </div>

        <div className="mt-12 p-6 bg-secondary rounded border border-border">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <p className="text-muted mb-4">
            Public careers page URL:
            <br />
            <code className="bg-background px-2 py-1 rounded mt-2 inline-block">
              {`${typeof window !== "undefined" ? window.location.origin : ""}`}/{company.slug}/careers
            </code>
          </p>
        </div>
      </div>
    </main>
  )
}
