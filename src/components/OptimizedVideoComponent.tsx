'use client';

import { memo, useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { advancedVideoOptimizer } from '@/lib/advanced-video-optimizer';
import { resourceManager } from '@/lib/resource-deduplication';

/**
 * Performance Monitoring and Memory Leak Prevention
 */
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private componentMetrics = new Map<string, any>();
  private renderCounts = new Map<string, number>();
  private memoryUsage: number[] = [];
  private leakDetector?: NodeJS.Timeout;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  constructor() {
    this.initializeMemoryMonitoring();
  }

  private initializeMemoryMonitoring() {
    if (typeof window === 'undefined') return;

    this.leakDetector = setInterval(() => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        this.memoryUsage.push(memInfo.usedJSHeapSize);
        
        // Keep only last 10 readings
        if (this.memoryUsage.length > 10) {
          this.memoryUsage.shift();
        }

        // Detect memory leaks
        this.detectMemoryLeaks();
      }
    }, 30000); // Check every 30 seconds
  }

  private detectMemoryLeaks() {
    if (this.memoryUsage.length < 5) return;

    const recent = this.memoryUsage.slice(-5);
    const isIncreasing = recent.every((val, i) => i === 0 || val > recent[i - 1]);
    
    if (isIncreasing) {
      console.warn('Potential memory leak detected');
      this.forceCleanup();
    }
  }

  private forceCleanup() {
    // Force cleanup of video optimizer
    advancedVideoOptimizer.destroy();
    
    // Clear resource manager cache
    resourceManager.clearStaleCache(0);
    
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
  }

  trackComponentRender(componentName: string) {
    const count = this.renderCounts.get(componentName) || 0;
    this.renderCounts.set(componentName, count + 1);
    
    // Warn about excessive renders
    if (count > 50) {
      console.warn(`Component ${componentName} has rendered ${count} times - possible performance issue`);
    }
  }

  trackVideoLoad(publicId: string, startTime: number) {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    this.componentMetrics.set(publicId, {
      loadTime,
      timestamp: Date.now()
    });
  }

  getMetrics() {
    return {
      renderCounts: Object.fromEntries(this.renderCounts),
      componentMetrics: Object.fromEntries(this.componentMetrics),
      memoryUsage: this.memoryUsage,
      resourceStats: resourceManager.getCacheStats()
    };
  }

  cleanup() {
    if (this.leakDetector) {
      clearInterval(this.leakDetector);
    }
    this.componentMetrics.clear();
    this.renderCounts.clear();
  }
}

const performanceMonitor = PerformanceMonitor.getInstance();

/**
 * Helper function to get poster URL from src or publicId
 */
const getPosterUrl = (publicId: string, src?: string): string | undefined => {
  // Try src first if available
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
  
  // Try publicId patterns
  if (publicId.startsWith('reel-')) {
    return `/thumbnails/reels/${publicId}.jpg`;
  }
  
  if (publicId === 'marquetmedia') {
    return `/thumbnails/hero/marquetmedia.jpg`;
  }
  
  const btsNames = ['C0442', 'IMG_0038', 'IMG_0160', 'IMG_0397', 'IMG_1770', 'IMG_2538', 'IMG_3287', 'IMG_3288', 'IMG_7721'];
  if (btsNames.includes(publicId)) {
    return `/thumbnails/bts/${publicId}.jpg`;
  }
  
  return undefined;
};

/**
 * Optimized Video Component with Deduplication and Memory Management
 */
interface OptimizedVideoProps {
  publicId: string;
  src?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  priority?: 'high' | 'medium' | 'low';
  enableChunking?: boolean;
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  onError?: (error: Error) => void;
}

export const OptimizedVideoComponent = memo<OptimizedVideoProps>(({
  publicId,
  src,
  className = '',
  autoPlay = false,
  muted = true,
  loop = false,
  playsInline = true,
  priority = 'medium',
  enableChunking = false,
  onLoadStart,
  onLoadComplete,
  onError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [loadStartTime] = useState(() => performance.now());
  const abortControllerRef = useRef<AbortController | null>(null);
  const isIntersectingRef = useRef(false);

  // Track component renders in development
  if (process.env.NODE_ENV === 'development') {
    performanceMonitor.trackComponentRender(`OptimizedVideo-${publicId}`);
  }

  // Memoize video source to prevent unnecessary re-fetching
  const videoSource = useMemo(() => {
    if (src) return src;
    
    return advancedVideoOptimizer.getOptimizedVideoUrl(publicId, {
      quality: priority === 'high' ? 'auto:best' : priority === 'medium' ? 'auto:good' : 'auto:eco',
      adaptiveBitrate: true
    });
  }, [publicId, src, priority]);

  // Memoized load function to prevent recreation on every render
  const loadVideo = useCallback(async () => {
    if (loadState === 'loaded' || loadState === 'loading') return;

    setLoadState('loading');
    onLoadStart?.();

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      if (enableChunking && videoRef.current) {
        // Use chunked loading for large videos
        await advancedVideoOptimizer.loadVideoInChunks(publicId, videoRef.current, {
          quality: priority === 'high' ? 'auto:best' : 'auto:good'
        });
      } else {
        // Use deduplicated fetch
        const response = await resourceManager.fetch(videoSource, {
          signal: abortControllerRef.current.signal
        });

        if (videoRef.current) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          videoRef.current.src = url;
        }
      }

      setLoadState('loaded');
      onLoadComplete?.();
      
      // Track performance
      performanceMonitor.trackVideoLoad(publicId, loadStartTime);
      
    } catch (error) {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoadState('error');
        onError?.(error as Error);
      }
    }
  }, [publicId, videoSource, enableChunking, priority, loadState, onLoadStart, onLoadComplete, onError, loadStartTime]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const wasIntersecting = isIntersectingRef.current;
        isIntersectingRef.current = entry.isIntersecting;

        if (entry.isIntersecting && !wasIntersecting) {
          // Start loading when video comes into view
          loadVideo();
          
          // Register with advanced optimizer
          advancedVideoOptimizer.observeVideo(video, publicId);
        } else if (!entry.isIntersecting && wasIntersecting) {
          // Unregister when out of view
          advancedVideoOptimizer.unobserveVideo(video);
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      advancedVideoOptimizer.unobserveVideo(video);
    };
  }, [publicId, loadVideo]);

  // Enable adaptive bitrate streaming for high priority videos
  useEffect(() => {
    const video = videoRef.current;
    if (!video || priority !== 'high' || loadState !== 'loaded') return;

    advancedVideoOptimizer.enableAdaptiveBitrate(video, publicId);
  }, [publicId, priority, loadState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Auto-play logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay || loadState !== 'loaded') return;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.warn('Autoplay failed:', error);
      }
    };

    if (isIntersectingRef.current) {
      playVideo();
    }
  }, [autoPlay, loadState]);

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        poster={getPosterUrl(publicId, src)}
        data-public-id={publicId}
      />

      {/* Loading State */}
      {loadState === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}

      {/* Error State */}
      {loadState === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-red-500 text-sm">Failed to load video</p>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.publicId === nextProps.publicId &&
    prevProps.src === nextProps.src &&
    prevProps.priority === nextProps.priority &&
    prevProps.enableChunking === nextProps.enableChunking
  );
});

OptimizedVideoComponent.displayName = 'OptimizedVideoComponent';

/**
 * Hook for batch video preloading
 */
export const useBatchVideoPreload = (videoIds: string[], strategy: 'viewport' | 'sequential' | 'predictive' = 'viewport') => {
  const [preloadStatus, setPreloadStatus] = useState<Record<string, 'pending' | 'loading' | 'loaded' | 'error'>>({});

  useEffect(() => {
    let mounted = true;

    const preloadVideos = async () => {
      // Initialize status
      const initialStatus = videoIds.reduce((acc, id) => ({ ...acc, [id]: 'pending' as const }), {});
      setPreloadStatus(initialStatus);

      try {
        await advancedVideoOptimizer.smartPreload(videoIds, strategy);
        
        if (mounted) {
          const loadedStatus = videoIds.reduce((acc, id) => ({ ...acc, [id]: 'loaded' as const }), {});
          setPreloadStatus(loadedStatus);
        }
      } catch (error) {
        if (mounted) {
          const errorStatus = videoIds.reduce((acc, id) => ({ ...acc, [id]: 'error' as const }), {});
          setPreloadStatus(errorStatus);
        }
      }
    };

    if (videoIds.length > 0) {
      preloadVideos();
    }

    return () => {
      mounted = false;
    };
  }, [videoIds, strategy]);

  return preloadStatus;
};

/**
 * Development Performance Dashboard
 */
export const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded text-sm z-50"
      >
        📊 Perf
      </button>

      {isVisible && (
        <div className="fixed bottom-16 right-4 bg-white shadow-lg rounded p-4 max-w-md max-h-96 overflow-auto z-50 text-xs">
          <h3 className="font-bold mb-2">Performance Metrics</h3>
          
          <div className="mb-2">
            <strong>Render Counts:</strong>
            <pre className="text-xs bg-gray-100 p-1 rounded mt-1">
              {JSON.stringify(metrics.renderCounts || {}, null, 2)}
            </pre>
          </div>

          <div className="mb-2">
            <strong>Resource Stats:</strong>
            <pre className="text-xs bg-gray-100 p-1 rounded mt-1">
              {JSON.stringify(metrics.resourceStats || {}, null, 2)}
            </pre>
          </div>

          <div>
            <strong>Memory Usage:</strong>
            <div className="text-xs">
              {metrics.memoryUsage?.slice(-3).map((usage: number, i: number) => (
                <div key={i}>{(usage / 1024 / 1024).toFixed(2)} MB</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OptimizedVideoComponent;
