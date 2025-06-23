import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertFeedbackSchema } from "@shared/schema";

const contactFormSchema = insertFeedbackSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(1, { message: "Please select a subject" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("POST", "/api/feedback", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: "fas fa-envelope",
      label: "Email",
      value: "contact@buyzzle.com",
    },
    {
      icon: "fas fa-phone",
      label: "Phone", 
      value: "+1 (555) 123-4567",
    },
    {
      icon: "fas fa-map-marker-alt",
      label: "Address",
      value: "University Incubation Centre\n123 Innovation Drive, Tech City",
    },
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ];

  const socialLinks = [
    { icon: "fab fa-facebook-f", href: "#", label: "Facebook" },
    { icon: "fab fa-twitter", href: "#", label: "Twitter" },
    { icon: "fab fa-linkedin-in", href: "#", label: "LinkedIn" },
    { icon: "fab fa-instagram", href: "#", label: "Instagram" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12 fade-in">
        <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Have questions, feedback, or want to collaborate? We'd love to hear from you!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="business">Business Partnership</SelectItem>
                          <SelectItem value="feedback">Product Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us how we can help you..."
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? (
                    <i className="fas fa-spinner loading-spin mr-2"></i>
                  ) : (
                    <i className="fas fa-paper-plane mr-2"></i>
                  )}
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-8">
          {/* Contact Details */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <i className={`${info.icon} text-primary text-lg mt-1`}></i>
                    <div>
                      <p className="font-medium">{info.label}</p>
                      <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                        {info.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Business Hours */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Business Hours</h3>
              <div className="space-y-2">
                {businessHours.map((hours, index) => (
                  <div key={index} className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{hours.day}</span>
                    <span>{hours.hours}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="bg-primary text-white p-3 rounded-lg hover:bg-primary/90 smooth-transition"
                    aria-label={social.label}
                  >
                    <i className={social.icon}></i>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
