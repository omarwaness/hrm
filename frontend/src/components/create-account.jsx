import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
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
import { GoogleLogin } from '@react-oauth/google';

export function CreateAccountForm({ className, ...props }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("Candidate"); // Typo fixed from "Conditate"
  const [action, setAction] = useState(null);
  const navigate = useNavigate();

  const renderPage = (role) => {
    switch (role) {
      case 'Admin':
        return '/admin';
      case 'Employee':
        return '/employee';
      case 'HR':
        return '/manager';
      case 'Conditate':
        return '/jobs';
      default:
        return '/signup';
    }
  };

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      try {
        const decodedToken = jwtDecode(token);
        const render = renderPage(decodedToken.role);
        navigate(render);
      } catch (error) {
        console.error("Error decoding token on load:", error);
        localStorage.removeItem('token');
        navigate("/login");
      }
    } else if (token) {
      localStorage.removeItem('token');
      navigate("/login");
    }
  }, [navigate]);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        const user = jwtDecode(data.token);
        navigate(renderPage(user.role));
      } else {
        alert(data.message || "Google registration failed.");
      }
    } catch (error) {
      console.error("Google registration error:", error);
      alert("Google login failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAction("submitting");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phoneNumber, role, email, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        const user = jwtDecode(data.token);
        navigate(renderPage(user.role));
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error in registration:", error);
      alert("Error: " + error.message);
    } finally {
      setAction(null);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription>
            Create an Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="w-full max-w-xs flex flex-col gap-4" onSubmit={handleSubmit} onReset={() => setAction("reset")}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    alert("Google Sign-In failed.");
                  }}
                />
              </div>
              <div
                className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>

              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    className="w-full"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
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
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 md:gap-6">
                <Button type="submit" disabled={action === "submitting"}>
                  {action === "submitting" ? "Submitting..." : "Create Account"}
                </Button>
                <Button type="reset" variant="outline">
                  Reset
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
