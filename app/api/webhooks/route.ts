import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { PrismaClient } from "@prisma/client"
import stripe from "@/lib/stripe"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object
      await handleSuccessfulPayment(session)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

async function handleSuccessfulPayment(session: any) {
  const purchaseId = session.metadata.purchaseId
  const courseId = session.metadata.courseId

  // Update purchase status
  await prisma.purchase.update({
    where: { id: purchaseId },
    data: { status: "COMPLETED" },
  })

  // Grant course access
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { user: true },
  })

  if (purchase) {
    await prisma.courseAccess.create({
      data: {
        userId: purchase.userId,
        courseId: courseId,
      },
    })
  }

  console.log(`Course access granted for purchase ${purchaseId}`)
}

