"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PreviewPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-background">
      <div className="container-main py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Preview</h1>
          <Link href={`/${params.slug}/edit`}>
            <Button variant="outline">Back to Edit</Button>
          </Link>
        </div>

        <div className="border-2 border-dashed border-border rounded p-8 text-center">
          <p className="text-muted">
            Preview renders as: <code>{`/${params.slug}/careers`}</code>
          </p>
          <Link href={`/${params.slug}/careers`}>
            <Button className="mt-4">View Live Careers Page</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
