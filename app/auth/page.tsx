"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SignInForm } from "../components/SignInForm"
import { SignUpForm } from "../components/SignUpForm"
import { Header } from "../components/Header"
import { Footer } from "../components/Footer"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin")
  const { toast } = useToast()

  const handleSignUp = () => {
    toast({
      title: "Profile Created",
      description: "Your account has been successfully created!",
    })
    setActiveTab("signin")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>Sign in or create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <SignInForm />
              </TabsContent>
              <TabsContent value="signup">
                <SignUpForm onSignUp={handleSignUp} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

