import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getUserFromToken } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const user = await getUserFromToken(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get("courseId")

  if (!courseId) {
    return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
  }

  try {
    const courseProgress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId: user.userId,
          courseId: courseId,
        },
      },
      include: {
        lessonProgress: true,
      },
    })

    return NextResponse.json(courseProgress)
  } catch (error) {
    console.error("Error fetching progress:", error)
    return NextResponse.json({ error: "Error fetching progress" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const user = await getUserFromToken(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { courseId, lessonId, completed } = await req.json()

  if (!courseId || !lessonId) {
    return NextResponse.json({ error: "Course ID and Lesson ID are required" }, { status: 400 })
  }

  try {
    const updatedLessonProgress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.userId,
          lessonId: lessonId,
        },
      },
      update: {
        completed,
      },
      create: {
        userId: user.userId,
        lessonId: lessonId,
        courseId: courseId,
        completed,
      },
    })

    // Update overall course progress
    const totalLessons = await prisma.lesson.count({
      where: {
        chapter: {
          courseId: courseId,
        },
      },
    })

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId: user.userId,
        courseId: courseId,
        completed: true,
      },
    })

    const progress = (completedLessons / totalLessons) * 100

    const updatedCourseProgress = await prisma.courseProgress.upsert({
      where: {
        userId_courseId: {
          userId: user.userId,
          courseId: courseId,
        },
      },
      update: {
        progress,
      },
      create: {
        userId: user.userId,
        courseId: courseId,
        progress,
      },
    })

    return NextResponse.json({ lessonProgress: updatedLessonProgress, courseProgress: updatedCourseProgress })
  } catch (error) {
    console.error("Error updating progress:", error)
    return NextResponse.json({ error: "Error updating progress" }, { status: 500 })
  }
}

