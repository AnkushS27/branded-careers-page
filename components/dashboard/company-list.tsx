"use client"

import Link from "next/link"
import type { Company } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface CompanyListProps {
  companies: Company[]
}

export default function CompanyList({ companies }: CompanyListProps) {
  return (
    <div className="grid gap-6">
      {companies.map((company) => (
        <div
          key={company.id}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{company.company_name}</h3>
              <p className="text-sm text-gray-600">/{company.company_slug}</p>
              {company.company_description && <p className="text-gray-600 mt-2">{company.company_description}</p>}
              <div className="mt-4 flex gap-2">
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: company.is_published ? "#d1fae5" : "#fee2e2",
                    color: company.is_published ? "#065f46" : "#991b1b",
                  }}
                >
                  {company.is_published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link href={`/dashboard/${company.id}/edit`}>
                <Button size="sm">Edit</Button>
              </Link>
              <Link href={`/${company.company_slug}/careers`}>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
