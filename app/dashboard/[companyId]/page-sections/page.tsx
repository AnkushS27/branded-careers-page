import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import PageSectionsEditor from "@/components/dashboard/page-sections-editor"

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

  const { data: sections } = await supabase
    .from("page_sections")
    .select("*")
    .eq("company_id", companyId)
    .order("section_order", { ascending: true })

  return <PageSectionsEditor company={company} sections={sections || []} />
}
