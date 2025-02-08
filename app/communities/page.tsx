"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getJWTPayload } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

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

interface Community {
  id: number;
  name: string;
  bio: string;
  imageUrl?: string;
  memberCount: number;
  createdAt: string;
  isLive: boolean;
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getJWTPayload();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error("Auth check error:", error);
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    async function fetchCommunities() {
      try {
        setLoading(true);
        const response = await fetch("/api/communities");
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch communities");
        }

        const data = await response.json();
        setCommunities(data.communities || []);
      } catch (error) {
        console.error("Error fetching communities:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load communities. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchCommunities();
  }, [toast]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <div className="border-b">
        <div className="container flex h-16 items-center">
          <nav className="flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                  pathname === item.href && "text-primary font-semibold"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Communities</h1>
          {isAuthenticated ? (
            <Button
              onClick={() => router.push("/communities/create")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create Community
            </Button>
          ) : (
            <div className="space-x-2">
              <Link href="/auth/signin">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">Loading communities...</div>
        ) : communities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No communities found.</p>
            {isAuthenticated && (
              <p className="mt-2">
                Be the first to{" "}
                <Link href="/communities/create" className="text-primary hover:underline">
                  create a community
                </Link>
                !
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {communities.map((community) => (
              <div
                key={community.id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden"
              >
                {community.imageUrl && (
                  <div className="aspect-video relative">
                    <img
                      src={community.imageUrl}
                      alt={community.name}
                      className="object-cover w-full h-full"
                    />
                    {community.isLive && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                        LIVE
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold">{community.name}</h3>
                  <p className="mt-2 text-muted-foreground">{community.bio}</p>
                  <div className="mt-4 flex items-center text-sm text-muted-foreground">
                    <span>{community.memberCount} members</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
