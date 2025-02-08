import { db } from '@/lib/db';
import { members } from '@/lib/schema';
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { Hero } from "./components/Hero"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { handleCreatePost } from '@/lib/actions';

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-6 h-6" />
                Quick Post
              </CardTitle>
              <CardDescription>Share a quick thought or update with the community</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                action={async (formData) => {
                  "use server"
                  const result = await handleCreatePost(formData);
                  if (result?.error) {
                    toast.error(result.error);
                  } else if (result?.success) {
                    toast.success("Post created successfully!");
                    (document.querySelector('form') as HTMLFormElement)?.reset();
                  }
                }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Input 
                    name="title" 
                    placeholder="What's on your mind?" 
                    className="text-lg font-medium"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Textarea 
                    name="content" 
                    placeholder="Tell us more..." 
                    className="min-h-[120px] resize-none"
                    required 
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" size="lg">
                    Post Update
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Community Forums
              </CardTitle>
              <CardDescription>Join discussions or start your own thread</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Engage with other members in our community forums. Start discussions, ask questions, or share your expertise.
                </p>
                <Link href="/forums">
                  <Button className="w-full group">
                    Visit Forums
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
