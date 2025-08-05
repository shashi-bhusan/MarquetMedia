'use client';

import { useEffect } from 'react';

export const PerformanceInitializer = () => {
  useEffect(() => {
    // Performance optimizations that should run once on app initialization
    
    // 1. Preload critical resources
    const preloadCriticalResources = () => {
      // Preload the hero logo
      const logoLink = document.createElement('link');
      logoLink.rel = 'preload';
      logoLink.href = '/MARQUET.svg';
      logoLink.as = 'image';
      document.head.appendChild(logoLink);

      // Preload hero video poster
      const posterLink = document.createElement('link');
      posterLink.rel = 'preload';
      posterLink.href = '/image.png';
      posterLink.as = 'image';
      document.head.appendChild(posterLink);
    };

    // 2. Set up performance observers
    const setupPerformanceObservers = () => {
      if ('PerformanceObserver' in window) {
        // Monitor largest contentful paint
        const lcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              // Log LCP for monitoring (remove in production)
              console.log(`LCP: ${entry.startTime.toFixed(2)}ms`);
            }
          }
        });

        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // Browser doesn't support this entry type
        }

        // Monitor cumulative layout shift
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              // Log CLS for monitoring (remove in production)
              console.log(`CLS: ${(entry as any).value.toFixed(4)}`);
            }
          }
        });

        try {
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          // Browser doesn't support this entry type
        }
      }
    };

    // 3. Optimize animations based on device capabilities
    const optimizeAnimations = () => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      if (prefersReducedMotion.matches) {
        // Add CSS class to disable animations
        document.documentElement.classList.add('reduce-motion');
      }

      // Check device capabilities
      const isLowEndDevice = navigator.hardwareConcurrency <= 2;
      const hasSlowConnection = (navigator as any).connection?.effectiveType === '2g';
      
      if (isLowEndDevice || hasSlowConnection) {
        document.documentElement.classList.add('low-performance');
      }
    };

    // 4. Set up service worker for caching (if available)
    const setupServiceWorker = () => {
      if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        navigator.serviceWorker.register('/sw.js').catch((error) => {
          console.log('ServiceWorker registration failed:', error);
        });
      }
    };

    // Run performance optimizations
    preloadCriticalResources();
    setupPerformanceObservers();
    optimizeAnimations();
    setupServiceWorker();

    // Cleanup function
    return () => {
      // Remove any performance observers if needed
      if ('PerformanceObserver' in window) {
        // Observers will be cleaned up automatically when component unmounts
      }
    };
  }, []);

  return null; // This component doesn't render anything
};
