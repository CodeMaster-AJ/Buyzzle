import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { formatPrice, truncateString } from "@/lib/utils";

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { toast } = useToast();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    removeItem(productId);
    toast({
      title: "Item removed",
      description: "Product has been removed from your cart.",
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const shipping = totalPrice > 50 ? 0 : 9.99;
  const tax = totalPrice * 0.08; // 8% tax
  const finalTotal = totalPrice + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <i className="fas fa-shopping-cart text-6xl text-gray-300 dark:text-gray-600 mb-6"></i>
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Start adding products to your cart and they will appear here.
          </p>
          <Link href="/products">
            <Button className="bg-primary text-white hover:bg-primary/90">
              <i className="fas fa-shopping-bag mr-2"></i>
              Continue Shopping
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
            <i className="fas fa-shopping-cart text-primary"></i>
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleClearCart}>
            <i className="fas fa-trash mr-2"></i>
            Clear Cart
          </Button>
          <Link href="/products">
            <Button variant="outline">
              <i className="fas fa-shopping-bag mr-2"></i>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const stockLevel = parseInt(item.product.stock.toString());
            const isLowStock = stockLevel < 20;

            return (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link href={`/products/${item.product.id}`}>
                            <h3 className="text-lg font-semibold hover:text-primary transition-colors cursor-pointer">
                              {item.product.name}
                            </h3>
                          </Link>
                          <Badge variant="outline" className="text-xs mt-1">
                            {item.product.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <i className="fas fa-times"></i>
                        </Button>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {truncateString(item.product.description, 120)}
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <i className="fas fa-minus"></i>
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                            min="1"
                            max={stockLevel}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= stockLevel}
                          >
                            <i className="fas fa-plus"></i>
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {formatPrice(parseFloat(item.product.price) * item.quantity)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatPrice(item.product.price)} each
                          </div>
                        </div>
                      </div>

                      {isLowStock && (
                        <div className="mt-2 text-xs text-warning">
                          ⚠️ Only {stockLevel} left in stock
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-success" : ""}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-6 text-sm">
                  <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                  Add {formatPrice(50 - totalPrice)} more for free shipping!
                </div>
              )}

              <Button className="w-full bg-primary text-white hover:bg-primary/90 mb-4">
                <i className="fas fa-credit-card mr-2"></i>
                Proceed to Checkout
              </Button>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p className="mb-2">Secure checkout with 256-bit SSL encryption</p>
                <div className="flex justify-center space-x-3">
                  <i className="fab fa-cc-visa text-2xl"></i>
                  <i className="fab fa-cc-mastercard text-2xl"></i>
                  <i className="fab fa-cc-paypal text-2xl"></i>
                  <i className="fab fa-cc-apple-pay text-2xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}