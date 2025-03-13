"use client"

import { AlignJustify, Sun, Moon, LogOut, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Theme management utility functions
// New commit
const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getInitialTheme = () => {
  // Check if theme is stored in localStorage
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) return storedTheme;
  
  // Fall back to system preference
  return getSystemTheme();
};

const applyTheme = (theme) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
};

export function SiteHeader() {
  const sidebarContext = useSidebar()
  const { toggleSidebar } = sidebarContext
  const [theme, setTheme] = useState("light"); // Default to light, will be updated in useEffect
  const [isNavOpen, setIsNavOpen] = useState(false)
  const navigate=useNavigate();
  const handleLogOut=async(e)=>{
  try{
    const res=await fetch("http://localhost:5000/api/auth/logout",{
      method:"POST",
    })
    
    let data=await res.json();
    
    if(res.ok){
      
      localStorage.setItem("token", data.token);
      navigate("/login");
      
    }else{alert(data.message)}
  }catch(err){
    console.error("Error in login is:",err);
    alert("error is:"+err)
  }}

  // Initialize theme on component mount
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
    
    // Optional: Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      const newTheme = e.matches ? "dark" : "light";
      // Only update if user hasn't explicitly set a preference
      if (!localStorage.getItem("theme")) {
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const navigateToDashboard = () => {
    // Theme is already saved in localStorage by the toggleTheme function
    // Just navigate to the dashboard
    window.location.href = "/dashboard";
  };

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-16 w-full items-center gap-2 px-4">
        {/* Left side - Menu toggle, Logo and Navigation */}
        <div className="flex items-center gap-2">
          {toggleSidebar && (
            <>
              <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
                <AlignJustify className="!w-6 !h-6" strokeWidth={1.5} />
              </Button>
              <Separator orientation="vertical" className="mr-2 h-6" />
            </>
          )}

          {/* Logo */}
          <div className="mr-4 flex items-center">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
              JN
            </div>
          </div>

          {/* Navigation Buttons - Shown on Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={navigateToDashboard}>
              Dashboard
            </Button>
            
            <Button variant="ghost" size="sm">Account</Button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className="md:hidden ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronDown className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={navigateToDashboard}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsNavOpen(false)}>Schedule</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsNavOpen(false)}>Account</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right side - Theme toggle and Profile */}
        <div className="ml-auto flex items-center gap-2">
          <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Profile Avatar with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span onClick={handleLogOut}>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
