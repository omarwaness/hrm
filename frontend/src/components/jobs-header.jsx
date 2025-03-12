import { AlignJustify, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { useEffect, useState } from "react";
const navigateToLogin= ()=>{
  window.location.href="/login"
}


export function JobsHeader() {
  const { toggleSidebar } = useSidebar()

  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== "undefined" ? document.documentElement.classList.contains("dark") : false
  );

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

  return (
    (<header
      className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">

        <Button
          className="h-8 w-8 ml-auto"
          variant="ghost"
          size="icon"
          onClick={() => setIsDarkMode((prev) => !prev)}>
          {isDarkMode ? <Sun /> : <Moon />}
        </Button>
        <Button className="h-8" onClick={navigateToLogin} variant="default">Login</Button>
      </div>
    </header>)
  );
}
