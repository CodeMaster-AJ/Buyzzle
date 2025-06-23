import { 
  users, 
  products, 
  feedback, 
  cartItems,
  wishlist,
  reviews,
  productViews,
  type User, 
  type InsertUser,
  type Product,
  type InsertProduct,
  type Feedback,
  type InsertFeedback,
  type CartItem,
  type InsertCartItem,
  type WishlistItem,
  type InsertWishlistItem,
  type Review,
  type InsertReview,
  type ProductView,
  type InsertProductView
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, like, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Feedback methods
  getAllFeedback(): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;

  // Cart methods
  getCartItems(userId?: number): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId?: number): Promise<boolean>;

  // Wishlist methods
  getWishlistItems(userId?: number): Promise<WishlistItem[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(id: number): Promise<boolean>;
  isInWishlist(userId: number, productId: number): Promise<boolean>;

  // Review methods
  getProductReviews(productId: number): Promise<Review[]>;
  addReview(review: InsertReview): Promise<Review>;
  getProductRating(productId: number): Promise<{ averageRating: number; totalReviews: number }>;

  // Analytics methods
  incrementProductView(productId: number): Promise<void>;
  getTrendingProducts(): Promise<Product[]>;
  getRecommendedProducts(userId?: number): Promise<Product[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.active, true)).orderBy(desc(products.createdAt));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(and(eq(products.id, id), eq(products.active, true)));
    return product || undefined;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(and(eq(products.featured, true), eq(products.active, true))).orderBy(desc(products.createdAt));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(and(eq(products.category, category), eq(products.active, true))).orderBy(desc(products.createdAt));
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await db.select().from(products).where(
      and(
        eq(products.active, true),
        like(products.name, `%${query}%`)
      )
    ).orderBy(desc(products.createdAt));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const [product] = await db
      .update(products)
      .set({ active: false })
      .where(eq(products.id, id))
      .returning();
    return !!product;
  }

  // Feedback methods
  async getAllFeedback(): Promise<Feedback[]> {
    return await db.select().from(feedback).orderBy(desc(feedback.createdAt));
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const [feedbackRecord] = await db
      .insert(feedback)
      .values(insertFeedback)
      .returning();
    return feedbackRecord;
  }

  // Cart methods
  async getCartItems(userId?: number): Promise<CartItem[]> {
    if (userId) {
      return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
    }
    return [];
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const [cartItem] = await db
      .insert(cartItems)
      .values(item)
      .returning();
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [cartItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return cartItem || undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount || 0) > 0;
  }

  async clearCart(userId?: number): Promise<boolean> {
    if (userId) {
      const result = await db.delete(cartItems).where(eq(cartItems.userId, userId));
      return (result.rowCount || 0) > 0;
    }
    return false;
  }

  // Wishlist methods
  async getWishlistItems(userId?: number): Promise<WishlistItem[]> {
    if (userId) {
      return await db.select().from(wishlist).where(eq(wishlist.userId, userId));
    }
    return [];
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    const [wishlistItem] = await db
      .insert(wishlist)
      .values(item)
      .returning();
    return wishlistItem;
  }

  async removeFromWishlist(id: number): Promise<boolean> {
    const result = await db.delete(wishlist).where(eq(wishlist.id, id));
    return (result.rowCount || 0) > 0;
  }

  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    const [item] = await db.select().from(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)));
    return !!item;
  }

  // Review methods
  async getProductReviews(productId: number): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
  }

  async addReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return newReview;
  }

  async getProductRating(productId: number): Promise<{ averageRating: number; totalReviews: number }> {
    const productReviews = await db.select().from(reviews).where(eq(reviews.productId, productId));
    
    if (productReviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const averageRating = productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length;
    
    return {
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: productReviews.length
    };
  }

  // Analytics methods
  async incrementProductView(productId: number): Promise<void> {
    const [existing] = await db.select().from(productViews)
      .where(eq(productViews.productId, productId));
    
    if (existing) {
      await db.update(productViews)
        .set({ 
          viewCount: existing.viewCount + 1,
          lastViewed: new Date()
        })
        .where(eq(productViews.productId, productId));
    } else {
      await db.insert(productViews)
        .values({ productId, viewCount: 1 });
    }
  }

  async getTrendingProducts(): Promise<Product[]> {
    // For now, return featured products as trending since we don't have view data yet
    return await this.getFeaturedProducts();
  }

  async getRecommendedProducts(userId?: number): Promise<Product[]> {
    // Simple recommendation based on newest products
    return await db.select().from(products)
      .where(eq(products.active, true))
      .orderBy(desc(products.createdAt))
      .limit(8);
  }
}

export const storage = new DatabaseStorage();
