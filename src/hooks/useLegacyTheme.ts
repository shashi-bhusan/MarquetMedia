'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * Legacy compatibility hook for components that haven't been migrated to next-themes yet.
 * This hook provides the old isDarkMode boolean interface while using next-themes under the hood.
 * 
 * @deprecated Use useThemeToggle() instead for new components
 */
export function useLegacyTheme() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted ? resolvedTheme === 'dark' : false;

  return {
    isDarkMode,
    mounted,
  };
}

/**
 * Modern theme hook that replaces manual localStorage management.
 * Provides compatibility with the existing theme system.
 */
export function useThemeSync() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync with legacy localStorage key for backwards compatibility
  useEffect(() => {
    if (!mounted) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'darkMode' && e.newValue !== null) {
        const isDark = e.newValue === 'true';
        setTheme(isDark ? 'dark' : 'light');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [mounted, setTheme]);

  const isDarkMode = mounted ? resolvedTheme === 'dark' : false;

  return {
    theme,
    resolvedTheme,
    systemTheme,
    isDarkMode,
    mounted,
    setTheme,
  };
}
