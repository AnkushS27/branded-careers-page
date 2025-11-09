"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { PageSection } from "@/lib/types"

interface SectionsManagerProps {
  companyId: string
}

export default function SectionsManager({ companyId }: SectionsManagerProps) {
  const [sections, setSections] = useState<PageSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  })

  useEffect(() => {
    fetchSections()
  }, [companyId])

  const fetchSections = async () => {
    try {
      const response = await fetch(`/api/page-sections?companyId=${companyId}`)
      if (response.ok) {
        const data = await response.json()
        setSections(data)
      }
    } catch (error) {
      console.error("Error fetching sections:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.title) return

    try {
      const response = await fetch("/api/page-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: companyId,
          section_type: "custom",
          title: formData.title,
          content: formData.content,
          order_index: sections.length,
        }),
      })

      if (response.ok) {
        setFormData({ title: "", content: "" })
        fetchSections()
      }
    } catch (error) {
      console.error("Error adding section:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/page-sections/${id}`, { method: "DELETE" })
      fetchSections()
    } catch (error) {
      console.error("Error deleting section:", error)
    }
  }

  if (isLoading) {
    return <p className="text-muted">Loading sections...</p>
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="p-6 bg-secondary rounded border border-border">
        <h3 className="text-lg font-semibold mb-4">Add New Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Why Join Us?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Section content..."
              className="w-full px-3 py-2 border border-border rounded bg-background"
              rows={4}
            />
          </div>

          <Button onClick={handleAdd}>Add Section</Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Existing Sections</h3>
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="p-4 border border-border rounded flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold">{section.title}</h4>
                <p className="text-sm text-muted mt-1 line-clamp-2">{section.content}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleDelete(section.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
