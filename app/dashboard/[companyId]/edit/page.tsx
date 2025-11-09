"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import EditCompanyPage from "@/components/dashboard/edit-company-page"
import type { Company } from "@/lib/types"

interface Params {
  companyId: string
}

export default function Page({ params }: { params: Params }) {
  const router = useRouter()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        // Get user_id from localStorage
        const userId = localStorage.getItem("user_id")
        if (!userId) {
          router.push("/auth/login")
          return
        }

        // Fetch company by ID
        const response = await fetch(`/api/companies/${params.companyId}`)
        if (!response.ok) {
          router.push("/dashboard")
          return
        }

        const companyData = await response.json()

        // Verify ownership
        if (companyData.user_id !== userId) {
          router.push("/dashboard")
          return
        }

        setCompany(companyData)
      } catch (error) {
        console.error("Error fetching company:", error)
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchCompany()
  }, [params.companyId, router])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </main>
    )
  }

  if (!company) {
    return null
  }

  return <EditCompanyPage company={company} />
}
