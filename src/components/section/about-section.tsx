'use client';

import { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ProfessionalButton } from "@/components/ui/professional-button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimations, ScrollAnimations } from '@/components/ScrollAnimations';

export default function AboutSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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

    // Animate content sections with subtle fade up
    if (contentRef.current) {
      const contentSections = contentRef.current.querySelectorAll('.animate-section');
      ScrollAnimations.fadeUp(Array.from(contentSections), { 
        stagger: 0.15,
        start: "top 85%"
      });
    }
  }, []);
  return (
    <section className="min-h-screen bg-cream dark:bg-background text-foreground px-4 md:px-6 lg:px-8 py-40" id="about">
      <div className="flex flex-col items-center-safe mx-auto">
        {/* Main Heading */}
        <div className="text-left flex items-center md:text-center mb-16">
            <div className="">
            <h1 ref={headingRef} className="text-3xl text-wrap sm:text-4xl md:text-4xl lg:text-5xl xl:text-7xl font-light text-foreground leading-tighter mb-8  text-left">
              <span className='w-48'>&nbsp;</span> BORN IN RANCHI, MARQUET MEDIA IS A <span className="italic font-baskerville tracking-tighter">full-stack creative media house</span> DESIGNED FOR BRANDS THAT <em className="italic font-baskerville tracking-tighter">want substance</em> OVER THE NOISE.
            </h1>
             <div ref={lineRef} className="w-full h-px bg-border mb-8"></div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div ref={contentRef} className="flex w-full flex-col md:flex-row gap-8 md:gap-16 items-stretch">
          {/* Left Side Content (originally right) */}
          <div className="animate-section flex-1 ml-24 flex flex-col ">
            <div>
                <h2 className="text-lg font-baskerville  font-medium text-foreground mb-4  ">
                Crafting authentic brand narratives that connect deeply with audiences 
                </h2>
              
            </div>

            {/* Partner with us button */}
            <div className="">
              <ProfessionalButton 
                variant="professional" 
                size="xl"
                className="text-foreground font-montserrat font-medium px-8 py-3"
                magneticStrength={25}
                hoverScale={1.05}
              >
                Let's Collaborate
                <ArrowRight className="ml-2 h-4 w-4" />
              </ProfessionalButton>
            </div>
          </div>

          {/* Right Side - Vision and Mission (originally left) */}
          <div className="animate-section flex-1 space-y-12 mr-24 max-w-lg">
            {/* Vision */}
            <div>
              <h3 className="text-xs mb-2 font-baskerville font-medium text-foreground/60 tracking-wider">
                VISION
              </h3>
         
              <p className="text-muted-foreground font-montserrat font-medium text-sm leading-tight">
                TO BE THE LEADING MARKETING MEDIA HOUSE THAT EMPOWERS BRANDS 
                WITH INNOVATIVE GRAPHIC DESIGN, STRATEGIC INFLUENCER MARKETING, 
                CUTTING-EDGE WEB DEVELOPMENT, AND CREATIVE CONTENT THAT TURNS 
                IDEAS INTO MEMORABLE EXPERIENCES AND DRIVING MEASURABLE GROWTH 
                IN A DYNAMIC DIGITAL LANDSCAPE.
              </p>
            </div>

            {/* Mission */}
            <div>
              <h3 className="text-xs mb-2 font-baskerville font-medium text-foreground/60 tracking-wider">
                MISSION
              </h3>
              <p className="text-muted-foreground font-montserrat text-sm font-medium leading-tight">
                OUR MISSION IS TO DELIVER CREATIVE, DATA-DRIVEN MARKETING SOLUTIONS 
                THROUGH EXCEPTIONAL GRAPHIC DESIGN, TARGETED INFLUENCER 
                COLLABORATIONS, INNOVATIVE WEB DEVELOPMENT, AND CONTENT AIM TO 
                BUILD STRONG BRAND IDENTITIES, AMPLIFY REACH, AND FOSTER 
                SUSTAINABLE GROWTH FOR OUR CLIENTS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
