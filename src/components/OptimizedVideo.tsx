'use client';

import { useState, useRef, useEffect, forwardRef } from 'react';
import { CldVideoPlayer } from 'next-cloudinary';
import assetMapping from '@/lib/asset-mapping.json';

interface OptimizedVideoProps {
  src: string; // Original local src
  className?: string;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  autoPlay?: boolean;
  preload?: string;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onLoadedData?: () => void;
  onCanPlay?: () => void;
  onTimeUpdate?: () => void;
  children?: React.ReactNode;
}

const getCloudinaryPublicId = (localSrc: string): string | null => {
  // Extract filename from local src (e.g., "/reel-1.mp4" -> "reel-1")
  const filename = localSrc.split('/').pop()?.replace(/\.(mp4|mov|webm)$/i, '') || '';
  return assetMapping.videos[filename as keyof typeof assetMapping.videos] || null;
};

const getPosterUrl = (localSrc: string): string | undefined => {
  const filename = localSrc.split('/').pop()?.replace(/\.(mp4|mov|webm)$/i, '') || '';
  
  // Check for reel thumbnails
  if (filename.startsWith('reel-')) {
    return `/thumbnails/reels/${filename}.jpg`;
  }
  
  // Check for main video thumbnail
  if (filename === 'marquetmedia') {
    return `/thumbnails/hero/marquetmedia.jpg`;
  }
  
  // Check for BTS thumbnails (uppercase extensions in file list)
  const btsNames = ['C0442', 'IMG_0038', 'IMG_0160', 'IMG_0397', 'IMG_1770', 'IMG_2538', 'IMG_3287', 'IMG_3288', 'IMG_7721'];
  if (btsNames.includes(filename)) {
    return `/thumbnails/bts/${filename}.jpg`;
  }
  
  return undefined;
};

// Improved quality settings - prioritize quality over file size
const getDeviceQuality = () => {
  if (typeof window === 'undefined') return 'auto:best';
  const width = window.innerWidth;
  if (width < 768) return 'auto:good';     // Improved: good instead of low for mobile
  if (width < 1024) return 'auto:best';    // Improved: best instead of good for tablet
  return 'auto:best';                      // Desktop stays best
};

export const OptimizedVideo = forwardRef<HTMLVideoElement, OptimizedVideoProps>(({
  src,
  className = '',
  loop = true,
  muted = true,
  playsInline = true,
  autoPlay = false,
  preload = 'metadata',
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onLoadedData,
  onCanPlay,
  onTimeUpdate,
  children,
  ...props
}, ref) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const publicId = getCloudinaryPublicId(src);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // If no Cloudinary mapping found, fallback to original video
  if (!publicId) {
    return (
      <div ref={containerRef} style={style}>
        <video
          ref={ref || videoRef}
          src={src}
          className={className}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          autoPlay={autoPlay}
          preload={preload}
          poster={getPosterUrl(src)}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
          onLoadedData={onLoadedData}
          onCanPlay={onCanPlay}
          onTimeUpdate={onTimeUpdate}
          {...props}
        >
          {children}
        </video>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={style}>
      {shouldLoad ? (
        <div 
          className={className}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
        >
          <CldVideoPlayer
            src={publicId}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            controls={false}
            playsinline={playsInline}
            transformation={{
              quality: 'auto:best',           // Force best quality for all devices
              fetch_format: 'auto',
              width: 1920,                    // Increased max width
              crop: 'limit'                   // Maintain aspect ratio
            }}
          />
        </div>
      ) : (
        <div className={`${className} bg-gray-100 flex items-center justify-center`}>
          <div className="animate-pulse text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      {children}
    </div>
  );
});

OptimizedVideo.displayName = 'OptimizedVideo';
