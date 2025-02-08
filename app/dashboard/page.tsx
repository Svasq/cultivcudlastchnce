"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header"
import { Footer } from "../components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getJWTPayload } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

interface UserStats {
  communityCount: number;
  forumPosts: number;
  marketListings: number;
}

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<UserStats>({
    communityCount: 0,
    forumPosts: 0,
    marketListings: 0,
  });
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const userData = await getJWTPayload();
        if (!userData && mounted) {
          console.log("No user data found, redirecting to signin");
          router.push("/auth/signin");
          return;
        }
        if (mounted) {
          setUser(userData);
          if (userData?.id) {
            await fetchUserStats(userData.id);
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Please sign in to access your dashboard",
          });
          router.push("/auth/signin");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router, toast]);

  async function fetchUserStats(userId: number) {
    try {
      const response = await fetch(`/api/users/${userId}/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load user statistics",
      });
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">Loading your dashboard...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Let the useEffect handle redirect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid gap-6">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome back, {user?.name}!</CardTitle>
              <CardDescription>Here's an overview of your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Communities</p>
                  <p className="text-2xl font-bold">{stats.communityCount}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Forum Posts</p>
                  <p className="text-2xl font-bold">{stats.forumPosts}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Market Listings</p>
                  <p className="text-2xl font-bold">{stats.marketListings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button asChild>
                  <Link href="/communities/create">Create Community</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/forums/create">Start Discussion</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/marketplace/create">List Item</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* My Content */}
          <Card>
            <CardHeader>
              <CardTitle>My Content</CardTitle>
              <CardDescription>View and manage your contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/my-communities">
                    My Communities ({stats.communityCount})
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/my-posts">
                    My Forum Posts ({stats.forumPosts})
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/my-listings">
                    My Market Listings ({stats.marketListings})
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
