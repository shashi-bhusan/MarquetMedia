'use client';

import { Instagram, Twitter, Linkedin, Mail } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import ScrollAnimations from "./ScrollAnimations";
import { ProfessionalButton } from "@/components/ui/professional-button";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const heyRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Custom joyful animation for "hey!" - bouncy entrance with rotation
      if (heyRef.current) {
        gsap.set(heyRef.current, {
          opacity: 0,
          scale: 0.5,
          rotation: -15,
          transformOrigin: "center bottom",
          filter: "blur(10px)"
        });

        gsap.to(heyRef.current, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          onComplete: () => {
            // Add a subtle pulse after the main animation
            if (heyRef.current) {
              gsap.to(heyRef.current, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
              });
            }
          }
        });
      }

      // Subheading with subtle slide up and fade
      if (subheadingRef.current) {
        ScrollAnimations.fadeUp(subheadingRef.current, {
          duration: 1.0,
          delay: 0.3,
          start: "top 85%"
        });
      }

      // CTA button with scale reveal
      if (ctaRef.current) {
        ScrollAnimations.scaleReveal(ctaRef.current, {
          duration: 1.2,
          delay: 0.6,
          start: "top 85%"
        });
      }

      // Footer navigation elements with staggered slide ins
      if (logoRef.current) {
        ScrollAnimations.slideInLeft(logoRef.current, {
          duration: 0.8,
          delay: 0.8,
          start: "top 85%"
        });
      }

      if (navRef.current) {
        ScrollAnimations.fadeUp(navRef.current, {
          duration: 0.8,
          delay: 1.0,
          start: "top 85%"
        });
      }

      if (socialRef.current) {
        ScrollAnimations.slideInRight(socialRef.current, {
          duration: 0.8,
          delay: 1.2,
          start: "top 85%"
        });
      }

      // Copyright with final subtle reveal
      if (copyrightRef.current) {
        ScrollAnimations.textReveal(copyrightRef.current, {
          duration: 0.6,
          delay: 1.4,
          start: "top 85%"
        });
      }

    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Large Typography Section */}
        <div className="mb-16">
          <h1 
            ref={heyRef}
            className="text-[clamp(4rem,12vw,12rem)] font-baskerville font-light leading-[0.85] tracking-tight italic mb-2"
          >
            hey!
          </h1>
          <h2 
            ref={subheadingRef}
            className="text-[clamp(2rem,6vw,6rem)] font-montserrat font-light leading-[0.9] tracking-tight mt-8"
          >
            Let's start something<br />
            great together
          </h2>
        </div>

        {/* CTA Button */}
        <div ref={ctaRef} className="mb-20">
          <ProfessionalButton 
            variant="professional" 
            size="xl"
            className="bg-white text-black hover:bg-lime-400 hover:text-black font-montserrat font-medium px-12 py-4 text-lg uppercase tracking-wider"
            magneticStrength={30}
            hoverScale={1.04}
          >
            Let's Collaborate
          </ProfessionalButton>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          
          {/* Logo */}
          <div ref={logoRef}>
            <h3 className="text-2xl font-baskerville font-bold">
              MARQUET
              <br />
              <span className="text-lg font-montserrat font-light tracking-[0.2em] text-gray-400">
                MEDIA
              </span>
            </h3>
          </div>

          {/* Navigation Links */}
          <div ref={navRef} className="flex flex-wrap gap-6 md:gap-8">
            <a href="#home" className="font-montserrat text-gray-300 hover:text-white transition-colors text-sm">
              Home
            </a>
            <a href="#about" className="font-montserrat text-gray-300 hover:text-white transition-colors text-sm">
              About
            </a>
            <a href="#portfolio" className="font-montserrat text-gray-300 hover:text-white transition-colors text-sm">
              Portfolio
            </a>
            <a href="#services" className="font-montserrat text-gray-300 hover:text-white transition-colors text-sm">
              Services
            </a>
            <a href="#contact" className="font-montserrat text-gray-300 hover:text-white transition-colors text-sm">
              Contact
            </a>
          </div>

          {/* Social Media Links */}
          <div ref={socialRef} className="flex space-x-3">
            <a href="#" className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-lime-400 hover:scale-110 transition-all duration-300 group border border-gray-800 hover:border-lime-400">
              <Instagram className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors duration-300" />
            </a>
            <a href="#" className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-lime-400 hover:scale-110 transition-all duration-300 group border border-gray-800 hover:border-lime-400">
              <Twitter className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors duration-300" />
            </a>
            <a href="#" className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-lime-400 hover:scale-110 transition-all duration-300 group border border-gray-800 hover:border-lime-400">
              <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors duration-300" />
            </a>
            <a href="#" className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-lime-400 hover:scale-110 transition-all duration-300 group border border-gray-800 hover:border-lime-400">
              <Mail className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors duration-300" />
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div ref={copyrightRef} className="border-t border-gray-800 pt-6 mt-12 text-center">
          <p className="font-montserrat text-gray-500 text-sm">
            © 2025 Marquet Media. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
