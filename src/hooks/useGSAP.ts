'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const useGSAP = () => {
  const ctx = useRef<gsap.Context | null>(null);

  useEffect(() => {
    ctx.current = gsap.context(() => {});
    return () => ctx.current?.revert();
  }, []);

  return ctx.current;
};

// Animation presets for consistency
export const animations = {
  // Elegant fade in with stagger
  fadeInUp: (elements: string | Element[], delay = 0, stagger = 0.1) => ({
    from: { opacity: 0, y: 60, scale: 0.95 },
    to: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      duration: 1.2,
      delay,
      stagger,
      ease: "power3.out"
    }
  }),

  // Professional slide in
  slideInLeft: (elements: string | Element[], delay = 0) => ({
    from: { opacity: 0, x: -100, skewX: 5 },
    to: { 
      opacity: 1, 
      x: 0, 
      skewX: 0,
      duration: 1.4,
      delay,
      ease: "power4.out"
    }
  }),

  // Smooth scale reveal
  scaleReveal: (elements: string | Element[], delay = 0) => ({
    from: { opacity: 0, scale: 0.8, rotate: 3 },
    to: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      duration: 1.6,
      delay,
      ease: "elastic.out(1, 0.8)"
    }
  }),

  // Text reveal with mask
  textReveal: (elements: string | Element[], delay = 0, stagger = 0.05) => ({
    from: { 
      opacity: 0, 
      y: 100,
      rotateX: 90,
      transformOrigin: "50% 100%"
    },
    to: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      duration: 1,
      delay,
      stagger,
      ease: "power2.out"
    }
  }),

  // Scrub text reveal for scroll-triggered animations
  scrubTextReveal: (trigger: string | Element, elements: string | Element[]) => {
    const elementsArray = typeof elements === 'string' ? 
      gsap.utils.toArray(elements) : 
      Array.isArray(elements) ? elements : [elements];

    elementsArray.forEach((element, index) => {
      gsap.fromTo(element as Element, 
        {
          opacity: 0,
          y: 50,
          rotateY: 45,
          transformOrigin: "left center"
        },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: trigger,
            start: "top 85%",
            end: "top 15%",
            scrub: 1.5,
            toggleActions: "play none none reverse",
            id: `text-reveal-${index}`
          }
        }
      );
    });
  },

  // Parallax effect
  parallax: (element: string | Element, speed: number = 0.5) => {
    gsap.to(element, {
      yPercent: -50 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  },

  // Magnetic hover effect
  magneticHover: (element: string | Element) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const { left, top, width, height } = (el as HTMLElement).getBoundingClientRect();
      const x = (mouseEvent.clientX - left - width / 2) * 0.3;
      const y = (mouseEvent.clientY - top - height / 2) * 0.3;
      
      gsap.to(el, {
        x,
        y,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }
};

// Timeline utilities
export const createTimeline = (options?: gsap.TimelineVars) => {
  return gsap.timeline(options);
};

// Scroll-triggered animations
export const scrollAnimation = (
  trigger: string | Element,
  animation: gsap.TweenVars,
  options?: ScrollTrigger.Vars
) => {
  return gsap.to(trigger, {
    ...animation,
    scrollTrigger: {
      trigger,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
      ...options
    }
  });
};
