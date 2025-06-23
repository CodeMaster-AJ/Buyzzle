import { useState, useEffect } from "react";
import type { Product, WishlistItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface UseWishlistReturn {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  totalItems: number;
}

const WISHLIST_STORAGE_KEY = "buyzzle-wishlist";

export function useWishlist(): UseWishlistReturn {
  const [items, setItems] = useState<Product[]>([]);
  const { toast } = useToast();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        setItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage:", error);
    }
  }, []);

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error);
    }
  }, [items]);

  const addItem = (product: Product) => {
    setItems(currentItems => {
      const exists = currentItems.some(item => item.id === product.id);
      if (exists) {
        toast({
          title: "Already in wishlist",
          description: `${product.name} is already in your wishlist.`,
          variant: "destructive",
        });
        return currentItems;
      }
      
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
      return [...currentItems, product];
    });
  };

  const removeItem = (productId: number) => {
    setItems(currentItems => {
      const product = currentItems.find(item => item.id === productId);
      if (product) {
        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        });
      }
      return currentItems.filter(item => item.id !== productId);
    });
  };

  const isInWishlist = (productId: number) => {
    return items.some(item => item.id === productId);
  };

  const totalItems = items.length;

  return {
    items,
    addItem,
    removeItem,
    isInWishlist,
    totalItems,
  };
}