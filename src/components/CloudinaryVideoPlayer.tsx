'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { getOptimizedVideoUrl, getOptimizedPosterUrl, getResponsiveVideoSources } from '@/lib/cloudinary-config';

interface CloudinaryVideoPlayerProps {
  publicId: string;
  className?: string;
  onCanPlay?: () => void;
  onError?: () => void;
  optimizationType?: 'hero' | 'portfolio' | 'bts' | 'poster';
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  showControls?: boolean;
  responsive?: boolean;
}

export const CloudinaryVideoPlayer = ({
  publicId,
  className = '',
  onCanPlay,
  onError,
  optimizationType = 'portfolio',
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  preload = 'metadata',
  showControls = false,
  responsive = true
}: CloudinaryVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Get optimized video sources
  const videoSources = responsive 
    ? getResponsiveVideoSources(publicId, optimizationType)
    : [{ src: getOptimizedVideoUrl(publicId, optimizationType), type: 'video/mp4' }];
  
  const posterUrl = getOptimizedPosterUrl(publicId);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isSubscribed = true;

    const handleCanPlay = () => {
      if (!isSubscribed) return;
      setIsLoaded(true);
      onCanPlay?.();
      
      // Enhanced entrance animation
      gsap.fromTo(containerRef.current, 
        { 
          opacity: 0, 
          scale: 1.05,
          filter: "blur(10px)" 
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.8,
          ease: "power3.out"
        }
      );
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      if (!isSubscribed) return;
      setHasError(true);
      onError?.();
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        if (duration) {
          const progress = (bufferedEnd / duration) * 100;
          setLoadingProgress(progress);
        }
      }
    };

    const handleLoadStart = () => {
      gsap.set(containerRef.current, { opacity: 0 });
    };

    // Intersection Observer for performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isPlaying && !hasError) {
            video.play().catch(() => {
              console.log('Video autoplay was prevented');
            });
          } else if (!entry.isIntersecting && isPlaying) {
            video.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(video);

    // Event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('loadstart', handleLoadStart);

    return () => {
      isSubscribed = false;
      observer.disconnect();
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [isPlaying, hasError, onCanPlay, onError]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={posterUrl}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        autoPlay={autoPlay}
        preload={preload}
        controls={showControls}
        controlsList="nodownload nofullscreen noremoteplaybook"
        disablePictureInPicture
      >
        {videoSources.map((source, index) => (
          <source 
            key={index}
            src={source.src}
            type={source.type}
            {...(('media' in source) && { media: source.media })}
          />
        ))}
        
        {/* Fallback for browsers that don't support video */}
        <div className="flex items-center justify-center h-full bg-foreground/5">
          <p className="text-foreground/60 text-center">
            Your browser does not support video playback.
          </p>
        </div>
      </video>

      {/* Loading Overlay */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            {/* Enhanced Loading Spinner */}
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-2 border-foreground/10 rounded-full" />
              <div className="absolute inset-0 border-2 border-transparent border-t-foreground/60 rounded-full animate-spin" />
            </div>
            
            {/* Loading Text */}
            <p className="text-sm text-foreground/60 font-montserrat">Loading high-quality video...</p>
            
            {/* Progress Bar */}
            {loadingProgress > 0 && (
              <div className="w-32 h-1 bg-foreground/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-foreground/40 rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto mb-4 text-foreground/40">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-foreground/60 font-montserrat">Unable to load video</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-foreground/80 hover:text-foreground underline font-montserrat"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Quality Badge (Development only) */}
      {process.env.NODE_ENV === 'development' && isLoaded && (
        <div className="absolute top-4 right-4 text-xs bg-black/50 text-white px-2 py-1 rounded">
          {optimizationType} | Cloudinary
        </div>
      )}
    </div>
  );
};
