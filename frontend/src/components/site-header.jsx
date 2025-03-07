"use client"

import { AlignJustify, Sun, Moon, LogOut, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SiteHeader() {
  const sidebarContext = useSidebar()
  const { toggleSidebar } = sidebarContext
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== "undefined" ? document.documentElement.classList.contains("dark") : false
  )
  const [isNavOpen, setIsNavOpen] = useState(false)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDarkMode])

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
    }
  }, [])

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
            <Button variant="ghost" size="sm">Dashboard</Button>
            <Button variant="ghost" size="sm">Schedule</Button>
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
              <DropdownMenuItem onClick={() => setIsNavOpen(false)}>Dashboard</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsNavOpen(false)}>Schedule</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsNavOpen(false)}>Account</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right side - Theme toggle and Profile */}
        <div className="ml-auto flex items-center gap-2">
          <Button className="h-8 w-8" variant="ghost" size="icon" onClick={() => setIsDarkMode((prev) => !prev)}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
