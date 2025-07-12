'use client';

import { useRef, useEffect, useState } from 'react';
import { useScrollAnimations, ScrollAnimations } from '@/components/ScrollAnimations';
import Image from 'next/image';

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

// Testimonial data from the provided content table
const testimonials = [
  {
    number: "01",
    brand: "Mocha Cafe & Bar",
    review: "Working with Marquet Media has been a game-changer for our restaurant and bar. From creative shoot planning to flawless execution, they've handled everything — photography, videos, content, and strategy — with incredible professionalism and passion. They make stunning high-quality creative designs which captures the essence of our brand perfectly. They understood our brand from sketch and brought it to life. It is always a pleasure working with such a dedicated and talented team. Truly a one-stop solution for all our marketing needs."
  },
  {
    number: "02",
    brand: "Anardana",
    review: "Marquet Media has been an incredible launch partner for Anardana in Ranchi. From day one, their team brought unmatched expertise in food photography, digital and traditional campaign strategies, and brand storytelling. Their work not only captured the essence of our culinary experience but also drove phenomenal brand awareness — resulting in millions of impressions and impressive footfall. It is rare to find a team that invests so deeply in your story — and with Marquet Media, we found just that."
  },
  {
    number: "03",
    brand: "Swarnabhumi",
    review: "Our journey with Marquet Media has been nothing short of extraordinary. Over the past five years, they've become more than just a marketing agency - they're family. From grand events to subtle brand moments, they've helped bring Swarnabhumi's vision to life with care, creativity, and class. Their dedication, consistency, and warmth make every collaboration feel effortless. It's rare to find a team that invests so deeply in your story — and with Marquet Media, we found just that."
  },
  {
    number: "04",
    brand: "Engine",
    review: "Marquet Media played a pivotal role in amplifying our brand through a powerful influencer marketing campaign, helping us reach over 98 million+ people organically. Their creative concepts, storytelling finesse, and sharp influencer curation generated not just buzz but strong brand recall. The campaign became a cultural moment — and we have Marquet Media to thank for that. We trust their team for their expertise, energy, and unwavering commitment to excellence."
  },
  {
    number: "05",
    brand: "Jerry Land",
    review: "From the very beginning of our journey, Marquet Media has been a true 360° partner for JerryLand. From launch campaigns to rebranding phases, they've consistently delivered standout strategies, storytelling, and execution. Their team thinks ahead, moves fast, and most importantly — they understand the brand and what it stands for. Thanks to them, we've built a strong presence and continue to grow with purpose. They know what they're doing, and it shows."
  },
  // {
  //   number: "06",
  //   brand: "Minu Enhance Developers",
  //   review: "Marquet Media has transformed the way we approach digital marketing for Minu Enhance Developers. Their data-driven strategies, creative execution, and consistent optimization helped us generate not just leads, but quality leads — directly impacting our ROI. The team truly understands the nuances of real estate marketing and crafts campaigns that speak directly to our target audience. We've seen a noticeable uplift in both enquiries and conversions. They're proactive, passionate, and deliver results — exactly the kind of partner every brand needs."
  // },
  {
    number: "06",
    brand: "FirstCry.com",
    review: "Working with Marquet Media has been a breath of fresh air. They are always ahead of the curve — constantly tapping into the latest trends, moments, and formats that connect with our audience. Their UGC-led approach brought authenticity to our campaigns and drove outstanding results — from increased awareness to real, measurable footfall across locations. The team's ability to blend creativity with performance is unmatched. We couldn't have asked for a better digital partner!"
  }
];

// Client Logo Component with theme support
const ClientLogo = ({ brandName }: { brandName: string }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Enhanced dark mode detection to match header component logic
    const checkDarkMode = () => {
      // Check localStorage first (matches header component logic)
      const storedDarkMode = localStorage.getItem("darkMode");
      
      // If localStorage has a value, use it
      if (storedDarkMode !== null) {
        const isDark = storedDarkMode === "true";
        setIsDarkMode(isDark);
        return;
      }
      
      // Fallback: check if dark class is present on document element
      const hasExplicitDarkClass = document.documentElement.classList.contains('dark');
      
      // If no explicit class, fall back to system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Final determination
      const isDark = hasExplicitDarkClass || systemPrefersDark;
      setIsDarkMode(isDark);
    };

    // Initial check
    checkDarkMode();

    // Listen for theme changes on document element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });
    
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    // Listen for localStorage changes (for theme toggle)
    const handleStorageChange = () => {
      checkDarkMode();
    };
    
    window.addEventListener('storage', handleStorageChange);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  const logoMapping = clientLogoMapping[brandName as keyof typeof clientLogoMapping];
  
  if (!logoMapping) {
    return null; // Return null if no logo mapping found
  }

  const logoSrc = isDarkMode ? logoMapping.darkLogo : logoMapping.lightLogo;

  return (
    <div className="flex items-center justify-center h-12 w-16">
      <Image
        src={logoSrc}
        alt={`${brandName} logo`}
        width={64}
        height={48}
        className="h-full w-auto max-w-full object-contain transition-all duration-300"
      />
    </div>
  );
};

export default function TestimonialSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  // Initialize scroll animations
  useScrollAnimations();

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

    // Animate testimonial tiles
    if (sectionRef.current) {
      const testimonialTiles = sectionRef.current.querySelectorAll('.testimonial-tile');
      ScrollAnimations.fadeUp(Array.from(testimonialTiles), { 
        stagger: 0.1,
        start: "top 80%"
      });
    }
  }, []);

  return (
    <section className="min-h-screen bg-cream dark:bg-background text-foreground px-4 md:px-6 lg:px-8 py-40" id="testimonials">
      {/* Top end-to-end horizontal line - full viewport width */}
    
      
      <div className="flex flex-col items-center-safe mx-auto">
        
        {/* Main Heading - Following About Section Style */}
        <div className="text-left flex items-center md:text-center mb-16">
          <div className="">
            <h1 ref={headingRef} className="text-3xl text-wrap sm:text-4xl md:text-4xl lg:text-5xl xl:text-7xl font-light text-foreground leading-tighter mb-8 text-left">
             WHAT OUR <span className="italic font-baskerville tracking-tighter">clients</span> SAY ABOUT THEIR <em className="italic font-baskerville tracking-tighter">transformative journey</em> WITH MARQUET MEDIA.
            </h1>
            <div ref={lineRef} className="w-full h-px bg-border mb-8"></div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="w-full px-16 md:px-24 lg:px-32 max-w-full flex flex-col gap-8 md:gap-16 items-stretch">
          
          {/* Grid of Testimonial Tiles - Sharp Line-based Layout */}
          {/* horizontal line */}
          
          <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-t border-border">
            {testimonials.map((testimonial, index) => {
              return (
                <div 
                  key={testimonial.number}
                  className="testimonial-tile group relative border-b border-r border-border hover:bg-foreground/5 transition-all duration-300"
                >
                  <div className="p-8 lg:p-10 h-full min-h-[350px] md:min-h-[400px] lg:min-h-[450px] flex flex-col">
                  
                  {/* Header with number */}
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-foreground/10 dark:bg-foreground/20 rounded-full mb-2">
                      <span className="text-xs font-montserrat text-foreground/60 font-semibold tracking-wider">
                        {testimonial.number}
                      </span>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 mb-6">
                    <p className="text-sm md:text-base font-montserrat text-foreground/70 leading-relaxed tracking-normal normal-case group-hover:text-foreground/90 transition-colors duration-300">
                      "{testimonial.review}"
                    </p>
                  </div>

                  {/* Logo and company name at bottom */}
                  <div className="mt-auto pt-4 border-t border-border/10">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <ClientLogo brandName={testimonial.brand} />
                      </div>
                      <div>
                        <h3 className="text-sm md:text-base font-montserrat text-foreground font-semibold tracking-normal normal-case leading-tight">
                          {testimonial.brand}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>

                </div>
              </div>
            );
            })}
          </div>
        </div>

      </div>

      
    </section>
  );
}
