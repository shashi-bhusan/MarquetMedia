'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    // Hide default cursor
    document.body.style.cursor = 'none';

    let mouseX = 0;
    let mouseY = 0;

    // Set initial position
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(follower, { xPercent: -50, yPercent: -50 });

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Animate cursor (fast)
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out"
      });

      // Animate follower (slower for trailing effect)
      gsap.to(follower, {
        x: mouseX,
        y: mouseY,
        duration: 0.6,
        ease: "power2.out"
      });
    };

    const handleMouseEnter = () => {
      gsap.to([cursor, follower], {
        opacity: 1,
        duration: 0.3
      });
    };

    const handleMouseLeave = () => {
      gsap.to([cursor, follower], {
        opacity: 0,
        duration: 0.3
      });
    };

    // Enhanced interactive elements hover effects
    const handleHoverStart = () => {
      gsap.to(cursor, {
        scale: 0.3,
        duration: 0.4,
        ease: "back.out(1.7)"
      });
      gsap.to(follower, {
        scale: 2.5,
        duration: 0.6,
        ease: "power2.out"
      });
    };

    const handleHoverEnd = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)"
      });
      gsap.to(follower, {
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    };

    // Special effect for professional buttons
    const handleProfessionalHover = () => {
      gsap.to(cursor, {
        scale: 0.2,
        duration: 0.3,
        ease: "back.out(2)"
      });
      gsap.to(follower, {
        scale: 3,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .magnetic, .interactive');
    const professionalButtons = document.querySelectorAll('[data-professional-button], .professional-button');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    // Enhanced effects for professional buttons
    professionalButtons.forEach(el => {
      el.addEventListener('mouseenter', handleProfessionalHover);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    // Cleanup
    return () => {
      document.body.style.cursor = 'auto';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });

      professionalButtons.forEach(el => {
        el.removeEventListener('mouseenter', handleProfessionalHover);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white mix-blend-difference rounded-full pointer-events-none z-[9999] opacity-0 shadow-lg"
      />
      
      {/* Follower circle */}
      <div 
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border-1 border-white/40 mix-blend-difference rounded-full pointer-events-none z-[9998] opacity-0 "
      />
    </>
  );
}
