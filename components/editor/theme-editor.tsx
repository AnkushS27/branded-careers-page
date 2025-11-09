"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
      <div className="space-y-2">
        <Label htmlFor="company-name">Company Name</Label>
        <Input id="company-name" name="name" value={formData.company_name} onChange={handleChange} placeholder="Your Company" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="primary-color">Primary Color</Label>
          <div className="flex gap-2">
            <input
              type="color"
              id="primary-color"
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

        <div className="space-y-2">
          <Label htmlFor="secondary-color">Secondary Color</Label>
          <div className="flex gap-2">
            <input
              type="color"
              id="secondary-color"
              name="secondary_color"
              value={formData.secondary_color}
              onChange={handleColorChange}
              className="w-16 h-10 rounded cursor-pointer border border-border"
            />
            <Input
              name="secondary_color"
              value={formData.secondary_color}
              onChange={handleColorChange}
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accent-color">Accent Color</Label>
          <div className="flex gap-2">
            <input
              type="color"
              id="accent-color"
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

      <div className="space-y-2">
        <Label htmlFor="logo-url">Logo URL</Label>
        <Input
          id="logo-url"
          name="logo_url"
          value={formData.logo_url || ""}
          onChange={handleChange}
          placeholder="https://example.com/logo.png"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="banner-url">Banner URL</Label>
        <Input
          id="banner-url"
          name="banner_image_url"
          value={formData.banner_image_url || ""}
          onChange={handleChange}
          placeholder="https://example.com/banner.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="video-url">Culture Video URL</Label>
        <Input
          id="video-url"
          name="culture_video_url"
          value={formData.culture_video_url || ""}
          onChange={handleChange}
          placeholder="https://youtube.com/embed/..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company-description">Company Description</Label>
        <Textarea
          id="company-description"
          name="company_description"
          value={formData.company_description || ""}
          onChange={handleChange}
          placeholder="Tell your company story..."
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
