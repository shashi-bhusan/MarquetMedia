
'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { ProfessionalButton } from '@/components/ui/professional-button';
import { useScrollAnimations, ScrollAnimations } from '@/components/ScrollAnimations';

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textGridRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [splashTimeout, setSplashTimeout] = useState<NodeJS.Timeout | null>(null);

  // Initialize scroll animations
  useScrollAnimations();

  useEffect(() => {
    if (!showSplash) {
      // Animate hero elements after splash
      if (logoRef.current) {
        ScrollAnimations.scaleReveal(logoRef.current, { 
          duration: 1.8, 
          start: "top 95%",
          delay: 0.3
        });
      }
      if (textGridRef.current) {
        ScrollAnimations.containerReveal(textGridRef.current, { 
          stagger: 0.2,
          start: "top 85%",
          delay: 0.8
        });
      }
    }
  }, [showSplash]);

  // Hide splash when video is ready or after fallback timeout
  useEffect(() => {
    if (videoReady && showSplash) {
      setTimeout(() => setShowSplash(false), 400); // quick fade
    }
  }, [videoReady]);

  useEffect(() => {
    if (showSplash) {
      // Fallback: hide splash after 2.5s if video is slow
      const timeout = setTimeout(() => setShowSplash(false), 2500);
      setSplashTimeout(timeout);
      return () => clearTimeout(timeout);
    } else if (splashTimeout) {
      clearTimeout(splashTimeout);
    }
  }, [showSplash]);

  // Handler for video ready
  const handleVideoCanPlay = () => {
    setVideoReady(true);
  };

  return (
    <>
      {/* Splash Screen */}
      {showSplash && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-black transition-opacity duration-700" style={{ pointerEvents: 'none' }}>
          <span
            className="text-2xl md:text-4xl font-baskerville font-light text-black dark:text-white tracking-tight text-center select-none mb-4"
            style={{ letterSpacing: '-0.02em', fontFamily: 'var(--font-baskerville), serif', background: 'none' }}
          >
            Elevate Your Brand. Quietly Powerful. Creatively Bold.
          </span>
          <span className="text-xs md:text-base font-montserrat text-gray-500 dark:text-gray-400 tracking-tight text-center select-none">
            Marquet Media — Creative Media House
          </span>
        </div>
      )}

      {/* Hero Text Section */}
      <section 
        ref={heroRef}
        id="home" 
        className={`relative overflow-hidden h-[80vh] bg-cream dark:bg-background text-foreground transition-opacity duration-700 ${showSplash ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        {/* Main Layout Container */}
        <div className="relative h-full flex flex-col justify-between pt-32 md:pt-32">
          {/* Main Content - Full Width */}
          <div className="w-full px-4 md:px-6 lg:px-8 max-w-full flex-1 flex flex-col justify-center">
            {/* Primary Headline */}
            <header className="font-md text-center">
              {/* MARQUET - Full Width */}
              <div ref={logoRef} className="w-full">
                <Image 
                  src="/MARQUET.svg"
                  alt="Marquet"
                  width={0}
                  height={0}
                  className="w-full h-auto svg-logo"
                  priority
                />
              </div>
            </header>
            {/* Bottom Grid */}
            <div ref={textGridRef} className="mt-auto mb-8">
              <div className="grid grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-full mx-auto">
                {/* First Text Grid */}
                <div className="space-y-2">
                  <p className="text-xs md:text-sm font-montserrat text-foreground uppercase leading-4 tracking-tighter">
                    Where strategy meets subtle storytelling
                  </p>
                </div>
                {/* Second Text Grid */}
                <div className="space-y-2">
                  <p className="text-xs md:text-sm font-montserrat text-foreground uppercase leading-4 tracking-tighter">
                    Elevating brands across Jharkhand and East India through thoughtful marketing
                  </p>
                </div>
                {/* CTA Grid */}
                <div className="flex items-end">
                  <ProfessionalButton
                    variant="professional"
                    size="lg"
                    className="font-montserrat font-medium px-6 py-3 text-xs uppercase tracking-wider"
                    magneticStrength={20}
                    hoverScale={1.03}
                    showContactForm={true}
                  >
                    Start A Project
                  </ProfessionalButton>
                </div>
                {/* Arrow Grid */}
                <div className="flex justify-end items-start">
                  <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                    <svg 
                      className="w-6 h-6 md:w-8 rotate-90 md:h-8 text-foreground" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1} 
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section Below */}
      <section 
        className={`relative w-full h-[100vh] overflow-hidden bg-black transition-opacity duration-700 ${showSplash ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          poster="/marquetmedia-poster.jpg"
          onCanPlay={handleVideoCanPlay}
          onError={() => setVideoReady(true)}
          style={{
            willChange: 'auto', // Remove will-change after video loads
          }}
        >
          <source src="/marquetmedia.mp4" type="video/mp4" />
          <source src="/marquetmedia.webm" type="video/webm" />
          {/* Fallback text for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
        {/* Refined overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
      </section>
    </>
  );
}
