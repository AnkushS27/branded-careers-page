import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import JobsManager from "@/components/dashboard/jobs-manager"

interface Params {
  companyId: string
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { companyId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .eq("user_id", user.id)
    .single()

  if (!company) {
    redirect("/dashboard")
  }

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("company_id", companyId)
    .order("posted_at", { ascending: false })

  return <JobsManager company={company} jobs={jobs || []} />
}
