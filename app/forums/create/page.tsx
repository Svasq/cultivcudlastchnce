"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { getJWTPayload } from "@/lib/auth";

export default function CreateThreadPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Check authentication on mount
  useEffect(() => {
    async function checkAuth() {
      const user = await getJWTPayload();
      if (!user) {
        router.push("/auth/signin");
        return;
      }
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    try {
      const res = await fetch("/api/forums/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create thread");
      }

      const thread = await res.json();
      toast({
        title: "Success",
        description: "Thread created successfully",
      });
      router.push(`/forums/thread/${thread.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-semibold">Create New Thread</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            name="title"
            required
            maxLength={200}
            placeholder="Enter thread title"
            className="h-9"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="body" className="text-sm font-medium">
            Content
          </label>
          <Textarea
            id="body"
            name="body"
            required
            placeholder="Write your thread content"
            className="min-h-[200px] resize-none"
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={submitting}
            className="h-9"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="h-9">
            {submitting ? "Creating..." : "Create Thread"}
          </Button>
        </div>
      </form>
    </div>
  );
} 