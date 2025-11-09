import { notFound } from "next/navigation"
import { query } from "@/lib/db"
import CareersPageClient from "@/components/careers/careers-page-client"
import type { Company, Job } from "@/lib/types"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const companyResult = await query("SELECT * FROM companies WHERE slug = $1", [params.slug])

  if (companyResult.length === 0) return {}

  const company = companyResult[0]
  return {
    title: `${company.name} Careers`,
    description: `Join ${company.name}. Browse open positions and apply today.`,
  }
}

export default async function CareersPage({
  params,
}: {
  params: { slug: string }
}) {
  try {
    const companyResult = await query("SELECT * FROM companies WHERE slug = $1", [params.slug])

    if (companyResult.length === 0) {
      notFound()
    }

    const company: Company = companyResult[0]

    const jobsResult = await query(
      "SELECT * FROM jobs WHERE company_id = $1 AND is_active = true ORDER BY created_at DESC",
      [company.id],
    )

    const jobs: Job[] = jobsResult

    const sectionsResult = await query(
      "SELECT * FROM page_sections WHERE company_id = $1 AND is_visible = true ORDER BY order_index ASC",
      [company.id],
    )

    return <CareersPageClient company={company} jobs={jobs} sections={sectionsResult} />
  } catch (error) {
    console.error("Error loading careers page:", error)
    notFound()
  }
}
