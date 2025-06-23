import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/components/theme-provider";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/search-bar";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 smooth-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary text-white p-2 rounded-lg">
              <i className="fas fa-shopping-bag text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Buyzzle</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">by TEAM AJ</p>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "nav-link text-gray-700 dark:text-gray-300 hover:text-primary smooth-transition",
                  location === link.href && "text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Wishlist Icon */}
            <Link href="/wishlist">
              <Button variant="ghost" className="relative">
                <i className="fas fa-heart text-xl"></i>
                {wishlistItems > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {wishlistItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart Icon */}
            <Link href="/cart">
              <Button variant="ghost" className="relative">
                <i className="fas fa-shopping-cart text-xl"></i>
                {totalItems > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Dark Mode Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <i className={cn("fas", theme === "dark" ? "fa-sun" : "fa-moon")}></i>
            </Button>

            {/* Admin Login */}
            <Link href="/admin-login">
              <Button className="bg-primary text-white hover:bg-primary/90">
                <i className="fas fa-user-shield mr-2"></i>
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <Link href="/wishlist">
              <Button variant="ghost" className="relative">
                <i className="fas fa-heart text-xl"></i>
                {wishlistItems > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {wishlistItems}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" className="relative">
                <i className="fas fa-shopping-cart text-xl"></i>
                {totalItems > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
            >
              <i className={cn("fas", theme === "dark" ? "fa-sun" : "fa-moon")}></i>
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <i className="fas fa-bars"></i>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="mb-4">
                    <SearchBar />
                  </div>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-lg font-medium hover:text-primary transition-colors",
                        location === link.href && "text-primary"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link href="/admin-login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-primary text-white hover:bg-primary/90">
                      <i className="fas fa-user-shield mr-2"></i>
                      Admin Login
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
