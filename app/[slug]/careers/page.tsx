import { notFound } from "next/navigation"
import { query } from "@/lib/db"
import CareersPageClient from "@/components/careers/careers-page-client"
import type { Company, Job } from "@/lib/types"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const companyResult = await query("SELECT * FROM companies WHERE company_slug = $1", [slug])

  if (companyResult.length === 0) return {}

  const company = companyResult[0]
  return {
    title: `${company.company_name} Careers`,
    description: `Join ${company.company_name}. Browse open positions and apply today.`,
  }
}

export default async function CareersPage({
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

    // Check if the careers page is published
    if (!company.is_published) {
      notFound()
    }

    const jobsResult = await query(
      "SELECT * FROM jobs WHERE company_id = $1 ORDER BY posted_at DESC",
      [company.id],
    )

    const jobs = jobsResult as Job[]

    const sectionsResult = await query(
      "SELECT * FROM page_sections WHERE company_id = $1 AND is_visible = true ORDER BY section_order ASC",
      [company.id],
    )

    return <CareersPageClient company={company} jobs={jobs} sections={sectionsResult} />
  } catch (error) {
    console.error("Error loading careers page:", error)
    notFound()
  }
}
