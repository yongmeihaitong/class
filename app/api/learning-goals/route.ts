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
    const goals = await prisma.learningGoal.findMany({
      where: { userId: user.userId },
      include: { course: { select: { title: true, slug: true } } },
      orderBy: { targetDate: "asc" },
    })
    return NextResponse.json(goals)
  } catch (error) {
    console.error("Error fetching learning goals:", error)
    return NextResponse.json({ error: "Error fetching learning goals" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const user = await getUserFromToken(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { courseId, title, description, targetDate } = await req.json()
    const newGoal = await prisma.learningGoal.create({
      data: {
        userId: user.userId,
        courseId,
        title,
        description,
        targetDate: new Date(targetDate),
      },
    })
    return NextResponse.json(newGoal)
  } catch (error) {
    console.error("Error creating learning goal:", error)
    return NextResponse.json({ error: "Error creating learning goal" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const user = await getUserFromToken(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, completed } = await req.json()
    const updatedGoal = await prisma.learningGoal.update({
      where: { id, userId: user.userId },
      data: { completed },
    })
    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error("Error updating learning goal:", error)
    return NextResponse.json({ error: "Error updating learning goal" }, { status: 500 })
  }
}

