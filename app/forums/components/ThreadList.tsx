"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { getJWTPayload } from "@/lib/auth";

interface Thread {
  id: number;
  title: string;
  authorId: number;
  createdAt: string;
  author: {
    name: string;
  };
  replyCount: number;
}

interface ThreadListProps {
  currentPage?: number;
}

export default function ThreadList({ currentPage = 1 }: ThreadListProps) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(currentPage);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
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
    async function fetchThreads() {
      try {
        setLoading(true);
        const res = await fetch(`/api/forums/threads?page=${page}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch threads");
        }

        const data = await res.json();
        setThreads(data.threads || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching threads:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load threads. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchThreads();
  }, [page, toast]);

  const handlePageChange = (newPage: number) => {
    router.push(`/forums?page=${newPage}`);
    setPage(newPage);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Forum Threads</h2>
        {isAuthenticated ? (
          <Button
            onClick={() => router.push("/forums/create")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create Thread
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
        <div className="text-center py-8">Loading threads...</div>
      ) : threads.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No threads found.</p>
          {isAuthenticated && (
            <p className="mt-2">
              Be the first to{" "}
              <Link href="/forums/create" className="text-primary hover:underline">
                start a discussion
              </Link>
              !
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {threads.map((thread) => (
              <div
                key={thread.id}
                className="p-4 rounded-lg border bg-card text-card-foreground hover:border-primary transition-colors"
              >
                <Link href={`/forums/thread/${thread.id}`}>
                  <h3 className="text-lg font-semibold hover:text-primary">
                    {thread.title}
                  </h3>
                  <div className="mt-2 flex items-center text-sm text-muted-foreground space-x-4">
                    <span>By {thread.author.name}</span>
                    <span>•</span>
                    <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{thread.replyCount} replies</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="py-2 px-3 text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
