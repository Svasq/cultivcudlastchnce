"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "../components/Header"
import { Footer } from "../components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function UserDashboard() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/auth")
    }
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
            <CardDescription>Here's an overview of your account</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Logged in as: {user.email}</p>
            <Button onClick={handleSignOut}>Sign Out</Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

