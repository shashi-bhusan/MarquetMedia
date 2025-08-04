// Animation performance configuration
export const animationConfig = {
  // Reduce motion for users who prefer it
  respectReducedMotion: true,
  
  // Performance-optimized defaults
  defaults: {
    duration: 0.8,
    ease: "power3.out",
    force3D: true, // Hardware acceleration
    transformOrigin: "center center",
    stagger: 0.1
  },

  // Loading sequence timing
  loading: {
    stepDuration: 700,
    minDisplayTime: 2500,
    maxWaitTime: 4000,
    exitDuration: 800
  },

  // Hero animations
  hero: {
    logoReveal: {
      duration: 1.8,
      ease: "power3.out",
      delay: 0.3
    },
    textGrid: {
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.2,
      delay: 0.5
    },
    videoFade: {
      duration: 1.5,
      ease: "power3.out"
    }
  },

  // Scroll animations
  scroll: {
    fadeUp: {
      duration: 1.0,
      ease: "power3.out",
      start: "top 85%",
      y: 40
    },
    scaleReveal: {
      duration: 1.2,
      ease: "power3.out",
      start: "top 80%",
      scale: 0.95
    },
    slideIn: {
      duration: 0.8,
      ease: "power3.out",
      start: "top 75%",
      x: 50
    }
  },

  // Video player animations
  video: {
    fadeIn: {
      duration: 1.5,
      ease: "power3.out",
      scale: 1.05,
      blur: 8
    },
    loading: {
      spinnerDuration: 1.2,
      progressEase: "power2.out"
    }
  }
};

// Performance utilities
export const performanceUtils = {
  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Get optimal animation settings based on device
  getOptimalSettings: () => {
    if (typeof window === 'undefined') return animationConfig.defaults;
    
    const { performance, navigator } = window;
    const isLowEnd = navigator.hardwareConcurrency <= 2;
    const hasSlowConnection = (navigator as any).connection?.effectiveType === '2g';
    
    if (isLowEnd || hasSlowConnection) {
      return {
        ...animationConfig.defaults,
        duration: animationConfig.defaults.duration * 0.7,
        stagger: animationConfig.defaults.stagger * 0.5
      };
    }
    
    return animationConfig.defaults;
  },

  // Memory-efficient cleanup
  cleanupAnimations: (context: any) => {
    if (context && typeof context.revert === 'function') {
      context.revert();
    }
  }
};

// Video optimization settings
export const videoConfig = {
  // Quality settings based on device
  getQualitySettings: () => {
    if (typeof window === 'undefined') return 'auto';
    
    const { screen, navigator } = window;
    const pixelRatio = window.devicePixelRatio || 1;
    const screenWidth = screen.width * pixelRatio;
    
    // High-end devices
    if (screenWidth >= 2560 && navigator.hardwareConcurrency >= 8) {
      return 'high';
    }
    
    // Mid-range devices
    if (screenWidth >= 1920 && navigator.hardwareConcurrency >= 4) {
      return 'medium';
    }
    
    // Low-end devices or slow connections
    const connection = (navigator as any).connection;
    if (connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g')) {
      return 'low';
    }
    
    return 'auto';
  },

  // Preload strategy
  preloadStrategy: {
    hero: 'metadata', // Always preload hero video metadata
    portfolio: 'none', // Lazy load portfolio videos
    bts: 'none' // Lazy load BTS videos
  }
};
