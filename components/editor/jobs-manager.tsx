"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
          salary_currency: "USD",
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
    <div className="space-y-6 max-w-4xl">
      {!showForm ? (
        <Button onClick={() => setShowForm(true)}>Add New Job</Button>
      ) : (
        <form onSubmit={handleAddJob} className="p-6 bg-secondary rounded border border-border space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Job Title</label>
              <Input
                value={formData.job_title}
                onChange={(e) => setFormData((prev) => ({ ...prev, job_title: e.target.value }))}
                placeholder="Job Title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Job Slug</label>
              <Input
                value={formData.job_slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, job_slug: e.target.value }))}
                placeholder="Auto-generated from title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <Input
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

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Berlin, Germany"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Job Type</label>
              <Input
                value={formData.job_type}
                onChange={(e) => setFormData((prev) => ({ ...prev, job_type: e.target.value }))}
                placeholder="e.g., Permanent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Employment Type</label>
              <Input
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

            <div>
              <label className="block text-sm font-medium mb-2">Experience Level</label>
              <Input
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

            <div>
              <label className="block text-sm font-medium mb-2">Salary Min</label>
              <Input
                type="number"
                value={formData.salary_min}
                onChange={(e) => setFormData((prev) => ({ ...prev, salary_min: e.target.value }))}
                placeholder="e.g., 8"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Salary Max</label>
              <Input
                type="number"
                value={formData.salary_max}
                onChange={(e) => setFormData((prev) => ({ ...prev, salary_max: e.target.value }))}
                placeholder="e.g., 12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Job Description</label>
            <textarea
              value={formData.job_description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  job_description: e.target.value,
                }))
              }
              placeholder="Job description..."
              className="w-full px-3 py-2 border border-border rounded bg-background"
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

      <div>
        <h3 className="text-lg font-semibold mb-4">Jobs ({jobs.length})</h3>
        <div className="space-y-3">
          {jobs.map((job) => (
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
          ))}
        </div>
      </div>
    </div>
  )
}
