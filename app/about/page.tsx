import { Header } from "../components/Header"
import { Footer } from "../components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">About Me</CardTitle>
            <CardDescription>Dominican-Colombian Entrepreneur</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              As a Dominican-Colombian entrepreneur, I bring a unique perspective to the business world, blending the
              rich cultural heritage of both countries with innovative business practices.
            </p>
            <p className="mb-4">
              My journey began in the vibrant streets of Santo Domingo and Bogotá, where I learned the value of
              community, hard work, and creativity. These early experiences shaped my entrepreneurial spirit and drive
              to create positive change through business.
            </p>
            <p className="mb-4">
              Today, I leverage my multicultural background to build bridges between different markets, fostering
              collaboration and driving growth. My ventures span various industries, always with a focus on
              sustainability and social impact.
            </p>
            <p>
              I'm passionate about mentoring the next generation of entrepreneurs, particularly those from
              underrepresented backgrounds. By sharing my experiences and insights, I hope to inspire others to pursue
              their dreams and make a difference in their communities.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">My Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              I envision a world where entrepreneurship is a powerful force for positive change, bridging cultures and
              creating opportunities for all. Through innovation, collaboration, and a commitment to social
              responsibility, we can build businesses that not only succeed financially but also contribute to the
              well-being of our communities and the planet.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

