import { AlignJustify, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Make sure you import this

const navigateToLogin = () => {
  window.location.href = "/login";
};

export function JobsHeader() {
  const { toggleSidebar } = useSidebar();
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== "undefined" ? document.documentElement.classList.contains("dark") : false
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

        {!isLoggedIn && (
          <Button className="h-8" onClick={navigateToLogin} variant="default">
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
