import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiRequest("POST", "/api/admin/login", {
        email: data.email,
        password: data.password,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard!",
        });
        // Store admin session (in a real app, use proper session management)
        if (form.getValues("rememberMe")) {
          localStorage.setItem("admin-session", JSON.stringify(data.user));
        } else {
          sessionStorage.setItem("admin-session", JSON.stringify(data.user));
        }
        navigate("/admin-dashboard");
      }
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center fade-in">
          <div className="bg-primary text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <i className="fas fa-shield-alt text-2xl"></i>
          </div>
          <h2 className="text-3xl font-bold">Admin Login</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Access the Buyzzle Admin Dashboard
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="admin@buyzzle.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
                            Remember me
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button variant="link" className="text-sm text-primary hover:text-primary/80">
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <i className="fas fa-spinner loading-spin mr-2"></i>
                  ) : (
                    <i className="fas fa-sign-in-alt mr-2"></i>
                  )}
                  {loginMutation.isPending ? "Signing in..." : "Login to Dashboard"}
                </Button>

                {/* Demo Credentials */}
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <p className="font-medium mb-1">Demo Credentials:</p>
                  <p>Email: admin@buyzzle.com</p>
                  <p>Password: admin123</p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
