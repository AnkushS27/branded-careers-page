"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import type { Company } from "@/lib/types"
import CompanyList from "./company-list"
import CreateCompanyDialog from "./create-company-dialog"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface DashboardContentProps {
  userId: string
  userEmail: string
}

export default function DashboardContent({ userId, userEmail }: DashboardContentProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`/api/companies?user_id=${userId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch companies")
        }

        const data = await response.json()
        setCompanies(data || [])
      } catch (err) {
        console.error("Error fetching companies:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanies()
  }, [userId])

  const handleCompanyCreated = (newCompany: Company) => {
    setCompanies([...companies, newCompany])
  }

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{userEmail}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">My Companies</h2>
          <CreateCompanyDialog onCompanyCreated={handleCompanyCreated} />
        </div>

        {isLoading ? (
          <p className="text-gray-600">Loading...</p>
        ) : companies.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-4">No companies yet. Create one to get started!</p>
          </div>
        ) : (
          <CompanyList companies={companies} />
        )}
      </main>
    </div>
  )
}
