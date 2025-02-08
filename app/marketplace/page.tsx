"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatPrice, cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { getJWTPayload } from "@/lib/auth"

interface Product {
  id: number
  title: string
  description: string
  price: number
  imageUrl: string | null
  createdAt: string
  seller: {
    id: number
    name: string
  }
}

const navigationItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Communities",
    href: "/communities",
  },
  {
    name: "Forums",
    href: "/forums",
  },
  {
    name: "Marketplace",
    href: "/marketplace",
  },
  {
    name: "Live",
    href: "/live",
  },
];

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function loadUserAndProducts() {
      try {
        const [userData, productsData] = await Promise.all([
          getJWTPayload(),
          fetch('/api/marketplace/products').then(res => res.json())
        ]);
        setUser(userData);
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          console.error('Error loading products:', productsData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadUserAndProducts();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <div className="border-b">
        <div className="container flex h-16 items-center">
          <nav className="flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                  pathname === item.href && "text-primary font-semibold"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
            <p className="text-xl text-muted-foreground">
              Buy, sell, and trade with community members.
            </p>
          </div>
          <div>
            {user ? (
              <Link href="/marketplace/create">
                <Button>List Item</Button>
              </Link>
            ) : (
              <div className="space-x-2">
                <Link href="/auth/signin">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : products.length === 0 ? (
          <Card className="p-12 text-center">
            <CardDescription>No items listed yet.</CardDescription>
            {!user && (
              <Button asChild variant="secondary" className="mt-4">
                <Link href="/marketplace/create">List your first item</Link>
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                {product.imageUrl && (
                  <div className="aspect-video w-full relative">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {product.title}
                    <span className="text-lg font-bold">
                      {formatPrice(product.price)}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Listed by {product.seller.name} • {new Date(product.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2">{product.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
