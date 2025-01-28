import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Recommendation {
  type: "next_level" | "related" | "popular"
  course: {
    id: string
    title: string
    slug: string
    description: string
    level: string
  }
  basedOn?: string
}

export function CourseRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch("/api/recommendations")
        if (response.ok) {
          const data = await response.json()
          setRecommendations(data)
        } else {
          console.error("Failed to fetch recommendations")
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if (isLoading) {
    return <div>Loading recommendations...</div>
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
        <CardDescription>Based on your progress and interests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <Card key={recommendation.course.id}>
              <CardHeader>
                <CardTitle className="text-lg">{recommendation.course.title}</CardTitle>
                <CardDescription>
                  {recommendation.type === "next_level" && `Next level after ${recommendation.basedOn}`}
                  {recommendation.type === "related" && `Related to ${recommendation.basedOn}`}
                  {recommendation.type === "popular" && "Popular course"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">{recommendation.course.description}</p>
                <p className="text-sm text-gray-500 mb-4">Level: {recommendation.course.level}</p>
                <Button asChild>
                  <Link href={`/courses/${recommendation.course.slug}`}>View Course</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

