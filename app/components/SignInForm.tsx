"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/components/ui/use-toast"

export function SignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Simulate authentication
    if (email && password) {
      // In a real app, you would validate credentials against your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate successful login
      localStorage.setItem("user", JSON.stringify({ email }))
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      })
      router.push("/dashboard")
    } else {
      toast({
        title: "Sign in failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          disabled={isLoading}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoCapitalize="none"
          autoComplete="current-password"
          disabled={isLoading}
          required
        />
      </div>
      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Sign In
      </Button>
    </form>
  )
}

