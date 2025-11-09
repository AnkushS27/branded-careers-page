"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import type { Company, Job } from "@/lib/types"
import Link from "next/link"
import { Plus, Trash2, Edit2 } from "lucide-react"
import CreateJobDialog from "./create-job-dialog"
import EditJobDialog from "./edit-job-dialog"

interface JobsManagerProps {
  company: Company
  jobs: Job[]
}

export default function JobsManager({ company, jobs: initialJobs }: JobsManagerProps) {
  const [jobs, setJobs] = useState(initialJobs)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const supabase = createClient()

  const handleJobCreated = (newJob: Job) => {
    setJobs([newJob, ...jobs])
    setShowCreateDialog(false)
  }

  const handleJobUpdated = (updatedJob: Job) => {
    setJobs(jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j)))
    setEditingJob(null)
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Delete this job posting?")) return

    try {
      const { error } = await supabase.from("jobs").delete().eq("id", jobId)

      if (error) throw error
      setJobs(jobs.filter((j) => j.id !== jobId))
    } catch (err) {
      console.error("Error deleting job:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href={`/dashboard/${company.id}/edit`}>
            <Button variant="outline" size="sm">
              ← Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
          <div />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">{jobs.length} Open Positions</h2>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Job
          </Button>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-4">No jobs posted yet</p>
            <Button onClick={() => setShowCreateDialog(true)}>Create Your First Job</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{job.job_title}</h3>
                    <p className="text-sm text-gray-600">
                      {job.department} • {job.location}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingJob(job)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteJob(job.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Type</span>
                    <p className="font-medium text-gray-900">{job.job_type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Level</span>
                    <p className="font-medium text-gray-900">{job.experience_level}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Salary</span>
                    <p className="font-medium text-gray-900">
                      {job.salary_min && job.salary_max ? `${job.salary_min}–${job.salary_max}` : "Competitive"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Posted</span>
                    <p className="font-medium text-gray-900">{new Date(job.posted_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Dialogs */}
      {showCreateDialog && (
        <CreateJobDialog
          companyId={company.id}
          onJobCreated={handleJobCreated}
          onClose={() => setShowCreateDialog(false)}
        />
      )}

      {editingJob && (
        <EditJobDialog job={editingJob} onJobUpdated={handleJobUpdated} onClose={() => setEditingJob(null)} />
      )}
    </div>
  )
}
