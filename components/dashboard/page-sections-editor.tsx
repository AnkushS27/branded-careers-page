"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Company, PageSection } from "@/lib/types"
import Link from "next/link"
import { GripVertical, Trash2, Plus } from "lucide-react"

interface PageSectionsEditorProps {
  company: Company
  sections: PageSection[]
}

const SECTION_TYPES = [
  { value: "about", label: "About Us" },
  { value: "culture", label: "Life at Company" },
  { value: "benefits", label: "Benefits" },
  { value: "team", label: "Our Team" },
  { value: "values", label: "Values" },
]

export default function PageSectionsEditor({ company, sections: initialSections }: PageSectionsEditorProps) {
  const [sections, setSections] = useState(initialSections)
  const [newSectionType, setNewSectionType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleAddSection = async () => {
    if (!newSectionType) return

    setIsLoading(true)
    try {
      const sectionType = SECTION_TYPES.find((t) => t.value === newSectionType)
      const response = await fetch("/api/page-sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_id: company.id,
          section_type: newSectionType,
          section_title: sectionType?.label || "",
          section_content: "",
          section_order: sections.length,
          is_visible: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add section")
      }

      const data = await response.json()
      setSections([...sections, data])
      setNewSectionType("")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add section")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSection = (id: string, field: string, value: string | boolean) => {
    setSections(sections.map((section) => (section.id === id ? { ...section, [field]: value } : section)))
  }

  const handleDeleteSection = async (id: string) => {
    if (!confirm("Delete this section?")) return

    try {
      const response = await fetch(`/api/page-sections/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete section")
      }

      setSections(sections.filter((s) => s.id !== id))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete section")
    }
  }

  const handleSaveAll = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Update all sections
      for (const section of sections) {
        const response = await fetch(`/api/page-sections/${section.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            section_title: section.section_title,
            section_content: section.section_content,
            section_order: section.section_order,
            is_visible: section.is_visible,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to save sections")
        }
      }

      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save sections")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href={`/dashboard/${company.id}/edit`}>
            <Button variant="outline" size="sm">
              ← Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Page Content</h1>
          <div />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Add New Section */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add Content Section</h2>
            <div className="flex gap-2">
              <select
                value={newSectionType}
                onChange={(e) => setNewSectionType(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select section type...</option>
                {SECTION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <Button onClick={handleAddSection} disabled={!newSectionType || isLoading}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            {sections.length === 0 ? (
              <p className="text-gray-600 text-center py-12 bg-white rounded-lg border border-gray-200">
                No sections yet. Add one to get started!
              </p>
            ) : (
              sections.map((section, index) => (
                <div key={section.id} className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <GripVertical className="w-5 h-5 text-gray-400 mt-1 cursor-move" />
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`title-${section.id}`}>Section Title</Label>
                        <Input
                          id={`title-${section.id}`}
                          value={section.section_title}
                          onChange={(e) => handleUpdateSection(section.id, "section_title", e.target.value)}
                          placeholder="Section title"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSection(section.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`content-${section.id}`}>Content</Label>
                    <Textarea
                      id={`content-${section.id}`}
                      value={section.section_content || ""}
                      onChange={(e) => handleUpdateSection(section.id, "section_content", e.target.value)}
                      placeholder="Write your section content here..."
                      rows={6}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={section.is_visible}
                        onChange={(e) => handleUpdateSection(section.id, "is_visible", e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">Visible on careers page</span>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}

          {success && <p className="text-sm text-green-600 bg-green-50 p-3 rounded">Changes saved successfully!</p>}

          <Button onClick={handleSaveAll} disabled={isLoading} className="w-full">
            {isLoading ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </main>
    </div>
  )
}
