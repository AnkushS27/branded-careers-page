import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>We sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Click the link in your email to confirm your account. After that, you can sign in.
            </p>
            <Link href="/auth/login" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                Return to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
