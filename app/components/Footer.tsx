import { Github, Twitter, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} Community Hub. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="ghost" size="icon">
            <Github className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Twitter className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Facebook className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </footer>
  )
}

