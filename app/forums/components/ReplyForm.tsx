"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function ReplyForm({ threadId }: { threadId: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const content = formData.get("content") as string;

    try {
      const res = await fetch(`/api/forums/threads/${threadId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to post reply");
      }

      toast({
        title: "Success",
        description: "Reply posted successfully",
      });
      
      (e.target as HTMLFormElement).reset();
      router.refresh();
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

  return (
    <Card className="p-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            Your Reply
          </label>
          <Textarea
            id="content"
            name="content"
            required
            placeholder="Write your reply"
            className="min-h-[100px]"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Reply"}
        </Button>
      </form>
    </Card>
  );
} 