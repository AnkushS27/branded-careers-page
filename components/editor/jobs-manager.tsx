"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Job } from "@/lib/types"

interface JobsManagerProps {
  companyId: string
}

export default function JobsManager({ companyId }: JobsManagerProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    job_title: "",
    job_slug: "",
    department: "",
    location: "",
    job_type: "",
    employment_type: "",
    experience_level: "",
    salary_min: "",
    salary_max: "",
    salary_currency: "USD",
    job_description: "",
  })

  useEffect(() => {
    fetchJobs()
  }, [companyId])

  const fetchJobs = async () => {
    try {
      const response = await fetch(`/api/jobs?company_id=${companyId}`)
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      if (response.ok) {
        setFormData({
          job_title: "",
          job_slug: "",
          department: "",
          location: "",
          job_type: "",
          employment_type: "",
          experience_level: "",
          salary_min: "",
          salary_max: "",
          salary_currency: "USD",
          job_description: "",
        })
        setShowForm(false)
        fetchJobs()
      }
    } catch (error) {
      console.error("Error adding job:", error)
    }
  }

  const handleDeleteJob = async (id: string) => {
    try {
      await fetch(`/api/jobs/${id}`, { method: "DELETE" })
      fetchJobs()
    } catch (error) {
      console.error("Error deleting job:", error)
    }
  }

  if (isLoading) {
    return <p className="text-muted">Loading jobs...</p>
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Jobs</h2>
        {!showForm && <Button onClick={() => setShowForm(true)}>Add New Job</Button>}
      </div>

      <div className={`grid ${showForm ? "md:grid-cols-3" : "md:grid-cols-1"} gap-6`}>
        {/* Add Job Form */}
        {showForm && (
          <form onSubmit={handleAddJob} className="p-6 md:col-span-2 bg-secondary rounded border border-border space-y-4">
            <h3 className="text-lg font-semibold mb-4">Add New Job</h3>
            <div className="grid md:grid-cols-2 gap-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title</Label>
                <Input
                  id="job-title"
                  value={formData.job_title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, job_title: e.target.value }))}
                  placeholder="Job Title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-slug">Job Slug</Label>
                <Input
                  id="job-slug"
                  value={formData.job_slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, job_slug: e.target.value }))}
                  placeholder="Auto-generated from title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  placeholder="e.g., Engineering"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Berlin, Germany"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-type">Job Type</Label>
                <Input
                  id="job-type"
                  value={formData.job_type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, job_type: e.target.value }))}
                  placeholder="e.g., Permanent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment-type">Employment Type</Label>
                <Input
                  id="employment-type"
                  value={formData.employment_type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      employment_type: e.target.value,
                    }))
                  }
                  placeholder="e.g., Full time"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience-level">Experience Level</Label>
                <Input
                  id="experience-level"
                  value={formData.experience_level}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      experience_level: e.target.value,
                    }))
                  }
                  placeholder="e.g., Senior"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.salary_currency} onValueChange={(value) => setFormData((prev) => ({ ...prev, salary_currency: value }))}>
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="CAD">CAD ($)</SelectItem>
                    <SelectItem value="AUD">AUD ($)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                    <SelectItem value="CNY">CNY (¥)</SelectItem>
                    <SelectItem value="SGD">SGD ($)</SelectItem>
                    <SelectItem value="AED">AED (د.إ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary-min">Salary Min</Label>
                <Input
                  id="salary-min"
                  type="number"
                  value={formData.salary_min}
                  onChange={(e) => setFormData((prev) => ({ ...prev, salary_min: e.target.value }))}
                  placeholder="e.g., 800000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary-max">Salary Max</Label>
                <Input
                  id="salary-max"
                  type="number"
                  value={formData.salary_max}
                  onChange={(e) => setFormData((prev) => ({ ...prev, salary_max: e.target.value }))}
                  placeholder="e.g., 1200000"
                />
              </div>

            </div>
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                value={formData.job_description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    job_description: e.target.value,
                  }))
                }
                placeholder="Job description..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Add Job</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Existing Jobs List */}
        <div className={showForm ? "" : "md:col-span-1"}>
          <h3 className="text-lg font-semibold mb-4">Existing Jobs ({jobs.length})</h3>
          <div className="space-y-3">
            {jobs.length === 0 ? (
              <p className="text-muted text-center py-4">No jobs yet. Click "Add New Job" to create one.</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="p-4 border border-border rounded flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{job.job_title}</h4>
                    <p className="text-sm text-muted">
                      {job.location} • {job.employment_type}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteJob(job.id)}>
                    Delete
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
