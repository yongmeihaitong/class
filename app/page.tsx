import { SiteHeader } from "@/components/site-header"
import { CourseCard } from "@/components/course-card"

const featuredCourses = [
  {
    title: "Complete Investment Banking Course",
    description: "Learn fundamental concepts of investment banking from industry experts",
    price: 199,
    duration: "40 hours",
    students: 15420,
    level: "Intermediate",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "investment-banking",
  },
  {
    title: "Stock Trading Fundamentals",
    description: "Master the basics of stock trading and technical analysis",
    price: 149,
    duration: "30 hours",
    students: 22150,
    level: "Beginner",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "stock-trading",
  },
  {
    title: "Personal Finance Mastery",
    description: "Take control of your finances with this comprehensive guide",
    price: 99,
    duration: "20 hours",
    students: 31840,
    level: "Beginner",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "personal-finance",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-12 bg-muted">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">Invest in Your Future</h1>
              <p className="text-xl text-muted-foreground">
                Access expert-led courses in investing, trading, and personal finance. Start your journey to financial
                freedom today.
              </p>
            </div>
          </div>
        </section>
        <section className="py-12">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Featured Courses</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course.slug} {...course} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">© 2024 LearnHub. All rights reserved.</div>
      </footer>
    </div>
  )
}

