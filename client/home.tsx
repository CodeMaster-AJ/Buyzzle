import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@shared/schema";

export default function Home() {
  const { data: featuredProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  const { data: trendingProducts, isLoading: trendingLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/trending"],
  });

  const { data: recommendedProducts, isLoading: recommendedLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/recommended"],
  });

  const categories = [
    {
      name: "Electronics",
      description: "Latest gadgets & tech",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    },
    {
      name: "Fashion", 
      description: "Trendy clothing & accessories",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    },
    {
      name: "Home & Living",
      description: "Decor & essentials", 
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    },
    {
      name: "Sports & Fitness",
      description: "Health & wellness gear",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    },
  ];

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-5xl font-bold mb-6">Welcome to Buyzzle</h1>
              <p className="text-xl mb-8 text-blue-100">
                Discover amazing products from our student startup, powered by University Incubation Centre innovation.
              </p>
              <div className="flex space-x-4">
                <Link href="/products">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/about">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white hover:text-primary"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
              
              {/* AI Features Placeholder */}
              <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <i className="fas fa-robot"></i>
                  AI-Powered Features (Coming Soon)
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30" disabled>
                    <i className="fas fa-brain mr-2"></i>
                    Smart Recommendations
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30" disabled>
                    <i className="fas fa-comments mr-2"></i>
                    AI Shopping Assistant
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30" disabled>
                    <i className="fas fa-chart-line mr-2"></i>
                    Dynamic Pricing
                  </Button>
                </div>
              </div>
            </div>
            <div className="fade-in">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern e-commerce shopping experience"
                className="rounded-xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link 
                key={category.name} 
                href={`/products?category=${encodeURIComponent(category.name)}`}
              >
                <Card className="hover-scale cursor-pointer">
                  <CardContent className="p-0">
                    <img 
                      src={category.image} 
                      alt={`${category.name} category`}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4 text-center">
                      <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Handpicked products just for you</p>
            </div>
            <Link href="/products">
              <Button variant="link" className="text-primary hover:text-primary/80 font-semibold">
                View All →
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-0">
                    <Skeleton className="w-full h-48" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} featured />
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No featured products available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <i className="fas fa-fire text-orange-500"></i>
                Trending Now
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Most popular products this week</p>
            </div>
            <Badge className="bg-orange-500 text-white">Hot</Badge>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {trendingLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-0">
                    <Skeleton className="w-full h-48" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : trendingProducts && trendingProducts.length > 0 ? (
              trendingProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No trending products available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
              <i className="fas fa-magic text-purple-500"></i>
              Recommended for You
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">AI-powered product suggestions based on your interests</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {recommendedLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-0">
                    <Skeleton className="w-full h-48" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : recommendedProducts && recommendedProducts.length > 0 ? (
              recommendedProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No recommendations available.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
