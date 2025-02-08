import { Suspense } from "react";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import ReplyForm from "../../components/ReplyForm";

async function getThread(id: string) {
  const res = await fetch(`/api/forums/threads/${id}`, {
    next: { revalidate: 0 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch thread");
  return res.json();
}

export default async function ThreadPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const data = await getThread(params.id);

  if (!data) {
    notFound();
  }

  const { thread, replies } = data;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{thread.title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            Posted by {thread.author.name} •{" "}
            {formatDistanceToNow(new Date(thread.createdAt), {
              addSuffix: true,
            })}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            {thread.body}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Replies ({replies.length})
        </h2>

        {replies.map((reply: any) => (
          <Card key={reply.id}>
            <CardHeader>
              <div className="text-sm text-muted-foreground">
                {reply.author.name} •{" "}
                {formatDistanceToNow(new Date(reply.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {reply.content}
              </div>
            </CardContent>
          </Card>
        ))}

        {session?.user ? (
          <ReplyForm threadId={thread.id} />
        ) : (
          <Card className="p-4 text-center bg-muted">
            <p>
              Please{" "}
              <a href="/auth/signin" className="text-primary hover:underline">
                sign in
              </a>{" "}
              to reply to this thread.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
} 