import { AlignJustify, Sun, Moon, LogOut, User, Mail, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect, useState, createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Créer un contexte pour gérer les notifications à travers l'application
export const NotificationContext = createContext({
  unreadCount: 0,
  setUnreadCount: () => {},
  hasNewMessage: false,
  setHasNewMessage: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

const getSystemTheme = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
};

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme || getSystemTheme();
  }
  return "light";
};

const applyTheme = (theme) => {
  if (typeof window !== 'undefined') {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }
};

export function SiteHeader({ setActiveComponent }) {
  const { toggleSidebar } = useSidebar() || { toggleSidebar: null };
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();
  const { unreadCount, hasNewMessage, setHasNewMessage } = useNotifications();

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);

    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
        const newTheme = e.matches ? "dark" : "light";
        if (!localStorage.getItem("theme")) {
          setTheme(newTheme);
          applyTheme(newTheme);
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Réinitialiser l'indicateur de nouveau message après un délai
  useEffect(() => {
    if (hasNewMessage) {
      const timer = setTimeout(() => {
        setHasNewMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasNewMessage, setHasNewMessage]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleLogOut = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error in logout:", err);
      alert("Error: " + err);
    }
  };

  const isAuthenticated = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      return token;
    }
    return false;
  };

  const goToInbox = () => {
    setActiveComponent("Inbox");
  };

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-16 w-full items-center gap-2 px-4">
        {toggleSidebar && (
          <>
            <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
              <AlignJustify className="h-6 w-6" strokeWidth={1.5} />
            </Button>
            <Separator orientation="vertical" className="mr-2 h-6" />
          </>
        )}

        <div className="mr-4 flex items-center">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
            JN
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setActiveComponent("Dashboard")}>Dashboard</Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToInbox}
            className="relative"
          >
            Inbox
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setActiveComponent("Account")}>Account</Button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Bouton de notification pour les appareils mobiles */}
          <Button 
            className="relative md:hidden h-8 w-8" 
            variant="ghost" 
            size="icon"
            onClick={goToInbox}
          >
            <Bell className={`h-5 w-5 ${hasNewMessage ? 'text-blue-500' : ''}`} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>

          <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {isAuthenticated() ? (
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
            <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
}