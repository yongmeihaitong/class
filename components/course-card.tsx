"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock, Users } from "lucide-react"
import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CourseCardProps {
  id: string
  title: string
  description: string
  price: number
  duration: string
  students: number
  level: string
  imageUrl: string
  slug: string
}

export function CourseCard({
  id,
  title,
  description,
  price,
  duration,
  students,
  level,
  imageUrl,
  slug,
}: CourseCardProps) {
  const { addItem } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = () => {
    addItem({ id, title, price })
  }

  const handleBuyNow = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: id,
          courseTitle: title,
          price,
        }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error("Error initiating checkout:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <Badge variant="secondary">{level}</Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {students} students
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-2xl font-bold">${price}</div>
        <div className="space-x-2">
          <Button onClick={handleAddToCart}>Add to Cart</Button>
          <Button onClick={handleBuyNow} disabled={isLoading}>
            {isLoading ? "Processing..." : "Buy Now"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

