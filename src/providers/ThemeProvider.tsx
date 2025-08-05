'use client';

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ 
  children,
  ...props 
}: { 
  children: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange={false}
      storageKey="darkMode" // Match legacy localStorage key for backwards compatibility
      themes={['light', 'dark', 'system']}
      forcedTheme={undefined}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
