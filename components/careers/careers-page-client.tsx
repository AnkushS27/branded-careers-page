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
        job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.department?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      const matchesLocation = !selectedLocation || job.location === selectedLocation
      const matchesJobType = !selectedJobType || job.job_type === selectedJobType

      return matchesSearch && matchesLocation && matchesJobType
    })
  }, [jobs, searchQuery, selectedLocation, selectedJobType])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      {company.banner_image_url ? (
        <div className="relative min-h-[400px] md:min-h-[500px] w-full">
          <img 
            src={company.banner_image_url} 
            alt={`${company.company_name} banner`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative bg-black/50 min-h-[400px] md:min-h-[500px] flex flex-col justify-center py-8 md:py-12">
            <div className="px-6 md:px-12 w-full text-white">
              {company.logo_url && (
                <img src={company.logo_url || "/placeholder.svg"} alt={company.company_name} className="h-12 md:h-16 mb-6 object-contain" />
              )}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">Careers at {company.company_name}</h1>
              {company.company_description && <p className="text-lg md:text-xl opacity-90 leading-relaxed">{company.company_description}</p>}
            </div>
          </div>
        </div>
      ) : (
        <header className="py-16 md:py-24 text-white" style={{ backgroundColor: company.primary_color || "#000000" }}>
          <div className="px-6 md:px-12 w-full">
            {company.logo_url && (
              <img src={company.logo_url || "/placeholder.svg"} alt={company.company_name} className="h-16 mb-6 object-contain" />
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Careers at {company.company_name}</h1>
            {company.company_description && <p className="text-lg opacity-90">{company.company_description}</p>}
          </div>
        </header>
      )}

      {/* Culture Video Section */}
      {company.culture_video_url && (
        <section className="container-main section-spacing border-b border-border">
          <h2 className="text-5xl font-bold mb-6 text-center" style={{ color: company.accent_color || "#000000" }}>Life at {company.company_name}</h2>
          <div className="aspect-video max-w-4xl mx-auto">
            <iframe
              src={company.culture_video_url}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`Life at ${company.company_name}`}
            />
          </div>
        </section>
      )}

      {/* Content sections */}
      {sections.map((section) => (
        <section key={section.id} className="container-main section-spacing border-b border-border last:border-b-0">
          <h2 className="text-3xl font-bold mb-6">{section.section_title}</h2>
          <p className="text-muted leading-relaxed whitespace-pre-wrap">{section.section_content}</p>
        </section>
      ))}

      {/* Jobs section */}
      <section className="container-main section-spacing">
        <h2 className="text-3xl font-bold mb-8">Open Positions</h2>

        {/* Search and filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div>
            <label className="block text-sm font-medium mb-2">Search by title or department</label>
            <Input
              type="text"
              placeholder="e.g. Engineer, Marketing"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
