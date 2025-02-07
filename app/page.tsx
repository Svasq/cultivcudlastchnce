import { getPosts, createPost } from "@/lib/utils/posts"
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { Hero } from "./components/Hero"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default async function Home() {
  let posts = []
  let error = null

  try {
    posts = await getPosts()
  } catch (e) {
    console.error("Failed to fetch posts:", e)
    error = "Failed to fetch posts. Please try again later."
  }

  async function handleCreatePost(formData: FormData) {
    "use server"
    const title = formData.get("title");
    const content = formData.get("content");
    if (typeof title === 'string' && typeof content === 'string') {
      await createPost(title, content);
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
      </main>
      <Footer />
    </div>
  )
}
