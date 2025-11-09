"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import JobCard from "./job-card"
import type { Company, Job } from "@/lib/types"

interface CareersPageClientProps {
  company: Company
  jobs: Job[]
  sections: any[]
}

export default function CareersPageClient({ company, jobs, sections }: CareersPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedJobType, setSelectedJobType] = useState("")

  const locations = Array.from(new Set(jobs.map((j) => j.location).filter(Boolean)))
  const jobTypes = Array.from(new Set(jobs.map((j) => j.job_type).filter(Boolean)))

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.department?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      const matchesLocation = !selectedLocation || job.location === selectedLocation
      const matchesJobType = !selectedJobType || job.job_type === selectedJobType

      return matchesSearch && matchesLocation && matchesJobType
    })
  }, [jobs, searchQuery, selectedLocation, selectedJobType])

  return (
    <div className="min-h-screen bg-background">
      {/* Header with banner */}
      <header className="py-16 md:py-24 text-white" style={{ backgroundColor: company.primary_color || "#000000" }}>
        <div className="container-main">
          {company.logo_url && (
            <img src={company.logo_url || "/placeholder.svg"} alt={company.name} className="h-12 mb-6" />
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Careers at {company.name}</h1>
          {company.about_section && <p className="text-lg opacity-90 max-w-2xl">{company.about_section}</p>}
        </div>
      </header>

      {/* Content sections */}
      {sections.map((section) => (
        <section key={section.id} className="container-main section-spacing border-b border-border last:border-b-0">
          <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
          <p className="text-muted leading-relaxed whitespace-pre-wrap">{section.content}</p>
        </section>
      ))}

      {/* Jobs section */}
      <section className="container-main section-spacing">
        <h2 className="text-3xl font-bold mb-8">Open Positions</h2>

        {/* Search and filters */}
        <div className="mb-12 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search by title or department</label>
            <Input
              type="text"
              placeholder="e.g. Engineer, Marketing"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded bg-background"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Job Type</label>
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded bg-background"
              >
                <option value="">All Types</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Jobs list */}
        {filteredJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} accentColor={company.accent_color} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted text-lg">No positions found. Please try different search criteria.</p>
          </div>
        )}
      </section>
    </div>
  )
}
