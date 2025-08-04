'use client';

import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
}

export const usePerformanceOptimization = () => {
  const preloadCriticalResources = useCallback(() => {
    // Preload critical assets
    const criticalAssets = [
      '/MARQUET.svg',
      '/image.png',
      '/marquetmedia.mp4'
    ];

    criticalAssets.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'preload';
      
      if (asset.endsWith('.mp4')) {
        link.as = 'video';
        link.type = 'video/mp4';
      } else if (asset.endsWith('.svg')) {
        link.as = 'image';
        link.type = 'image/svg+xml';
      } else if (asset.endsWith('.png')) {
        link.as = 'image';
        link.type = 'image/png';
      }
      
      link.href = asset;
      document.head.appendChild(link);
    });
  }, []);

  const optimizeImages = useCallback(() => {
    // Lazy load non-critical images
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }, []);

  const enableGPUAcceleration = useCallback(() => {
    // Apply hardware acceleration to critical elements
    const elements = document.querySelectorAll('.hero-logo, .hero-text-item, video, .magnetic');
    elements.forEach(el => {
      const element = el as HTMLElement;
      element.style.transform = 'translate3d(0,0,0)';
      element.style.backfaceVisibility = 'hidden';
      element.style.perspective = '1000px';
    });
  }, []);

  const measurePerformance = useCallback((): PerformanceMetrics => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      loadTime: navigation.loadEventEnd - navigation.fetchStart,
      renderTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      interactionTime: navigation.domInteractive - navigation.fetchStart
    };
  }, []);

  const optimizeForMobile = useCallback(() => {
    // Mobile-specific optimizations
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Reduce animation complexity on mobile
      document.documentElement.style.setProperty('--animation-duration', '0.3s');
      
      // Optimize video for mobile
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        video.preload = 'none';
        video.setAttribute('playsinline', 'true');
      });
    }
  }, []);

  const setupResourceHints = useCallback(() => {
    // DNS prefetch for external resources
    const dnsPrefetch = ['https://res.cloudinary.com'];
    
    dnsPrefetch.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });

    // Preconnect to critical domains
    const preconnect = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
    
    preconnect.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }, []);

  useEffect(() => {
    // Initialize performance optimizations
    preloadCriticalResources();
    setupResourceHints();
    enableGPUAcceleration();
    optimizeForMobile();
    
    // Defer non-critical optimizations
    requestIdleCallback(() => {
      optimizeImages();
    });

    // Performance monitoring
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        const metrics = measurePerformance();
        console.log('Performance Metrics:', metrics);
      }, 2000);
    }

    // Cleanup on unmount
    return () => {
      // Remove preload links to free memory
      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      preloadLinks.forEach(link => link.remove());
    };
  }, [preloadCriticalResources, setupResourceHints, enableGPUAcceleration, optimizeForMobile, optimizeImages, measurePerformance]);

  return {
    measurePerformance,
    preloadCriticalResources,
    optimizeImages,
    enableGPUAcceleration
  };
};

// Export performance utilities
export const PerformanceUtils = {
  // Debounce function for scroll events
  debounce: <T extends (...args: any[]) => void>(func: T, wait: number): T => {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    }) as T;
  },

  // Throttle function for resize events
  throttle: <T extends (...args: any[]) => void>(func: T, limit: number): T => {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  },

  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Get device performance tier
  getPerformanceTier: () => {
    const memory = (navigator as any).deviceMemory || 4; // Default to 4GB
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    
    if (memory >= 8 && hardwareConcurrency >= 8) return 'high';
    if (memory >= 4 && hardwareConcurrency >= 4) return 'medium';
    return 'low';
  }
};
