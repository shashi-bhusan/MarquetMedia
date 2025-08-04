'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Hook for using scroll animations with performance optimizations
export const useScrollAnimations = () => {
  const ctx = useRef<gsap.Context | null>(null);

  useEffect(() => {
    ctx.current = gsap.context(() => {
      // Set default ScrollTrigger configuration for better performance
      ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
        ignoreMobileResize: true
      });
    });

    return () => {
      ctx.current?.revert();
      ScrollTrigger.killAll();
    };
  }, []);

  return ctx.current;
};

// Sequential animation system for hero loading
export const createSequentialAnimation = (elements: (string | Element)[], options = {}) => {
  const defaults = {
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.15,
    delay: 0,
    ...options
  };

  const tl = gsap.timeline({ delay: defaults.delay });
  
  elements.forEach((element, index) => {
    const delay = index * defaults.stagger;
    
    // Set initial state
    gsap.set(element, {
      opacity: 0,
      y: 40,
      scale: 0.95,
      filter: "blur(10px)"
    });

    // Animate in
    tl.to(element, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: defaults.duration,
      ease: defaults.ease
    }, delay);
  });

  return tl;
};

// Modern, subtle scroll animations for design agencies
const ScrollAnimations = {
  // Enhanced container reveal with better performance
  containerReveal: (selector: string | Element | Element[], options = {}) => {
    const defaults = {
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.08,
      start: "top 85%",
      ...options
    };

    const elements = typeof selector === 'string' ? 
      document.querySelectorAll(selector) : 
      Array.isArray(selector) ? selector : [selector];

    if (!elements.length) return;

    // Batch DOM reads/writes for better performance
    const animations = Array.from(elements).map((element, index) => {
      // Set initial state with transform3d for GPU acceleration
      gsap.set(element, {
        opacity: 0,
        y: 50,
        scale: 0.9,
        rotationX: 15,
        transformOrigin: "center bottom",
        force3D: true
      });

      return {
        element,
        delay: index * defaults.stagger
      };
    });

    // Use single timeline for better performance
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: elements[0],
        start: defaults.start,
        toggleActions: "play none none none",
        once: true, // Only play once for better performance
        fastScrollEnd: true,
        preventOverlaps: true
      }
    });

    animations.forEach(({ element, delay }) => {
      tl.to(element, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: defaults.duration,
        ease: defaults.ease,
        force3D: true
      }, delay);
    });

    return tl;
  },

  // High-performance fade up with GPU acceleration
  fadeUp: (selector: string | Element | Element[], options = {}) => {
    const defaults = {
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.15,
      start: "top 90%",
      ...options
    };

    const elements = typeof selector === 'string' ? 
      document.querySelectorAll(selector) : 
      Array.isArray(selector) ? selector : [selector];

    if (!elements.length) return;

    // Batch initial setup
    gsap.set(elements, {
      opacity: 0,
      y: 60,
      filter: "blur(12px)",
      force3D: true,
      willChange: "transform, opacity, filter"
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: elements[0],
        start: defaults.start,
        toggleActions: "play none none none",
        once: true,
        fastScrollEnd: true
      }
    });

    tl.to(elements, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: defaults.duration,
      ease: defaults.ease,
      stagger: defaults.stagger,
      force3D: true,
      onComplete: () => {
        // Remove will-change after animation for better performance
        gsap.set(elements, { willChange: "auto" });
      }
    });

    return tl;
  },

  // Minimal slide from left
  slideInLeft: (selector: string | Element | Element[], options = {}) => {
    const defaults = {
      duration: 1.0,
      ease: "power3.out",
      start: "top 85%",
      ...options
    };

    gsap.set(selector, {
      opacity: 0,
      x: -30,
      rotateY: -5
    });

    gsap.to(selector, {
      opacity: 1,
      x: 0,
      rotateY: 0,
      duration: defaults.duration,
      ease: defaults.ease,
      scrollTrigger: {
        trigger: selector,
        start: defaults.start,
        toggleActions: "play none none none"
      }
    });
  },

  // Minimal slide from right
  slideInRight: (selector: string | Element | Element[], options = {}) => {
    const defaults = {
      duration: 1.0,
      ease: "power3.out",
      start: "top 85%",
      ...options
    };

    gsap.set(selector, {
      opacity: 0,
      x: 30,
      rotateY: 5
    });

    gsap.to(selector, {
      opacity: 1,
      x: 0,
      rotateY: 0,
      duration: defaults.duration,
      ease: defaults.ease,
      scrollTrigger: {
        trigger: selector,
        start: defaults.start,
        toggleActions: "play none none none"
      }
    });
  },

  // Enhanced scale reveal with magnetic effect
  scaleReveal: (selector: string | Element | Element[], options = {}) => {
    const defaults = {
      duration: 1.6,
      ease: "elastic.out(1, 0.6)",
      start: "top 85%",
      delay: 0,
      ...options
    };

    const elements = typeof selector === 'string' ? 
      document.querySelectorAll(selector) : 
      Array.isArray(selector) ? selector : [selector];

    if (!elements.length) return;

    // Enhanced initial state with 3D transforms
    gsap.set(elements, {
      opacity: 0,
      scale: 0.7,
      rotationY: 25,
      rotationX: 15,
      transformPerspective: 1000,
      transformOrigin: "center center",
      filter: "blur(15px) brightness(0.8)",
      force3D: true
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: elements[0],
        start: defaults.start,
        toggleActions: "play none none none",
        once: true
      },
      delay: defaults.delay
    });

    tl.to(elements, {
      opacity: 1,
      scale: 1,
      rotationY: 0,
      rotationX: 0,
      filter: "blur(0px) brightness(1)",
      duration: defaults.duration,
      ease: defaults.ease,
      force3D: true,
      stagger: 0.1
    });

    return tl;
  },

  // Clean text reveal
  textReveal: (selector: string | Element | Element[], options = {}) => {
    const defaults = {
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.05,
      start: "top 90%",
      ...options
    };

    gsap.set(selector, {
      opacity: 0,
      y: 15,
      skewY: 2
    });

    gsap.to(selector, {
      opacity: 1,
      y: 0,
      skewY: 0,
      duration: defaults.duration,
      ease: defaults.ease,
      stagger: defaults.stagger,
      scrollTrigger: {
        trigger: selector,
        start: defaults.start,
        toggleActions: "play none none none"
      }
    });
  },

  // Refined image reveal
  imageReveal: (selector: string | Element | Element[], options = {}) => {
    const defaults = {
      duration: 1.6,
      ease: "power4.out",
      start: "top 80%",
      ...options
    };

    gsap.set(selector, {
      opacity: 0,
      scale: 1.05,
      filter: "brightness(1.1)"
    });

    gsap.to(selector, {
      opacity: 1,
      scale: 1,
      filter: "brightness(1)",
      duration: defaults.duration,
      ease: defaults.ease,
      scrollTrigger: {
        trigger: selector,
        start: defaults.start,
        toggleActions: "play none none none"
      }
    });
  },

  // Gentle background parallax
  parallax: (selector: string | Element | Element[], speed = 0.3, options = {}) => {
    gsap.to(selector, {
      yPercent: -30 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: selector,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
        ...options
      }
    });
  },

  // Smooth line draw
  lineDraw: (selector: string | Element | Element[], options = {}) => {
    const defaults = {
      duration: 1.5,
      ease: "power3.out",
      start: "top 85%",
      ...options
    };

    gsap.set(selector, {
      scaleX: 0,
      transformOrigin: "left center",
      opacity: 0.7
    });

    gsap.to(selector, {
      scaleX: 1,
      opacity: 1,
      duration: defaults.duration,
      ease: defaults.ease,
      scrollTrigger: {
        trigger: selector,
        start: defaults.start,
        toggleActions: "play none none none"
      }
    });
  },

  // Clip path reveal (modern agency favorite)
  clipReveal: (selector: string | Element | Element[], options = {}) => {
    const defaults = {
      duration: 1.8,
      ease: "power4.out",
      start: "top 80%",
      ...options
    };

    gsap.set(selector, {
      clipPath: "inset(0 100% 0 0)",
      opacity: 0.9
    });

    gsap.to(selector, {
      clipPath: "inset(0 0% 0 0)",
      opacity: 1,
      duration: defaults.duration,
      ease: defaults.ease,
      scrollTrigger: {
        trigger: selector,
        start: defaults.start,
        toggleActions: "play none none none"
      }
    });
  },

  // Enhanced staggered container reveal (removing duplicate)
  enhancedContainerReveal: (selector: string | Element | Element[], options = {}) => {
    const defaults = {
      duration: 1.0,
      ease: "power3.out",
      stagger: 0.1,
      start: "top 85%",
      ...options
    };

    const children = typeof selector === 'string' 
      ? document.querySelectorAll(`${selector} > *`)
      : (selector as Element).children;

    gsap.set(children, {
      opacity: 0,
      y: 25,
      filter: "blur(4px)"
    });

    gsap.to(children, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: defaults.duration,
      ease: defaults.ease,
      stagger: defaults.stagger,
      scrollTrigger: {
        trigger: selector,
        start: defaults.start,
        toggleActions: "play none none none"
      }
    });
  },

  // Initialize all animations on elements with data attributes
  initAutoAnimations: () => {
    // Auto-initialize based on data attributes
    document.querySelectorAll('[data-animate]').forEach((element) => {
      const animationType = element.getAttribute('data-animate');
      const delay = parseFloat(element.getAttribute('data-delay') || '0');
      const stagger = parseFloat(element.getAttribute('data-stagger') || '0');
      
      const options = { delay, stagger };
      
      switch (animationType) {
        case 'fade-up':
          ScrollAnimations.fadeUp(element, options);
          break;
        case 'slide-left':
          ScrollAnimations.slideInLeft(element, options);
          break;
        case 'slide-right':
          ScrollAnimations.slideInRight(element, options);
          break;
        case 'scale':
          ScrollAnimations.scaleReveal(element, options);
          break;
        case 'text':
          ScrollAnimations.textReveal(element, options);
          break;
        case 'image':
          ScrollAnimations.imageReveal(element, options);
          break;
        case 'line':
          ScrollAnimations.lineDraw(element, options);
          break;
        case 'clip':
          ScrollAnimations.clipReveal(element, options);
          break;
        case 'container':
          ScrollAnimations.containerReveal(element, options);
          break;
      }
    });
  },

  // Batch animate multiple elements with optimal performance
  batchAnimate: (elements: NodeListOf<Element> | Element[], animationType = 'fadeUp', options = {}) => {
    if (!elements || elements.length === 0) return;

    const animation = ScrollAnimations[animationType as keyof typeof ScrollAnimations];
    if (typeof animation === 'function') {
      (animation as Function)(elements, options);
    }
  },

  // Observer for lazy loading animations
  observeElements: (selector: string, animationType = 'fadeUp', options = {}) => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animation = ScrollAnimations[animationType as keyof typeof ScrollAnimations];
            if (typeof animation === 'function') {
              (animation as Function)(entry.target, options);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    document.querySelectorAll(selector).forEach((el) => {
      observer.observe(el);
    });

    return observer;
  }
};

export default ScrollAnimations;
export { ScrollAnimations };

// Usage examples:
// ScrollAnimations.fadeUp('.card', { start: "top 90%" });
// ScrollAnimations.observeElements('.lazy-load', 'fadeUp');
// ScrollAnimations.batchAnimate(elements, 'slideInLeft');
// <div data-animate="fade-up" data-delay="0.2">Content</div>
