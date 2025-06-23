import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";
import { formatPrice, truncateString, cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const stockLevel = parseInt(product.stock.toString());
  const isLowStock = stockLevel < 20;

  return (
    <Card className="product-card overflow-hidden">
      <div className="relative group">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
        />
        {product.featured && (
          <Badge className="absolute top-2 left-2 bg-primary text-white">
            Featured
          </Badge>
        )}
        {isLowStock && (
          <Badge variant="secondary" className="absolute top-2 right-2 bg-warning text-white">
            Low Stock
          </Badge>
        )}
        
        {/* Wishlist Button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleWishlistToggle}
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all",
            isLowStock && "top-12"
          )}
        >
          <i className={cn(
            "fas fa-heart text-lg",
            inWishlist ? "text-red-500" : "text-gray-400"
          )}></i>
        </Button>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Link href={`/products/${product.id}`}>
            <Button className="bg-white text-black hover:bg-gray-100">
              <i className="fas fa-eye mr-2"></i>
              Quick View
            </Button>
          </Link>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-2">
          <Badge variant="outline" className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {product.category}
          </Badge>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {truncateString(product.description, 100)}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          
          <div className="flex items-center space-x-2">
            <Link href={`/products/${product.id}`}>
              <Button variant="outline" size="sm">
                <i className="fas fa-eye mr-2"></i>
                View
              </Button>
            </Link>
            
            <Button 
              size="sm"
              onClick={handleAddToCart}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <i className="fas fa-shopping-cart mr-2"></i>
              Add
            </Button>
          </div>
        </div>
        
        {isLowStock && (
          <div className="mt-3 text-xs text-warning">
            ⚠️ Only {stockLevel} left in stock
          </div>
        )}
      </CardContent>
    </Card>
  );
}
