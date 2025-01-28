"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token")
      if (!token) {
        setStatus("error")
        return
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        if (response.ok) {
          setStatus("success")
          setTimeout(() => router.push("/auth/login"), 3000)
        } else {
          setStatus("error")
        }
      } catch (error) {
        console.error("Email verification error:", error)
        setStatus("error")
      }
    }

    verifyEmail()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Email Verification</h1>
        {status === "verifying" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verifying</AlertTitle>
            <AlertDescription>Please wait while we verify your email...</AlertDescription>
          </Alert>
        )}
        {status === "success" && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Your email has been verified. Redirecting to login page...</AlertDescription>
          </Alert>
        )}
        {status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to verify your email. Please try again or contact support.</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

