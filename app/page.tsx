import { db } from '@/lib/db';
import { posts } from '@/lib/schema';
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { Hero } from "./components/Hero"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { InferModel } from 'drizzle-orm';

type Post = InferModel<typeof posts>;

export default async function Home() {
  let postsData: Post[] = [];
  
  try {
    postsData = await db.select().from(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
  }

  async function handleCreatePost(formData: FormData) {
    "use server"
    const title = formData.get("title");
    const content = formData.get("content");
    if (typeof title === 'string' && typeof content === 'string') {
      await db.insert(posts).values({ title, content }).returning({ id: posts.id });
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <main className="flex-grow container mx-auto px-4 py-12">
        <section id="create-post" className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Create a New Post</h2>
          <form action={handleCreatePost}>
            <div className="space-y-4">
              <Input name="title" placeholder="Post Title" required />
              <Textarea name="content" placeholder="Post Content" required />
              <Button type="submit">Create Post</Button>
            </div>
          </form>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
          {postsData.length > 0 ? (
            <div className="grid gap-4">
              {postsData.map((post) => (
                <article key={post.id} className="p-4 border rounded-lg">
                  <h3 className="text-xl font-medium">{post.title}</h3>
                  <p className="mt-2">{post.content}</p>
                </article>
              ))}
            </div>
          ) : (
            <p>No posts available yet.</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
