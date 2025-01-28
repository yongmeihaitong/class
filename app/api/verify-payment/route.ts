import { NextResponse } from "next/server"
import stripe from "@/lib/stripe"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      // Here you would typically update your database to grant course access
      // For this example, we'll just return a success message
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Error verifying payment" }, { status: 500 })
  }
}

