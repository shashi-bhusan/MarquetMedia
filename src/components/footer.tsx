"use client";
import Image from "next/image";
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
          filter: "blur(10px)",
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
            toggleActions: "play none none none",
          },
          onComplete: () => {
            // Add a subtle pulse after the main animation
            if (heyRef.current) {
              gsap.to(heyRef.current, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out",
                yoyo: true,
                repeat: 1,
              });
            }
          },
        });
      }

      // Subheading with subtle slide up and fade
      if (subheadingRef.current) {
        ScrollAnimations.fadeUp(subheadingRef.current, {
          duration: 1.0,
          delay: 0.3,
          start: "top 85%",
        });
      }

      // CTA button with scale reveal
      if (ctaRef.current) {
        ScrollAnimations.scaleReveal(ctaRef.current, {
          duration: 1.2,
          delay: 0.6,
          start: "top 85%",
        });
      }

      // Footer navigation elements with staggered slide ins
      if (logoRef.current) {
        ScrollAnimations.slideInLeft(logoRef.current, {
          duration: 0.8,
          delay: 0.8,
          start: "top 85%",
        });
      }

      if (navRef.current) {
        ScrollAnimations.fadeUp(navRef.current, {
          duration: 0.8,
          delay: 1.0,
          start: "top 85%",
        });
      }

      if (socialRef.current) {
        ScrollAnimations.slideInRight(socialRef.current, {
          duration: 0.8,
          delay: 1.2,
          start: "top 85%",
        });
      }

      // Copyright with final subtle reveal
      if (copyrightRef.current) {
        ScrollAnimations.textReveal(copyrightRef.current, {
          duration: 0.6,
          delay: 1.4,
          start: "top 85%",
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-background dark:bg-background text-foreground dark:text-beige px-4 md:px-6 lg:px-8">
      <div className=" mx-auto ">
        {/* Large Typography Section */}
        <div className="mb-16 ">
          <h2
            ref={subheadingRef}
            className="text-[clamp(2rem,6vw,6rem)] font-montserrat font-light leading-[0.9] tracking-tight mt-8 uppercase"
          >
            Let's start something
            <br />
            great together
          </h2>
        </div>

        {/* CTA Button */}
        <div ref={ctaRef} className="mb-20"></div>

        {/* Footer Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Logo */}
          <div ref={logoRef}>
            <ProfessionalButton
              variant="professional"
              size="xl"
              className=" font-montserrat font-medium px-12 py-4 text-lg uppercase tracking-wider"
              magneticStrength={30}
              hoverScale={1.04}
              showContactForm={true}
            >
              Let's Collaborate
            </ProfessionalButton>
          </div>

          {/* Navigation Links */}
          {/* <div ref={navRef} className="flex flex-wrap gap-6 md:gap-8">
            <a
              href="#home"
              className="font-montserrat text-gray-300 hover:underline dark:text-gray-400 dark:hover:underline transition-all text-sm"
            >
              Home
            </a>
            <a
              href="#about"
              className="font-montserrat text-gray-300 hover:underline dark:text-gray-400 dark:hover:underline transition-all text-sm"
            >
              About
            </a>
            <a
              href="#portfolio"
              className="font-montserrat text-gray-300 hover:underline dark:text-gray-400 dark:hover:underline transition-all text-sm"
            >
              Portfolio
            </a>
            <a
              href="#services"
              className="font-montserrat text-gray-300 hover:underline dark:text-gray-400 dark:hover:underline transition-all text-sm"
            >
              Services
            </a>
            <a
              href="#contact"
              className="font-montserrat text-gray-300 hover:underline dark:text-gray-400 dark:hover:underline transition-all text-sm"
            >
              Contact
            </a>
          </div> */}

          {/* Social Media Links */}
            <div ref={socialRef} className="flex space-x-3">
              <a
                href="https://www.instagram.com/marquetmedia?igsh=cHk3ejZ5d3FvZm5q&utm_source=qr"
                className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 group border border-foreground dark:border-beige"
              >
                <Instagram className="w-5 h-5 text-foreground dark:text-beige group-hover:text-beige dark:group-hover:text-foreground transition-colors duration-300" />
              </a>
              {/* <a
                href="#"
                className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 group border border-foreground dark:border-beige"
              >
                <Twitter className="w-5 h-5 text-foreground dark:text-beige group-hover:text-beige dark:group-hover:text-foreground transition-colors duration-300" />
              </a> */}
              {/* <a
                href="#"
                className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 group border border-foreground dark:border-beige"
              >
                <Linkedin className="w-5 h-5 text-foreground dark:text-beige group-hover:text-beige dark:group-hover:text-foreground transition-colors duration-300" />
              </a> */}
              <a
                href="mailto:info@marquetmedia.com"
                className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 group border border-foreground dark:border-beige"
              >
                <Mail className="w-5 h-5 text-foreground dark:text-beige group-hover:text-beige dark:group-hover:text-foreground transition-colors duration-300" />
              </a>
            </div>
          
        </div>
{/* MARQUET - Full Width */}
          <div ref={logoRef} className="w-full">
            <Image
              src="/MARQUET.svg"
              alt="Marquet"
              width={0}
              height={0}
              className="w-full h-auto mt-24 svg-logo"
              priority
            />
          </div>
        {/* Bottom Copyright */}
        <div
          ref={copyrightRef}
          className="border-b-0 border-x-0 border my-12 text-center"
        >
          
            <p className="font-montserrat text-foreground text-sm my-8">
            © 2025 Marquet Media. All rights reserved. Designed and developed by <a href="https://beenait.uk/" target="_blank" rel="noopener noreferrer" className="hover:underline">BeenaIT Solutions</a>.
            </p>
        </div>
      </div>
    </footer>
  );
}
