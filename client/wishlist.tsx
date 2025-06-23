import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { formatPrice, truncateString } from "@/lib/utils";

export default function Wishlist() {
  const { items, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromWishlist = (productId: number) => {
    removeItem(productId);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <i className="fas fa-heart text-6xl text-gray-300 dark:text-gray-600 mb-6"></i>
          <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Start adding products to your wishlist by clicking the heart icon on products you love.
          </p>
          <Link href="/products">
            <Button className="bg-primary text-white hover:bg-primary/90">
              <i className="fas fa-shopping-bag mr-2"></i>
              Discover Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <i className="fas fa-heart text-red-500"></i>
            My Wishlist
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {items.length} item{items.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {items.length} items
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((product) => {
          const stockLevel = parseInt(product.stock.toString());
          const isLowStock = stockLevel < 20;

          return (
            <Card key={product.id} className="product-card overflow-hidden">
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
                
                {/* Remove from Wishlist Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all"
                >
                  <i className="fas fa-times text-red-500 text-lg"></i>
                </Button>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {product.category}
                  </Badge>
                </div>
                
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors cursor-pointer">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {truncateString(product.description, 100)}
                </p>
                
                <div className="flex items-center justify-between mb-4">
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
                      onClick={() => handleAddToCart(product)}
                      className="bg-primary text-white hover:bg-primary/90"
                    >
                      <i className="fas fa-shopping-cart mr-2"></i>
                      Add to Cart
                    </Button>
                  </div>
                </div>
                
                {isLowStock && (
                  <div className="text-xs text-warning">
                    ⚠️ Only {stockLevel} left in stock
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}