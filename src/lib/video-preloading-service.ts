'use client';

import { advancedVideoOptimizer } from './advanced-video-optimizer';

interface PreloadStrategy {
  strategy: 'aggressive' | 'balanced' | 'conservative';
  maxConcurrent: number;
  chunkSize: number;
  priorityThreshold: number;
}

interface VideoMetrics {
  url: string;
  loadTime: number;
  size: number;
  quality: string;
  cacheHit: boolean;
  playbackStalls: number;
  averageBitrate: number;
}

interface UserBehaviorData {
  viewTime: number;
  skipRate: number;
  engagementScore: number;
  deviceType: string;
  connectionType: string;
  preferredQuality: string;
}

class VideoPreloadingService {
  private static instance: VideoPreloadingService;
  private preloadQueue: Map<string, { priority: number; publicId: string; options: any }> = new Map();
  private loadingPromises: Map<string, Promise<void>> = new Map();
  private userBehavior: UserBehaviorData[] = [];
  private strategy: PreloadStrategy;
  private isPreloading = false;
  private maxConcurrentLoads = 3;
  private performanceMetrics: VideoMetrics[] = [];
  private predictiveModel: any = null;

  private constructor() {
    this.strategy = this.determineOptimalStrategy();
    this.initializePredictiveModel();
    this.setupPerformanceMonitoring();
    this.setupNetworkChangeListener();
  }

  static getInstance(): VideoPreloadingService {
    if (!VideoPreloadingService.instance) {
      VideoPreloadingService.instance = new VideoPreloadingService();
    }
    return VideoPreloadingService.instance;
  }

  // Main preloading orchestrator
  async preloadVideos(
    videoList: Array<{
      publicId: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
      context: 'hero' | 'portfolio' | 'background';
      estimatedViewTime?: number;
    }>
  ): Promise<void> {
    // Sort by priority and predicted engagement
    const sortedVideos = this.prioritizeVideos(videoList);
    
    // Implement chunked preloading
    for (const batch of this.createBatches(sortedVideos)) {
      await this.preloadBatch(batch);
      
      // Yield control to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  // Smart batch creation based on network and device capabilities
  private createBatches<T>(items: T[]): T[][] {
    const batchSize = this.calculateOptimalBatchSize();
    const batches: T[][] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    
    return batches;
  }

  private calculateOptimalBatchSize(): number {
    const connection = this.getConnectionInfo();
    const deviceMemory = this.getDeviceMemory();
    
    // Base batch size on connection and memory
    let batchSize = 2; // Conservative default
    
    if (connection.effectiveType === '4g' && deviceMemory >= 4) {
      batchSize = 4;
    } else if (connection.effectiveType === '3g') {
      batchSize = 2;
    } else {
      batchSize = 1;
    }
    
    // Adjust based on current performance
    const averageLoadTime = this.getAverageLoadTime();
    if (averageLoadTime > 3000) {
      batchSize = Math.max(1, batchSize - 1);
    }
    
    return Math.min(batchSize, this.maxConcurrentLoads);
  }

  // Preload a batch of videos concurrently
  private async preloadBatch(
    batch: Array<{
      publicId: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
      context: string;
    }>
  ): Promise<void> {
    const promises = batch.map(async (video) => {
      const loadingKey = `${video.publicId}-${video.priority}`;
      
      if (this.loadingPromises.has(loadingKey)) {
        return this.loadingPromises.get(loadingKey);
      }
      
      const loadPromise = this.preloadSingleVideo(video);
      this.loadingPromises.set(loadingKey, loadPromise);
      
      try {
        await loadPromise;
      } finally {
        this.loadingPromises.delete(loadingKey);
      }
    });
    
    await Promise.allSettled(promises);
  }

  // Preload individual video with chunked loading
  private async preloadSingleVideo(video: {
    publicId: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    context: string;
  }): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Create a temporary video element for preloading
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.muted = true;
      
      // Use chunked loading for better control
      await advancedVideoOptimizer.loadVideoInChunks(
        video.publicId,
        tempVideo,
        {
          chunkSize: this.strategy.chunkSize,
          preloadChunks: this.getPreloadChunks(video.priority),
          quality: this.getOptimalQuality(video.context)
        }
      );
      
      // Record success metrics
      this.recordMetrics({
        url: video.publicId,
        loadTime: performance.now() - startTime,
        size: 0, // Will be filled by actual implementation
        quality: this.getOptimalQuality(video.context),
        cacheHit: false,
        playbackStalls: 0,
        averageBitrate: 0
      });
      
    } catch (error) {
      console.warn(`Failed to preload video ${video.publicId}:`, error);
      
      // Record failure for learning
      this.recordMetrics({
        url: video.publicId,
        loadTime: performance.now() - startTime,
        size: 0,
        quality: 'failed',
        cacheHit: false,
        playbackStalls: 0,
        averageBitrate: 0
      });
    }
  }

  // Prioritize videos based on multiple factors
  private prioritizeVideos(
    videoList: Array<{
      publicId: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
      context: string;
      estimatedViewTime?: number;
    }>
  ): typeof videoList {
    return videoList.sort((a, b) => {
      // Base priority score
      const priorityScore = {
        critical: 1000,
        high: 500,
        medium: 100,
        low: 10
      };
      
      let scoreA = priorityScore[a.priority];
      let scoreB = priorityScore[b.priority];
      
      // Boost score based on predicted engagement
      if (this.predictiveModel) {
        scoreA += this.predictEngagement(a) * 100;
        scoreB += this.predictEngagement(b) * 100;
      }
      
      // Boost hero and visible content
      if (a.context === 'hero') scoreA += 200;
      if (b.context === 'hero') scoreB += 200;
      
      // Consider estimated view time
      if (a.estimatedViewTime) scoreA += a.estimatedViewTime * 2;
      if (b.estimatedViewTime) scoreB += b.estimatedViewTime * 2;
      
      return scoreB - scoreA;
    });
  }

  // Predictive engagement scoring
  private predictEngagement(video: any): number {
    if (!this.predictiveModel || this.userBehavior.length < 10) {
      return 0.5; // Neutral score
    }
    
    // Simple engagement prediction based on historical data
    const similarVideos = this.userBehavior.filter(
      behavior => behavior.deviceType === this.getDeviceType()
    );
    
    if (similarVideos.length === 0) return 0.5;
    
    const avgEngagement = similarVideos.reduce(
      (sum, behavior) => sum + behavior.engagementScore, 0
    ) / similarVideos.length;
    
    return Math.min(1, Math.max(0, avgEngagement));
  }

  // Adaptive preloading based on viewport visibility
  async preloadInViewport(): Promise<void> {
    const visibleVideos = this.getVisibleVideoElements();
    const nearViewportVideos = this.getNearViewportVideoElements();
    
    // Preload visible videos with high priority
    const highPriorityList = visibleVideos.map(el => ({
      publicId: el.dataset.publicId || '',
      priority: 'critical' as const,
      context: (el.dataset.context as 'hero' | 'portfolio' | 'background') || 'portfolio'
    })).filter(v => v.publicId);
    
    // Preload near-viewport videos with medium priority
    const mediumPriorityList = nearViewportVideos.map(el => ({
      publicId: el.dataset.publicId || '',
      priority: 'medium' as const,
      context: (el.dataset.context as 'hero' | 'portfolio' | 'background') || 'portfolio'
    })).filter(v => v.publicId);
    
    await this.preloadVideos([...highPriorityList, ...mediumPriorityList]);
  }

  // Network-aware preloading
  private setupNetworkChangeListener(): void {
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', () => {
        this.strategy = this.determineOptimalStrategy();
        this.adjustOngoingPreloads();
      });
    }
  }

  // Adjust strategy based on network conditions
  private determineOptimalStrategy(): PreloadStrategy {
    const connection = this.getConnectionInfo();
    const deviceMemory = this.getDeviceMemory();
    
    if (connection.saveData || connection.effectiveType === 'slow-2g') {
      return {
        strategy: 'conservative',
        maxConcurrent: 1,
        chunkSize: 256 * 1024, // 256KB
        priorityThreshold: 1000
      };
    } else if (connection.effectiveType === '3g' || deviceMemory < 4) {
      return {
        strategy: 'balanced',
        maxConcurrent: 2,
        chunkSize: 512 * 1024, // 512KB
        priorityThreshold: 500
      };
    } else {
      return {
        strategy: 'aggressive',
        maxConcurrent: 4,
        chunkSize: 1024 * 1024, // 1MB
        priorityThreshold: 100
      };
    }
  }

  // Adjust ongoing preloads when network changes
  private adjustOngoingPreloads(): void {
    // Cancel low-priority preloads if network degrades
    if (this.strategy.strategy === 'conservative') {
      this.loadingPromises.clear();
    }
    
    // Update max concurrent loads
    this.maxConcurrentLoads = this.strategy.maxConcurrent;
  }

  // Performance monitoring and metrics
  private setupPerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;
    
    // Monitor video load performance
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('.mp4') || entry.name.includes('cloudinary')) {
            this.analyzeLoadPerformance(entry as PerformanceResourceTiming);
          }
        }
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  private analyzeLoadPerformance(entry: PerformanceResourceTiming): void {
    const metrics: VideoMetrics = {
      url: entry.name,
      loadTime: entry.responseEnd - entry.requestStart,
      size: entry.transferSize,
      quality: 'unknown',
      cacheHit: entry.transferSize === 0,
      playbackStalls: 0,
      averageBitrate: entry.transferSize / (entry.responseEnd - entry.requestStart) * 8 * 1000
    };
    
    this.recordMetrics(metrics);
  }

  private recordMetrics(metrics: VideoMetrics): void {
    this.performanceMetrics.push(metrics);
    
    // Keep only recent metrics (last 100 entries)
    if (this.performanceMetrics.length > 100) {
      this.performanceMetrics = this.performanceMetrics.slice(-100);
    }
    
    // Learn from performance data
    this.updatePredictiveModel();
  }

  // Machine learning for predictive preloading
  private initializePredictiveModel(): void {
    // Simple model based on user behavior patterns
    this.predictiveModel = {
      weights: {
        viewTime: 0.3,
        deviceType: 0.2,
        connectionType: 0.2,
        timeOfDay: 0.1,
        previousEngagement: 0.2
      },
      threshold: 0.6
    };
  }

  private updatePredictiveModel(): void {
    if (this.userBehavior.length < 20) return;
    
    // Update model weights based on actual performance
    const recent = this.userBehavior.slice(-20);
    const avgEngagement = recent.reduce((sum, b) => sum + b.engagementScore, 0) / recent.length;
    
    // Simple adaptation (in a real implementation, use proper ML)
    if (avgEngagement > 0.7) {
      this.predictiveModel.threshold = Math.max(0.4, this.predictiveModel.threshold - 0.1);
    } else if (avgEngagement < 0.3) {
      this.predictiveModel.threshold = Math.min(0.8, this.predictiveModel.threshold + 0.1);
    }
  }

  // User behavior tracking
  trackVideoInteraction(
    publicId: string,
    interaction: {
      viewTime: number;
      totalDuration: number;
      skipped: boolean;
      quality: string;
    }
  ): void {
    const engagementScore = interaction.skipped 
      ? 0.1 
      : Math.min(1, interaction.viewTime / interaction.totalDuration);
    
    this.userBehavior.push({
      viewTime: interaction.viewTime,
      skipRate: interaction.skipped ? 1 : 0,
      engagementScore,
      deviceType: this.getDeviceType(),
      connectionType: this.getConnectionInfo().effectiveType,
      preferredQuality: interaction.quality
    });
    
    // Keep only recent behavior (last 50 interactions)
    if (this.userBehavior.length > 50) {
      this.userBehavior = this.userBehavior.slice(-50);
    }
  }

  // Utility methods
  private getPreloadChunks(priority: string): number {
    switch (priority) {
      case 'critical': return 5;
      case 'high': return 3;
      case 'medium': return 2;
      default: return 1;
    }
  }

  private getOptimalQuality(context: string): 'auto:low' | 'auto:good' | 'auto:best' | 'auto:eco' {
    const connection = this.getConnectionInfo();
    
    if (context === 'hero') return 'auto:best';
    if (connection.saveData) return 'auto:eco';
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') return 'auto:low';
    
    return 'auto:good';
  }

  private getConnectionInfo(): any {
    const connection = (navigator as any).connection;
    return {
      effectiveType: connection?.effectiveType || '4g',
      downlink: connection?.downlink || 10,
      saveData: connection?.saveData || false
    };
  }

  private getDeviceType(): string {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getDeviceMemory(): number {
    return (navigator as any).deviceMemory || 4;
  }

  private getAverageLoadTime(): number {
    if (this.performanceMetrics.length === 0) return 0;
    
    const recent = this.performanceMetrics.slice(-10);
    return recent.reduce((sum, m) => sum + m.loadTime, 0) / recent.length;
  }

  private getVisibleVideoElements(): HTMLVideoElement[] {
    const videos = document.querySelectorAll('video[data-public-id]');
    return Array.from(videos).filter(video => this.isElementVisible(video)) as HTMLVideoElement[];
  }

  private getNearViewportVideoElements(): HTMLVideoElement[] {
    const videos = document.querySelectorAll('video[data-public-id]');
    return Array.from(videos).filter(video => this.isElementNearViewport(video)) as HTMLVideoElement[];
  }

  private isElementVisible(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  private isElementNearViewport(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    const buffer = window.innerHeight * 0.5; // 50% of viewport height
    return rect.top < window.innerHeight + buffer && rect.bottom > -buffer;
  }

  // Public API methods
  getPerformanceStats(): any {
    return {
      totalMetrics: this.performanceMetrics.length,
      averageLoadTime: this.getAverageLoadTime(),
      cacheHitRate: this.performanceMetrics.filter(m => m.cacheHit).length / this.performanceMetrics.length || 0,
      currentStrategy: this.strategy,
      userBehaviorSamples: this.userBehavior.length,
      averageEngagement: this.userBehavior.reduce((sum, b) => sum + b.engagementScore, 0) / this.userBehavior.length || 0
    };
  }

  async preloadCriticalVideos(publicIds: string[]): Promise<void> {
    const criticalVideos = publicIds.map(publicId => ({
      publicId,
      priority: 'critical' as const,
      context: 'hero' as const
    }));
    
    await this.preloadVideos(criticalVideos);
  }

  pausePreloading(): void {
    this.isPreloading = false;
    this.loadingPromises.clear();
  }

  resumePreloading(): void {
    this.isPreloading = true;
  }

  clearCache(): void {
    advancedVideoOptimizer.destroy();
    this.loadingPromises.clear();
    this.performanceMetrics = [];
  }
}

// Export singleton instance
export const videoPreloadingService = VideoPreloadingService.getInstance();

export default VideoPreloadingService;
