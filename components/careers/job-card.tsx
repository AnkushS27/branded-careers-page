import type { Job } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface JobCardProps {
  job: Job
  accentColor: string
}

export default function JobCard({ job, accentColor }: JobCardProps) {
  const salaryDisplay =
    job.salary_min && job.salary_max ? `${job.salary_currency} ${job.salary_min}–${job.salary_max}` : null

  return (
    <div className="p-6 border border-border rounded hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-1">{job.job_title}</h3>
          <p className="text-muted text-sm">{job.department}</p>
        </div>
        {job.posted_at && new Date(job.posted_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
          <Badge variant="outline" className="text-xs">
            New
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-4 text-sm">
        {job.location && <span className="text-muted">📍 {job.location}</span>}
        {job.employment_type && <span className="text-muted">• {job.employment_type}</span>}
        {job.experience_level && <span className="text-muted">• {job.experience_level}</span>}
      </div>

      {salaryDisplay && (
        <p className="mb-4 font-semibold" style={{ color: accentColor }}>
          {salaryDisplay}
        </p>
      )}

      <button className="px-4 py-2 rounded text-white text-sm font-medium" style={{ backgroundColor: accentColor }}>
        View Details
      </button>
    </div>
  )
}
