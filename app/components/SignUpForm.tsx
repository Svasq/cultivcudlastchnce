"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/components/ui/use-toast"

export function SignUpForm({ onSignUp }: { onSignup: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    toast({
      title: "Account created",
      description: "Your account has been created successfully.",
    })
    onSignUp()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input type="email" placeholder="Email" required />
      <Input type="password" placeholder="Password" required />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
      </Button>
    </form>
  )
}

