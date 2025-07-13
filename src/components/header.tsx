"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProfessionalButton } from "@/components/ui/professional-button";
import { Moon, Sun, Menu, X } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleSectionChange = () => {
      const sections = ["home", "about", "services", "portfolio", "testimonials"];
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const triggerPoint = scrollPosition + viewportHeight * 0.3; // 30% from top of viewport

      let currentSection = "home";
      let closestDistance = Infinity;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollPosition;
          const elementBottom = elementTop + rect.height;
          const elementCenter = elementTop + rect.height * 0.5;
          
          // Check if the section is currently in viewport
          const isInViewport = elementBottom > scrollPosition && elementTop < scrollPosition + viewportHeight;
          
          if (isInViewport) {
            // Use different logic based on scroll direction and position
            if (triggerPoint >= elementTop && triggerPoint <= elementBottom) {
              // Direct hit - use this section
              currentSection = section;
              break;
            } else {
              // Find the closest section center to our trigger point
              const distanceToCenter = Math.abs(elementCenter - triggerPoint);
              if (distanceToCenter < closestDistance) {
                closestDistance = distanceToCenter;
                currentSection = section;
              }
            }
          }
        }
      }

      // Additional check: if we're at the very bottom, ensure testimonials is active if it exists
      if (scrollPosition + viewportHeight >= document.documentElement.scrollHeight - 10) {
        const testimonialsElement = document.getElementById("testimonials");
        if (testimonialsElement) {
          currentSection = "testimonials";
        } else {
          currentSection = "portfolio";
        }
      }

      // Smooth transition only when the section actually changes
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    // Use requestAnimationFrame for smoother scroll handling
    let ticking = false;
    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          handleSectionChange();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", optimizedScrollHandler, { passive: true });
    handleSectionChange(); // Initial check

    return () => {
      window.removeEventListener("scroll", optimizedScrollHandler);
    };
  }, [activeSection]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Portfolio" },
    { id: "testimonials", label: "Testimonials" },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/95 dark:bg-background/95 backdrop-blur-md border-b border-border/50' 
            : 'bg-transparent'
        }`}
      >
        <div className="py-4 px-4 md:px-6 lg:px-8">
          <nav className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Logo */}
            <div 
              className="cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => handleNavClick("home")}
            >
              <Image
                src="/logo.png"
                alt="Marquet Media"
                width={150}
                height={50}
                className="h-10 md:h-12 w-auto transition-all duration-300 svg-logo"
                priority
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative group font-montserrat font-medium text-sm uppercase tracking-wider transition-all duration-500 ease-out hover:text-foreground ${
                    activeSection === item.id 
                      ? 'text-foreground' 
                      : 'text-foreground/60'
                  }`}
                >
                  {item.label}
                  
                  {/* Animated underline on hover */}
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-foreground/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
                  
                  {/* Active state indicator with smooth animation */}
                  <span 
                    className={`absolute -bottom-1 left-0 right-0 h-px bg-foreground transition-all duration-500 ease-out ${
                      activeSection === item.id 
                        ? 'scale-x-100 opacity-100' 
                        : 'scale-x-0 opacity-0'
                    }`}
                    style={{ 
                      transformOrigin: 'left center',
                      background: activeSection === item.id 
                        ? 'linear-gradient(90deg, var(--foreground) 0%, var(--foreground) 100%)' 
                        : 'transparent'
                    }}
                  />
                  
                  {/* Subtle background glow effect for active state */}
                  {activeSection === item.id && (
                    <span className="absolute inset-0 bg-foreground/5 rounded-md scale-110 opacity-50 animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-full border border-border/30 text-foreground hover:bg-foreground/10 hover:border-foreground/50 transition-all duration-300"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              
              <ProfessionalButton
                variant="professional"
                size="lg"
                className="font-montserrat font-medium px-6 py-2 text-sm uppercase tracking-wider"
                magneticStrength={20}
                hoverScale={1.03}
                showContactForm={true}
              >
                COLLABORATE with Us
              </ProfessionalButton>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="w-9 h-9 rounded-full border border-border/30 text-foreground hover:bg-foreground/10"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-9 h-9 rounded-full border border-border/30 text-foreground hover:bg-foreground/10"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="absolute inset-0 bg-background/95 backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative pt-20 pb-8 px-4">
            <nav className="flex flex-col space-y-8 text-center">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative group font-montserrat font-medium text-2xl uppercase tracking-wider transition-all duration-500 hover:text-foreground ${
                    activeSection === item.id 
                      ? 'text-foreground' 
                      : 'text-foreground/60'
                  }`}
                >
                  {item.label}
                  
                  {/* Active indicator for mobile */}
                  <span 
                    className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-px bg-foreground transition-all duration-500 ease-out ${
                      activeSection === item.id 
                        ? 'scale-x-100 opacity-100' 
                        : 'scale-x-0 opacity-0'
                    }`}
                  />
                  
                  {/* Subtle glow effect for active state on mobile */}
                  {activeSection === item.id && (
                    <span className="absolute inset-0 bg-foreground/5 rounded-lg scale-110 opacity-30 animate-pulse" />
                  )}
                </button>
              ))}
              
              <div className="pt-8">
                <ProfessionalButton
                  onClick={() => handleNavClick("testimonials")}
                  variant="professional"
                  size="lg"
                  className="font-montserrat font-medium px-8 py-3 text-sm uppercase tracking-wider"
                  magneticStrength={20}
                  hoverScale={1.03}
                  showContactForm={true}
                >
                  Let's Collaborate
                </ProfessionalButton>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
