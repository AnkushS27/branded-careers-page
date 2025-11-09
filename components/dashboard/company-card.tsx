import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CompanyCardProps {
  title: string
  description: string
  href: string
  action: string
}

export default function CompanyCard({ title, description, href, action }: CompanyCardProps) {
  return (
    <Link href={href}>
      <div className="p-6 border border-border rounded hover:bg-secondary transition cursor-pointer">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted text-sm mb-4">{description}</p>
        <Button variant="outline" size="sm">
          {action}
        </Button>
      </div>
    </Link>
  )
}
