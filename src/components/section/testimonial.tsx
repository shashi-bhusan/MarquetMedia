'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useScrollAnimations, ScrollAnimations } from '@/components/ScrollAnimations';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedThemeImage from '@/components/ui/OptimizedThemeImage';
import { useLegacyTheme } from '@/hooks/useLegacyTheme';

// Client logo mapping - explicit mapping provided by client
const clientLogoMapping = {
  "Mocha Cafe & Bar": { lightLogo: '/protfolio_logo_light/Frame 3.png', darkLogo: '/protfolio_logo_dark/Frame 3.png' },
  "Anardana": { lightLogo: '/protfolio_logo_light/Frame 8.png', darkLogo: '/protfolio_logo_dark/Frame 8.png' },
  "Swarnabhumi": { lightLogo: '/protfolio_logo_light/Frame 11.png', darkLogo: '/protfolio_logo_dark/Frame 11.png' },
  "Engine": { lightLogo: '/protfolio_logo_light/Frame 15.png', darkLogo: '/protfolio_logo_dark/Frame 15.png' },
  "Jerry Land": { lightLogo: '/protfolio_logo_light/1.png', darkLogo: '/protfolio_logo_dark/1.png' },
  "Minu Enhance Developers": { lightLogo: '/protfolio_logo_light/Frame 9.png', darkLogo: '/protfolio_logo_dark/Frame 9.png' },
  "FirstCry.com": { lightLogo: '/protfolio_logo_light/Frame 2.png', darkLogo: '/protfolio_logo_dark/Frame 2.png' },
};

// Testimonial data - Client reviews from provided content
const testimonials = [
  {
    brand: "Mocha Cafe & Bar",
    review: "Working with Marquet Media has been a game-changer for our restaurant and bar. From creative shoot planning to flawless execution, they've handled everything — photography, videos, content, and strategy — with incredible professionalism and passion. They make stunning high-quality creative designs which captures the essence of our brand perfectly. They understood our brand from sketch and brought it to life. It is always a pleasure working with such a dedicated and talented team. Truly a one-stop solution for all our marketing needs."
  },
  {
    brand: "Anardana",
    review: "Marquet Media has been an incredible launch partner for Anardana in Ranchi. From day one, their team brought unmatched expertise in food photography, digital and traditional campaign strategies, and brand storytelling. Their work not only captured the essence of our culinary experience but also drove phenomenal brand awareness — resulting in millions of impressions and impressive footfall. It is rare to find a team that invests so deeply in your story — and with Marquet Media, we found just that."
  },
  {
    brand: "Swarnabhumi",
    review: "Our journey with Marquet Media has been nothing short of extraordinary. Over the past five years, they've become more than just a marketing agency - they're family. From grand events to subtle brand moments, they've helped bring Swarnabhumi's vision to life with care, creativity, and class. Their dedication, consistency, and warmth make every collaboration feel effortless. It's rare to find a team that invests so deeply in your story — and with Marquet Media, we found just that."
  },
  {
    brand: "Engine",
    review: "Marquet Media played a pivotal role in amplifying our brand through a powerful influencer marketing campaign, helping us reach over 98 million+ people organically. Their creative concepts, storytelling finesse, and sharp influencer curation generated not just buzz but strong brand recall. The campaign became a cultural moment — and we have Marquet Media to thank for that. We trust their team for their expertise, energy, and unwavering commitment to excellence."
  },
  {
    brand: "Jerry Land",
    review: "From the very beginning of our journey, Marquet Media has been a true 360° partner for JerryLand. From launch campaigns to rebranding phases, they've consistently delivered standout strategies, storytelling, and execution. Their team thinks ahead, moves fast, and most importantly — they understand the brand and what it stands for. Thanks to them, we've built a strong presence and continue to grow with purpose. They know what they're doing, and it shows."
  },
  {
    brand: "Minu Enhance Developers",
    review: "Marquet Media has transformed the way we approach digital marketing for Minu Enhance Developers. Their data-driven strategies, creative execution, and consistent optimization helped us generate not just leads, but quality leads — directly impacting our ROI. The team truly understands the nuances of real estate marketing and crafts campaigns that speak directly to our target audience. We've seen a noticeable uplift in both enquiries and conversions. They're proactive, passionate, and deliver results — exactly the kind of partner every brand needs."
  },
  {
    brand: "FirstCry.com",
    review: "Working with Marquet Media has been a breath of fresh air. They are always ahead of the curve — constantly tapping into the latest trends, moments, and formats that connect with our audience. Their UGC-led approach brought authenticity to our campaigns and drove outstanding results — from increased awareness to real, measurable footfall across locations. The team's ability to blend creativity with performance is unmatched. We couldn't have asked for a better digital partner!"
  }
];

// Client Logo Component with theme support - Enhanced size
const ClientLogo = ({ brandName }: { brandName: string }) => {
  const { isDarkMode } = useLegacyTheme();

  const logoMapping = clientLogoMapping[brandName as keyof typeof clientLogoMapping];
  
  if (!logoMapping) {
    return null; // Return null if no logo mapping found
  }

  return (
    <div className="flex items-center justify-center h-16 w-24 md:h-20 md:w-32 lg:h-24 lg:w-36">
      <OptimizedThemeImage
        lightSrc={logoMapping.lightLogo}
        darkSrc={logoMapping.darkLogo}
        isDarkMode={isDarkMode}
        alt={`${brandName} logo`}
        width={144}
        height={96}
  className={`h-full w-auto max-w-full object-contain transition-all duration-300 filter hover:brightness-110${isDarkMode ? ' grayscale brightness-200 contrast-200' : ''}`}
        priority
        preloadBoth={true}
      />
    </div>
  );
};

export default function TestimonialSection() {

  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastScrollTimeRef = useRef<number>(0);

  // Memoize duplicated testimonials to prevent recreation on every render
  const duplicatedTestimonials = useMemo(() => [...testimonials, ...testimonials], []);

  // State management with better performance
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Initialize scroll animations
  useScrollAnimations();

  // Constants for better performance
  const CARD_WIDTH_MOBILE = useMemo(() => {
    if (typeof window === 'undefined') return 400;
    return Math.min(window.innerWidth * 0.9, 400);
  }, []);
  const CARD_WIDTH_DESKTOP = 400;
  const SCROLL_SPEED = 0.5; // Slower, smoother scrolling
  const THROTTLE_DELAY = 16; // 60fps throttling

  // Optimized scroll boundary checking with throttling
  const updateScrollButtons = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft < maxScrollLeft - 1);
  }, []);

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const now = Date.now();
    if (now - lastScrollTimeRef.current < THROTTLE_DELAY) return;
    
    lastScrollTimeRef.current = now;
    
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = window.innerWidth < 640 ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP;
    const totalOriginalWidth = testimonials.length * cardWidth;
    const currentScroll = container.scrollLeft % totalOriginalWidth;
    const progress = Math.min((currentScroll / totalOriginalWidth) * 100, 100);
    
    // Use requestAnimationFrame for smooth updates
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      setScrollProgress(progress);
      updateScrollButtons();
    });
  }, [CARD_WIDTH_MOBILE, CARD_WIDTH_DESKTOP, updateScrollButtons]);

  // Optimized auto-scroll with requestAnimationFrame
  useEffect(() => {
    if (!scrollContainerRef.current || isHovered) return;

    const container = scrollContainerRef.current;
    if (typeof window === 'undefined') return;
    let rafId: number;
    
    const autoScroll = () => {
      if (!container || isHovered) return;
      
      const currentScroll = container.scrollLeft;
      const cardWidth = window.innerWidth < 640 ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP;
      const totalOriginalWidth = testimonials.length * cardWidth;
      
      // Smooth infinite scroll with reset
      if (currentScroll >= totalOriginalWidth - 1) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft = currentScroll + SCROLL_SPEED;
      }
      
      rafId = requestAnimationFrame(autoScroll);
    };

    rafId = requestAnimationFrame(autoScroll);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isHovered, CARD_WIDTH_MOBILE, CARD_WIDTH_DESKTOP]);

  // Optimized navigation with better user feedback
  const scrollTo = useCallback((direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    setIsHovered(true);
    if (typeof window === 'undefined') return;
    
    const container = scrollContainerRef.current;
    const cardWidth = window.innerWidth < 640 ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    
    // Use smooth scrolling with better easing
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
    
    // Provide immediate visual feedback
    updateScrollButtons();
    
    // Resume auto-scroll after user interaction
    const resumeTimeout = setTimeout(() => {
      setIsHovered(false);
    }, 3000); // Reduced from 5s for better UX
    
    return () => clearTimeout(resumeTimeout);
  }, [CARD_WIDTH_MOBILE, CARD_WIDTH_DESKTOP, updateScrollButtons]);

  // Attach scroll event listener with cleanup
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    // Animate main heading with container reveal
    if (headingRef.current) {
      ScrollAnimations.containerReveal(headingRef.current, { 
        stagger: 0.08,
        start: "top 85%"
      });
    }

    // Animate divider line
    if (lineRef.current) {
      ScrollAnimations.lineDraw(lineRef.current, { 
        duration: 1.5,
        start: "top 90%" 
      });
    }

    // Animate scroll container
    if (scrollContainerRef.current) {
      ScrollAnimations.fadeUp(scrollContainerRef.current, { 
        delay: 0.3,
        start: "top 80%"
      });
    }
  }, []);

  return (
    <>
      {/* Optimized styles for smooth scrolling performance */}
      <style jsx>{`
        .testimonial-scroll {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          transform: translateZ(0); /* Force hardware acceleration */
          will-change: scroll-position;
        }
        
        .testimonial-scroll::-webkit-scrollbar {
          display: none;
        }
        
        .testimonial-tile {
          transform: translateZ(0); /* Force hardware acceleration for tiles */
          will-change: transform;
          backface-visibility: hidden;
        }
        
        /* Optimize scrolling on mobile */
        @media (max-width: 640px) {
          .testimonial-scroll {
            scroll-snap-type: x mandatory;
            scroll-padding: 0 1rem;
          }
          
          .testimonial-tile {
            scroll-snap-align: start;
            scroll-snap-stop: always;
          }
        }
        
        /* Improve hover performance */
        .testimonial-tile:hover {
          transform: translateZ(0);
        }
      `}</style>
      
        <section className="min-h-screen bg-background dark:bg-background text-foreground px-2 sm:px-4 md:px-6 lg:px-8 py-20 md:py-40" id="testimonials">
      
      <div className="flex flex-col items-center mx-auto max-w-8xl">
        
        {/* Main Heading - Responsive typography */}
        <div className="text-center mb-12 md:mb-16 px-4">
          <div ref={lineRef} className="w-full h-px bg-border mb-6 md:mb-8"></div>
          <h1 ref={headingRef} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-light text-foreground leading-tight md:leading-tighter mb-6 md:mb-8 max-w-6xl mx-auto">
           WHAT OUR <span className="italic font-baskerville tracking-tighter">clients</span> SAY ABOUT THEIR <em className="italic font-baskerville tracking-tighter">transformative journey</em> WITH MARQUET MEDIA.
          </h1>
        </div>

        {/* Main Content - Responsive Horizontal Scroll */}
        <div className="w-full px-2 sm:px-4 md:px-8 lg:px-16 max-w-full mx-auto">
          
          {/* Navigation Header - Mobile optimized */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="text-xs md:text-sm font-montserrat text-foreground/60 uppercase tracking-wider">
              {testimonials.length} Client Stories
            </div>
            
            {/* Navigation Controls - Hidden on mobile, visible on tablet+ */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scrollTo('left')}
                disabled={!canScrollLeft}
                className={`group flex items-center justify-center w-10 h-10 border border-border transition-all duration-300 ${
                  canScrollLeft 
                    ? 'hover:border-foreground/40 hover:bg-foreground/5 text-foreground/60 hover:text-foreground' 
                    : 'text-foreground/20 border-border/30 cursor-not-allowed'
                }`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => scrollTo('right')}
                disabled={!canScrollRight}
                className={`group flex items-center justify-center w-10 h-10 border border-border transition-all duration-300 ${
                  canScrollRight 
                    ? 'hover:border-foreground/40 hover:bg-foreground/5 text-foreground/60 hover:text-foreground' 
                    : 'text-foreground/20 border-border/30 cursor-not-allowed'
                }`}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Container - Optimized for performance */}
          <div className="relative border-t border-border">
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto testimonial-scroll gap-0"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <div 
                  key={`${testimonial.brand}-${index}`}
                  className="testimonial-tile group relative border-r border-b border-border hover:bg-foreground/5 transition-colors duration-300 flex-shrink-0"
                  style={{ 
                    width: 'min(90vw, 400px)',
                    minHeight: '500px',
                    contain: 'layout style paint' // CSS containment for better performance
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onTouchStart={() => setIsHovered(true)}
                  onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
                >
                  <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
                    
                    {/* Header with logo - optimized rendering */}
                    <div className="flex items-center justify-end mb-4 sm:mb-6">
                      <div className="flex-shrink-0">
                        <ClientLogo brandName={testimonial.brand} />
                      </div>
                    </div>

                    {/* Review Content - Optimized text rendering */}
                    <div className="flex-1 mb-4 sm:mb-6 overflow-hidden">
                      <blockquote className="text-xs sm:text-sm md:text-sm font-montserrat text-foreground/80 leading-relaxed sm:leading-loose group-hover:text-foreground/90 transition-colors duration-300 font-normal tracking-normal">
                        "{testimonial.review}"
                      </blockquote>
                    </div>

                    {/* Brand name at bottom */}
                    <div className="mt-auto pt-3 sm:pt-4 border-t border-border/10">
                      <h3 className="text-sm sm:text-base md:text-lg font-baskerville text-foreground font-semibold tracking-normal leading-tight">
                        {testimonial.brand}
                      </h3>
                    </div>

                    {/* Optimized gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                         style={{ willChange: 'opacity' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimized Scroll Progress Indicator */}
          <div className="mt-4 sm:mt-6 flex items-center justify-center">
            <div className="w-24 sm:w-32 md:w-40 h-1 bg-border/30 overflow-hidden rounded-full">
              <div 
                className="h-full bg-foreground/60 transition-all duration-200 ease-out rounded-full"
                style={{ 
                  width: `${scrollProgress}%`,
                  willChange: 'width',
                  transform: 'translateZ(0)'
                }}
              />
            </div>
          </div>

          {/* Mobile Navigation Hint */}
          <div className="sm:hidden mt-4 text-center">
            <p className="text-xs font-montserrat text-foreground/40 uppercase tracking-wider">
              Swipe to explore more stories
            </p>
          </div>
        </div>

      </div>

      
    </section>
    </>
  );
}
