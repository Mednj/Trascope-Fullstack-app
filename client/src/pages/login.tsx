import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { CreditCard, ArrowRight, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      authApi.login(email, password),
    onSuccess: ({ user, token }) => {
      login(user, token);
      toast({ title: "Success", description: "Logged in successfully" });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    // Always try the backend API first
    loginMutation.mutate({ email: data.email, password: data.password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome to Transcope</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your merchant dashboard</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-12"
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
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-12 pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between text-sm">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label htmlFor="remember" className="text-gray-600">
                        Remember me
                      </Label>
                    </div>
                  )}
                />
                <a href="#" className="font-medium text-primary hover:text-primary/80">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-sm font-medium"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>

              <div className="text-center space-y-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800 font-medium">
                    Backend Integration
                  </p>
                  <p className="text-xs text-blue-700">
                    This login will attempt to connect to the Spring Boot backend on port 8080.
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Demo credentials:{" "}
                  <strong>merchant@transcope.com</strong> /{" "}
                  <strong>password123</strong>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
