import { AlignJustify, Sun, Moon, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Make sure you import this
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"; // Assuming you have a DropdownMenu component
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Assuming you have an Avatar component

const navigateToLogin = () => {
  window.location.href = "/login";
};

const handleLogOut = () => {
  localStorage.removeItem("token");
  window.location.reload();
};

export function JobsHeader() {
  const { toggleSidebar } = useSidebar();
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== "undefined" ? document.documentElement.classList.contains("dark") : false
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Dark mode effects
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  // Check if user is logged in
  useEffect(() => {
    let isMounted = true;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        if (isMounted) setIsLoggedIn(false);
        return;
      }

      const decodedUser = jwtDecode(token);
      if (decodedUser && isMounted) {
        setIsLoggedIn(true);
        setUser(decodedUser); // Set user details
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      if (isMounted) setIsLoggedIn(false);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8 ml-auto"
          variant="ghost"
          size="icon"
          onClick={() => setIsDarkMode((prev) => !prev)}
        >
          {isDarkMode ? <Sun /> : <Moon />}
        </Button>

        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {/* Assuming you have an avatar image URL stored in the user object */}
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button className="h-8" onClick={navigateToLogin} variant="default">
            Login
          </Button>
        )}
      </div>
    </header>
  );
}