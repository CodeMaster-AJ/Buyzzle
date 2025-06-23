import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";
import { formatPrice, formatDate } from "@/lib/utils";

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  lowStockProducts: number;
  categoryStats: {
    electronics: number;
    fashion: number;
    home: number;
    sports: number;
  };
  salesData: number[];
  recentFeedback: any[];
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Check if user is logged in as admin
  useEffect(() => {
    const adminSession = localStorage.getItem("admin-session") || sessionStorage.getItem("admin-session");
    if (!adminSession) {
      navigate("/admin-login");
      return;
    }
  }, [navigate]);

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const handleLogout = () => {
    localStorage.removeItem("admin-session");
    sessionStorage.removeItem("admin-session");
    navigate("/");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin dashboard.",
    });
  };

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  const getStockStatus = (stock: number) => {
    if (stock < 10) return { label: "Critical", variant: "destructive" as const };
    if (stock < 20) return { label: "Low", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Navigation */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
              <Badge className="bg-primary/10 text-primary">TEAM AJ</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-400">Welcome, Admin</span>
              <Button variant="destructive" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Products</p>
                  <p className="text-3xl font-bold text-primary">{stats?.totalProducts || 0}</p>
                </div>
                <i className="fas fa-box text-primary text-2xl"></i>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold text-success">{stats?.totalOrders.toLocaleString() || 0}</p>
                </div>
                <i className="fas fa-shopping-cart text-success text-2xl"></i>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-warning">${stats?.totalRevenue.toLocaleString() || 0}</p>
                </div>
                <i className="fas fa-dollar-sign text-warning text-2xl"></i>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Active Users</p>
                  <p className="text-3xl font-bold text-secondary">{stats?.activeUsers.toLocaleString() || 0}</p>
                </div>
                <i className="fas fa-users text-secondary text-2xl"></i>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {stats && stats.lowStockProducts > 0 && (
          <Card className="mb-8 border-warning">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <i className="fas fa-exclamation-triangle text-warning text-xl"></i>
                <div>
                  <h3 className="font-semibold">Low Stock Alert</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {stats.lowStockProducts} product{stats.lowStockProducts > 1 ? 's' : ''} running low on stock
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts Section - Placeholder for Chart.js integration */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <i className="fas fa-chart-line text-4xl mb-4"></i>
                  <p>Sales Chart</p>
                  <p className="text-sm">Chart.js integration ready</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.categoryStats && Object.entries(stats.categoryStats).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="capitalize">{category.replace('_', ' & ')}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Product Management</CardTitle>
              <Button className="bg-primary text-white hover:bg-primary/90">
                <i className="fas fa-plus mr-2"></i>
                Add Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Home & Living">Home & Living</SelectItem>
                  <SelectItem value="Sports & Fitness">Sports & Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => {
                      const stockLevel = parseInt(product.stock.toString());
                      const stockStatus = getStockStatus(stockLevel);
                      
                      return (
                        <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-semibold">{product.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  ID: {product.id}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="font-semibold">
                            {formatPrice(product.price)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className={stockLevel < 20 ? "text-warning" : "text-success"}>
                                {stockLevel} units
                              </span>
                              {stockLevel < 20 && (
                                <div className="text-xs text-warning">⚠️ Low Stock</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={stockStatus.variant}>
                              {stockStatus.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <i className="fas fa-eye"></i>
                              </Button>
                              <Button size="sm" variant="outline">
                                <i className="fas fa-edit"></i>
                              </Button>
                              <Button size="sm" variant="outline">
                                <i className="fas fa-trash text-destructive"></i>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="text-gray-500 dark:text-gray-400">
                          <i className="fas fa-search text-2xl mb-2"></i>
                          <p>No products found matching your criteria</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
