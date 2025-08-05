'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Resource Deduplication and Request Optimization
 * Prevents duplicate fetching and optimizes resource requests
 */

class ResourceDeduplicationManager {
  private static instance: ResourceDeduplicationManager;
  private pendingRequests = new Map<string, Promise<any>>();
  private requestCache = new Map<string, any>();
  private fetchQueue = new Map<string, { resolve: Function; reject: Function }[]>();
  private maxConcurrentRequests = 6;
  private activeRequests = new Set<string>();

  static getInstance(): ResourceDeduplicationManager {
    if (!ResourceDeduplicationManager.instance) {
      ResourceDeduplicationManager.instance = new ResourceDeduplicationManager();
    }
    return ResourceDeduplicationManager.instance;
  }

  /**
   * Deduplicated fetch - prevents multiple identical requests
   */
  async fetch(url: string, options?: RequestInit): Promise<Response> {
    const cacheKey = this.getCacheKey(url, options);
    
    // Return cached result if available
    if (this.requestCache.has(cacheKey)) {
      return Promise.resolve(this.requestCache.get(cacheKey).clone());
    }

    // Return pending request if already in progress
    if (this.pendingRequests.has(cacheKey)) {
      const response = await this.pendingRequests.get(cacheKey);
      return response.clone();
    }

    // Queue request if at concurrency limit
    if (this.activeRequests.size >= this.maxConcurrentRequests) {
      return new Promise((resolve, reject) => {
        if (!this.fetchQueue.has(cacheKey)) {
          this.fetchQueue.set(cacheKey, []);
        }
        this.fetchQueue.get(cacheKey)!.push({ resolve, reject });
      });
    }

    // Execute request
    const request = this.executeRequest(url, options, cacheKey);
    this.pendingRequests.set(cacheKey, request);

    try {
      const response = await request;
      this.requestCache.set(cacheKey, response.clone());
      return response;
    } finally {
      this.pendingRequests.delete(cacheKey);
      this.activeRequests.delete(cacheKey);
      this.processQueue();
    }
  }

  private async executeRequest(url: string, options?: RequestInit, cacheKey?: string): Promise<Response> {
    if (cacheKey) {
      this.activeRequests.add(cacheKey);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private processQueue(): void {
    if (this.activeRequests.size >= this.maxConcurrentRequests) return;

    const queueEntries = Array.from(this.fetchQueue.entries());
    for (const [cacheKey, callbacks] of queueEntries) {
      if (this.activeRequests.size >= this.maxConcurrentRequests) break;

      const callback = callbacks.shift();
      if (!callback) {
        this.fetchQueue.delete(cacheKey);
        continue;
      }

      // Extract URL and options from cache key (simplified)
      const [url] = cacheKey.split('|');
      
      this.executeRequest(url, undefined, cacheKey)
        .then(response => {
          this.requestCache.set(cacheKey, response.clone());
          callback.resolve(response);
        })
        .catch(error => callback.reject(error))
        .finally(() => {
          this.activeRequests.delete(cacheKey);
          this.processQueue();
        });
    }
  }

  private getCacheKey(url: string, options?: RequestInit): string {
    const optionsStr = options ? JSON.stringify(options) : '';
    return `${url}|${optionsStr}`;
  }

  /**
   * Clear cache entries older than specified time
   */
  clearStaleCache(maxAge: number = 5 * 60 * 1000): void {
    const now = Date.now();
    for (const [key, value] of this.requestCache.entries()) {
      if (value.timestamp && now - value.timestamp > maxAge) {
        this.requestCache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cacheSize: this.requestCache.size,
      pendingRequests: this.pendingRequests.size,
      queuedRequests: Array.from(this.fetchQueue.values()).reduce((sum, arr) => sum + arr.length, 0),
      activeRequests: this.activeRequests.size
    };
  }
}

// Export singleton
export const resourceManager = ResourceDeduplicationManager.getInstance();

/**
 * Enhanced Video Component Hook with Deduplication
 */
export const useOptimizedVideo = (src: string, options: {
  preload?: 'none' | 'metadata' | 'auto';
  priority?: 'high' | 'medium' | 'low';
  enableChunking?: boolean;
}) => {
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let mounted = true;
    abortControllerRef.current = new AbortController();

    const loadVideo = async () => {
      if (!src || loadState === 'loaded') return;

      setLoadState('loading');

      try {
        // Use deduplicated fetch
        const response = await resourceManager.fetch(src, {
          signal: abortControllerRef.current!.signal
        });

        if (!mounted) return;

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        if (videoRef.current && mounted) {
          videoRef.current.src = url;
          setLoadState('loaded');
          setProgress(100);
        }
      } catch (error) {
        if (mounted && !abortControllerRef.current!.signal.aborted) {
          setLoadState('error');
          console.error('Video load failed:', error);
        }
      }
    };

    // Load video based on preload strategy
    if (options.preload === 'auto' || options.priority === 'high') {
      loadVideo();
    } else if (options.preload === 'metadata') {
      // Load only metadata
      requestIdleCallback(() => loadVideo());
    }

    return () => {
      mounted = false;
      abortControllerRef.current?.abort();
    };
  }, [src, options.preload, options.priority, loadState]);

  // Progress tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const progress = (video.buffered.end(0) / video.duration) * 100;
        setProgress(progress);
      }
    };

    video.addEventListener('progress', handleProgress);
    return () => video.removeEventListener('progress', handleProgress);
  }, []);

  return {
    videoRef,
    loadState,
    progress,
    reload: () => setLoadState('idle')
  };
};

export default ResourceDeduplicationManager;
