"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-gray-600 mb-6">Something went wrong. Please try again.</p>
        <div className="flex gap-4">
          <Button onClick={reset} className="flex-1">
            Try Again
          </Button>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
