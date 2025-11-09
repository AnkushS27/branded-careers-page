"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import ThemeEditor from "@/components/editor/theme-editor"
import SectionsManager from "@/components/editor/sections-manager"
import JobsManager from "@/components/editor/jobs-manager"
import type { Company } from "@/lib/types"

interface Tab {
  id: string
  label: string
}

const TABS: Tab[] = [
  { id: "branding", label: "Branding & Theme" },
  { id: "content", label: "Content Sections" },
  { id: "jobs", label: "Manage Jobs" },
]

export default function EditPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [company, setCompany] = useState<Company | null>(null)
  const [activeTab, setActiveTab] = useState("branding")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/api/companies/by-slug/${params.slug}`)
        if (!response.ok) throw new Error("Company not found")
        const data = await response.json()
        setCompany(data)
      } catch (error) {
        console.error("Error fetching company:", error)
        router.push("/login")
      }
    }

    fetchCompany()
  }, [params.slug, router])

  const handleSaveCompany = async (updates: Partial<Company>) => {
    if (!company) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/companies/${company.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error("Failed to save")
      const updated = await response.json()
      setCompany(updated)
    } catch (error) {
      console.error("Error saving company:", error)
      alert("Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  if (!company) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container-main py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <p className="text-muted">Edit your careers page</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                activeTab === tab.id ? "border-accent text-foreground" : "border-transparent text-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "branding" && <ThemeEditor company={company} onSave={handleSaveCompany} isSaving={isSaving} />}

        {activeTab === "content" && <SectionsManager companyId={company.id} />}

        {activeTab === "jobs" && <JobsManager companyId={company.id} />}
      </div>
    </main>
  )
}
