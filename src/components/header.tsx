"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-baskerville font-bold text-foreground tracking-tight">
              MARQUET
              <br />
              <span className="text-sm font-montserrat font-light tracking-[0.2em] text-muted-foreground">
                MEDIA
              </span>
            </h1>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-foreground font-montserrat font-medium hover:text-primary transition-colors"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-muted-foreground font-montserrat font-medium hover:text-primary transition-colors"
            >
              About Us
            </a>
            <a
              href="#portfolio"
              className="text-muted-foreground font-montserrat font-medium hover:text-primary transition-colors"
            >
              Portfolio
            </a>
          </div>

          {/* CTA and Theme Toggle */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="w-9 h-9"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              className="bg-primary text-primary-foreground font-montserrat font-medium px-6 py-2 rounded-none hover:bg-primary/90 transition-all"
            >
              Contact Us
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
