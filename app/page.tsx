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
        </div>
      </main>
      <Footer />
    </div>
  )
}
