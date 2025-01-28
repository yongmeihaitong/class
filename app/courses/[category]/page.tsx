import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { CourseCard } from "@/components/course-card"
import { Breadcrumb } from "@/components/breadcrumb"

// This would typically come from a database
const categories = {
  investing: {
    title: "Investing Courses",
    description: "Learn how to build long-term wealth through smart investing strategies",
    courses: [
      {
        title: "Investment Banking Fundamentals",
        description: "Master the basics of investment banking, including valuation, modeling, and deal structures",
        price: 199,
        duration: "40 hours",
        students: 15420,
        level: "Intermediate",
        imageUrl: "/placeholder.svg?height=400&width=600",
        slug: "investment-banking-fundamentals",
      },
      {
        title: "Value Investing Masterclass",
        description: "Learn Warren Buffett's investment strategies and fundamental analysis techniques",
        price: 149,
        duration: "25 hours",
        students: 8750,
        level: "Advanced",
        imageUrl: "/placeholder.svg?height=400&width=600",
        slug: "value-investing-masterclass",
      },
      {
        title: "Real Estate Investment",
        description: "Comprehensive guide to real estate investing and property management",
        price: 179,
        duration: "35 hours",
        students: 12300,
        level: "Beginner",
        imageUrl: "/placeholder.svg?height=400&width=600",
        slug: "real-estate-investment",
      },
      {
        title: "ETF & Index Fund Investing",
        description: "Build a diversified portfolio with ETFs and index funds",
        price: 89,
        duration: "15 hours",
        students: 24600,
        level: "Beginner",
        imageUrl: "/placeholder.svg?height=400&width=600",
        slug: "etf-index-fund-investing",
      },
    ],
  },
  trading: {
    title: "Trading Courses",
    description: "Master technical analysis and trading strategies for various markets",
    courses: [
      {
        title: "Technical Analysis Mastery",
        description: "Learn to read charts and identify trading patterns like a pro",
        price: 199,
        duration: "30 hours",
        students: 18900,
        level: "Intermediate",
        imageUrl: "/placeholder.svg?height=400&width=600",
        slug: "technical-analysis-mastery",
      },
      // Add more trading courses...
    ],
  },
  finance: {
    title: "Personal Finance Courses",
    description: "Take control of your financial future with expert guidance",
    courses: [
      {
        title: "Budgeting and Saving",
        description: "Learn effective budgeting strategies and build your savings",
        price: 79,
        duration: "10 hours",
        students: 31500,
        level: "Beginner",
        imageUrl: "/placeholder.svg?height=400&width=600",
        slug: "budgeting-and-saving",
      },
      // Add more finance courses...
    ],
  },
}

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categories[params.category as keyof typeof categories]

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: category.title, href: `/courses/${params.category}` },
            ]}
          />
          <div className="py-8">
            <h1 className="text-4xl font-bold mb-4">{category.title}</h1>
            <p className="text-xl text-muted-foreground mb-8">{category.description}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.courses.map((course) => (
                <CourseCard key={course.slug} {...course} />
              ))}
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

