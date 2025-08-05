'use client';

import { useEffect, useCallback, useState } from 'react';

interface ImageCacheEntry {
  url: string;
  blob: Blob;
  objectURL: string;
  timestamp: number;
  accessCount: number;
}

interface UseImageCacheProps {
  lightImage: string;
  darkImage: string;
  isDarkMode: boolean;
  preloadBoth?: boolean;
}

class ImageCacheManager {
  private static instance: ImageCacheManager;
  private cache = new Map<string, ImageCacheEntry>();
  private maxCacheSize = 50; // Maximum number of cached images
  private maxAge = 30 * 60 * 1000; // 30 minutes

  static getInstance(): ImageCacheManager {
    if (!ImageCacheManager.instance) {
      ImageCacheManager.instance = new ImageCacheManager();
    }
    return ImageCacheManager.instance;
  }

  private constructor() {
    // Clean up cache periodically
    setInterval(() => this.cleanup(), 5 * 60 * 1000); // Every 5 minutes
  }

  async preloadImage(url: string): Promise<string> {
    // Return cached version if available
    const cached = this.cache.get(url);
    if (cached) {
      cached.accessCount++;
      cached.timestamp = Date.now();
      return cached.objectURL;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);
      
      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);
      
      const entry: ImageCacheEntry = {
        url,
        blob,
        objectURL,
        timestamp: Date.now(),
        accessCount: 1,
      };

      this.cache.set(url, entry);
      this.enforCacheSize();
      
      return objectURL;
    } catch (error) {
      console.error('Failed to preload image:', error);
      return url; // Fallback to original URL
    }
  }

  getCachedImage(url: string): string | null {
    const cached = this.cache.get(url);
    if (cached) {
      cached.accessCount++;
      cached.timestamp = Date.now();
      return cached.objectURL;
    }
    return null;
  }

  private enforCacheSize(): void {
    if (this.cache.size <= this.maxCacheSize) return;

    // Sort by access count and timestamp (LRU with frequency)
    const entries = Array.from(this.cache.entries()).sort((a, b) => {
      const scoreA = a[1].accessCount * 0.7 + (Date.now() - a[1].timestamp) * 0.3;
      const scoreB = b[1].accessCount * 0.7 + (Date.now() - b[1].timestamp) * 0.3;
      return scoreA - scoreB;
    });

    // Remove least frequently used entries
    const toRemove = entries.slice(0, this.cache.size - this.maxCacheSize + 5);
    toRemove.forEach(([url, entry]) => {
      URL.revokeObjectURL(entry.objectURL);
      this.cache.delete(url);
    });
  }

  private cleanup(): void {
    const now = Date.now();
    const toRemove: string[] = [];

    this.cache.forEach((entry, url) => {
      if (now - entry.timestamp > this.maxAge) {
        URL.revokeObjectURL(entry.objectURL);
        toRemove.push(url);
      }
    });

    toRemove.forEach(url => this.cache.delete(url));
  }

  // Preload both theme variants for smooth switching
  async preloadBothThemes(lightUrl: string, darkUrl: string): Promise<void> {
    try {
      await Promise.all([
        this.preloadImage(lightUrl),
        this.preloadImage(darkUrl)
      ]);
    } catch (error) {
      console.error('Failed to preload theme images:', error);
    }
  }
}

export function useImageCache({
  lightImage,
  darkImage,
  isDarkMode,
  preloadBoth = true
}: UseImageCacheProps) {
  const [cachedImageUrl, setCachedImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const cacheManager = ImageCacheManager.getInstance();

  const currentImage = isDarkMode ? darkImage : lightImage;

  const loadImage = useCallback(async (imageUrl: string) => {
    setIsLoading(true);
    
    // Check if already cached
    const cached = cacheManager.getCachedImage(imageUrl);
    if (cached) {
      setCachedImageUrl(cached);
      setIsLoading(false);
      return;
    }

    // Preload and cache the image
    try {
      const cachedUrl = await cacheManager.preloadImage(imageUrl);
      setCachedImageUrl(cachedUrl);
    } catch (error) {
      console.error('Failed to load image:', error);
      setCachedImageUrl(imageUrl); // Fallback to original URL
    } finally {
      setIsLoading(false);
    }
  }, [cacheManager]);

  // Preload both theme variants on mount
  useEffect(() => {
    if (preloadBoth) {
      cacheManager.preloadBothThemes(lightImage, darkImage);
    }
  }, [lightImage, darkImage, preloadBoth, cacheManager]);

  // Load current theme image
  useEffect(() => {
    loadImage(currentImage);
  }, [currentImage, loadImage]);

  return {
    imageUrl: cachedImageUrl || currentImage,
    isLoading,
    preloadBothThemes: () => cacheManager.preloadBothThemes(lightImage, darkImage)
  };
}

// Hook for batch preloading multiple images
export function useImageBatchPreloader() {
  const cacheManager = ImageCacheManager.getInstance();

  const preloadImages = useCallback(async (urls: string[]) => {
    try {
      await Promise.all(urls.map(url => cacheManager.preloadImage(url)));
    } catch (error) {
      console.error('Failed to batch preload images:', error);
    }
  }, [cacheManager]);

  return { preloadImages };
}
