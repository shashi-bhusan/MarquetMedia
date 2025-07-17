'use client';

import { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ProfessionalButton } from "@/components/ui/professional-button";
import { ArrowRight, Palette, Users, Globe, TrendingUp, Camera, Megaphone, Share2, Star, Play, Newspaper, Target, Calendar, Lightbulb, MessageSquare, Smartphone, Code } from "lucide-react";
import Image from "next/image";
import { useScrollAnimations, ScrollAnimations } from '@/components/ScrollAnimations';

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Initialize scroll animations
  useScrollAnimations();

  useEffect(() => {
    // Animate header
    if (headerRef.current) {
      const headerElements = headerRef.current.querySelectorAll('h2, p');
      ScrollAnimations.fadeUp(Array.from(headerElements), { 
        stagger: 0.2,
        start: "top 80%"
      });
    }

    // Animate service cards
    if (servicesRef.current) {
      const serviceCards = servicesRef.current.querySelectorAll('.service-card');
      ScrollAnimations.slideInLeft(Array.from(serviceCards), { 
        stagger: 0.15,
        start: "top 75%"
      });
    }

    // Animate CTA section
    if (ctaRef.current) {
      ScrollAnimations.scaleReveal(ctaRef.current, { 
        start: "top 80%" 
      });
    }
  }, []);
  const services = [
    {
      icon: Share2,
      title: "social media management",
      description: "Strategy, content creation, calendar planning, community management. For brands who want to engage, not just post.",
      illustration: "/illustration/digital-nomad-working-near-beach.svg",
      size: "large"
    },
    {
      icon: Play,
      title: "production & shoots",
      description: "Lifestyle shoots, product photography, brand reels, campaign visuals. We tell your story through scroll-stopping visuals.",
      illustration: "/illustration/having-fun.svg",
      size: "large"
    },
    {
      icon: Users,
      title: "influencer marketing",
      description: "Collaborations with local and regional creators. Authentic voices, amplified impact.",
      illustration: "/illustration/digital-nomad-working-in-airport.svg",
      size: "large"
    },
    {
      icon: Target,
      title: "performance campaigns",
      description: "Meta & Google ads, analytics, lead funnels. Numbers-driven strategies that deliver.",
      illustration: "/illustration/get-a-job-promotion.svg",
      size: "large"
    },
    {
      icon: Newspaper,
      title: "media buying",
      description: "Newspaper ads, hoardings, FM radio placements. Integrated media, locally executed.",
      illustration: "/illustration/financial-literacy.svg",
      size: "large"
    },
    {
      icon: Calendar,
      title: "corporate event management",
      description: "Brand launches, internal activations, press events. Designed with detail, delivered with polish.",
      illustration: "/illustration/designer-working.svg",
      size: "large"
    },
    {
      icon: Lightbulb,
      title: "brand strategy & consulting",
      description: "Audits, positioning, brand language, campaign frameworks. For brands that want to get it right from the inside out.",
      illustration: "/illustration/designer-desk.svg",
      size: "large"
    },
    {
      icon: MessageSquare,
      title: "sms & whatsapp blasts",
      description: "Targeted messaging campaigns for direct customer engagement. Reach your audience where they are most active.",
      illustration: "/illustration/grow-plants-home-garden.svg",
      size: "large"
    },
    {
      icon: Smartphone,
      title: "whatsapp for business",
      description: "Professional customer communication solutions. Build stronger relationships through instant, personalized interactions.",
      illustration: "/illustration/digital-nomad-working-near-beach.svg",
      size: "large"
    },
    {
      icon: Code,
      title: "website development",
      description: "Cutting-edge websites and digital experiences that combine aesthetic excellence with seamless functionality, optimized for performance and user engagement.",
      illustration: "/illustration/digital-nomad-working-in-airport.svg",
      size: "large"
    }
  ];

  return (
    <>
      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <section  className="min-h-screen bg-cream dark:bg-background text-foreground px-4 md:px-6 lg:px-8 " id="services">
      <div className="flex flex-col items-center ">
        {/* line seperator */}
        <div className="w-full border-t border-border/90 mb-8 sm:mb-12 md:mb-16"></div>
        
        {/* Header Section */}
        <div ref={headerRef} className="w-full mb-12 md:mb-16 lg:mb-32">
          {/* Main Content Grid */}
          <div className="flex flex-row justify-between item-end w-full">
            
            {/* Left Side - Main Heading */}
            <div className="lg:col-span-7 order-1">
              <h2 className="text-3xl text-wrap sm:text-4xl md:text-4xl lg:text-5xl xl:text-7xl font-light text-foreground leading-tighter  text-left ">
                OUR
                <br />
                <span className="sm:hidden" />
                <span className="italic font-baskerville tracking-tighter font-light">services</span>
               
              
              </h2>
            </div>

            {/* Right Side - Description & CTA */}
            <div className="lg:col-span-5 order-2 lg:order-2 flex flex-col justify-center lg:justify-end">
              <div className="space-y-6 lg:space-y-8">
                <p className="text-xs sm:text-sm font-montserrat font-medium max-w-full lg:max-w-md uppercase leading-tight text-foreground/80">
                  We bring clarity to chaos. Whether it’s digital, traditional, or somewhere in between, we partner with you to craft campaigns rooted in insight and executed with intention
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <ProfessionalButton 
                    variant="professional" 
                    size="lg"
                    className="font-montserrat font-medium px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm w-full sm:w-auto uppercase tracking-wider"
                    magneticStrength={25}
                    hoverScale={1.03}
                    showContactForm={true}
                  >
                    Partner with Us
                    <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                  </ProfessionalButton>
                </div>
              </div>
            </div>
          </div>

          
        </div>

        {/* Services Horizontal Scroll Grid */}
        <div ref={servicesRef} className="w-full overflow-hidden">
          {/* CSS-based Infinite Scrolling Container */}
          <div 
            className="flex gap-0 animate-scroll-left"
            style={{ 
              width: 'fit-content'
            }}
          >
            {/* First set of services */}
            {services.map((service, index) => {
              const Icon = service.icon;
              
              return (
                <div 
                  key={`first-${index}`}
                  className="service-card group relative overflow-hidden border-r border-b border-t border-border/90 hover:bg-foreground/5 transition-all duration-500 flex-shrink-0"
                  style={{ width: '400px', height: '500px' }} // Fixed dimensions for consistent scrolling
                >
                  <div className="p-8 lg:p-12 h-full flex flex-col">
                    
                    {/* Service Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="text-xs font-montserrat text-foreground/30 font-medium tracking-wider">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div className="w-10 h-10 rounded-full border border-foreground/15 flex items-center justify-center group-hover:border-foreground/30 group-hover:bg-foreground/10 transition-all duration-300">
                          <Icon className="w-5 h-5 text-foreground/60 group-hover:text-foreground transition-colors duration-300" />
                        </div>
                      </div>
                    </div>

                    {/* Service Title */}
                    <div className="mb-6">
                      <h3 className="text-xl lg:text-2xl font-baskerville italic text-foreground leading-tight tracking-tighter lowercase">
                        {service.title}
                      </h3>
                    </div>

                    {/* Service Description */}
                    <div className="mb-8 flex-1">
                      <p className="text-foreground font-montserrat text-sm leading-tight lg:text-sm font-light uppercase">
                        {service.description}
                      </p>
                    </div>

                    {/* Large Illustration */}
                    <div className="flex justify-center items-end mt-auto">
                      <div className="w-32 h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 relative">
                        <Image
                          src={service.illustration}
                          alt={service.title}
                          fill
                          className="object-contain svg-logo transition-all duration-300 group-hover:scale-105"
                          sizes="(max-width: 1024px) 128px, (max-width: 1280px) 160px, 192px"
                        />
                      </div>
                    </div>

                    {/* Subtle corner accent */}
                    <div className="absolute top-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-foreground/20"></div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Duplicate set for seamless loop */}
            {services.map((service, index) => {
              const Icon = service.icon;
              
              return (
                <div 
                  key={`second-${index}`}
                  className="group relative overflow-hidden border-r border-b border-t border-border/90 hover:bg-foreground/5 transition-all duration-500 flex-shrink-0"
                  style={{ width: '400px', height: '500px' }} // Fixed dimensions for consistent scrolling
                >
                  <div className="p-8 lg:p-12 h-full flex flex-col">
                    
                    {/* Service Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="text-xs font-montserrat text-foreground/30 font-medium tracking-wider">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div className="w-10 h-10 rounded-full border border-foreground/15 flex items-center justify-center group-hover:border-foreground/30 group-hover:bg-foreground/10 transition-all duration-300">
                          <Icon className="w-5 h-5 text-foreground/60 group-hover:text-foreground transition-colors duration-300" />
                        </div>
                      </div>
                    </div>

                    {/* Service Title */}
                    <div className="mb-6">
                      <h3 className="text-xl lg:text-2xl font-baskerville italic text-foreground leading-tight tracking-tighter lowercase">
                        {service.title}
                      </h3>
                    </div>

                    {/* Service Description */}
                    <div className="mb-8 flex-1">
                      <p className="text-foreground font-montserrat text-sm leading-tight lg:text-sm font-light uppercase">
                        {service.description}
                      </p>
                    </div>

                    {/* Large Illustration */}
                    <div className="flex justify-center items-end mt-auto">
                      <div className="w-32 h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 relative">
                        <Image
                          src={service.illustration}
                          alt={service.title}
                          fill
                          className="object-contain svg-logo transition-all duration-300 group-hover:scale-105"
                          sizes="(max-width: 1024px) 128px, (max-width: 1280px) 160px, 192px"
                        />
                      </div>
                    </div>

                    {/* Subtle corner accent */}
                    <div className="absolute top-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-foreground/20"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom border line */}
          <div className="w-full border-t border-border/20"></div>
        </div>
      </div>
    </section>
    </>
  );
}
