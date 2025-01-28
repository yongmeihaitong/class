import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { sendVerificationEmail } from "@/lib/email"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate verification token
    const verificationToken = uuidv4()

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationToken,
      },
    })

    // Send verification email
    await sendVerificationEmail(email, verificationToken)

    return NextResponse.json(
      { message: "User created successfully. Please check your email to verify your account." },
      { status: 201 },
    )
  } catch (error) {
    console.error("Sign-up error:", error)
    return NextResponse.json({ error: "An error occurred during sign up" }, { status: 500 })
  }
}

