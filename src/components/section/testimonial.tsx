'use client';

import { useRef, useEffect } from 'react';
import { useScrollAnimations, ScrollAnimations } from '@/components/ScrollAnimations';

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
  {
    number: "06",
    brand: "Minu Enhance Developers",
    review: "Marquet Media has transformed the way we approach digital marketing for Minu Enhance Developers. Their data-driven strategies, creative execution, and consistent optimization helped us generate not just leads, but quality leads — directly impacting our ROI. The team truly understands the nuances of real estate marketing and crafts campaigns that speak directly to our target audience. We've seen a noticeable uplift in both enquiries and conversions. They're proactive, passionate, and deliver results — exactly the kind of partner every brand needs."
  },
  {
    number: "07",
    brand: "FirstCry.com",
    review: "Working with Marquet Media has been a breath of fresh air. They are always ahead of the curve — constantly tapping into the latest trends, moments, and formats that connect with our audience. Their UGC-led approach brought authenticity to our campaigns and drove outstanding results — from increased awareness to real, measurable footfall across locations. The team's ability to blend creativity with performance is unmatched. We couldn't have asked for a better digital partner!"
  }
];

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
          {/* Grid of Testimonial Tiles - 3x3 Grid Layout with 7 testimonials */}
          <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-0 border-l border-border/90">
            {testimonials.map((testimonial, index) => {
              // Define special layouts for certain testimonials
              let gridClass = "";
              if (index === 0) {
                // First testimonial spans 2 columns
                gridClass = "";
              } else if (index === 5) {
                // Last testimonial spans 2 columns in bottom row
                gridClass = "md:row-span-2";
              } else if (index === 6) {
                // Fifth testimonial spans 2 rows
                gridClass = "md:col-span-2";
              }
              
              return (
                <div 
                  key={testimonial.number}
                  className={`testimonial-tile group relative border-b border-r border-border/90 hover:bg-foreground/5 transition-all duration-300 ${gridClass}`}
                >
                  <div className="p-8 lg:p-10 h-full min-h-[300px] md:min-h-[350px] lg:min-h-[400px] flex flex-col">
                  
                  {/* Header with number only */}
                  <div className="mb-6">
                    <span className="text-xs font-montserrat text-foreground/30 font-medium tracking-wider uppercase">
                      {testimonial.number}
                    </span>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 mb-6">
                    <p className="text-xs md:text-sm font-montserrat text-foreground/80 leading-4 tracking-tighter uppercase group-hover:text-foreground transition-colors duration-300">
                      {testimonial.review}
                    </p>
                  </div>

                  {/* Company name at bottom left */}
                  <div className="mt-auto">
                    <h3 className="text-xs md:text-sm font-montserrat text-foreground font-medium tracking-tighter uppercase leading-4">
                      {testimonial.brand}
                    </h3>
                  </div>

                  {/* Subtle corner accent */}
                  <div className="absolute top-0 right-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-foreground/20"></div>
                  </div>

                </div>
              </div>
            );
            })}
          </div>
        </div>

      </div>

      {/* Bottom end-to-end horizontal line - full viewport width */}
      <div className="w-screen border-t border-border/90 absolute left-0"></div>
    </section>
  );
}
