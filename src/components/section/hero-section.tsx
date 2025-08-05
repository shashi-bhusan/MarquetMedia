
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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Words to animate sequentially
  const words = ["Elevate", "Your", "Brand.", "Quietly", "Powerful.", "Creatively", "Bold."];
  const taglineWords = ["Marquet", "Media", "—", "Creative", "Media", "House"];

  // Initialize scroll animations
  useScrollAnimations();

  // Sequential word animation effect
  useEffect(() => {
    if (showSplash && currentWordIndex < words.length) {
      const timer = setTimeout(() => {
        setCurrentWordIndex(prev => prev + 1);
      }, 300); // Show each word every 300ms
      return () => clearTimeout(timer);
    }
  }, [showSplash, currentWordIndex, words.length]);

  // Loading progress simulation
  useEffect(() => {
    if (showSplash) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [showSplash]);

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
    if (videoReady && showSplash && loadingProgress >= 100) {
      setTimeout(() => setShowSplash(false), 600); // Slightly longer for elegant exit
    }
  }, [videoReady, loadingProgress, showSplash]);

  useEffect(() => {
    if (showSplash) {
      // Fallback: hide splash after 4s to allow for full animation
      const timeout = setTimeout(() => setShowSplash(false), 4000);
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
      {/* Enhanced Splash Screen */}
      {showSplash && (
        <div className="fixed inset-0 z-50 bg-cream dark:bg-background overflow-hidden">
          
          
          {/* Main Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center">
            {/* Animated Text */}
            <div className="text-center mb-8">
              <div className="text-2xl md:text-4xl font-baskerville font-light text-black dark:text-white tracking-tight mb-4 h-12 md:h-16">
                {words.slice(0, currentWordIndex).map((word, index) => (
                  <span
                    key={index}
                    className="inline-block mr-3 animate-fade-in-up"
                    style={{ 
                      animationDelay: `${index * 300}ms`,
                      letterSpacing: '-0.02em',
                      fontFamily: 'var(--font-baskerville), serif'
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
              
              {/* Tagline Animation */}
              <div className="text-xs md:text-base font-montserrat text-gray-500 dark:text-gray-400 tracking-tight h-6 md:h-8">
                {currentWordIndex >= words.length && (
                  <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    {taglineWords.map((word, index) => (
                      <span
                        key={index}
                        className="inline-block mr-1 animate-fade-in-up"
                        style={{ animationDelay: `${(index * 150) + 2100}ms` }}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Elegant Loader */}
            <div className="w-64 md:w-80">
              {/* Progress Bar */}
              <div className="relative h-1 bg-border dark:bg-border rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                />
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
              
              {/* Progress Text */}
              <div className="flex justify-between items-center mt-3 text-xs font-montserrat">
                <span className="text-gray-400 dark:text-gray-500">Loading Experience</span>
                <span className="text-gray-600 dark:text-gray-400 tabular-nums">
                  {Math.round(Math.min(loadingProgress, 100))}%
                </span>
              </div>
            </div>

            {/* Subtle Loading Dots */}
            <div className="flex space-x-1 mt-6">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="w-2 h-2 bg-primary/40 rounded-full animate-pulse"
                  style={{ animationDelay: `${index * 200}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Text Section */}
      <section 
        ref={heroRef}
        id="home" 
        className={`relative overflow-hidden h-[80vh] bg-cream dark:bg-background text-foreground transition-all duration-1000 ${showSplash ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}
        
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-cream/90 dark:bg-background/90" />
        
        {/* Main Layout Container */}
        <div className="relative h-full flex flex-col justify-between pt-32 md:pt-32 z-10">
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
        className={`relative w-full h-[100vh] overflow-hidden bg-black transition-all duration-1000 ${showSplash ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}
      >
        {/* Background Image while video loads */}
        {!videoReady && (
          <div className="absolute inset-0 z-10">
            <Image 
              src="/image.png"
              alt="Video Loading Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}
        
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
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
