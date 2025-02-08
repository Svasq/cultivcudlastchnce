"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getJWTPayload, type JWTPayload } from "@/lib/auth";
import ThreadList from "./components/ThreadList";
import { cn } from "@/lib/utils";

export default function ForumsPage() {
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getJWTPayload();
        setUser(userData);
      } catch (err) {
        console.error("Error loading user:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="container mx-auto py-6">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="container mx-auto py-6">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto py-6">
        <div className="border-b pb-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Forum Discussions</h1>
            {user ? (
              <Link href="/forums/create" className="inline-block">
                <Button className="h-9">Create Thread</Button>
              </Link>
            ) : (
              <div className="space-x-2">
                <Link href="/auth/signin" className="inline-block">
                  <Button variant="outline" className="h-9">Login</Button>
                </Link>
                <Link href="/auth/signup" className="inline-block">
                  <Button className="h-9">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <ThreadList />
      </div>
    </div>
  );
}
