"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { getJWTPayload } from "@/lib/auth";

export default function CreateCommunityPage() {
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const bio = formData.get("bio") as string;
      const imageUrl = formData.get("imageUrl") as string;

      const res = await fetch("/api/communities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, bio, imageUrl }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create community");
      }

      const community = await res.json();
      
      toast({
        title: "Success!",
        description: "Your community has been created.",
      });

      router.push(`/communities/${community.id}`);
      router.refresh();
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

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-semibold">Create New Community</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Community Name
          </label>
          <Input
            id="name"
            name="name"
            required
            maxLength={50}
            placeholder="Enter community name"
            className="h-9"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="bio"
            name="bio"
            required
            placeholder="Write about your community"
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="imageUrl" className="text-sm font-medium">
            Community Image URL
          </label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            className="h-9"
          />
          <p className="text-xs text-muted-foreground">
            Optional: Add an image URL for your community banner
          </p>
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
            {submitting ? "Creating..." : "Create Community"}
          </Button>
        </div>
      </form>
    </div>
  );
} 