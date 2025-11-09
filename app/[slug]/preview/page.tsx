import { notFound } from "next/navigation"
import { query } from "@/lib/db"
import CareersPageClient from "@/components/careers/careers-page-client"
import type { Company, Job } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  try {
    const { slug } = await params
    const companyResult = await query("SELECT * FROM companies WHERE company_slug = $1", [slug])

    if (companyResult.length === 0) {
      notFound()
    }

    const company = companyResult[0] as Company

    const jobsResult = await query(
      "SELECT * FROM jobs WHERE company_id = $1 ORDER BY posted_at DESC",
      [company.id],
    )

    const jobs = jobsResult as Job[]

    const sectionsResult = await query(
      "SELECT * FROM page_sections WHERE company_id = $1 AND is_visible = true ORDER BY section_order ASC",
      [company.id],
    )

    return (
      <div>
        {/* Preview Header */}
        <div className="sticky top-0 z-50 bg-yellow-50 border-b-2 border-yellow-300">
          <div className="container-main py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-yellow-200 text-yellow-900 text-sm font-semibold rounded">
                PREVIEW MODE
              </div>
              <p className="text-sm text-yellow-900">
                Showing saved content • Not visible to public
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/${company.company_slug}/careers`} target="_blank">
                <Button variant="outline" size="sm">
                  View Public Page
                </Button>
              </Link>
              <Link href={`/${company.company_slug}/edit`}>
                <Button size="sm">Back to Editor</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <CareersPageClient company={company} jobs={jobs} sections={sectionsResult} />
      </div>
    )
  } catch (error) {
    console.error("Error loading preview page:", error)
    notFound()
  }
}

