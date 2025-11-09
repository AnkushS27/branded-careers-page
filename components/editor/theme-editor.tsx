"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Company } from "@/lib/types"

interface ThemeEditorProps {
  company: Company
  onSave: (updates: Partial<Company>) => Promise<void>
  isSaving: boolean
}

export default function ThemeEditor({ company, onSave, isSaving }: ThemeEditorProps) {
  const [formData, setFormData] = useState(company)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-2">Company Name</label>
        <Input name="name" value={formData.name} onChange={handleChange} placeholder="Your Company" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Primary Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              name="primary_color"
              value={formData.primary_color}
              onChange={handleColorChange}
              className="w-16 h-10 rounded cursor-pointer border border-border"
            />
            <Input
              name="primary_color"
              value={formData.primary_color}
              onChange={handleColorChange}
              placeholder="#000000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Accent Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              name="accent_color"
              value={formData.accent_color}
              onChange={handleColorChange}
              className="w-16 h-10 rounded cursor-pointer border border-border"
            />
            <Input
              name="accent_color"
              value={formData.accent_color}
              onChange={handleColorChange}
              placeholder="#3B82F6"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Logo URL</label>
        <Input
          name="logo_url"
          value={formData.logo_url || ""}
          onChange={handleChange}
          placeholder="https://example.com/logo.png"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Banner URL</label>
        <Input
          name="banner_url"
          value={formData.banner_url || ""}
          onChange={handleChange}
          placeholder="https://example.com/banner.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Culture Video URL</label>
        <Input
          name="culture_video_url"
          value={formData.culture_video_url || ""}
          onChange={handleChange}
          placeholder="https://youtube.com/embed/..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">About Section</label>
        <textarea
          name="about_section"
          value={formData.about_section || ""}
          onChange={handleChange}
          placeholder="Tell your company story..."
          className="w-full px-3 py-2 border border-border rounded bg-background"
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
