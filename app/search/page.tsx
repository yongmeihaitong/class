"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { CourseCard } from "@/components/course-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { searchCourses } from "@/utils/search"
import type { Course } from "@/types/course"

// This would typically come from an API or database
const allCourses: Course[] = [
  {
    id: "1",
    title: "Investment Banking Fundamentals",
    description: "Master the basics of investment banking, including valuation, modeling, and deal structures",
    price: 199,
    duration: "40 hours",
    students: 15420,
    level: "Intermediate",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "investment-banking-fundamentals",
    category: "investing",
  },
  // Add more courses here...
]

const categories = ["investing", "trading", "finance", "business"]
const levels = ["Beginner", "Intermediate", "Advanced"]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [category, setCategory] = useState<string>("")
  const [level, setLevel] = useState<string>("")
  const [minPrice, setMinPrice] = useState<number | undefined>()
  const [maxPrice, setMaxPrice] = useState<number | undefined>()
  const [results, setResults] = useState<Course[]>([])

  useEffect(() => {
    const filteredCourses = searchCourses(allCourses, query, {
      category,
      level,
      minPrice,
      maxPrice,
    })
    setResults(filteredCourses)
  }, [query, category, level, minPrice, maxPrice])

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Search Courses</h1>
        <div className="grid gap-6 md:grid-cols-4">
          <div className="space-y-4">
            <Input
              type="search"
              placeholder="Search courses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map((lvl) => (
                  <SelectItem key={lvl} value={lvl}>
                    {lvl}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min Price"
                onChange={(e) => setMinPrice(Number(e.target.value) || undefined)}
              />
              <Input
                type="number"
                placeholder="Max Price"
                onChange={(e) => setMaxPrice(Number(e.target.value) || undefined)}
              />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setQuery("")
                setCategory("")
                setLevel("")
                setMinPrice(undefined)
                setMaxPrice(undefined)
              }}
            >
              Clear Filters
            </Button>
          </div>
          <div className="md:col-span-3">
            <h2 className="text-xl font-semibold mb-4">
              {results.length} {results.length === 1 ? "course" : "courses"} found
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

