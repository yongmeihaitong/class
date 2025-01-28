import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getUserFromToken } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const user = await getUserFromToken(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Fetch user's enrolled courses and their progress
    const userCourses = await prisma.courseAccess.findMany({
      where: { userId: user.userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            level: true,
            category: true,
          },
        },
        user: {
          select: {
            courseProgress: {
              where: {
                courseId: {
                  in: prisma.courseAccess
                    .findMany({
                      where: { userId: user.userId },
                      select: { courseId: true },
                    })
                    .then((accesses) => accesses.map((access) => access.courseId)),
                },
              },
            },
          },
        },
      },
    })

    // Calculate recommendations based on user's progress and course attributes
    const recommendations = await calculateRecommendations(userCourses)

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return NextResponse.json({ error: "Error fetching recommendations" }, { status: 500 })
  }
}

async function calculateRecommendations(userCourses: any[]) {
  const completedCourses = userCourses.filter((uc) => uc.user.courseProgress[0]?.progress === 100)
  const inProgressCourses = userCourses.filter(
    (uc) => uc.user.courseProgress[0]?.progress > 0 && uc.user.courseProgress[0]?.progress < 100,
  )

  const recommendations = []

  // Recommend next level courses for completed courses
  for (const completedCourse of completedCourses) {
    const nextLevelCourse = await prisma.course.findFirst({
      where: {
        level: getNextLevel(completedCourse.course.level),
        category: completedCourse.course.category,
        id: { notIn: userCourses.map((uc) => uc.course.id) },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        level: true,
      },
    })
    if (nextLevelCourse) {
      recommendations.push({
        type: "next_level",
        course: nextLevelCourse,
        basedOn: completedCourse.course.title,
      })
    }
  }

  // Recommend related courses for in-progress courses
  for (const inProgressCourse of inProgressCourses) {
    const relatedCourse = await prisma.course.findFirst({
      where: {
        category: inProgressCourse.course.category,
        id: { notIn: userCourses.map((uc) => uc.course.id) },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        level: true,
      },
    })
    if (relatedCourse) {
      recommendations.push({
        type: "related",
        course: relatedCourse,
        basedOn: inProgressCourse.course.title,
      })
    }
  }

  // If we have less than 3 recommendations, add some popular courses
  if (recommendations.length < 3) {
    const popularCourses = await prisma.course.findMany({
      where: {
        id: { notIn: userCourses.map((uc) => uc.course.id) },
      },
      orderBy: {
        purchases: {
          _count: "desc",
        },
      },
      take: 3 - recommendations.length,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        level: true,
      },
    })
    recommendations.push(
      ...popularCourses.map((course) => ({
        type: "popular",
        course,
      })),
    )
  }

  return recommendations
}

function getNextLevel(currentLevel: string): string {
  const levels = ["Beginner", "Intermediate", "Advanced"]
  const currentIndex = levels.indexOf(currentLevel)
  return levels[currentIndex + 1] || levels[currentIndex]
}

