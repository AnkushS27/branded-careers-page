import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import EditCompanyPage from "@/components/dashboard/edit-company-page"

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

  const { data: company, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .eq("user_id", user.id)
    .single()

  if (error || !company) {
    redirect("/dashboard")
  }

  return <EditCompanyPage company={company} />
}
