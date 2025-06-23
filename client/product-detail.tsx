import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";
import { formatPrice, cn } from "@/lib/utils";

export default function ProductDetail() {
  const [location] = useLocation();
  const productId = parseInt(location.split('/')[2]);
  const [quantity, setQuantity] = useState(1);
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !isNaN(productId),
  });

  const inWishlist = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} ${product.name}(s) added to your cart.`,
      });
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      if (inWishlist) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  if (isNaN(productId)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">Invalid product ID.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="w-full h-96" />
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const stockLevel = parseInt(product.stock.toString());
  const isLowStock = stockLevel < 20;
  const isOutOfStock = stockLevel === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <li><a href="/" className="hover:text-primary">Home</a></li>
          <li><i className="fas fa-chevron-right text-xs"></i></li>
          <li><a href="/products" className="hover:text-primary">Products</a></li>
          <li><i className="fas fa-chevron-right text-xs"></i></li>
          <li><span className="text-gray-900 dark:text-gray-100">{product.name}</span></li>
        </ol>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
          {product.featured && (
            <Badge className="absolute top-4 left-4 bg-primary text-white">
              Featured
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge variant="secondary" className="absolute top-4 right-4 bg-warning text-white">
              Low Stock
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="destructive" className="absolute top-4 right-4">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="text-3xl font-bold text-primary mb-4">
              {formatPrice(product.price)}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <i className={cn(
              "fas fa-circle text-xs",
              isOutOfStock ? "text-red-500" : isLowStock ? "text-yellow-500" : "text-green-500"
            )}></i>
            <span className="text-sm">
              {isOutOfStock 
                ? "Out of stock" 
                : isLowStock 
                  ? `Only ${stockLevel} left in stock` 
                  : "In stock"
              }
            </span>
          </div>

          {/* Quantity and Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                    >
                      <i className="fas fa-minus"></i>
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(stockLevel, parseInt(e.target.value) || 1)))}
                      className="w-20 text-center"
                      min="1"
                      max={stockLevel}
                      disabled={isOutOfStock}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.min(stockLevel, quantity + 1))}
                      disabled={quantity >= stockLevel || isOutOfStock}
                    >
                      <i className="fas fa-plus"></i>
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-primary text-white hover:bg-primary/90"
                    disabled={isOutOfStock}
                  >
                    <i className="fas fa-shopping-cart mr-2"></i>
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleWishlistToggle}
                    className="w-full"
                  >
                    <i className={cn(
                      "fas fa-heart mr-2",
                      inWishlist ? "text-red-500" : "text-gray-400"
                    )}></i>
                    {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                  </Button>
                </div>

                {/* Features */}
                <div className="pt-4 border-t space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-truck text-green-500"></i>
                    <span>Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-undo text-blue-500"></i>
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-shield-alt text-purple-500"></i>
                    <span>2-year warranty included</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-headset text-orange-500"></i>
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews Section Placeholder */}
      <div className="mt-16">
        <Card>
          <CardContent className="p-8 text-center">
            <i className="fas fa-star text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Customer Reviews</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Review system coming soon! Be the first to share your experience with this product.
            </p>
            <Button variant="outline" disabled>
              <i className="fas fa-pen mr-2"></i>
              Write a Review
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}