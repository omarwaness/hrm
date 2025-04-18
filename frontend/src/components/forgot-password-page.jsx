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
import { LoaderCircle, Mail } from "lucide-react";
import React, { useState } from "react";

export function ForgotPassword({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email.trim()) {
      setError("Please enter a valid email.");
      return;
    }
  
    setLoading(true);
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Something went wrong.");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className={cn("flex min-h-screen items-center justify-center", className)} {...props}>
      <Card className="m-3 w-full max-w-sm">

        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password?</CardTitle>
          <CardDescription>
            Enter your email to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <p className="mb-6 text-center text-green-600">
              Email has been sent. Please check your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubmit} action="/users/forgot" method="POST">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleChange}
                    error={error}
                    icon={<Mail size={20} />}
                  />
                  {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </div>
            </form>
          )}
          <div className="mt-4 text-center text-sm">
            <a
              href="/login"
              className="hover:underline underline-offset-4 hover:text-primary"
            >
              Back to Login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgotPassword;