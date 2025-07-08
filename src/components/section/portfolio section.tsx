'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ProfessionalButton } from '@/components/ui/professional-button';
import { ArrowUpRight, ExternalLink, Play } from 'lucide-react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollAnimations } from '@/components/ScrollAnimations';

// Portfolio Reel Video Component with Pinterest-style layout
const ReelVideoPlayer = ({ 
  videoSrc, 
  title, 
  description, 
  category, 
  instagramUrl,
  height = 'auto'
}: { 
  videoSrc: string; 
  title: string; 
  description: string; 
  category: string; 
  instagramUrl: string; 
  height?: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    const details = detailsRef.current;
    const cursor = cursorRef.current;

    if (!video || !overlay || !details || !cursor) return;

    // Auto-play video when component mounts
    const playVideo = async () => {
      try {
        if (video) {
          video.muted = true; // Ensure muted for autoplay
          await video.play();
        }
      } catch (e) {
        console.log('Video autoplay failed:', e);
        // Fallback: try again after a short delay
        setTimeout(() => {
          if (video) {
            video.play().catch(() => {});
          }
        }, 500);
      }
    };

    // Observer for intersection to auto-play when in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo();
          } else {
            if (video) {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const handleMouseEnter = () => {
      setIsHovered(true);
      
      // Animate overlay and details
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });

      gsap.to(details, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        delay: 0.1,
        ease: "power3.out"
      });

      // Scale up cursor
      gsap.to(cursor, {
        scale: 1.2,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);

      // Animate out
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out"
      });

      gsap.to(details, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.out"
      });

      // Scale down cursor
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = video.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Animate custom cursor
      gsap.to(cursor, {
        x: x - 75,
        y: y - 75,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    // Add event listeners for video loading
    const handleLoadedData = () => {
      playVideo();
    };
    
    const handleCanPlay = () => {
      playVideo();
    };

    if (video) {
      observer.observe(video);
      
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('mouseenter', handleMouseEnter);
      video.addEventListener('mouseleave', handleMouseLeave);
      video.addEventListener('mousemove', handleMouseMove);
      
      // Initial play attempt - multiple attempts for better reliability
      setTimeout(playVideo, 100);
      setTimeout(playVideo, 500);
      setTimeout(playVideo, 1000);

      // Cleanup function
      return () => {
        observer.disconnect();
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('mouseenter', handleMouseEnter);
        video.removeEventListener('mouseleave', handleMouseLeave);
        video.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  return (
    <div 
      className="group cursor-pointer relative bg-background overflow-hidden break-inside-avoid w-full h-full"
      style={{ height }}
    >
      {/* Video Player */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
        autoPlay
        preload="metadata"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Enhanced Custom Cursor */}
      <div
        ref={cursorRef}
        className={`fixed w-36 h-36 pointer-events-none z-50 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ mixBlendMode: 'difference' }}
      >
      <div className="w-full h-full border-2 border-background flex items-center justify-center bg-foreground/30 backdrop-blur-sm">
        <div className="text-background text-xs font-montserrat font-medium text-center">
          <div>VIEW</div>
          <div>REEL</div>
        </div>
      </div>
      </div>

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-0"
      />

      {/* Details */}
      <div
        ref={detailsRef}
        className="absolute bottom-4 left-4 right-4 text-background opacity-0 transform translate-y-5"
      >
        <span className="inline-block mb-3 px-3 py-1 bg-background/20 text-xs font-montserrat font-bold backdrop-blur-sm uppercase tracking-wider">
          {category}
        </span>
        <h3 className="text-lg font-montserrat font-black mb-3 leading-tight uppercase tracking-wide">{title}</h3>
        <p className="text-xs font-montserrat text-background/90 mb-4 line-clamp-3 uppercase tracking-wide">
          {description}
        </p>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-montserrat font-bold hover:underline bg-background/10 px-4 py-2 backdrop-blur-sm transition-all hover:bg-background/20 uppercase tracking-wider"
          onClick={(e) => e.stopPropagation()}
        >
          VIEW ON INSTAGRAM
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

// Portfolio data object with 8 reel videos
const portfolioReels = [
  {
    id: 1,
    videoSrc: '/reel-1.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DF69CDJhGdo/',
    title: 'BRAND STORYTELLING',
    description: 'CREATIVE NARRATIVE THAT CONNECTS WITH AUDIENCES THROUGH COMPELLING VISUAL STORYTELLING.',
    category: 'SOCIAL MEDIA',
  },
  {
    id: 2,
    videoSrc: '/reel-2.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DBJO9AINY6L/',
    title: 'PRODUCT LAUNCH',
    description: 'STRATEGIC CONTENT DESIGNED FOR MAXIMUM ENGAGEMENT AND CONVERSION.',
    category: 'MARKETING',
  },
  {
    id: 3,
    videoSrc: '/reel-3.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DHfz1XlygVw/',
    title: 'INFLUENCER COLLABORATION',
    description: 'AUTHENTIC PARTNERSHIPS WITH CONTENT CREATORS THAT DRIVE REAL RESULTS.',
    category: 'INFLUENCER',
  },
  {
    id: 4,
    videoSrc: '/reel-4.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DIjD37aB0_s/',
    title: 'CREATIVE DIRECTION',
    description: 'VISUALLY STUNNING CONTENT THAT STANDS OUT IN CROWDED FEEDS.',
    category: 'CREATIVE',
  },
  {
    id: 5,
    videoSrc: '/reel-1.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DF69CDJhGdo/',
    title: 'SOCIAL STRATEGY',
    description: 'DATA-DRIVEN SOCIAL MEDIA CAMPAIGNS THAT BUILD COMMUNITY.',
    category: 'SOCIAL MEDIA',
  },
  {
    id: 6,
    videoSrc: '/reel-2.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DBJO9AINY6L/',
    title: 'BRAND IDENTITY',
    description: 'COMPREHENSIVE VISUAL IDENTITY SYSTEMS THAT DEFINE BRANDS.',
    category: 'CREATIVE',
  },
  {
    id: 7,
    videoSrc: '/reel-3.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DHfz1XlygVw/',
    title: 'CONTENT CREATION',
    description: 'HIGH-IMPACT CONTENT THAT DRIVES ENGAGEMENT AND CONVERSIONS.',
    category: 'MARKETING',
  },
  {
    id: 8,
    videoSrc: '/reel-4.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DIjD37aB0_s/',
    title: 'DIGITAL CAMPAIGNS',
    description: 'COMPREHENSIVE DIGITAL MARKETING SOLUTIONS FOR GROWTH.',
    category: 'MARKETING',
  },
];

// Real client logos data
const clientLogos = [
  { name: 'MidFunnel', logo: '/client-1.png' },
  { name: 'Achieve', logo: '/client-2.png' },
  { name: 'Momentum', logo: '/client-3.webp' },
  { name: 'Tangent', logo: '/client-1.png' },
  { name: 'Utility', logo: '/client-2.png' },
  { name: 'SuperIntelligent', logo: '/client-3.webp' },
  { name: 'Creative Agency', logo: '/client-1.png' },
  { name: 'Brand House', logo: '/client-2.png' },
];

// Behind the Scenes videos data
const btsVideos = [
  { id: 1, videoSrc: '/bts/IMG_0038.MOV', title: 'Creative Process', description: 'Behind the scenes of our creative workflow' },
  { id: 2, videoSrc: '/bts/IMG_0160.MOV', title: 'Production Setup', description: 'Setting up for the perfect shot' },
  { id: 3, videoSrc: '/bts/IMG_0397.MOV', title: 'Team Collaboration', description: 'Working together to bring ideas to life' },
  { id: 4, videoSrc: '/bts/IMG_1770.MOV', title: 'Location Scouting', description: 'Finding the perfect backdrop for our content' },
  { id: 5, videoSrc: '/bts/IMG_2538.MOV', title: 'Equipment Setup', description: 'Professional gear for professional results' },
  { id: 6, videoSrc: '/bts/IMG_3287.MOV', title: 'Direction & Guidance', description: 'Guiding talent through the creative process' },
  { id: 7, videoSrc: '/bts/IMG_3288.MOV', title: 'Final Touches', description: 'Adding the finishing touches to our work' },
  { id: 8, videoSrc: '/bts/IMG_7721.MOV', title: 'Wrap Up', description: 'Celebrating another successful project' },
];

// Dual Row Scrolling Logo Grid Component with service box inspiration
const DualRowLogoGrid = () => {
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const topRow = topRowRef.current;
    const bottomRow = bottomRowRef.current;
    
    if (!topRow || !bottomRow) return;

    // Create GSAP animations for both rows
    const topRowAnimation = gsap.fromTo(topRow, 
      { x: 0 }, 
      {
        x: -topRow.scrollWidth / 2,
        duration: 20,
        ease: 'none',
        repeat: -1,
      }
    );

    const bottomRowAnimation = gsap.fromTo(bottomRow, 
      { x: -bottomRow.scrollWidth / 2 }, 
      {
        x: 0,
        duration: 25,
        ease: 'none',
        repeat: -1,
      }
    );

    // Pause animations on hover
    const handleMouseEnter = (animation: gsap.core.Tween) => {
      gsap.to(animation, { timeScale: 0.3, duration: 0.5 });
    };
    
    const handleMouseLeave = (animation: gsap.core.Tween) => {
      gsap.to(animation, { timeScale: 1, duration: 0.5 });
    };

    const topRowEnter = () => handleMouseEnter(topRowAnimation);
    const topRowLeave = () => handleMouseLeave(topRowAnimation);
    const bottomRowEnter = () => handleMouseEnter(bottomRowAnimation);
    const bottomRowLeave = () => handleMouseLeave(bottomRowAnimation);

    topRow.addEventListener('mouseenter', topRowEnter);
    topRow.addEventListener('mouseleave', topRowLeave);
    bottomRow.addEventListener('mouseenter', bottomRowEnter);
    bottomRow.addEventListener('mouseleave', bottomRowLeave);

    return () => {
      topRowAnimation.kill();
      bottomRowAnimation.kill();
      topRow.removeEventListener('mouseenter', topRowEnter);
      topRow.removeEventListener('mouseleave', topRowLeave);
      bottomRow.removeEventListener('mouseenter', bottomRowEnter);
      bottomRow.removeEventListener('mouseleave', bottomRowLeave);
    };
  }, []);

  // Create logo boxes similar to service section
  const LogoBox = ({ client, index }: { client: typeof clientLogos[0]; index: number }) => (
    <div 
      className="group relative overflow-hidden border-r border-t border-b border-border/40 hover:bg-foreground/5 transition-all duration-500 flex-shrink-0"
      style={{ width: '200px', height: '120px' }}
    >
      <div className="p-6 h-full flex items-center justify-center relative">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Image
            src={client.logo}
            alt={client.name}
            width={120}
            height={50}
            className="h-10 w-auto object-contain transition-all duration-500 transform group-hover:scale-110 
            grayscale dark:grayscale-0
            group-hover:opacity-100"
          />
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-foreground/20"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full pb-12 space-y-0">
      {/* Top Row - Scrolling Left */}
      <div className="overflow-hidden">
        <div ref={topRowRef} className="flex">
          {/* First set */}
          {clientLogos.map((client, index) => (
            <LogoBox key={`top-first-${index}`} client={client} index={index} />
          ))}
          {/* Duplicate for seamless loop */}
          {clientLogos.map((client, index) => (
            <LogoBox key={`top-second-${index}`} client={client} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom Row - Scrolling Right */}
      <div className="overflow-hidden">
        <div ref={bottomRowRef} className="flex">
          {/* First set - reversed order for variety */}
          {[...clientLogos].reverse().map((client, index) => (
            <LogoBox key={`bottom-first-${index}`} client={client} index={index} />
          ))}
          {/* Duplicate for seamless loop */}
          {[...clientLogos].reverse().map((client, index) => (
            <LogoBox key={`bottom-second-${index}`} client={client} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom border */}
      <div className="w-full border-t border-border/20"></div>
    </div>
  );
};

// Cinematic BTS Video Component
const CinematicBTSCard = ({ video, index }: { video: typeof btsVideos[0]; index: number }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const playVideo = async () => {
      try {
        videoElement.muted = true;
        await videoElement.play();
      } catch (e) {
        console.log('BTS video autoplay failed:', e);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            playVideo();
          } else {
            setIsInView(false);
            videoElement.pause();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  const cardVariants = [
    "w-72 h-96", // Tall
    "w-80 h-64", // Wide
    "w-64 h-80", // Portrait
    "w-96 h-72", // Landscape
  ];

  const rotationVariants = [
    "hover:rotate-2",
    "hover:-rotate-1",
    "hover:rotate-1",
    "hover:-rotate-2",
  ];

  return (
    <div 
      className={`
        flex-shrink-0 ${cardVariants[index % 4]} 
        bg-foreground overflow-hidden group 
        transition-all duration-700 
        ${rotationVariants[index % 4]}
        hover:scale-105 hover:z-10
        shadow-2xl hover:shadow-4xl
        border-2 border-background/10 hover:border-background/30
        relative
      `}
      style={{
        clipPath: index % 3 === 0 ? 'polygon(0 0, 100% 0, 95% 100%, 0 100%)' : 
                  index % 3 === 1 ? 'polygon(5% 0, 100% 0, 100% 100%, 0 100%)' :
                  'none'
      }}
    >
      {/* Film grain overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/5 to-transparent opacity-20 pointer-events-none z-10"></div>
      
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={video.videoSrc} type="video/quicktime" />
        <source src={video.videoSrc} type="video/mp4" />
      </video>
      
      {/* Cinematic overlay with film bars */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-foreground opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      
      {/* Top film bar */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-foreground/80 border-b border-background/20"></div>
      
      {/* Bottom film bar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-foreground/80 border-t border-background/20"></div>
      
      {/* Content with cinematic typography */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 text-background opacity-0 group-hover:opacity-100 transition-all duration-500">
        
        {/* Top content */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-mono tracking-wider uppercase text-background/80">
              REC
            </span>
          </div>
          <div className="text-xs font-mono text-background/60 tracking-wider">
            {String(index + 1).padStart(2, '0')}/08
          </div>
        </div>

        {/* Bottom content */}
        <div className="mb-6">
          <h4 className="text-lg font-baskerville font-medium mb-2 leading-tight">
            {video.title}
          </h4>
          <p className="text-sm font-montserrat text-background/80 leading-relaxed mb-3">
            {video.description}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-full h-px bg-background/30"></div>
            <span className="text-xs font-mono text-background/60 whitespace-nowrap">
              BTS
            </span>
          </div>
        </div>
      </div>

      {/* Film perforations */}
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-foreground/40 border-r border-background/20">
        <div className="flex flex-col h-full justify-evenly items-center py-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-background/30 rounded-sm"></div>
          ))}
        </div>
      </div>

      {/* Corner frame number */}
      <div className="absolute top-2 right-2 bg-foreground/80 px-2 py-1 text-xs font-mono text-background/80 border border-background/20">
        #{String(index + 1).padStart(3, '0')}
      </div>
    </div>
  );
};

// Cinematic BTS Scroll Component
const CinematicBTSScroll = () => {
  return (
    <div className="relative">
      {/* Film strip background */}
      <div className="absolute inset-0 pointer-events-none"></div>
      
      {/* Scrolling container */}
      <div className="overflow-hidden py-8">
        <div 
          className="flex gap-8 animate-scroll-smooth hover:pause-animation"
          style={{
            animation: 'scroll-cinematic 15s linear infinite',
            width: 'fit-content'
          }}
        >
          {/* First set */}
          {btsVideos.map((video, index) => (
            <CinematicBTSCard key={`first-${video.id}`} video={video} index={index} />
          ))}
          {/* Duplicate for seamless loop */}
          {btsVideos.map((video, index) => (
            <CinematicBTSCard key={`second-${video.id}`} video={video} index={index} />
          ))}
        </div>
      </div>

      {/* CSS for cinematic scroll animation */}
      <style jsx>{`
        @keyframes scroll-cinematic {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-smooth {
          animation: scroll-cinematic 25s linear infinite;
        }
        
        .animate-scroll-smooth:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default function PortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Social Media', 'Marketing', 'Influencer', 'Creative'];

  // Refs for scroll animations
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const logoGridRef = useRef<HTMLDivElement>(null);
  const portfolioGridRef = useRef<HTMLDivElement>(null);
  const btsHeaderRef = useRef<HTMLDivElement>(null);
  const btsScrollRef = useRef<HTMLDivElement>(null);

  const filteredReels = selectedCategory === 'All' 
    ? portfolioReels 
    : portfolioReels.filter(reel => reel.category === selectedCategory);

  // Setup scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animations with custom timing and effects
      if (headerRef.current) {
        ScrollAnimations.fadeUp(headerRef.current, { 
          delay: 0.1,
          duration: 1.2,
          start: "top 90%"
        });
      }
      
      if (titleRef.current) {
        // Custom text reveal animation for the main title
        const titleLines = titleRef.current.children;
        gsap.set(titleLines, {
          opacity: 0,
          y: 60,
          rotateX: 30,
          transformOrigin: "center bottom"
        });
        
        gsap.to(titleLines, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.4,
          ease: "power4.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });
      }
      
      if (descriptionRef.current) {
        ScrollAnimations.fadeUp(descriptionRef.current, { 
          delay: 0.6,
          duration: 1.0,
          start: "top 85%"
        });
      }

      // Logo grid with sophisticated entrance
      if (logoGridRef.current) {
        // Animate the entire logo grid container
        gsap.set(logoGridRef.current, {
          opacity: 0,
          y: 40,
          scale: 0.98
        });
        
        gsap.to(logoGridRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: logoGridRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        });
      }

      // Portfolio grid with enhanced staggered animation
      if (portfolioGridRef.current) {
        const portfolioItems = portfolioGridRef.current.querySelectorAll('.portfolio-item');
        
        gsap.set(portfolioItems, {
          opacity: 0,
          y: 50,
          scale: 0.95,
          rotateY: 5,
          filter: "blur(10px)"
        });
        
        gsap.to(portfolioItems, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateY: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          stagger: {
            amount: 0.8,
            from: "random"
          },
          scrollTrigger: {
            trigger: portfolioGridRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });
      }

      // BTS section with cinematic entrance
      if (btsHeaderRef.current) {
        ScrollAnimations.fadeUp(btsHeaderRef.current, { 
          delay: 0.2,
          duration: 1.0,
          start: "top 85%"
        });
      }
      
      if (btsScrollRef.current) {
        // Custom animation for BTS scroll
        gsap.set(btsScrollRef.current, {
          opacity: 0,
          y: 30,
          scale: 0.96,
          clipPath: "inset(0 100% 0 0)"
        });
        
        gsap.to(btsScrollRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: "inset(0 0% 0 0)",
          duration: 1.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: btsScrollRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });
      }

    });

    return () => ctx.revert();
  }, [filteredReels]); // Re-run when filtered reels change

  return (
    <section 
      id="portfolio"
      className="min-h-screen bg-cream dark:bg-background py-20 md:py-32"
    >
      <div className="max-w mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Professional Header Section */}
        <div ref={headerRef} className="relative mb-32 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          
          {/* Section Identifier */}

          {/* Main Content Area */}
          <div className="text-center max-w-5xl mx-auto">
            
            {/* Primary Headline */}
            <h2 ref={titleRef} className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-7xl font-light text-foreground leading-[0.9] sm:leading-[1] mb-8 sm:mb-10 md:mb-12 text-center">
              <span className="block">
                <span className="font-montserrat">CRAFTING </span>
                <span className="italic font-baskerville font-normal tracking-tight text-foreground">brands that</span>
              </span>
              <span className="block font-montserrat tracking-tight mt-1 sm:mt-2">
                CAPTIVATE & CONVERT
              </span>
            </h2>
            
            {/* Professional Description */}
            <div ref={descriptionRef} className="max-w-3xl mx-auto mb-16">
              <p className="text-xs md:text-sm font-montserrat text-foreground uppercase leading-4 tracking-tighter mb-4">
                We deliver creative, data-driven marketing solutions through exceptional design, 
                strategic influencer partnerships, and innovative business development.
              </p>
              
              {/* Call to Action */}
              <ProfessionalButton 
                variant="professional" 
                size="xl"
                className="font-montserrat font-medium px-12 py-4 text-lg uppercase tracking-wider"
                magneticStrength={30}
                hoverScale={1.04}
              >
                Partner with Us
                <ArrowUpRight className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </ProfessionalButton>
            </div>


          </div>

        </div>

        {/* Dual Row Scrolling Brand Logos */}
        <div ref={logoGridRef} className="mb-20 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <DualRowLogoGrid />
        </div>


        {/* Creative Portfolio Layout */}
        <div className="mb-32 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          
          {/* Pinterest-style Masonry Grid */}
          <div ref={portfolioGridRef} className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
            
            {/* Display all 8 videos with Pinterest-style varying heights */}
            {filteredReels.map((reel, index) => {
              // Define different heights for Pinterest effect
              const heights = [
                'h-80',   // Short
                'h-96',   // Medium
                'h-[500px]', // Tall
                'h-72',   // Extra short
                'h-[450px]', // Medium-tall
                'h-88',   // Medium-short
                'h-[520px]', // Extra tall
                'h-92'    // Medium
              ];
              
              return (
                <div key={reel.id} className="portfolio-item relative group break-inside-avoid mb-4 md:mb-6">
                  <div className={`w-full overflow-hidden bg-muted/50 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.02] border border-border ${heights[index % heights.length]}`}>
                    <ReelVideoPlayer
                      videoSrc={reel.videoSrc}
                      title={reel.title}
                      description={reel.description}
                      category={reel.category}
                      instagramUrl={reel.instagramUrl}
                      height="100%"
                    />
                  </div>
                  {/* Featured tag for first video */}
                  {index === 0 && (
                    <div className="absolute -top-3 -right-3 bg-foreground text-background px-4 py-2 text-xs font-montserrat font-bold tracking-wider z-10">
                      FEATURED
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        </div>

        {/* Cinematic Behind the Scenes */}
        <div className="mb-20  py-20">
          <div ref={btsHeaderRef}>
            <h3 className='text-3xl md:text-lg lg:text-3xl font-light font-baskerville text-foreground mb-2 leading-tight text-center lowercase tracking-tighter italic'>
               Behind the Scenes
            </h3>
            <p className='text-xs md:text-sm font-montserrat text-foreground uppercase leading-4 tracking-tighter mb-8 text-center'>
              Experience the magic of our cinematic behind-the-scenes content, where creativity meets strategy.
            </p>
          </div>

          {/* Cinematic BTS Experience */}
          <div ref={btsScrollRef} className="max-w-full mx-auto px-4 md:px-6 lg:px-8">
            <CinematicBTSScroll />
          </div>
        </div>


      </div>
    </section>
  );
}