import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import stripe from "@/lib/stripe"
import { getUserFromToken } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { courseId, courseTitle, price } = await req.json()

    // Create a pending purchase record
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.userId,
        courseId,
        amount: price,
        status: "PENDING",
      },
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: courseTitle,
            },
            unit_amount: price * 100, // Stripe expects the amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${courseId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${courseId}`,
      metadata: {
        courseId,
        purchaseId: purchase.id,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 })
  }
}

