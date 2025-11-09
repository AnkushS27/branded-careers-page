import type { Job } from "@/lib/types"
import { MapPin, Briefcase, DollarSign, TrendingUp } from "lucide-react"

interface JobCardProps {
  job: Job
  accentColor: string
}

export default function JobCard({ job, accentColor }: JobCardProps) {
  const formatSalary = () => {
    if (job.salary_min && job.salary_max) {
      return `${job.salary_min}–${job.salary_max} ${job.salary_currency}`
    }
    return "Competitive"
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{job.job_title}</h3>
          <p className="text-sm text-gray-600">{job.department}</p>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: accentColor }}>
          {job.experience_level}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Briefcase className="w-4 h-4" />
          <span>{job.job_type}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>{formatSalary()}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>{job.employment_type}</span>
        </div>
      </div>

      {job.job_description && <p className="text-gray-600 text-sm mt-4 line-clamp-2">{job.job_description}</p>}
    </div>
  )
}
