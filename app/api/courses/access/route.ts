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
    const access = await prisma.courseAccess.findUnique({
      where: {
        userId_courseId: {
          userId: user.userId,
          courseId: courseId,
        },
      },
    })

    return NextResponse.json({ hasAccess: !!access })
  } catch (error) {
    console.error("Error checking course access:", error)
    return NextResponse.json({ error: "Error checking course access" }, { status: 500 })
  }
}

