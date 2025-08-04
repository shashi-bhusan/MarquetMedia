'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface OptimizedVideoPlayerProps {
  src: string;
  className?: string;
  onCanPlay?: () => void;
  onError?: () => void;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
}

export const OptimizedVideoPlayer = ({
  src,
  className = '',
  onCanPlay,
  onError,
  poster,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  preload = 'metadata'
}: OptimizedVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isSubscribed = true;

    // Enhanced performance optimizations
    const handleCanPlay = () => {
      if (!isSubscribed) return;
      setIsLoaded(true);
      onCanPlay?.();
      
      // Enhanced fade in with scale animation
      gsap.fromTo(video, 
        { 
          opacity: 0, 
          scale: 1.05,
          filter: "blur(8px)" 
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power3.out"
        }
      );
    };

    const handleError = (e: Event) => {
      if (!isSubscribed) return;
      console.warn('Video loading error:', e);
      setHasError(true);
      onError?.();
    };

    const handleLoadStart = () => {
      if (!isSubscribed) return;
      // Set initial state
      gsap.set(video, { opacity: 0 });
    };

    // Event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);

    // Intersection Observer for performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isLoaded) {
            video.play().catch(console.warn);
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    return () => {
      isSubscribed = false;
      observer.disconnect();
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [onCanPlay, onError, isLoaded]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className={`${className} transition-opacity duration-800`}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload={preload}
        poster={poster}
        style={{
          willChange: isLoaded ? 'auto' : 'opacity',
          opacity: 0
        }}
      >
        <source src={src} type="video/mp4" />
        <source src={src.replace('.mp4', '.webm')} type="video/webm" />
      </video>

      {/* Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-white/60 text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-center text-white/60">
            <p className="text-lg mb-2">Video unavailable</p>
            <p className="text-sm">Please check your connection</p>
          </div>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none"></div>
    </div>
  );
};

export default OptimizedVideoPlayer;
