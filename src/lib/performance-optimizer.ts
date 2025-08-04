'use client';

// Performance optimization utilities for the application
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private intersectionObserver?: IntersectionObserver;
  private mutationObserver?: MutationObserver;
  private performanceMetrics: Map<string, number> = new Map();

  private constructor() {
    this.initializeObservers();
    this.trackCoreWebVitals();
  }

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Initialize intersection observer for lazy loading
  private initializeObservers(): void {
    if (typeof window === 'undefined') return;

    // Intersection Observer for lazy loading
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            
            // Add loaded class to trigger animations
            target.classList.add('loaded');
            
            // Remove observer once loaded
            this.intersectionObserver?.unobserve(target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    // Mutation Observer for dynamic content
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            this.optimizeNewElement(element);
          }
        });
      });
    });

    // Start observing
    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Track Core Web Vitals
  private trackCoreWebVitals(): void {
    if (typeof window === 'undefined') return;

    // First Contentful Paint (FCP)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.performanceMetrics.set('FCP', entry.startTime);
        }
      }
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.performanceMetrics.set('LCP', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.performanceMetrics.set('FID', (entry as any).processingStart - entry.startTime);
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          this.performanceMetrics.set('CLS', clsValue);
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Optimize new elements added to DOM
  private optimizeNewElement(element: HTMLElement): void {
    // Add lazy loading to images
    const images = element.querySelectorAll('img:not([loading])');
    images.forEach((img) => {
      (img as HTMLImageElement).loading = 'lazy';
    });

    // Add lazy loading class for animations
    if (element.classList.contains('lazy-load')) {
      this.intersectionObserver?.observe(element);
    }

    // Optimize videos
    const videos = element.querySelectorAll('video');
    videos.forEach((video) => {
      video.preload = 'metadata';
      video.playsInline = true;
    });
  }

  // Preload critical resources
  preloadCriticalResources(resources: Array<{ href: string; as: string; type?: string }>): void {
    if (typeof document === 'undefined') return;

    resources.forEach(({ href, as, type }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      
      document.head.appendChild(link);
    });
  }

  // Optimize images with lazy loading
  optimizeImages(container: HTMLElement = document.body): void {
    const images = container.querySelectorAll('img');
    
    images.forEach((img) => {
      // Add lazy loading
      if (!img.hasAttribute('loading')) {
        img.loading = 'lazy';
      }

      // Add intersection observer for fade-in effect
      img.classList.add('lazy-load');
      this.intersectionObserver?.observe(img);

      // Optimize image sizes
      if (!img.hasAttribute('sizes') && img.hasAttribute('srcset')) {
        img.sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
      }
    });
  }

  // Optimize fonts
  optimizeFonts(): void {
    if (typeof document === 'undefined') return;

    // Preload critical fonts
    const fontPreloads = [
      { href: '/fonts/montserrat-variable.woff2', as: 'font', type: 'font/woff2' },
      { href: '/fonts/baskerville.woff2', as: 'font', type: 'font/woff2' }
    ];

    this.preloadCriticalResources(fontPreloads);

    // Add font-display: swap to existing font faces
    const styleSheets = Array.from(document.styleSheets);
    styleSheets.forEach((sheet) => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules || []);
        rules.forEach((rule) => {
          if (rule instanceof CSSFontFaceRule) {
            const style = rule.style as any;
            if (!style.fontDisplay) {
              style.fontDisplay = 'swap';
            }
          }
        });
      } catch (e) {
        // Cross-origin stylesheets may throw errors
        console.warn('Could not access stylesheet:', e);
      }
    });
  }

  // Debounce function for performance
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Throttle function for performance
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Get performance metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.performanceMetrics);
  }

  // Clean up observers
  cleanup(): void {
    this.intersectionObserver?.disconnect();
    this.mutationObserver?.disconnect();
  }

  // Optimize scroll performance
  optimizeScrollPerformance(): void {
    if (typeof window === 'undefined') return;

    let ticking = false;

    const updateScrollElements = () => {
      // Update scroll-dependent elements
      const scrollY = window.scrollY;
      const elements = document.querySelectorAll('[data-scroll]');
      
      elements.forEach((element) => {
        const speed = parseFloat(element.getAttribute('data-scroll') || '0.5');
        const transform = `translateY(${scrollY * speed}px)`;
        (element as HTMLElement).style.transform = transform;
      });

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollElements);
        ticking = true;
      }
    };

    // Use passive listeners for better performance
    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // Memory management for large lists
  optimizeLargeList(container: HTMLElement, itemHeight: number, bufferSize: number = 5): void {
    const items = Array.from(container.children) as HTMLElement[];
    const containerHeight = container.clientHeight;
    const visibleItems = Math.ceil(containerHeight / itemHeight) + bufferSize * 2;

    let scrollTop = 0;
    let startIndex = 0;
    let endIndex = Math.min(visibleItems, items.length);

    const updateVisibleItems = this.throttle(() => {
      const newScrollTop = container.scrollTop;
      const newStartIndex = Math.floor(newScrollTop / itemHeight) - bufferSize;
      const newEndIndex = newStartIndex + visibleItems;

      if (newStartIndex !== startIndex || newEndIndex !== endIndex) {
        startIndex = Math.max(0, newStartIndex);
        endIndex = Math.min(items.length, newEndIndex);

        items.forEach((item, index) => {
          if (index >= startIndex && index < endIndex) {
            item.style.display = '';
            item.style.transform = `translateY(${index * itemHeight}px)`;
          } else {
            item.style.display = 'none';
          }
        });
      }

      scrollTop = newScrollTop;
    }, 16); // ~60fps

    container.addEventListener('scroll', updateVisibleItems, { passive: true });
  }
}

// Export singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance();

// Utility functions
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadVideo = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.oncanplaythrough = () => resolve();
    video.onerror = reject;
    video.preload = 'metadata';
    video.src = src;
  });
};

// Initialize performance optimizations
export const initializePerformanceOptimizations = (): void => {
  if (typeof window === 'undefined') return;

  const optimizer = performanceOptimizer;

  // Optimize on page load
  window.addEventListener('load', () => {
    optimizer.optimizeImages();
    optimizer.optimizeFonts();
    optimizer.optimizeScrollPerformance();
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    optimizer.cleanup();
  });
};

export default performanceOptimizer;
