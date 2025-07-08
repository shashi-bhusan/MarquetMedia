'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { ProfessionalButton } from '@/components/ui/professional-button';
import { useScrollAnimations, ScrollAnimations } from '@/components/ScrollAnimations';

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textGridRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLElement>(null);

  // Initialize scroll animations
  useScrollAnimations();

  useEffect(() => {
    // Refined animations for hero elements
    if (logoRef.current) {
      ScrollAnimations.scaleReveal(logoRef.current, { 
        duration: 1.8, 
        start: "top 95%",
        delay: 0.3
      });
    }

    if (textGridRef.current) {
      // Use containerReveal for staggered text animation
      ScrollAnimations.containerReveal(textGridRef.current, { 
        stagger: 0.2,
        start: "top 85%",
        delay: 0.8
      });
    }

    if (videoRef.current) {
      ScrollAnimations.clipReveal(videoRef.current, { 
        duration: 2.2,
        start: "top 90%" 
      });
    }
  }, []);

  return (
    <>
      {/* Hero Text Section */}
      <section 
        ref={heroRef}
        id="home" 
        className="relative overflow-hidden h-[80vh] bg-cream dark:bg-background text-foreground"
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
                    Elevating brands with bespoke creative solutions and data-driven marketing campaigns.
                  </p>
                </div>

                {/* Second Text Grid */}
                <div className="space-y-2">
                  <p className="text-xs md:text-sm font-montserrat text-foreground uppercase leading-4 tracking-tighter">
                    UNLEASHING BRAND POTENTIAL WITH CREATIVE CAMPAIGNS, TARGETED STRATEGIES & DATA-DRIVEN INSIGHTS.
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
                    onClick={() => {
                      const portfolioSection = document.getElementById('portfolio');
                      if (portfolioSection) {
                        portfolioSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Let's Collaborate
                  </ProfessionalButton>
                </div>

                {/* Arrow Grid */}
                <div className="flex justify-end items-start">
                  <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                    <svg 
                      className="w-6 h-6 md:w-8 md:h-8 text-foreground" 
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
        ref={videoRef}
        className="relative w-full h-[100vh] overflow-hidden bg-black"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/marquetmedia.mp4" type="video/mp4" />
        </video>
        
        {/* Refined overlay for better contrast */}
        <div className="absolute"></div>
      </section>
    </>
  );
}
