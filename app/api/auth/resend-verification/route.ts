import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { sendVerificationEmail } from "@/lib/email"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 })
    }

    // Generate new verification token
    const newVerificationToken = uuidv4()

    // Update user with new verification token
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken: newVerificationToken },
    })

    // Send new verification email
    await sendVerificationEmail(email, newVerificationToken)

    return NextResponse.json({ message: "Verification email resent successfully" })
  } catch (error) {
    console.error("Resend verification email error:", error)
    return NextResponse.json({ error: "An error occurred while resending the verification email" }, { status: 500 })
  }
}

