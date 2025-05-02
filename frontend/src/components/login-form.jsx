import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google"; // Ensure this import is correct
import { jwtDecode } from "jwt-decode";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const renderPage = (role) => {
    switch (role) {
      case "Admin":
        return "/admin";
      case "Employee":
        return "/employee";
      case "HR":
        return "/manager";
      case "Conditate":
        return "/jobs";
      default:
        return "/login";
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        const user = jwtDecode(data.token);
        const path = renderPage(user.role);
        navigate(path);
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("Unexpected error during login.");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
  
      const data = await res.json();
  
      if (res.ok) {

        localStorage.setItem("token", data.token);
        const user = jwtDecode(data.token);
        const path = renderPage(user.role);
        setTimeout(() => navigate(path), 0); // Ensures proper navigation
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      console.error("Google login error:", err);
      setErrorMessage("Google login failed.");
    }
  };
  

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin}>
            <div className="grid gap-6">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* Google Login Button */}
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setErrorMessage("Google Sign-In failed.")}
              />

              <div className="relative text-center text-sm">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
                <div className="absolute inset-0 flex items-center border-t" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password-page"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  Don’t have an account?{" "}
                </span>
                <Link
                  to="/create-account"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Create Account
                </Link>
              </div>

              <div className="text-muted-foreground text-center text-xs *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
