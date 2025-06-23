import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/product-card";
import SearchBar from "@/components/search-bar";
import type { Product } from "@shared/schema";
import { categories } from "@/lib/utils";

export default function Products() {
  const [searchParams] = useLocation();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  const itemsPerPage = 12;

  // Get URL params
  const urlParams = new URLSearchParams(searchParams.split('?')[1] || '');
  const categoryFromUrl = urlParams.get('category');
  const searchFromUrl = urlParams.get('search');

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  useEffect(() => {
    if (categoryFromUrl && categories.includes(categoryFromUrl as any)) {
      setSelectedCategory(categoryFromUrl);
    }
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [categoryFromUrl, searchFromUrl]);

  useEffect(() => {
    if (!products) return;

    let filtered = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "featured":
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchQuery, selectedCategory, sortBy]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          {/* Mobile Search */}
          <div className="md:hidden">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Filter */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Sort by: Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {(searchQuery || selectedCategory !== "all") && (
        <div className="flex flex-wrap gap-2 mb-6">
          {searchQuery && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="flex items-center gap-2"
            >
              Search: "{searchQuery}"
              <i className="fas fa-times"></i>
            </Button>
          )}
          {selectedCategory !== "all" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="flex items-center gap-2"
            >
              Category: {selectedCategory}
              <i className="fas fa-times"></i>
            </Button>
          )}
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
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
        ) : paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (pageNum > totalPages) return null;
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage === pageNum ? "bg-primary text-white" : ""}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
