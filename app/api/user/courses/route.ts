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
    const userCourses = await prisma.courseAccess.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        course: {
          include: {
            chapters: {
              include: {
                lessons: true,
              },
            },
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

    const recentActivities = await prisma.userActivity.findMany({
      where: {
        userId: user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        course: {
          select: {
            title: true,
            slug: true,
          },
        },
        lesson: {
          select: {
            title: true,
          },
        },
      },
    })

    // Get the last accessed date for each course
    const lastAccessedDates = await prisma.userActivity.groupBy({
      by: ["courseId"],
      where: {
        userId: user.userId,
      },
      _max: {
        createdAt: true,
      },
    })

    const coursesWithLastAccessed = userCourses.map((userCourse) => ({
      ...userCourse,
      course: {
        ...userCourse.course,
        lastAccessed: lastAccessedDates.find((date) => date.courseId === userCourse.course.id)?._max.createdAt,
      },
    }))

    return NextResponse.json({ userCourses: coursesWithLastAccessed, recentActivities })
  } catch (error) {
    console.error("Error fetching user courses and activities:", error)
    return NextResponse.json({ error: "Error fetching user courses and activities" }, { status: 500 })
  }
}

