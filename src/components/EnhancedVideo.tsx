'use client';

import React, { useState, useRef, useEffect, useMemo, memo, useCallback } from 'react';
import { advancedVideoOptimizer } from '@/lib/advanced-video-optimizer';
import assetMapping from '@/lib/asset-mapping.json';

interface EnhancedVideoProps {
  src: string;
  publicId?: string;
  className?: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  quality?: 'auto:low' | 'auto:good' | 'auto:best' | 'auto:eco';
  chunkLoading?: boolean;
  adaptiveBitrate?: boolean;
  priority?: 'critical' | 'high' | 'low';
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
  onPerformanceUpdate?: (metrics: any) => void;
  fallbackComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  style?: React.CSSProperties;
}

// Memoized loading component
const DefaultLoadingComponent = memo(() => (
  <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-sm">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-r-white/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
      </div>
      <p className="text-white/80 text-sm font-medium">Optimizing video...</p>
    </div>
  </div>
));

DefaultLoadingComponent.displayName = 'DefaultLoadingComponent';

// Enhanced video component with industry-standard optimizations
export const EnhancedVideo = memo<EnhancedVideoProps>(({
  src,
  publicId: propPublicId,
  className = '',
  poster,
  autoPlay = false,
  muted = true,
  loop = true,
  playsInline = true,
  controls = false,
  preload = 'metadata',
  quality = 'auto:good',
  chunkLoading = true,
  adaptiveBitrate = true,
  priority = 'high',
  onLoadStart,
  onCanPlay,
  onProgress,
  onError,
  onPerformanceUpdate,
  fallbackComponent,
  loadingComponent,
  style,
  ...props
}) => {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const performanceRef = useRef<{ startTime: number; metrics: any }>({
    startTime: Date.now(),
    metrics: {}
  });

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [currentQuality, setCurrentQuality] = useState(quality);
  const [bufferHealth, setBufferHealth] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Memoized values
  const publicId = useMemo(() => {
    if (propPublicId) return propPublicId;
    
    // Extract from src path
    const filename = src.split('/').pop()?.replace(/\.(mp4|mov|webm)$/i, '') || '';
    return assetMapping.videos[filename as keyof typeof assetMapping.videos] || null;
  }, [propPublicId, src]);

  const optimizedVideoUrl = useMemo(() => {
    if (!publicId) return src;
    
    return advancedVideoOptimizer.getOptimizedVideoUrl(publicId, {
      quality: currentQuality,
      adaptiveBitrate,
      width: window.innerWidth < 768 ? 480 : window.innerWidth < 1024 ? 768 : 1920,
      height: window.innerWidth < 768 ? 854 : window.innerWidth < 1024 ? 1024 : 1080
    });
  }, [publicId, src, currentQuality, adaptiveBitrate]);

  const posterUrl = useMemo(() => {
    if (poster) return poster;
    
    // Try to get poster from src first
    if (src) {
      const filename = src.split('/').pop()?.replace(/\.(mp4|mov|webm)$/i, '') || '';
      
      // Check for reel thumbnails
      if (filename.startsWith('reel-')) {
        return `/thumbnails/reels/${filename}.jpg`;
      }
      
      // Check for main video thumbnail
      if (filename === 'marquetmedia') {
        return `/thumbnails/hero/marquetmedia.jpg`;
      }
      
      // Check for BTS thumbnails
      const btsNames = ['C0442', 'IMG_0038', 'IMG_0160', 'IMG_0397', 'IMG_1770', 'IMG_2538', 'IMG_3287', 'IMG_3288', 'IMG_7721'];
      if (btsNames.includes(filename)) {
        return `/thumbnails/bts/${filename}.jpg`;
      }
    }
    
    // Fallback to asset mapping
    if (!publicId) return undefined;
    return assetMapping.posters[publicId as keyof typeof assetMapping.posters];
  }, [poster, src, publicId]);

  // Performance monitoring
  const updatePerformanceMetrics = useCallback((updates: any) => {
    performanceRef.current.metrics = {
      ...performanceRef.current.metrics,
      ...updates,
      totalTime: Date.now() - performanceRef.current.startTime
    };
    
    onPerformanceUpdate?.(performanceRef.current.metrics);
  }, [onPerformanceUpdate]);

  // Video event handlers
  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    updatePerformanceMetrics({ loadStartTime: Date.now() });
    onLoadStart?.();
  }, [onLoadStart, updatePerformanceMetrics]);

  const handleCanPlay = useCallback(() => {
    setIsLoaded(true);
    setIsLoading(false);
    updatePerformanceMetrics({
      canPlayTime: Date.now(),
      loadDuration: Date.now() - performanceRef.current.startTime
    });
    onCanPlay?.();
  }, [onCanPlay, updatePerformanceMetrics]);

  const handleProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.buffered.length === 0) return;

    const buffered = video.buffered.end(video.buffered.length - 1);
    const duration = video.duration || 0;
    const progress = duration ? (buffered / duration) * 100 : 0;
    
    setLoadProgress(progress);
    setBufferHealth(buffered - video.currentTime);
    
    updatePerformanceMetrics({
      bufferHealth: buffered - video.currentTime,
      loadProgress: progress
    });
    
    onProgress?.(progress);
  }, [onProgress, updatePerformanceMetrics]);

  const handleError = useCallback((event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const error = new Error(`Video load failed: ${event.type}`);
    setHasError(true);
    setIsLoading(false);
    
    updatePerformanceMetrics({
      errorTime: Date.now(),
      errorType: event.type,
      retryCount
    });
    
    // Auto-retry with fallback quality
    if (retryCount < 2 && currentQuality !== 'auto:low') {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setCurrentQuality('auto:low');
        setHasError(false);
      }, 1000);
    } else {
      onError?.(error);
    }
  }, [onError, retryCount, currentQuality, updatePerformanceMetrics]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Update buffer health for adaptive bitrate
    const buffered = video.buffered.length > 0 ? video.buffered.end(video.buffered.length - 1) : 0;
    setBufferHealth(buffered - video.currentTime);
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !publicId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
          
          if (entry.isIntersecting) {
            // Video is visible, prioritize loading
            advancedVideoOptimizer.observeVideo(video, publicId);
            
            // Enable chunked loading if supported
            if (chunkLoading && publicId) {
              advancedVideoOptimizer.loadVideoInChunks(publicId, video, {
                quality: currentQuality,
                preloadChunks: priority === 'critical' ? 5 : 3
              });
            }
          } else {
            // Video is not visible, reduce priority
            if (autoPlay && !video.paused) {
              video.pause();
            }
          }
        });
      },
      {
        threshold: [0.1, 0.5, 0.9],
        rootMargin: priority === 'critical' ? '200px' : '100px'
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      advancedVideoOptimizer.unobserveVideo(video);
    };
  }, [publicId, chunkLoading, currentQuality, priority, autoPlay]);

  // Adaptive bitrate monitoring
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !adaptiveBitrate || !publicId) return;

    advancedVideoOptimizer.enableAdaptiveBitrate(video, publicId);
  }, [adaptiveBitrate, publicId]);

  // Auto-play when visible (if enabled)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay || !isVisible || !isLoaded) return;

    const playVideo = async () => {
      try {
        await video.play();
        updatePerformanceMetrics({ autoPlaySuccess: true });
      } catch (error) {
        console.warn('Auto-play prevented:', error);
        updatePerformanceMetrics({ autoPlayBlocked: true });
      }
    };

    playVideo();
  }, [autoPlay, isVisible, isLoaded, updatePerformanceMetrics]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (video) {
        advancedVideoOptimizer.unobserveVideo(video);
      }
    };
  }, []);

  // Error boundary fallback
  if (hasError && retryCount >= 2) {
    return (
      <div ref={containerRef} className={`relative ${className}`} style={style}>
        {fallbackComponent || (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <p className="text-lg mb-2">Video unavailable</p>
              <p className="text-sm">Please check your connection and try again</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`} style={style}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={optimizedVideoUrl}
        poster={posterUrl}
        autoPlay={false} // Controlled by intersection observer
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        controls={controls}
        preload={preload}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onProgress={handleProgress}
        onError={handleError}
        onTimeUpdate={handleTimeUpdate}
        style={{
          transition: 'opacity 0.5s ease-in-out',
          opacity: isLoaded ? 1 : 0
        }}
        {...props}
      />

      {/* Loading State */}
      {isLoading && !hasError && (
        <>
          {loadingComponent || <DefaultLoadingComponent />}
          
          {/* Progress indicator */}
          {loadProgress > 0 && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/50 rounded-full p-2 backdrop-blur-sm">
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white/80 rounded-full transition-all duration-300"
                    style={{ width: `${loadProgress}%` }}
                  />
                </div>
                <p className="text-white/80 text-xs mt-1 text-center">
                  Loading {Math.round(loadProgress)}%
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Development Quality Badge */}
      {process.env.NODE_ENV === 'development' && isLoaded && (
        <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          <div className="space-y-1">
            <div>Quality: {currentQuality}</div>
            <div>Buffer: {bufferHealth.toFixed(1)}s</div>
            <div>Progress: {loadProgress.toFixed(0)}%</div>
            {retryCount > 0 && <div>Retries: {retryCount}</div>}
          </div>
        </div>
      )}

      {/* Buffer Health Indicator (Development) */}
      {process.env.NODE_ENV === 'development' && isLoaded && (
        <div className="absolute bottom-4 right-4">
          <div className={`w-3 h-3 rounded-full ${
            bufferHealth > 5 ? 'bg-green-500' : 
            bufferHealth > 2 ? 'bg-yellow-500' : 
            'bg-red-500'
          }`} />
        </div>
      )}
    </div>
  );
});

EnhancedVideo.displayName = 'EnhancedVideo';

export default EnhancedVideo;
