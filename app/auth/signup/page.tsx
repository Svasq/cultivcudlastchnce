"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { getJWTPayload } from "@/lib/auth";

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
];

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getJWTPayload();
        if (user) {
          router.push("/dashboard");
          return;
        }
      } finally {
        setChecking(false);
      }
    }
    checkAuth();
  }, [router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to sign up");
      }

      toast({
        title: "Account created!",
        description: "Your account has been created successfully. Please sign in.",
      });

      // Redirect to sign-in immediately
      router.push("/auth/signin");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return <div className="container mx-auto py-6">Checking authentication...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="container flex h-16 items-center">
          <nav className="flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground",
                  pathname === item.href && "text-primary font-semibold"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="container flex-1 items-center justify-center py-6">
        <div className="mx-auto max-w-[350px] space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="text-muted-foreground">
              Enter your information to create your account
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                name="name"
                required
                placeholder="John Doe"
                className="h-9"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                className="h-9"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="h-9"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              className="w-full h-9"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
