"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { DashboardSummary } from "@/components/dashboard-summary"
import { RecentActivity } from "@/components/recent-activity"
import { LearningGoals } from "@/components/learning-goals"
import { CourseRecommendations } from "@/components/course-recommendations"
import { CourseSortFilter } from "@/components/course-sort-filter"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  slug: string
  level: string
  category: string
  lastAccessed?: string
  chapters: { lessons: any[] }[]
}

interface CourseProgress {
  courseId: string
  progress: number
}

interface UserCourse {
  course: Course
  user: {
    courseProgress: CourseProgress[]
  }
}

interface Activity {
  id: string
  activityType: "LESSON_STARTED" | "LESSON_COMPLETED" | "QUIZ_ATTEMPTED" | "QUIZ_COMPLETED"
  createdAt: string
  course: {
    title: string
    slug: string
  }
  lesson: {
    title: string
  }
}

export default function DashboardPage() {
  const [userCourses, setUserCourses] = useState<UserCourse[]>([])
  const [filteredCourses, setFilteredCourses] = useState<UserCourse[]>([])
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortOption, setSortOption] = useState("")
  const [filters, setFilters] = useState<{ level?: string; category?: string }>({})

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/courses")
        if (response.ok) {
          const data = await response.json()
          setUserCourses(data.userCourses)
          setFilteredCourses(data.userCourses)
          setRecentActivities(data.recentActivities)
        } else {
          console.error("Failed to fetch user data")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const getCourseProgress = (courseId: string): number => {
    const progress = userCourses.find((uc) => uc.course.id === courseId)?.user.courseProgress[0]?.progress
    return progress || 0
  }

  const handleSortChange = (sort: string) => {
    setSortOption(sort)
    const sorted = [...filteredCourses]
    switch (sort) {
      case "progress-desc":
        sorted.sort((a, b) => getCourseProgress(b.course.id) - getCourseProgress(a.course.id))
        break
      case "progress-asc":
        sorted.sort((a, b) => getCourseProgress(a.course.id) - getCourseProgress(b.course.id))
        break
      case "recent":
        sorted.sort((a, b) => {
          const dateA = a.course.lastAccessed ? new Date(a.course.lastAccessed) : new Date(0)
          const dateB = b.course.lastAccessed ? new Date(b.course.lastAccessed) : new Date(0)
          return dateB.getTime() - dateA.getTime()
        })
        break
      case "title":
        sorted.sort((a, b) => a.course.title.localeCompare(b.course.title))
        break
    }
    setFilteredCourses(sorted)
  }

  const handleFilterChange = (newFilters: { level?: string; category?: string }) => {
    setFilters(newFilters)
    const filtered = userCourses.filter((uc) => {
      if (newFilters.level && uc.course.level !== newFilters.level) return false
      if (newFilters.category && uc.course.category !== newFilters.category) return false
      return true
    })
    setFilteredCourses(filtered)
  }

  const totalCourses = userCourses.length
  const averageProgress =
    totalCourses > 0 ? userCourses.reduce((sum, uc) => sum + getCourseProgress(uc.course.id), 0) / totalCourses : 0
  const completedCourses = userCourses.filter((uc) => getCourseProgress(uc.course.id) === 100).length

  const levels = Array.from(new Set(userCourses.map((uc) => uc.course.level)))
  const categories = Array.from(new Set(userCourses.map((uc) => uc.course.category)))

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
        {isLoading ? (
          <p>Loading your data...</p>
        ) : userCourses.length === 0 ? (
          <p>You are not enrolled in any courses yet.</p>
        ) : (
          <>
            <DashboardSummary
              totalCourses={totalCourses}
              averageProgress={averageProgress}
              completedCourses={completedCourses}
            />
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
                <CourseSortFilter
                  onSortChange={handleSortChange}
                  onFilterChange={handleFilterChange}
                  levels={levels}
                  categories={categories}
                />
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredCourses.map((userCourse) => (
                    <Card key={userCourse.course.id}>
                      <CardHeader>
                        <CardTitle>{userCourse.course.title}</CardTitle>
                        <CardDescription>{userCourse.course.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Progress value={getCourseProgress(userCourse.course.id)} />
                          <p className="text-sm text-gray-500">
                            {Math.round(getCourseProgress(userCourse.course.id))}% complete
                          </p>
                          <p className="text-sm text-gray-500">
                            {userCourse.course.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0)}{" "}
                            lessons
                          </p>
                          <Button asChild className="w-full">
                            <Link href={`/courses/${userCourse.course.slug}/content`}>
                              {getCourseProgress(userCourse.course.id) > 0 ? "Continue Learning" : "Start Course"}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <RecentActivity activities={recentActivities} />
                <LearningGoals courseId={userCourses[0]?.course.id} />
                <CourseRecommendations />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

