import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { jwtDecode } from 'jwt-decode';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateAccountForm({
  className,
  ...props
}) {
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [action, setAction] = useState(null);

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

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

  const handleRoleChange = (value) => {
    setRole(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAction("submitting");

    try {
        const res = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, phoneNumber, role: role || 'Conditate', email, password }),
            credentials: "include",
        });

        const data = await res.json();
        if (res.ok) {
            // Store the token in localStorage
            const token = data.token;
            if (typeof token !== 'string' || !token.trim()) {
                alert("Invalid token received");
                return;
            }

            localStorage.setItem("token", token);  // Store token
            const user = jwtDecode(token.trim());  // Decode token
            const render = renderPage(user.role);  // Navigate to appropriate page
            navigate(render);
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
                <Button variant="outline" className="w-full"
                  onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor" />
                  </svg>
                  Create Account with Google
                </Button>
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
                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="number"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={handleRoleChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Role</SelectLabel>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="Employee">Employee</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Conditate">Conditate</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
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

