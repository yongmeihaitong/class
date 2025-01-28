"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SuccessPage({ params }: { params: { courseId: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = new URLSearchParams(window.location.search).get("session_id")
      if (!sessionId) {
        router.push("/")
        return
      }

      try {
        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`)
        if (response.ok) {
          setIsLoading(false)
        } else {
          router.push("/")
        }
      } catch (error) {
        console.error("Error verifying payment:", error)
        router.push("/")
      }
    }

    verifyPayment()
  }, [router])

  if (isLoading) {
    return <div>Verifying your purchase...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Thank you for your purchase!</h1>
        <p className="mb-4">Your course access has been granted.</p>
        <Button onClick={() => router.push(`/courses/${params.courseId}`)}>Start Learning</Button>
      </div>
    </div>
  )
}

