"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ThemeEditor from "@/components/editor/theme-editor"
import SectionsManager from "@/components/editor/sections-manager"
import JobsManager from "@/components/editor/jobs-manager"
import type { Company } from "@/lib/types"
import Link from "next/link"
import { Eye, Globe, EyeOff, ArrowLeft } from "lucide-react"

interface Tab {
  id: string
  label: string
}

const TABS: Tab[] = [
  { id: "branding", label: "Branding & Theme" },
  { id: "content", label: "Content Sections" },
  { id: "jobs", label: "Manage Jobs" },
]

export default function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [company, setCompany] = useState<Company | null>(null)
  const [activeTab, setActiveTab] = useState("branding")
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/api/companies/by-slug/${slug}`)
        if (!response.ok) throw new Error("Company not found")
        const data = await response.json()
        setCompany(data)
      } catch (error) {
        console.error("Error fetching company:", error)
        router.push("/auth/login")
      }
    }

    fetchCompany()
  }, [slug, router])

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

  const handleTogglePublish = async () => {
    if (!company) return

    setIsPublishing(true)
    try {
      const response = await fetch(`/api/companies/${company.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !company.is_published }),
      })

      if (!response.ok) throw new Error("Failed to update publish status")
      const updated = await response.json()
      setCompany(updated)
    } catch (error) {
      console.error("Error toggling publish status:", error)
      alert("Failed to update publish status")
    } finally {
      setIsPublishing(false)
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
            <h1 className="text-3xl font-bold">{company.company_name}</h1>
            <p className="text-muted">Edit your careers page</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href={`/${company.company_slug}/preview`} target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="w-3.5 h-3.5 mr-2" />
                Preview
              </Button>
            </Link>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-3 px-4 py-2 rounded-md border border-border bg-background hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-2">
                      {company.is_published ? (
                        <Globe className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium">
                        {company.is_published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <Switch
                      checked={company.is_published}
                      onCheckedChange={handleTogglePublish}
                      disabled={isPublishing}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {company.is_published
                      ? "Your careers page is live and publicly accessible"
                      : "Your careers page is hidden. Enable to make it publicly accessible"
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="w-3.5 h-3.5 mr-2"/>Back to Dashboard
            </Button>
          </div>
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
