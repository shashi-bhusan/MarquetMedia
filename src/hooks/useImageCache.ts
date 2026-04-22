'use client';

import { useCallback, useEffect, useMemo } from 'react';

interface UseImageCacheProps {
  lightImage: string;
  darkImage: string;
  isDarkMode: boolean;
  preloadBoth?: boolean;
}

/**
 * Resolves light/dark image URLs for theme switching.
 * Note: We intentionally do not rewrite `src` to `blob:` URLs — `next/image`
 * must receive normal paths or https URLs so the optimizer and static
 * file serving work correctly.
 */
export function useImageCache({
  lightImage,
  darkImage,
  isDarkMode,
  preloadBoth = true,
}: UseImageCacheProps) {
  const currentImage = isDarkMode ? darkImage : lightImage;

  const preloadBothThemes = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const urls = [lightImage, darkImage].filter(Boolean);
    await Promise.all(
      urls.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = src;
          })
      )
    );
  }, [lightImage, darkImage]);

  useEffect(() => {
    if (preloadBoth) {
      void preloadBothThemes();
    }
  }, [preloadBoth, preloadBothThemes]);

  return useMemo(
    () => ({
      imageUrl: currentImage,
      isLoading: false,
      preloadBothThemes,
    }),
    [currentImage, preloadBothThemes]
  );
}

export function useImageBatchPreloader() {
  const preloadImages = useCallback(async (urls: string[]) => {
    if (typeof window === 'undefined') return;
    await Promise.all(
      urls.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = src;
          })
      )
    );
  }, []);

  return { preloadImages };
}
