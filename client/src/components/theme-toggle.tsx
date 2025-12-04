import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const THEME_KEY = "theme";

export function ThemeToggle(): JSX.Element {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "dark") return true;
      if (saved === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem(THEME_KEY, "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem(THEME_KEY, "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark((v) => !v)}
      className={cn(
        "relative flex items-center justify-center h-10 w-10 rounded-md",
        "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm",
        "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        "focus:outline-none focus:ring-0 focus-visible:outline-none"
      )}
    >
      <div className="relative h-5 w-5">
        <Sun
          className={cn(
            "absolute h-5 w-5 transition-all duration-300 origin-center",
            isDark
              ? "opacity-0 -rotate-90 scale-75"
              : "opacity-100 rotate-0 scale-100 text-gray-800"
          )}
        />
        <Moon
          className={cn(
            "absolute h-5 w-5 transition-all duration-300 origin-center",
            isDark
              ? "opacity-100 rotate-0 scale-100 text-yellow-300"
              : "opacity-0 rotate-90 scale-75"
          )}
        />
      </div>
    </button>
  );
}
