'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useImageCache } from '@/hooks/useImageCache';

interface OptimizedThemeImageProps {
  lightSrc: string;
  darkSrc: string;
  isDarkMode: boolean;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  preloadBoth?: boolean;
}

const OptimizedThemeImage = ({
  lightSrc,
  darkSrc,
  isDarkMode,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  onLoad,
  onError,
  preloadBoth = true
}: OptimizedThemeImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { imageUrl, isLoading } = useImageCache({
    lightImage: lightSrc,
    darkImage: darkSrc,
    isDarkMode,
    preloadBoth
  });

  const handleLoad = () => {
    console.log("first")
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    console.error(`Failed to load image: ${imageUrl}`);
    setImageError(true);
    onError?.();
  };

  return (
    <div className="relative">
      {/* Loading shimmer effect */}
      {(isLoading || !imageLoaded) && !imageError && (
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-foreground/5 via-foreground/10 to-foreground/5 animate-pulse ${className}`}
          style={{ width, height }}
        />
      )}

      {/* Main image */}
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          imageLoaded && !imageError ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        priority={priority}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        quality={90}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />

      {/* Error fallback */}
      {imageError && (
        <div 
          className={`flex items-center justify-center bg-foreground/5 border border-foreground/10 ${className}`}
          style={{ width, height }}
        >
          <span className="text-xs text-foreground/40">Failed to load</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedThemeImage;
