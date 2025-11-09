"use client"

import { useState } from "react"
import type { Company, Job, PageSection } from "@/lib/types"
import JobCard from "./job-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface CareersPageProps {
  company: Company
  jobs: Job[]
  sections: PageSection[]
}

export default function CareersPage({ company, jobs, sections }: CareersPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedJobType, setSelectedJobType] = useState("")

  const locations = [...new Set(jobs.map((j) => j.location))]
  const jobTypes = [...new Set(jobs.map((j) => j.job_type))]

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = !searchQuery || job.job_title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = !selectedLocation || job.location === selectedLocation
    const matchesJobType = !selectedJobType || job.job_type === selectedJobType

    return matchesSearch && matchesLocation && matchesJobType
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="text-white py-20" style={{ backgroundColor: company.primary_color }}>
        <div className="max-w-6xl mx-auto px-6">
          {company.logo_url && (
            <img
              src={company.logo_url || "/placeholder.svg"}
              alt={company.company_name}
              className="h-12 mb-6 object-contain"
            />
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{company.company_name}</h1>
          <p className="text-lg opacity-90">{company.company_description}</p>
        </div>
      </header>

      {/* Content Sections */}
      {sections.map((section) => (
        <section key={section.id} className="max-w-6xl mx-auto px-6 py-16 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{section.section_title}</h2>
          <p className="text-gray-600 leading-relaxed">{section.section_content}</p>
        </section>
      ))}

      {/* Video Section (if exists) */}
      {company.culture_video_url && (
        <section className="max-w-6xl mx-auto px-6 py-16 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Culture</h2>
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={company.culture_video_url}
              title="Company Culture"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      )}

      {/* Jobs Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Open Positions</h2>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <select
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Job Types</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Job Listings */}
        {filteredJobs.length === 0 ? (
          <p className="text-gray-600 text-center py-12">No positions match your search</p>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} accentColor={company.accent_color} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600 text-sm">
          <p>
            © {new Date().getFullYear()} {company.company_name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
