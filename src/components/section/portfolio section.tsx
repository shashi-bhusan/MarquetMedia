'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ProfessionalButton } from '@/components/ui/professional-button';
import { ArrowUpRight, ExternalLink, Play } from 'lucide-react';
import OptimizedThemeImage from '@/components/ui/OptimizedThemeImage';
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
    videoSrc: '/reel-5.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DF69CDJhGdo/',
    title: 'BRAND STORYTELLING',
    description: 'CREATIVE NARRATIVE THAT CONNECTS WITH AUDIENCES THROUGH COMPELLING VISUAL STORYTELLING.',
    category: 'SOCIAL MEDIA',
  },
  {
    id: 2,
    videoSrc: '/reel-6.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DBJO9AINY6L/',
    title: 'PRODUCT LAUNCH',
    description: 'STRATEGIC CONTENT DESIGNED FOR MAXIMUM ENGAGEMENT AND CONVERSION.',
    category: 'MARKETING',
  },
  {
    id: 3,
    videoSrc: '/reel-2.mp4',
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
    id: 7,
    videoSrc: '/reel-3.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DHfz1XlygVw/',
    title: 'CONTENT CREATION',
    description: 'HIGH-IMPACT CONTENT THAT DRIVES ENGAGEMENT AND CONVERSIONS.',
    category: 'MARKETING',
  },
];

// Portfolio client logos data with theme support - dynamically generated
const lightLogos = [
  '1.png',
  'Frame 2.png',
  'Frame 3.png',
  'Frame 5.png',
  'Frame 6.png',
  'Frame 7.png',
  'Frame 8.png',
  'Frame 9.png',
  'Frame 10.png',
  'Frame 11.png',
  'Frame 12.png',
  'Frame 13.png',
  'Frame 14.png',
  'Frame 15.png',
  'Frame 16.png',
  'Frame 17.png',
  'Frame 18.png',
  'Frame 19.png',
  'Frame 20.png',
  'Frame 21.png'
];

const darkLogos = [
  '1.png',
  'Frame 2.png',
  'Frame 3.png',
  'Frame 4.png',
  'Frame 5.png',
  'Frame 6.png',
  'Frame 7.png',
  'Frame 8.png',
  'Frame 9.png',
  'Frame 10.png',
  'Frame 11.png',
  'Frame 12.png',
  'Frame 13.png',
  'Frame 14.png',
  'Frame 15.png',
  'Frame 16.png',
  'Frame 17.png',
  'Frame 18.png',
  'Frame 19.png',
  'Frame 20.png'
];

// Generate client logos array dynamically
const clientLogos = lightLogos.map((lightLogo, index) => ({
  name: `Client ${index + 1}`,
  lightLogo: `/protfolio_logo_light/${lightLogo}`,
  darkLogo: `/protfolio_logo_dark/${darkLogos[index] || darkLogos[index % darkLogos.length]}`
}));

// Behind the Scenes videos data
const btsVideos = [
  { id: 1, videoSrc: '/bts/IMG_0038.MOV', title: 'Creative Process', description: 'Behind the scenes of our creative workflow' },
  { id: 2, videoSrc: '/bts/IMG_0160.MOV', title: 'Production Setup', description: 'Setting up for the perfect shot' },
  { id: 3, videoSrc: '/bts/IMG_0397.MOV', title: 'Team Collaboration', description: 'Working together to bring ideas to life' },
  { id: 4, videoSrc: '/bts/IMG_1770.MOV', title: 'Location Scouting', description: 'Finding the perfect backdrop for our content' },
  { id: 5, videoSrc: '/bts/IMG_2538.MOV', title: 'Equipment Setup', description: 'Professional gear for professional results' },
  { id: 6, videoSrc: '/bts/IMG_3287.MOV', title: 'Direction & Guidance', description: 'Guiding talent through the creative process' },
  { id: 7, videoSrc: '/bts/IMG_7721.MOV', title: 'Wrap Up', description: 'Celebrating another successful project' },
  { id: 8, videoSrc: '/bts/C0442.MP4', title: 'Final Cut', description: 'Bringing everything together in post-production' },
];

// Behind the Scenes images data
const btsImages = [
  { id: 1, imageSrc: '/bts/image.png', title: 'Studio Moments', description: 'Capturing the essence of creativity' },
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


  // Create logo boxes similar to service section with theme support
  const LogoBox = ({ client, index }: { client: typeof clientLogos[0]; index: number }) => {
    
    const logoSrc = isDarkMode ? client.darkLogo : client.lightLogo;

    return (
      <div 
        className="group relative overflow-hidden border-r border-t border-b border-border/40 hover:bg-foreground/5 transition-all duration-500 flex-shrink-0"
        style={{ width: '250px', height: '150px' }}
      >
        <div className="p-8 h-full flex items-center justify-center relative">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <OptimizedThemeImage
              lightSrc={client.lightLogo}
              darkSrc={client.darkLogo}
              isDarkMode={isDarkMode}
              alt={client.name}
              width={280}
              height={280}
              className="h-32 w-auto max-w-[160px] object-contain transition-all duration-500 transform group-hover:scale-110 group-hover:opacity-100"
              preloadBoth={true}
            />
          </div>

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-foreground/20"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full pb-12 space-y-0">
      {/* Top Row - Scrolling Left - First 10 logos */}
      <div className="overflow-hidden">
        <div ref={topRowRef} className="flex">
          {/* First set - first 10 logos */}
          {clientLogos.slice(0, 10).map((client, index) => (
            <LogoBox key={`top-first-${index}`} client={client} index={index} />
          ))}
          {/* Duplicate for seamless loop */}
          {clientLogos.slice(0, 10).map((client, index) => (
            <LogoBox key={`top-second-${index}`} client={client} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom Row - Scrolling Right - Last 10 logos */}
      <div className="overflow-hidden">
        <div ref={bottomRowRef} className="flex">
          {/* First set - last 10 logos */}
          {clientLogos.slice(10, 20).map((client, index) => (
            <LogoBox key={`bottom-first-${index}`} client={client} index={index} />
          ))}
          {/* Duplicate for seamless loop */}
          {clientLogos.slice(10, 20).map((client, index) => (
            <LogoBox key={`bottom-second-${index}`} client={client} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom border */}
      <div className="w-full border-t border-border/20"></div>
    </div>
  );
};

// Simple BTS Video Component
const SimpleBTSCard = ({ video, index }: { video: typeof btsVideos[0]; index: number }) => {
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

  return (
    <div 
      className="flex-shrink-0 w-64 h-96 bg-background overflow-hidden group transition-all duration-500 hover:scale-105 border border-border/20 relative"
    >
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={video.videoSrc} type="video/quicktime" />
        <source src={video.videoSrc} type="video/mp4" />
      </video>
      
      {/* Simple recording indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-mono tracking-wider uppercase text-white/90 bg-black/40 px-2 py-1 backdrop-blur-sm">
          REC
        </span>
      </div>
    </div>
  );
};

// Simple BTS Image Component with scaling animation
const SimpleBTSImageCard = ({ image, index }: { image: typeof btsImages[0]; index: number }) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(imageElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={imageRef}
      className="flex-shrink-0 w-64 h-96 bg-background overflow-hidden group transition-all duration-500 hover:scale-105 border border-border/20 relative"
    >
      {/* Image with continuous scaling animation */}
      <div className="w-full h-full overflow-hidden">
        <Image
          src={image.imageSrc}
          alt={image.title}
          width={256}
          height={384}
          className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-linear ${
            isInView ? 'scale-110' : 'scale-100'
          }`}
        />
      </div>
      
      {/* Photo indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span className="text-xs font-mono tracking-wider uppercase text-white/90 bg-black/40 px-2 py-1 backdrop-blur-sm">
          PHOTO
        </span>
      </div>

      {/* Title overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h4 className="text-sm font-montserrat font-bold uppercase tracking-wider mb-1">{image.title}</h4>
          <p className="text-xs text-white/80 uppercase tracking-wide">{image.description}</p>
        </div>
      </div>
    </div>
  );
};

// Simple BTS Scroll Component
const SimpleBTSScroll = () => {
  // Combine videos and images for mixed content
  const allBTSContent = [
    ...btsVideos.map(video => ({ ...video, type: 'video' as const })),
    ...btsImages.map(image => ({ ...image, type: 'image' as const }))
  ];

  return (
    <div className="relative">
      {/* Scrolling container */}
      <div className="overflow-hidden py-8">
        <div 
          className="flex gap-6 animate-scroll-smooth hover:pause-animation"
          style={{
            animation: 'scroll-simple 25s linear infinite',
            width: 'fit-content'
          }}
        >
          {/* First set - mixed content */}
          {allBTSContent.map((content, index) => (
            content.type === 'video' ? (
              <SimpleBTSCard key={`first-video-${content.id}`} video={content} index={index} />
            ) : (
              <SimpleBTSImageCard key={`first-image-${content.id}`} image={content} index={index} />
            )
          ))}
          {/* Duplicate for seamless loop */}
          {allBTSContent.map((content, index) => (
            content.type === 'video' ? (
              <SimpleBTSCard key={`second-video-${content.id}`} video={content} index={index} />
            ) : (
              <SimpleBTSImageCard key={`second-image-${content.id}`} image={content} index={index} />
            )
          ))}
        </div>
      </div>

      {/* CSS for simple scroll animation */}
      <style jsx>{`
        @keyframes scroll-simple {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-smooth {
          animation: scroll-simple 25s linear infinite;
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
      className="min-h-screen bg-background dark:bg-background py-20 md:py-32"
    >
      <div className="max-w mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Professional Header Section */}
        <div ref={headerRef} className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          
          {/* Section Identifier */}

          {/* Main Content Area */}
          <div className="text-center max-w-5xl mx-auto">
            
            {/* Primary Headline */}
            <h2 ref={titleRef} className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-7xl font-light text-foreground leading-[0.9] sm:leading-[1] mb-8 sm:mb-10 md:mb-12 text-center">
              <span className="block">
                <span className="font-montserrat">OUR WORK </span>
                <span className="italic font-baskerville font-normal tracking-tight text-foreground">speaks!</span>
              </span>
            </h2>
            
           


          </div>

        </div>

        {/* Dual Row Scrolling Brand Logos */}
        <div ref={logoGridRef} className="mb-20 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <DualRowLogoGrid />
        </div>


        {/* Modern Portfolio Layout */}
        <div className="mb-32 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          
          {/* Responsive Grid with Gaps */}
          <div ref={portfolioGridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            
            {/* Display all 8 videos plus featured section */}
            {filteredReels.map((reel, index) => {
              // For featured video (index 0), create a subdivided layout
              if (index === 0) {
                return (
                  <div 
                    key={reel.id} 
                    className="portfolio-item relative group col-span-2 row-span-2 border border-border/10 overflow-hidden"
                    style={{ aspectRatio: '9/16' }}
                  >
                    {/* Internal subdivision: 2 rows within the featured area */}
                    <div className="w-full h-full flex flex-col gap-2">
                      {/* Top section - Featured Video */}
                      <div className="flex-1 overflow-hidden bg-background/50 hover:bg-background/80 transition-all duration-700 hover:scale-[1.02] shadow-sm hover:shadow-xl backdrop-blur-sm group-hover:backdrop-blur-md relative" style={{ aspectRatio: '9/16' }}>
                        <ReelVideoPlayer
                          videoSrc={reel.videoSrc}
                          title={reel.title}
                          description={reel.description}
                          category={reel.category}
                          instagramUrl={reel.instagramUrl}
                          height="100%"
                        />
                        
                        {/* Featured badge */}
                      
                      </div>
                      
                      {/* Bottom section - Text Tile */}
                      <div className="text-xs md:text-sm font-montserrat text-foreground uppercase leading-4 tracking-tighter my-4 ">
                         {/* Call to Action */}
              <ProfessionalButton 
                variant="professional" 
                size="xl"
                className="font-montserrat font-medium mt-6 px-12 py-4 text-lg uppercase tracking-wider"
                magneticStrength={30}
                hoverScale={1.04}
                showContactForm={true}
              >
                start your project
                <ArrowUpRight className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </ProfessionalButton>
                      </div>
                    </div>
                    
                    {/* Corner accents for the entire featured container */}
                    <div className="absolute top-0 left-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-white/40"></div>
                    </div>
                    
                    <div className="absolute bottom-0 right-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-white/40"></div>
                    </div>
                    
                    {/* Subtle hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-foreground/5 via-transparent to-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none "></div>
                  </div>
                );
              }
              
              // For video ID 7, make it span 2 columns
              if (reel.id === 7) {
                return (
                  <div 
                    key={reel.id} 
                    className="portfolio-item relative group col-span-2 border border-border/10 overflow-hidden"
                    style={{ aspectRatio: '18/16' }}
                  >
                    <div className="w-full h-full overflow-hidden bg-background/50 hover:bg-background/80 transition-all duration-700 hover:scale-[1.02] shadow-sm hover:shadow-xl backdrop-blur-sm group-hover:backdrop-blur-md">
                      <ReelVideoPlayer
                        videoSrc={reel.videoSrc}
                        title={reel.title}
                        description={reel.description}
                        category={reel.category}
                        instagramUrl={reel.instagramUrl}
                        height="100%"
                      />
                    </div>
                    
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-white/40"></div>
                    </div>
                    
                    <div className="absolute bottom-0 right-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-white/40"></div>
                    </div>
                    
                    {/* Subtle hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-foreground/5 via-transparent to-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                );
              }
              
              // Standard videos layout for all other videos
              return (
                <div 
                  key={reel.id} 
                  className="portfolio-item relative group border border-border/10 overflow-hidden"
                  style={{ aspectRatio: '9/16' }}
                >
                  <div className="w-full h-full overflow-hidden bg-background/50 hover:bg-background/80 transition-all duration-700 hover:scale-[1.02] shadow-sm hover:shadow-xl backdrop-blur-sm group-hover:backdrop-blur-md">
                    <ReelVideoPlayer
                      videoSrc={reel.videoSrc}
                      title={reel.title}
                      description={reel.description}
                      category={reel.category}
                      instagramUrl={reel.instagramUrl}
                      height="100%"
                    />
                  </div>
                  
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-white/40"></div>
                  </div>
                  
                  <div className="absolute bottom-0 right-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-white/40"></div>
                  </div>
                  
                  {/* Subtle hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-foreground/5 via-transparent to-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              );
            })}


          </div>
        </div>

        {/* Cinematic Behind the Scenes */}
        <div className="pt-20">
          <div ref={btsHeaderRef}>
            <h3 className='text-3xl md:text-lg lg:text-3xl font-light font-baskerville text-foreground mb-2 leading-tight text-center lowercase tracking-tighter italic'>
               Behind the Scenes
            </h3>
            <p className='text-xs md:text-sm font-montserrat text-foreground uppercase leading-4 tracking-tighter mb-8 text-center'>
              Experience the magic of our cinematic behind-the-scenes content, where creativity meets strategy.
            </p>
          </div>

          {/* Simple BTS Experience */}
          <div ref={btsScrollRef} className="max-w-full mx-auto px-4 md:px-6 lg:px-8">
            <SimpleBTSScroll />
          </div>
        </div>


      </div>
    </section>
  );
}