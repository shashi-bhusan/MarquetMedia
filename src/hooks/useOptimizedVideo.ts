'use client';

import { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import { advancedVideoOptimizer } from '@/lib/advanced-video-optimizer';
import { videoPreloadingService } from '@/lib/video-preloading-service';

interface UseOptimizedVideoOptions {
  publicId: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  context?: 'hero' | 'portfolio' | 'background';
  quality?: 'auto:low' | 'auto:good' | 'auto:best' | 'auto:eco';
  chunkLoading?: boolean;
  adaptiveBitrate?: boolean;
  preloadStrategy?: 'aggressive' | 'balanced' | 'conservative';
  trackInteractions?: boolean;
  fallbackSrc?: string;
}

interface VideoState {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  loadProgress: number;
  currentQuality: string;
  bufferHealth: number;
  retryCount: number;
  performanceMetrics: any;
}

interface VideoControls {
  play: () => Promise<void>;
  pause: () => void;
  retry: () => void;
  switchQuality: (quality: string) => void;
  getCurrentTime: () => number;
  setCurrentTime: (time: number) => void;
  getPlaybackRate: () => number;
  setPlaybackRate: (rate: number) => void;
}

export function useOptimizedVideo({
  publicId,
  priority = 'medium',
  context = 'portfolio',
  quality = 'auto:good',
  chunkLoading = true,
  adaptiveBitrate = true,
  preloadStrategy = 'balanced',
  trackInteractions = true,
  fallbackSrc
}: UseOptimizedVideoOptions) {
  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const interactionStartTime = useRef<number>(0);
  const performanceRef = useRef<any>({});
  const retryTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // State
  const [state, setState] = useState<VideoState>({
    isLoading: true,
    isLoaded: false,
    hasError: false,
    loadProgress: 0,
    currentQuality: quality,
    bufferHealth: 0,
    retryCount: 0,
    performanceMetrics: {}
  });

  // Memoized optimized URL
  const optimizedUrl = useMemo(() => {
    if (!publicId) return fallbackSrc || '';
    
    return advancedVideoOptimizer.getOptimizedVideoUrl(publicId, {
      quality: state.currentQuality as any,
      adaptiveBitrate,
      width: window.innerWidth < 768 ? 480 : window.innerWidth < 1024 ? 768 : 1920,
      height: window.innerWidth < 768 ? 854 : window.innerWidth < 1024 ? 1024 : 1080
    });
  }, [publicId, state.currentQuality, adaptiveBitrate, fallbackSrc]);

  // Update state helper
  const updateState = useCallback((updates: Partial<VideoState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Performance tracking
  const trackPerformance = useCallback((metrics: any) => {
    performanceRef.current = { ...performanceRef.current, ...metrics };
    updateState({ performanceMetrics: performanceRef.current });
  }, [updateState]);

  // Video event handlers
  const handleLoadStart = useCallback(() => {
    updateState({ isLoading: true, hasError: false });
    trackPerformance({ loadStartTime: Date.now() });
  }, [updateState, trackPerformance]);

  const handleCanPlay = useCallback(() => {
    updateState({ isLoaded: true, isLoading: false });
    trackPerformance({ 
      canPlayTime: Date.now(),
      loadDuration: Date.now() - (performanceRef.current.loadStartTime || 0)
    });
  }, [updateState, trackPerformance]);

  const handleProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.buffered.length === 0) return;

    const buffered = video.buffered.end(video.buffered.length - 1);
    const duration = video.duration || 0;
    const progress = duration ? (buffered / duration) * 100 : 0;
    const bufferHealth = buffered - video.currentTime;
    
    updateState({ loadProgress: progress, bufferHealth });
    trackPerformance({ bufferHealth, loadProgress: progress });
  }, [updateState, trackPerformance]);

  const handleError = useCallback(() => {
    updateState({ hasError: true, isLoading: false });
    
    // Auto-retry with lower quality
    if (state.retryCount < 2) {
      const lowerQualities = ['auto:best', 'auto:good', 'auto:low', 'auto:eco'];
      const currentIndex = lowerQualities.indexOf(state.currentQuality);
      const nextQuality = lowerQualities[Math.min(currentIndex + 1, lowerQualities.length - 1)];
      
      retryTimeoutRef.current = setTimeout(() => {
        updateState({ 
          currentQuality: nextQuality,
          hasError: false,
          retryCount: state.retryCount + 1
        });
      }, 1000);
    }
    
    trackPerformance({ errorTime: Date.now(), retryCount: state.retryCount });
  }, [state.retryCount, state.currentQuality, updateState, trackPerformance]);

  const handlePlay = useCallback(() => {
    interactionStartTime.current = Date.now();
    trackPerformance({ playStartTime: Date.now() });
  }, [trackPerformance]);

  const handlePause = useCallback(() => {
    if (trackInteractions && interactionStartTime.current > 0) {
      const viewTime = Date.now() - interactionStartTime.current;
      const video = videoRef.current;
      
      if (video) {
        videoPreloadingService.trackVideoInteraction(publicId, {
          viewTime,
          totalDuration: video.duration * 1000,
          skipped: viewTime < (video.duration * 1000 * 0.1), // Skipped if < 10% watched
          quality: state.currentQuality
        });
      }
    }
  }, [publicId, state.currentQuality, trackInteractions]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const buffered = video.buffered.length > 0 ? video.buffered.end(video.buffered.length - 1) : 0;
    updateState({ bufferHealth: buffered - video.currentTime });
  }, [updateState]);

  // Video controls
  const controls: VideoControls = useMemo(() => ({
    play: async () => {
      const video = videoRef.current;
      if (!video) return;
      
      try {
        await video.play();
        handlePlay();
      } catch (error) {
        console.warn('Play failed:', error);
      }
    },
    
    pause: () => {
      const video = videoRef.current;
      if (!video) return;
      
      video.pause();
      handlePause();
    },
    
    retry: () => {
      updateState({ 
        hasError: false, 
        retryCount: state.retryCount + 1,
        isLoading: true 
      });
      
      const video = videoRef.current;
      if (video) {
        video.load();
      }
    },
    
    switchQuality: (newQuality: string) => {
      const video = videoRef.current;
      if (!video) return;
      
      const currentTime = video.currentTime;
      updateState({ currentQuality: newQuality });
      
      // Preserve playback position
      video.addEventListener('loadedmetadata', () => {
        video.currentTime = currentTime;
      }, { once: true });
    },
    
    getCurrentTime: () => videoRef.current?.currentTime || 0,
    setCurrentTime: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },
    
    getPlaybackRate: () => videoRef.current?.playbackRate || 1,
    setPlaybackRate: (rate: number) => {
      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
      }
    }
  }), [state.retryCount, updateState, handlePlay, handlePause]);

  // Initialize video optimization
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !publicId) return;

    // Register with advanced optimizer
    advancedVideoOptimizer.observeVideo(video, publicId);
    
    // Setup chunked loading if enabled
    if (chunkLoading) {
      advancedVideoOptimizer.loadVideoInChunks(publicId, video, {
        quality: state.currentQuality,
        preloadChunks: priority === 'critical' ? 5 : 3
      });
    }
    
    // Enable adaptive bitrate if requested
    if (adaptiveBitrate) {
      advancedVideoOptimizer.enableAdaptiveBitrate(video, publicId);
    }
    
    return () => {
      advancedVideoOptimizer.unobserveVideo(video);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [publicId, chunkLoading, adaptiveBitrate, priority, state.currentQuality]);

  // Preload related videos based on strategy
  useEffect(() => {
    if (priority === 'critical') {
      videoPreloadingService.preloadCriticalVideos([publicId]);
    } else if (preloadStrategy === 'aggressive') {
      videoPreloadingService.preloadInViewport();
    }
  }, [publicId, priority, preloadStrategy]);

  // Attach event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('error', handleError);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('error', handleError);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [handleLoadStart, handleCanPlay, handleProgress, handleError, handleTimeUpdate]);

  // Return video element props and controls
  const videoProps = useMemo(() => ({
    ref: videoRef,
    src: optimizedUrl,
    'data-public-id': publicId,
    'data-context': context,
    onLoadStart: handleLoadStart,
    onCanPlay: handleCanPlay,
    onProgress: handleProgress,
    onError: handleError,
    onTimeUpdate: handleTimeUpdate,
    onPlay: handlePlay,
    onPause: handlePause
  }), [
    optimizedUrl,
    publicId,
    context,
    handleLoadStart,
    handleCanPlay,
    handleProgress,
    handleError,
    handleTimeUpdate,
    handlePlay,
    handlePause
  ]);

  return {
    videoProps,
    state,
    controls,
    optimizedUrl,
    performanceStats: performanceRef.current
  };
}

// Hook for batch video optimization
export function useBatchVideoOptimization(
  videos: Array<{
    publicId: string;
    priority?: 'critical' | 'high' | 'medium' | 'low';
    context?: 'hero' | 'portfolio' | 'background';
  }>
) {
  const [batchState, setBatchState] = useState({
    totalVideos: videos.length,
    loadedVideos: 0,
    failedVideos: 0,
    overallProgress: 0
  });

  useEffect(() => {
    const preloadBatch = async () => {
      try {
        const videosWithDefaults = videos.map(video => ({
          ...video,
          priority: video.priority || 'medium' as const,
          context: video.context || 'portfolio' as const
        }));
        
        await videoPreloadingService.preloadVideos(videosWithDefaults);
        setBatchState(prev => ({ 
          ...prev, 
          loadedVideos: videos.length,
          overallProgress: 100 
        }));
      } catch (error) {
        console.error('Batch preload failed:', error);
        setBatchState(prev => ({ 
          ...prev, 
          failedVideos: videos.length - prev.loadedVideos 
        }));
      }
    };

    if (videos.length > 0) {
      preloadBatch();
    }
  }, [videos]);

  return batchState;
}

// Hook for performance monitoring
export function useVideoPerformanceMonitor() {
  const [performanceStats, setPerformanceStats] = useState<any>({});

  useEffect(() => {
    const updateStats = () => {
      const stats = {
        optimizer: advancedVideoOptimizer.getCacheStats(),
        preloader: videoPreloadingService.getPerformanceStats()
      };
      setPerformanceStats(stats);
    };

    // Update stats every 5 seconds
    const interval = setInterval(updateStats, 5000);
    updateStats(); // Initial update

    return () => clearInterval(interval);
  }, []);

  return performanceStats;
}

export default useOptimizedVideo;
