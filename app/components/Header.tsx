"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getJWTPayload } from "@/lib/auth"

const navigationItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Communities",
    href: "/communities",
  },
  {
    name: "Forums",
    href: "/forums",
  },
  {
    name: "Marketplace",
    href: "/marketplace",
  },
  {
    name: "Live",
    href: "/live",
  },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)

  useEffect(() => {
    // Check for JWT token and user data on component mount
    const storedToken = localStorage.getItem('jwt')
    setToken(storedToken)
    
    if (storedToken) {
      fetch('/api/me', {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {
        // If token is invalid, clear it
        localStorage.removeItem('jwt')
        setToken(null)
      })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('jwt')
    setToken(null)
    setUser(null)
    router.push('/auth/signin')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">CultivarGente</span>
          </Link>
          <nav className="flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary px-2 py-1 rounded-md",
                  pathname === item.href
                    ? "text-primary font-semibold bg-secondary"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {!token ? (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
