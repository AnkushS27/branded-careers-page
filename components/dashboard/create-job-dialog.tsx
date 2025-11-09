"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Job } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CreateJobDialogProps {
  companyId: string
  onJobCreated: (job: Job) => void
  onClose: () => void
}

export default function CreateJobDialog({ companyId, onJobCreated, onClose }: CreateJobDialogProps) {
  const [formData, setFormData] = useState({
    job_title: "",
    job_slug: "",
    job_description: "",
    department: "",
    location: "",
    job_type: "Full time",
    employment_type: "Permanent",
    experience_level: "Mid",
    salary_min: "",
    salary_max: "",
    salary_currency: "USD",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_id: companyId,
          job_title: formData.job_title,
          job_slug: formData.job_slug || formData.job_title.toLowerCase().replace(/\s+/g, "-"),
          job_description: formData.job_description,
          department: formData.department,
          location: formData.location,
          job_type: formData.job_type,
          employment_type: formData.employment_type,
          experience_level: formData.experience_level,
          salary_min: formData.salary_min ? Number.parseInt(formData.salary_min) : null,
          salary_max: formData.salary_max ? Number.parseInt(formData.salary_max) : null,
          salary_currency: formData.salary_currency,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create job")
      }

      const data = await response.json()
      onJobCreated(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create job")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Job Posting</DialogTitle>
          <DialogDescription>Add a new open position to your careers page</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title *</Label>
              <Input
                id="job_title"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                placeholder="e.g., Full Stack Engineer"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Product"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Berlin, Germany"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job_type">Job Type *</Label>
              <select
                id="job_type"
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Full time</option>
                <option>Part time</option>
                <option>Contract</option>
                <option>Temporary</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience_level">Experience Level *</Label>
              <select
                id="experience_level"
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Entry</option>
                <option>Mid</option>
                <option>Senior</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employment_type">Employment Type *</Label>
              <select
                id="employment_type"
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Permanent</option>
                <option>Temporary</option>
                <option>Contract</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_currency">Currency</Label>
              <Input
                id="salary_currency"
                name="salary_currency"
                value={formData.salary_currency}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary_min">Salary Min</Label>
              <Input
                id="salary_min"
                name="salary_min"
                type="number"
                value={formData.salary_min}
                onChange={handleChange}
                placeholder="8000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_max">Salary Max</Label>
              <Input
                id="salary_max"
                name="salary_max"
                type="number"
                value={formData.salary_max}
                onChange={handleChange}
                placeholder="12000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_description">Job Description</Label>
            <Textarea
              id="job_description"
              name="job_description"
              value={formData.job_description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={5}
            />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
