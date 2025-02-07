import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="py-24 px-6 text-center bg-gradient-to-r from-gray-700 to-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-6">Welcome to Community Hub</h1>
      <p className="text-xl mb-8 max-w-2xl mx-auto">
        Join our vibrant community of changemakers and make a difference in your local area.
      </p>
      <Button size="lg" variant="secondary" asChild>
        <a href="/feedback">Get Involved</a>
      </Button>
    </section>
  )
}
