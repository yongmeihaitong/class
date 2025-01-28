"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CartDropdown } from "@/components/cart-dropdown"
import { useAuth } from "@/contexts/auth-context"

export function SiteHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { user } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-xl">
            LearnHub
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/courses/investing" className="text-sm font-medium hover:text-primary">
              Investing
            </Link>
            <Link href="/courses/trading" className="text-sm font-medium hover:text-primary">
              Trading
            </Link>
            <Link href="/courses/finance" className="text-sm font-medium hover:text-primary">
              Personal Finance
            </Link>
            <Link href="/courses/business" className="text-sm font-medium hover:text-primary">
              Business
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex">
            <Input
              type="search"
              placeholder="Search courses..."
              className="w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </form>
          <CartDropdown />
          {user ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/profile">Profile</Link>
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

