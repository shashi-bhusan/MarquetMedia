'use client';

import Header from "@/components/header";
import HeroSection from "@/components/section/hero-section";import TestimonialSection from "@/components/section/testimonial";
import CustomCursor from "@/components/CustomCursor";
import AboutSection from "@/components/section/about-section";
import PortfolioSection from "@/components/section/portfolio section";
import Services from "@/components/section/services";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Main Content */}
      <div className="min-h-screen bg-background dark:bg-background font-montserrat overflow-hidden">
        <Header />
        <main>
          <HeroSection />
         <AboutSection />
         <Services></Services>
         <PortfolioSection />
         <TestimonialSection></TestimonialSection>
         <Footer></Footer>
        </main>
      </div>
    </>
  );
}
