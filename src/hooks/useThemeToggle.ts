'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useThemeToggle() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted ? resolvedTheme === 'dark' : false;
  
  const toggleTheme = () => {
    // Cycle through: light -> dark -> system
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');
  const setSystemTheme = () => setTheme('system');

  // Get human-readable theme name
  const getThemeLabel = () => {
    if (!mounted) return 'Loading...';
    
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return `System (${systemTheme === 'dark' ? 'Dark' : 'Light'})`;
      default:
        return 'Unknown';
    }
  };

  // Check if system theme is available
  const isSystemSupported = typeof window !== 'undefined' && 
    window.matchMedia && 
    window.matchMedia('(prefers-color-scheme: dark)').media !== 'not all';

  return {
    theme,
    resolvedTheme,
    systemTheme,
    isDarkMode,
    mounted,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    setTheme,
    getThemeLabel,
    isSystemSupported,
  };
}
