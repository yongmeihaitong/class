import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getUserFromToken } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const user = await getUserFromToken(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, email: true },
    })

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(userProfile)
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "An error occurred while fetching profile" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getUserFromToken(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await req.json()

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name },
      select: { id: true, name: true, email: true },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "An error occurred while updating profile" }, { status: 500 })
  }
}

