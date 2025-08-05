'use client';

import { Moon, Sun, Monitor, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { useState, useRef, useEffect } from "react";

interface ThemeToggleProps {
  size?: "sm" | "default" | "lg";
  className?: string;
  variant?: "button" | "dropdown";
}

export function ThemeToggle({ 
  size = "default",
  className = "",
  variant = "button"
}: ThemeToggleProps) {
  const { 
    isDarkMode, 
    mounted, 
    toggleTheme, 
    setLightTheme, 
    setDarkTheme, 
    setSystemTheme,
    theme,
    getThemeLabel,
    isSystemSupported
  } = useThemeToggle();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent hydration mismatch by showing a placeholder during SSR
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`w-9 h-9 rounded-full border border-border/30 text-foreground ${className}`}
        disabled
      >
        <div className="h-4 w-4" />
        <span className="sr-only">Loading theme toggle...</span>
      </Button>
    );
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
    }
  };

  const handleThemeSelect = (newTheme: 'light' | 'dark' | 'system') => {
    switch (newTheme) {
      case 'light':
        setLightTheme();
        break;
      case 'dark':
        setDarkTheme();
        break;
      case 'system':
        setSystemTheme();
        break;
    }
    setIsDropdownOpen(false);
  };

  if (variant === "dropdown") {
    return (
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-9 h-9 rounded-full border border-border/30 text-foreground hover:bg-foreground/10 hover:border-foreground/50 transition-all duration-300 ${className}`}
        >
          <div className="relative">
            {getThemeIcon()}
            {theme === 'system' && (
              <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />
            )}
          </div>
          <span className="sr-only">Toggle theme - Current: {getThemeLabel()}</span>
        </Button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 min-w-[140px] bg-background border border-border/20 rounded-lg shadow-lg z-50 overflow-hidden">
            <button
              onClick={() => handleThemeSelect('light')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
            >
              <Sun className="h-4 w-4" />
              <span>Light</span>
            </button>
            
            <button
              onClick={() => handleThemeSelect('dark')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
            >
              <Moon className="h-4 w-4" />
              <span>Dark</span>
            </button>
            
            {isSystemSupported && (
              <button
                onClick={() => handleThemeSelect('system')}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
              >
                <Monitor className="h-4 w-4" />
                <span>System</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`w-9 h-9 rounded-full border border-border/30 text-foreground hover:bg-foreground/10 hover:border-foreground/50 transition-all duration-300 ${className}`}
      title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
    >
      <div className="relative">
        {getThemeIcon()}
        {theme === 'system' && (
          <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />
        )}
      </div>
      <span className="sr-only">Toggle theme - Current: {getThemeLabel()}</span>
    </Button>
  );
}
