"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Button } from "@/components/ui/button"

export function Header() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const router = useRouter()

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
    <header className="border-b">
      <div className="container mx-auto flex justify-between items-center py-4">
        <Link href="/" className="text-2xl font-bold">
          Community Hub
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>About</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/feedback" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Feedback</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {user && (
              <NavigationMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Dashboard</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center space-x-4">
          {user ? (
            <Button onClick={handleSignOut} variant="ghost">
              Sign Out
            </Button>
          ) : (
            <Button asChild variant="ghost">
              <Link href="/auth">Sign In</Link>
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
