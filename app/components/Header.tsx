"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Video, Users, MessageSquare, ShoppingBag, MessageCircle } from "lucide-react"
const navigationItems = [
  {
    name: "Live",
    href: "/live",
    icon: Video,
    visitorAccess: true,
  },
  {
    name: "Communities",
    href: "/communities",
    icon: Users,
    visitorAccess: true,
  },
  {
    name: "Forums",
    href: "/forums",
    icon: MessageSquare,
    visitorAccess: true,
  },
  {
    name: "Marketplace",
    href: "/marketplace",
    icon: ShoppingBag,
    visitorAccess: true,
  },
  {
    name: "Feedback",
    href: "/feedback",
    icon: MessageCircle,
    visitorAccess: true,
  },
]

export function Header() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = false; // TODO: Replace with actual auth check

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Community</span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="flex gap-2">
            {navigationItems.map((item) => {
              if (!item.visitorAccess && !isAuthenticated) return null

              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} passHref legacyBehavior>
                    <NavigationMenuLink asChild>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "flex items-center gap-2",
                          isActive && "bg-muted"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Button>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
          <ModeToggle />
        </div>
      </nav>
    </header>
  )
}
