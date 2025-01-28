import { notFound } from "next/navigation"
import Image from "next/image"
import { Clock, Users, BookOpen, Award } from "lucide-react"
import { PrismaClient } from "@prisma/client"
import Link from "next/link"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserFromToken } from "@/lib/auth"
import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { loadStripe } from "@stripe/stripe-js"

const prisma = new PrismaClient()

interface CoursePageProps {
  params: {
    category: string
    slug: string
  }
}

const handlePurchase = async (courseId: string, price: number) => {
  const response = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      courseId,
      price,
    }),
  })

  if (response.ok) {
    const { sessionId } = await response.json()
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
    await stripe?.redirectToCheckout({ sessionId })
  } else {
    console.error("Failed to create checkout session")
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
  })

  if (!course) {
    notFound()
  }

  const user = await getUserFromToken()
  let hasAccess = false

  if (user) {
    const access = await prisma.courseAccess.findUnique({
      where: {
        userId_courseId: {
          userId: user.userId,
          courseId: course.id,
        },
      },
    })
    hasAccess = !!access
  }

  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const fetchProgress = async () => {
      const response = await fetch(`/api/progress?courseId=${course.id}`)
      if (response.ok) {
        const data = await response.json()
        setProgress(data?.progress || 0)
      }
    }
    fetchProgress()
  }, [course.id])

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Courses", href: `/courses/${params.category}` },
              { label: course.title, href: `/courses/${params.category}/${params.slug}` },
            ]}
          />
          <div className="grid lg:grid-cols-3 gap-8 py-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl text-muted-foreground">{course.description}</p>
              </div>
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image src={course.imageUrl || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
              </div>
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-4">About this course</h2>
                <p>{course.description}</p>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Your Progress</h3>
                  <Progress value={progress} className="w-full" />
                  <p className="mt-2 text-sm text-gray-600">{Math.round(progress)}% complete</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-3xl">${course.price}</CardTitle>
                  <CardDescription>One-time payment, lifetime access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {hasAccess ? (
                    <Button className="w-full" size="lg" asChild>
                      <Link href={`/courses/${params.category}/${params.slug}/content`}>Continue Learning</Link>
                    </Button>
                  ) : (
                    <Button className="w-full" size="lg" onClick={() => handlePurchase(course.id, course.price)}>
                      Enroll Now
                    </Button>
                  )}
                  <div className="grid gap-4 pt-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>{course.duration} of content</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-muted-foreground" />
                      <span>{course.level} level</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">© 2024 LearnHub. All rights reserved.</div>
      </footer>
    </div>
  )
}

