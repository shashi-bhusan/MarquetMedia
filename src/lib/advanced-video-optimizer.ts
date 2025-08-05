'use client';

import { cld } from './cloudinary';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';

// Enhanced video chunk loading system
interface VideoChunk {
  start: number;
  end: number;
  url: string;
  priority: 'critical' | 'high' | 'low';
  loaded: boolean;
}

interface VideoCache {
  [key: string]: {
    chunks: VideoChunk[];
    metadata: {
      duration: number;
      size: number;
      quality: string;
      lastAccessed: number;
      hitCount: number;
    };
  };
}

interface ConnectionInfo {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

class AdvancedVideoOptimizer {
  private static instance: AdvancedVideoOptimizer;
  private videoCache: VideoCache = {};
  private chunkSize = 1024 * 1024; // 1MB chunks
  private maxCacheSize = 100 * 1024 * 1024; // 100MB cache limit
  private preloadQueue: string[] = [];
  private isPreloading = false;
  private connectionAwareSettings: any = {};
  private performanceObserver?: PerformanceObserver;
  private intersectionObserver?: IntersectionObserver;

  private constructor() {
    this.initializePerformanceMonitoring();
    this.initializeConnectionMonitoring();
    this.setupIntersectionObserver();
    this.setupMemoryManagement();
  }

  static getInstance(): AdvancedVideoOptimizer {
    if (!AdvancedVideoOptimizer.instance) {
      AdvancedVideoOptimizer.instance = new AdvancedVideoOptimizer();
    }
    return AdvancedVideoOptimizer.instance;
  }

  // Initialize performance monitoring
  private initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource' && entry.name.includes('.mp4')) {
            this.analyzeVideoLoadPerformance(entry as PerformanceResourceTiming);
          }
        }
      });

      this.performanceObserver.observe({
        entryTypes: ['resource']
      });
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }
  }

  // Monitor connection changes for adaptive streaming
  private initializeConnectionMonitoring(): void {
    if (typeof navigator === 'undefined') return;

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const updateConnectionSettings = () => {
        this.connectionAwareSettings = {
          effectiveType: connection.effectiveType || '4g',
          downlink: connection.downlink || 10,
          rtt: connection.rtt || 100,
          saveData: connection.saveData || false
        };
        this.adjustQualityBasedOnConnection();
      };

      connection.addEventListener('change', updateConnectionSettings);
      updateConnectionSettings();
    }
  }

  // Adjust quality settings based on connection
  private adjustQualityBasedOnConnection(): void {
    const connection = this.connectionAwareSettings;
    if (!connection) return;

    // Implement adaptive quality logic based on connection
    if (connection.saveData || connection.effectiveType === 'slow-2g') {
      this.chunkSize = 512 * 1024; // 512KB for slow connections
    } else if (connection.effectiveType === '3g') {
      this.chunkSize = 1024 * 1024; // 1MB for 3G
    } else {
      this.chunkSize = 2 * 1024 * 1024; // 2MB for fast connections
    }
  }

  // Setup intersection observer for viewport-based loading
  private setupIntersectionObserver(): void {
    if (typeof window === 'undefined') return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target as HTMLVideoElement;
          const publicId = videoElement.dataset.publicId;
          
          if (entry.isIntersecting && publicId) {
            this.prioritizeVideoLoad(publicId, 'high');
          } else if (!entry.isIntersecting && publicId) {
            this.deprioritizeVideoLoad(publicId);
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: [0.1, 0.5, 0.9]
      }
    );
  }

  // Memory management and cache cleanup
  private setupMemoryManagement(): void {
    if (typeof window === 'undefined') return;

    // Clean up cache every 5 minutes
    setInterval(() => {
      this.cleanupCache();
    }, 5 * 60 * 1000);

    // Emergency cleanup on memory pressure
    if ('memory' in performance) {
      const checkMemory = () => {
        const memInfo = (performance as any).memory;
        if (memInfo.usedJSHeapSize / memInfo.totalJSHeapSize > 0.8) {
          this.emergencyCleanup();
        }
      };
      
      setInterval(checkMemory, 30 * 1000);
    }
  }

  // Generate chunked video URLs with adaptive bitrates
  getOptimizedVideoUrl(
    publicId: string,
    options: {
      quality?: 'auto:low' | 'auto:good' | 'auto:best' | 'auto:eco';
      width?: number;
      height?: number;
      format?: 'auto' | 'mp4' | 'webm' | 'av1';
      startTime?: number;
      duration?: number;
      adaptiveBitrate?: boolean;
    } = {}
  ): string {
    const connection = this.getConnectionInfo();
    const deviceType = this.getDeviceType();
    
    // Dynamic quality adjustment
    const adaptiveQuality = this.getAdaptiveQuality(connection, deviceType, options.quality);
    
    try {
      const video = cld.video(publicId);
      
      // Apply responsive sizing
      if (options.width && options.height) {
        video.resize(fill().width(options.width).height(options.height));
      } else {
        const { width, height } = this.getOptimalDimensions(deviceType, connection);
        video.resize(fill().width(width).height(height));
      }
      
      // Apply quality and format
      video.delivery(quality(adaptiveQuality));
      video.delivery(format(options.format || 'auto'));
      
      // Add progressive loading flags
      video.addFlag('progressive:semi');
      video.addFlag('immutable_cache');
      
      // Chunk-specific transformations
      if (options.startTime !== undefined || options.duration !== undefined) {
        if (options.startTime) video.addTransformation(`so_${options.startTime}`);
        if (options.duration) video.addTransformation(`du_${options.duration}`);
      }
      
      return video.toURL();
    } catch (error) {
      console.warn('Error generating optimized video URL:', error);
      return this.getFallbackUrl(publicId);
    }
  }

  // Chunked video loading for large files
  async loadVideoInChunks(
    publicId: string,
    element: HTMLVideoElement,
    options: {
      chunkSize?: number;
      preloadChunks?: number;
      quality?: string;
    } = {}
  ): Promise<void> {
    const chunkSize = options.chunkSize || this.chunkSize;
    const preloadChunks = options.preloadChunks || 3;
    
    try {
      // Get video metadata first
      const metadata = await this.getVideoMetadata(publicId);
      const totalChunks = Math.ceil(metadata.size / chunkSize);
      
      // Initialize cache entry
      if (!this.videoCache[publicId]) {
        this.videoCache[publicId] = {
          chunks: [],
          metadata: {
            duration: metadata.duration,
            size: metadata.size,
            quality: options.quality || 'auto:good',
            lastAccessed: Date.now(),
            hitCount: 0
          }
        };
      }
      
      // Create chunks
      const chunks: VideoChunk[] = [];
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min((i + 1) * chunkSize, metadata.size);
        const priority = i < preloadChunks ? 'critical' : i < preloadChunks * 2 ? 'high' : 'low';
        
        chunks.push({
          start,
          end,
          url: this.getChunkUrl(publicId, start, end, options.quality),
          priority,
          loaded: false
        });
      }
      
      this.videoCache[publicId].chunks = chunks;
      
      // Load critical chunks first
      await this.loadCriticalChunks(publicId, element);
      
      // Queue remaining chunks
      this.queueRemainingChunks(publicId);
      
    } catch (error) {
      console.error('Error loading video in chunks:', error);
      // Fallback to regular loading
      element.src = this.getOptimizedVideoUrl(publicId);
    }
  }

  // Smart preloading based on user behavior
  async smartPreload(
    videoIds: string[],
    strategy: 'viewport' | 'sequential' | 'predictive' = 'viewport'
  ): Promise<void> {
    if (this.isPreloading) return;
    
    this.isPreloading = true;
    const connection = this.getConnectionInfo();
    
    // Don't preload on slow connections or data saver mode
    if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      this.isPreloading = false;
      return;
    }
    
    try {
      switch (strategy) {
        case 'viewport':
          await this.preloadViewportVideos(videoIds);
          break;
        case 'sequential':
          await this.preloadSequentially(videoIds);
          break;
        case 'predictive':
          await this.preloadPredictively(videoIds);
          break;
      }
    } catch (error) {
      console.error('Smart preload failed:', error);
    } finally {
      this.isPreloading = false;
    }
  }

  // Adaptive bitrate streaming
  enableAdaptiveBitrate(element: HTMLVideoElement, publicId: string): void {
    if (!element || !publicId) return;
    
    const qualities = ['auto:eco', 'auto:good', 'auto:best'];
    let currentQualityIndex = 1; // Start with 'good'
    
    // Monitor playback quality
    const monitorPlayback = () => {
      const connection = this.getConnectionInfo();
      const bufferedAmount = this.getBufferedAmount(element);
      
      // Adjust quality based on buffer health and connection
      if (bufferedAmount < 2 && currentQualityIndex > 0) {
        // Reduce quality if buffer is low
        currentQualityIndex--;
        this.switchQuality(element, publicId, qualities[currentQualityIndex]);
      } else if (bufferedAmount > 10 && currentQualityIndex < qualities.length - 1 && connection.downlink > 5) {
        // Increase quality if buffer is healthy and connection is good
        currentQualityIndex++;
        this.switchQuality(element, publicId, qualities[currentQualityIndex]);
      }
    };
    
    // Monitor every 5 seconds
    const interval = setInterval(monitorPlayback, 5000);
    
    // Cleanup on element removal
    element.addEventListener('pause', () => clearInterval(interval));
    element.addEventListener('ended', () => clearInterval(interval));
  }

  // Advanced caching with LRU and size limits
  private cleanupCache(): void {
    const cacheEntries = Object.entries(this.videoCache);
    const totalSize = cacheEntries.reduce((sum, [, entry]) => sum + entry.metadata.size, 0);
    
    if (totalSize <= this.maxCacheSize) return;
    
    // Sort by last accessed time and hit count (LRU with frequency)
    const sortedEntries = cacheEntries.sort((a, b) => {
      const scoreA = a[1].metadata.lastAccessed + (a[1].metadata.hitCount * 60000); // Weight hit count
      const scoreB = b[1].metadata.lastAccessed + (b[1].metadata.hitCount * 60000);
      return scoreA - scoreB;
    });
    
    // Remove oldest entries until under cache limit
    let currentSize = totalSize;
    for (const [publicId, entry] of sortedEntries) {
      if (currentSize <= this.maxCacheSize * 0.8) break; // Leave 20% buffer
      
      delete this.videoCache[publicId];
      currentSize -= entry.metadata.size;
    }
  }

  // Emergency cleanup for memory pressure
  private emergencyCleanup(): void {
    // Remove all but critical (currently playing) videos
    const criticalVideos = this.getCriticalVideos();
    
    Object.keys(this.videoCache).forEach(publicId => {
      if (!criticalVideos.includes(publicId)) {
        delete this.videoCache[publicId];
      }
    });
    
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
  }

  // Performance analytics
  private analyzeVideoLoadPerformance(entry: PerformanceResourceTiming): void {
    const metrics = {
      url: entry.name,
      loadTime: entry.responseEnd - entry.requestStart,
      downloadTime: entry.responseEnd - entry.responseStart,
      cacheHit: entry.transferSize === 0,
      size: entry.transferSize,
      compression: entry.encodedBodySize / entry.decodedBodySize
    };
    
    // Send analytics (implement based on your analytics provider)
    this.sendVideoMetrics(metrics);
    
    // Adjust strategy based on performance
    if (metrics.loadTime > 3000) {
      this.adjustStrategyForSlowLoading();
    }
  }

  // Helper methods
  private getConnectionInfo(): ConnectionInfo {
    const connection = (navigator as any).connection;
    return {
      effectiveType: connection?.effectiveType || '4g',
      downlink: connection?.downlink || 10,
      rtt: connection?.rtt || 100,
      saveData: connection?.saveData || false
    };
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getAdaptiveQuality(
    connection: ConnectionInfo,
    deviceType: string,
    requestedQuality?: string
  ): string {
    if (requestedQuality && !requestedQuality.includes('auto')) {
      return requestedQuality;
    }
    
    // Base quality on connection and device
    if (connection.saveData || connection.effectiveType === 'slow-2g') return 'auto:eco';
    if (connection.effectiveType === '2g') return 'auto:low';
    if (connection.effectiveType === '3g' && deviceType === 'mobile') return 'auto:good';
    if (connection.downlink < 3) return 'auto:good';
    
    return requestedQuality || 'auto:best';
  }

  private getOptimalDimensions(deviceType: string, connection: ConnectionInfo): { width: number; height: number } {
    const dimensions = {
      mobile: { width: 480, height: 854 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1920, height: 1080 }
    };
    
    let baseDimensions = dimensions[deviceType as keyof typeof dimensions] || dimensions.desktop;
    
    // Reduce dimensions on slow connections
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      baseDimensions.width = Math.floor(baseDimensions.width * 0.5);
      baseDimensions.height = Math.floor(baseDimensions.height * 0.5);
    } else if (connection.effectiveType === '3g') {
      baseDimensions.width = Math.floor(baseDimensions.width * 0.75);
      baseDimensions.height = Math.floor(baseDimensions.height * 0.75);
    }
    
    return baseDimensions;
  }

  private getFallbackUrl(publicId: string): string {
    return `/videos/${publicId}.mp4`;
  }

  private async getVideoMetadata(publicId: string): Promise<{ duration: number; size: number }> {
    // Mock implementation - replace with actual Cloudinary API call
    return { duration: 30, size: 5 * 1024 * 1024 }; // 5MB
  }

  private getChunkUrl(publicId: string, start: number, end: number, quality?: string): string {
    // Generate URL for specific byte range
    const validQuality = quality as 'auto:low' | 'auto:good' | 'auto:best' | 'auto:eco' | undefined;
    const baseUrl = this.getOptimizedVideoUrl(publicId, { quality: validQuality });
    return `${baseUrl}#t=${start / 1000},${end / 1000}`;
  }

  private async loadCriticalChunks(publicId: string, element: HTMLVideoElement): Promise<void> {
    const cache = this.videoCache[publicId];
    if (!cache) return;
    
    const criticalChunks = cache.chunks.filter(chunk => chunk.priority === 'critical');
    
    for (const chunk of criticalChunks) {
      try {
        await this.loadChunk(chunk);
        chunk.loaded = true;
      } catch (error) {
        console.warn('Failed to load critical chunk:', error);
      }
    }
  }

  private queueRemainingChunks(publicId: string): void {
    if (!this.preloadQueue.includes(publicId)) {
      this.preloadQueue.push(publicId);
    }
    
    // Process queue in background
    requestIdleCallback(() => this.processPreloadQueue());
  }

  private async processPreloadQueue(): Promise<void> {
    if (this.preloadQueue.length === 0) return;
    
    const publicId = this.preloadQueue.shift();
    if (!publicId || !this.videoCache[publicId]) return;
    
    const cache = this.videoCache[publicId];
    const unloadedChunks = cache.chunks.filter(chunk => !chunk.loaded);
    
    for (const chunk of unloadedChunks) {
      if (chunk.priority === 'high') {
        try {
          await this.loadChunk(chunk);
          chunk.loaded = true;
        } catch (error) {
          console.warn('Failed to load chunk:', error);
        }
      }
    }
    
    // Continue processing queue
    if (this.preloadQueue.length > 0) {
      requestIdleCallback(() => this.processPreloadQueue());
    }
  }

  private async loadChunk(chunk: VideoChunk): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', chunk.url);
      xhr.setRequestHeader('Range', `bytes=${chunk.start}-${chunk.end}`);
      
      xhr.onload = () => {
        if (xhr.status === 206) {
          resolve();
        } else {
          reject(new Error(`Chunk load failed: ${xhr.status}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send();
    });
  }

  private prioritizeVideoLoad(publicId: string, priority: 'high' | 'low'): void {
    const cache = this.videoCache[publicId];
    if (cache) {
      cache.metadata.lastAccessed = Date.now();
      cache.metadata.hitCount++;
    }
  }

  private deprioritizeVideoLoad(publicId: string): void {
    // Could pause non-critical chunk loading
  }

  private async preloadViewportVideos(videoIds: string[]): Promise<void> {
    // Implementation for viewport-based preloading
  }

  private async preloadSequentially(videoIds: string[]): Promise<void> {
    // Implementation for sequential preloading
  }

  private async preloadPredictively(videoIds: string[]): Promise<void> {
    // Implementation for predictive preloading based on user behavior
  }

  private getBufferedAmount(element: HTMLVideoElement): number {
    if (element.buffered.length === 0) return 0;
    return element.buffered.end(element.buffered.length - 1) - element.currentTime;
  }

  private switchQuality(element: HTMLVideoElement, publicId: string, quality: string): void {
    const currentTime = element.currentTime;
    const validQuality = quality as 'auto:low' | 'auto:good' | 'auto:best' | 'auto:eco';
    const newUrl = this.getOptimizedVideoUrl(publicId, { quality: validQuality });
    
    element.src = newUrl;
    element.currentTime = currentTime;
    element.play().catch(console.warn);
  }

  private getCriticalVideos(): string[] {
    // Return list of currently playing or visible videos
    const videos = document.querySelectorAll('video[data-public-id]');
    return Array.from(videos)
      .filter(video => {
        const videoEl = video as HTMLVideoElement;
        return !videoEl.paused || this.isInViewport(video);
      })
      .map(video => video.getAttribute('data-public-id'))
      .filter(Boolean) as string[];
  }

  private isInViewport(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  private sendVideoMetrics(metrics: any): void {
    // Send to analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log('Video Performance Metrics:', metrics);
    }
  }

  private adjustStrategyForSlowLoading(): void {
    // Adjust chunking and quality strategies for slow loading
    this.chunkSize = Math.max(this.chunkSize * 0.8, 512 * 1024); // Reduce chunk size
  }

  // Public methods for external use
  observeVideo(element: HTMLVideoElement, publicId: string): void {
    element.setAttribute('data-public-id', publicId);
    this.intersectionObserver?.observe(element);
  }

  unobserveVideo(element: HTMLVideoElement): void {
    this.intersectionObserver?.unobserve(element);
  }

  getCacheStats(): any {
    const entries = Object.values(this.videoCache);
    return {
      totalEntries: entries.length,
      totalSize: entries.reduce((sum, entry) => sum + entry.metadata.size, 0),
      hitRate: entries.reduce((sum, entry) => sum + entry.metadata.hitCount, 0) / entries.length || 0,
      oldestEntry: Math.min(...entries.map(entry => entry.metadata.lastAccessed)),
      newestEntry: Math.max(...entries.map(entry => entry.metadata.lastAccessed))
    };
  }

  destroy(): void {
    this.performanceObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.videoCache = {};
    this.preloadQueue = [];
  }
}

// Export singleton instance
export const advancedVideoOptimizer = AdvancedVideoOptimizer.getInstance();

// Export types for TypeScript
export type { VideoChunk, VideoCache, ConnectionInfo };

export default AdvancedVideoOptimizer;
