"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import type { Company } from "@/lib/types"
import CompanyList from "./company-list"
import CreateCompanyDialog from "./create-company-dialog"

export default function DashboardContent({ user }: { user: User }) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase.from("companies").select("*").eq("user_id", user.id)

        if (error) throw error
        setCompanies(data || [])
      } catch (err) {
        console.error("Error fetching companies:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanies()
  }, [supabase, user.id])

  const handleCompanyCreated = (newCompany: Company) => {
    setCompanies([...companies, newCompany])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>
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
