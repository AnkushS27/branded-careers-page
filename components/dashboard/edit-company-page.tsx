"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Company } from "@/lib/types"
import Link from "next/link"

interface EditCompanyPageProps {
  company: Company
}

export default function EditCompanyPage({ company }: EditCompanyPageProps) {
  const [formData, setFormData] = useState(company)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleColorChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/companies/${company.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: formData.company_name,
          company_description: formData.company_description,
          logo_url: formData.logo_url,
          banner_image_url: formData.banner_image_url,
          culture_video_url: formData.culture_video_url,
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color,
          accent_color: formData.accent_color,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update company")
      }

      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update company")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/companies/${company.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_published: !company.is_published }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to publish")
      }

      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to publish")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              ← Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{company.company_name}</h1>
          <div />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200 flex gap-8">
          <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium">Settings</button>
          <Link href={`/dashboard/${company.id}/page-sections`}>
            <button className="px-4 py-2 text-gray-600 font-medium hover:text-gray-900">Page Content</button>
          </Link>
          <Link href={`/dashboard/${company.id}/jobs`}>
            <button className="px-4 py-2 text-gray-600 font-medium hover:text-gray-900">Job Postings</button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-lg p-8 border border-gray-200">
          {/* Basic Info */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_description">Description</Label>
                <Textarea
                  id="company_description"
                  name="company_description"
                  value={formData.company_description || ""}
                  onChange={handleChange}
                  placeholder="Tell candidates about your company..."
                  disabled={isLoading}
                  rows={5}
                />
              </div>
            </div>
          </div>

          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Brand & Media</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  name="logo_url"
                  type="url"
                  value={formData.logo_url || ""}
                  onChange={handleChange}
                  placeholder="https://..."
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banner_image_url">Banner Image URL</Label>
                <Input
                  id="banner_image_url"
                  name="banner_image_url"
                  type="url"
                  value={formData.banner_image_url || ""}
                  onChange={handleChange}
                  placeholder="https://..."
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="culture_video_url">Culture Video URL</Label>
                <Input
                  id="culture_video_url"
                  name="culture_video_url"
                  type="url"
                  value={formData.culture_video_url || ""}
                  onChange={handleChange}
                  placeholder="https://..."
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Colors */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Brand Colors</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex gap-2">
                  <input
                    id="primary_color"
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => handleColorChange("primary_color", e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <Input type="text" value={formData.primary_color} readOnly className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <div className="flex gap-2">
                  <input
                    id="secondary_color"
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => handleColorChange("secondary_color", e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <Input type="text" value={formData.secondary_color} readOnly className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent_color">Accent Color</Label>
                <div className="flex gap-2">
                  <input
                    id="accent_color"
                    type="color"
                    value={formData.accent_color}
                    onChange={(e) => handleColorChange("accent_color", e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <Input type="text" value={formData.accent_color} readOnly className="flex-1" />
                </div>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}

          {success && <p className="text-sm text-green-600 bg-green-50 p-3 rounded">Changes saved successfully!</p>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={handlePublish} disabled={isLoading}>
              {company.is_published ? "Unpublish" : "Publish"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
