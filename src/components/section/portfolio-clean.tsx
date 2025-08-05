'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ProfessionalButton } from '@/components/ui/professional-button';
import { ArrowUpRight, ExternalLink, Play, ChevronRight, Eye, Heart, MessageCircle, Star, TrendingUp, Award, Users, Zap } from 'lucide-react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useScrollAnimations, ScrollAnimations } from '@/components/ScrollAnimations';

// Enhanced Reel Video Player with Agency-style Interactions
const ReelVideoPlayer = ({ 
  videoSrc, 
  title, 
  description, 
  category, 
  instagramUrl,
  height = 'auto',
  metrics = { views: '1.2M', likes: '47K', engagement: '8.4%' },
  isHero = false
}: { 
  videoSrc: string; 
  title: string; 
  description: string; 
  category: string; 
  instagramUrl: string; 
  height?: string;
  metrics?: { views: string; likes: string; engagement: string };
  isHero?: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    const details = detailsRef.current;
    const progress = progressRef.current;

    if (!video || !overlay || !details || !progress) return;

    const playVideo = async () => {
      try {
        video.muted = true;
        await video.play();
        setIsPlaying(true);
      } catch (e) {
        console.log('Video autoplay failed:', e);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo();
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    const handleMouseEnter = () => {
      setIsHovered(true);
      
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.4,
        ease: "power3.out"
      });

      gsap.to(details, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.1,
        ease: "power3.out"
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);

      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
      });

      gsap.to(details, {
        opacity: 0,
        y: 30,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    // Progress bar animation
    const updateProgress = () => {
      if (video && !video.paused && video.duration) {
        const progressPercent = (video.currentTime / video.duration) * 100;
        gsap.set(progress, { width: `${progressPercent}%` });
      }
    };

    if (video) {
      observer.observe(video);
      video.addEventListener('mouseenter', handleMouseEnter);
      video.addEventListener('mouseleave', handleMouseLeave);
      video.addEventListener('timeupdate', updateProgress);
      
      setTimeout(playVideo, 100);

      return () => {
        observer.disconnect();
        video.removeEventListener('mouseenter', handleMouseEnter);
        video.removeEventListener('mouseleave', handleMouseLeave);
        video.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, []);

  return (
    <div className="group cursor-pointer relative bg-black overflow-hidden w-full rounded-2xl border border-foreground/10 shadow-lg hover:shadow-2xl transition-all duration-700" style={{ height }}>
      {/* Video Player */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loop
        muted
        playsInline
        preload="metadata"
        poster={
          videoSrc.includes('/reel-') 
            ? `/thumbnails/reels/${videoSrc.split('/').pop()?.replace('.mp4', '.jpg')}` 
            : videoSrc.includes('/bts/') 
            ? `/thumbnails/bts/${videoSrc.split('/').pop()?.replace(/\.(mp4|MOV)$/i, '.jpg')}` 
            : undefined
        }
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          ref={progressRef}
          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
          style={{ width: '0%' }}
        />
      </div>

      {/* Category & Quality Badge */}
      <div className="absolute top-6 left-6 z-10 flex gap-2">
        <span className="inline-flex items-center px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/20">
          {category}
        </span>
        {isHero && (
          <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-yellow-400/90 to-orange-400/90 backdrop-blur-md rounded-full text-xs font-semibold text-black border border-yellow-300/30">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </span>
        )}
      </div>

      {/* Metrics */}
      <div className="absolute top-6 right-6 z-10 flex gap-2">
        <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs text-white">
          <Eye className="w-3 h-3" />
          <span>{metrics.views}</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs text-white">
          <TrendingUp className="w-3 h-3" />
          <span>{metrics.engagement}</span>
        </div>
      </div>

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 transition-all duration-500"
      />

      {/* Content Details */}
      <div
        ref={detailsRef}
        className="absolute bottom-0 left-0 right-0 p-8 text-white opacity-0 transform translate-y-8"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <h3 className={`${isHero ? 'text-2xl lg:text-3xl' : 'text-xl'} font-medium leading-tight mb-2`}>
              {title}
            </h3>
            <p className={`${isHero ? 'text-base' : 'text-sm'} text-white/90 line-clamp-2 leading-relaxed`}>
              {description}
            </p>
          </div>
          
          <Button
            size="sm"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded-full px-4 shrink-0"
          >
            <Play className="w-3 h-3 mr-1" />
            {isHero ? 'Watch Case Study' : 'View'}
          </Button>
        </div>

        {/* Engagement Metrics & CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{metrics.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>2.3K</span>
            </div>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            className="text-white/80 hover:text-white p-0 h-auto"
            onClick={() => window.open(instagramUrl, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Infinite Logo Scroll Component
const InfiniteLogoScroll = () => {
  const clients = [
    { name: 'Client 1', logo: '/client-1.png', industry: 'Tech Startup' },
    { name: 'Client 2', logo: '/client-2.png', industry: 'Fashion' },
    { name: 'Client 3', logo: '/client-3.webp', industry: 'Healthcare' },
    { name: 'Client 1', logo: '/client-1.png', industry: 'Tech Startup' },
    { name: 'Client 2', logo: '/client-2.png', industry: 'Fashion' },
    { name: 'Client 3', logo: '/client-3.webp', industry: 'Healthcare' },
  ];

  return (
    <>
      <style jsx>{`
        @keyframes scroll-logos {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-logo-scroll {
          animation: scroll-logos 20s linear infinite;
        }
        
        .animate-logo-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="w-full overflow-hidden">
        <div className="flex gap-12 animate-logo-scroll" style={{ width: 'fit-content' }}>
          {/* First set */}
          {clients.map((client, index) => (
            <div 
              key={`first-${index}`}
              className="flex-shrink-0 group"
              style={{ width: '180px' }}
            >
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-3 rounded-xl overflow-hidden bg-foreground/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={60}
                    height={60}
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <p className="text-xs font-medium text-foreground/60 group-hover:text-foreground transition-colors">
                  {client.industry}
                </p>
              </div>
            </div>
          ))}
          
          {/* Second set for seamless loop */}
          {clients.map((client, index) => (
            <div 
              key={`second-${index}`}
              className="flex-shrink-0 group"
              style={{ width: '180px' }}
            >
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-3 rounded-xl overflow-hidden bg-foreground/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={60}
                    height={60}
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <p className="text-xs font-medium text-foreground/60 group-hover:text-foreground transition-colors">
                  {client.industry}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// Portfolio data
const portfolioReels = [
  {
    id: 1,
    title: "Luxury Brand Campaign",
    description: "Premium product showcase with sophisticated cinematography and strategic brand positioning for a high-end fashion client.",
    category: "Fashion",
    videoSrc: "/reel-1.mp4",
    instagramUrl: "https://instagram.com/p/example1",
    metrics: { views: '2.1M', likes: '89K', engagement: '12.3%' }
  },
  {
    id: 2,
    title: "Tech Startup Launch",
    description: "Dynamic product launch campaign featuring innovative storytelling and data-driven creative strategy.",
    category: "Technology",
    videoSrc: "/reel-2.mp4",
    instagramUrl: "https://instagram.com/p/example2",
    metrics: { views: '1.8M', likes: '67K', engagement: '9.1%' }
  },
  {
    id: 3,
    title: "Healthcare Innovation",
    description: "Compassionate healthcare storytelling that connects emotionally while showcasing cutting-edge medical solutions.",
    category: "Healthcare",
    videoSrc: "/reel-3.mp4",
    instagramUrl: "https://instagram.com/p/example3",
    metrics: { views: '1.3M', likes: '54K', engagement: '8.7%' }
  },
  {
    id: 4,
    title: "F&B Experience",
    description: "Mouth-watering culinary showcase with artistic food photography and immersive dining experience storytelling.",
    category: "Food & Beverage",
    videoSrc: "/reel-4.mp4",
    instagramUrl: "https://instagram.com/p/example4",
    metrics: { views: '2.7M', likes: '123K', engagement: '15.2%' }
  },
];

// BTS videos data
const btsVideos = [
  { 
    id: 1, 
    title: "Behind the Lens", 
    videoSrc: "/bts/IMG_0038.MOV",
    description: "Creative process of luxury fashion shoot"
  },
  { 
    id: 2, 
    title: "Studio Magic", 
    videoSrc: "/bts/IMG_0160.MOV",
    description: "Team collaboration in action"
  },
  { 
    id: 3, 
    title: "Creative Flow", 
    videoSrc: "/bts/IMG_0397.MOV",
    description: "Artistic direction and execution"
  },
  { 
    id: 4, 
    title: "Production Day", 
    videoSrc: "/bts/IMG_1770.MOV",
    description: "Full-scale commercial production"
  },
  { 
    id: 5, 
    title: "Team Dynamics", 
    videoSrc: "/bts/IMG_2538.MOV",
    description: "Collaborative creative energy"
  },
  { 
    id: 6, 
    title: "Concept to Reality", 
    videoSrc: "/bts/IMG_3287.MOV",
    description: "Bringing creative visions to life"
  },
];

// BTS Video Card Component
const BTSVideoCard = ({ video }: { video: typeof btsVideos[0] }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoElement.muted = true;
            videoElement.play().catch(() => {});
            setIsPlaying(true);
          } else {
            videoElement.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(videoElement);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bts-card group relative bg-black overflow-hidden rounded-xl border border-foreground/10 hover:border-foreground/20 transition-all duration-500 flex-shrink-0" style={{ width: '280px', height: '500px' }}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loop
        muted
        playsInline
        preload="metadata"
        poster={
          video.videoSrc.includes('/bts/') 
            ? `/thumbnails/bts/${video.videoSrc.split('/').pop()?.replace(/\.(mp4|MOV)$/i, '.jpg')}` 
            : undefined
        }
      >
        <source src={video.videoSrc} type="video/mp4" />
      </video>
      
      {/* Overlay with content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h4 className="text-lg font-medium mb-2">{video.title}</h4>
          <p className="text-sm text-white/80 leading-relaxed">{video.description}</p>
        </div>
      </div>

      {/* Play indicator */}
      <div className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-sm rounded-full">
        <Play className="w-4 h-4 text-white" />
      </div>
    </div>
  );
};

// Infinite BTS Scroll Component
const InfiniteBTSScroll = () => {
  return (
    <>
      <style jsx>{`
        @keyframes scroll-bts {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-bts-scroll {
          animation: scroll-bts 40s linear infinite;
        }
        
        .animate-bts-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="w-full overflow-hidden">
        <div className="flex gap-6 animate-bts-scroll" style={{ width: 'fit-content' }}>
          {/* First set */}
          {btsVideos.map((video, index) => (
            <BTSVideoCard key={`first-${index}`} video={video} />
          ))}
          
          {/* Second set for seamless loop */}
          {btsVideos.map((video, index) => (
            <BTSVideoCard key={`second-${index}`} video={video} />
          ))}
        </div>
      </div>
    </>
  );
};

export default function PortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const heroRef = useRef<HTMLDivElement>(null);
  const btsRef = useRef<HTMLDivElement>(null);
  const reelsRef = useRef<HTMLDivElement>(null);
  
  // Initialize scroll animations
  useScrollAnimations();

  useEffect(() => {
    // Animate hero section
    if (heroRef.current) {
      const heroElements = heroRef.current.querySelectorAll('h2, p, button, .hero-divider');
      ScrollAnimations.fadeUp(Array.from(heroElements), { 
        stagger: 0.2,
        start: "top 80%"
      });
    }

    // Animate BTS videos
    if (btsRef.current) {
      const btsCards = btsRef.current.querySelectorAll('.bts-card');
      ScrollAnimations.scaleReveal(Array.from(btsCards), { 
        stagger: 0.1,
        start: "top 75%"
      });
    }

    // Animate reel videos
    if (reelsRef.current) {
      const reelCards = reelsRef.current.querySelectorAll('.reel-card');
      ScrollAnimations.imageReveal(Array.from(reelCards), { 
        stagger: 0.15,
        start: "top 70%"
      });
    }
  }, [selectedCategory]); // Re-run when category changes
  
  const categories = ['All', 'Fashion', 'Technology', 'Healthcare', 'Food & Beverage'];
  
  const filteredReels = selectedCategory === 'All' 
    ? portfolioReels 
    : portfolioReels.filter(reel => reel.category === selectedCategory);

  return (
        <section className="min-h-screen bg-background dark:bg-background text-foreground relative overflow-hidden" id="portfolio">
      {/* Section Divider */}
      <div className="w-full border-t border-border/90 mb-16"></div>
      
      {/* Hero Section */}
      <div ref={heroRef} className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Side - Main Message */}
          <div className="space-y-8">
            <div>
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-light text-foreground leading-none tracking-tight mb-6">
                CREATIVE
                <br />
                <span className="italic font-baskerville tracking-tight">excellence</span>
                <br />
                DELIVERED
              </h2>
              
              <div className="hero-divider w-20 h-px bg-foreground mb-8"></div>
              
              <p className="text-sm font-montserrat font-medium text-foreground/60 mb-6 tracking-wider uppercase">
                Our Mission is to deliver creative, data-driven<br />
                marketing solutions through exceptional<br />
                graphic design, targeted influencer<br />
                collaborations, and strategic business<br />
                development.
              </p>
              
              <ProfessionalButton 
                variant="professional" 
                size="lg"
                className="font-montserrat font-medium px-8 py-3 uppercase tracking-wider text-sm"
                magneticStrength={25}
                hoverScale={1.03}
              >
                SEE ALL OUR PORTFOLIOS
                <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </ProfessionalButton>
            </div>
          </div>

          {/* Right Side - Creative Media House */}
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl  text-right  lg:text-7xl font-light text-foreground leading-tighter">
              WE'RE A <span className="italic tracking-tighter font-baskerville ">highly creative digital</span><br />
              MEDIA HOUSE<br />
            </h1>
          </div>
        </div>

        {/* Infinite Scrolling Brand Logos */}
        <div className="mb-20 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <InfiniteLogoScroll />
        </div>


        {/* Portfolio Grid - Enhanced Layout */}
        <div className="mb-32">
          {/* Portfolio Section Header */}
          

          {/* Hero Portfolio Video - Featured */}
          <div className="mb-16 max-w-6xl mx-auto">
            <div className="relative aspect-[16/9] overflow-hidden bg-foreground/5 border border-border/20">
              <ReelVideoPlayer
                videoSrc={filteredReels[0].videoSrc}
                title={filteredReels[0].title}
                description={filteredReels[0].description}
                category={filteredReels[0].category}
                instagramUrl={filteredReels[0].instagramUrl}
                metrics={filteredReels[0].metrics}
                height="100%"
                isHero={true}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  selectedCategory === category
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-transparent text-foreground border-foreground/20 hover:border-foreground/40'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredReels.slice(1).map((reel) => (
              <div key={reel.id} className="aspect-[9/16]">
                <ReelVideoPlayer
                  videoSrc={reel.videoSrc}
                  title={reel.title}
                  description={reel.description}
                  category={reel.category}
                  instagramUrl={reel.instagramUrl}
                  metrics={reel.metrics}
                  height="100%"
                />
              </div>
            ))}
          </div>

          {/* Impact Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-light text-foreground mb-2">24M+</div>
              <div className="text-sm font-medium text-foreground/60 uppercase tracking-wide">Total Reach</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-light text-foreground mb-2">94%</div>
              <div className="text-sm font-medium text-foreground/60 uppercase tracking-wide">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-light text-foreground mb-2">156</div>
              <div className="text-sm font-medium text-foreground/60 uppercase tracking-wide">Projects Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-light text-foreground mb-2">12.8%</div>
              <div className="text-sm font-medium text-foreground/60 uppercase tracking-wide">Avg. Engagement</div>
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
            {/* Left Column - Process Insights */}
            <div className="lg:col-span-8 space-y-8">
              <div>
                <h3 className="text-2xl lg:text-3xl font-medium text-foreground mb-4 leading-tight">
                  Every campaign tells a story of <span className="italic font-baskerville">strategic creativity</span> and measurable impact.
                </h3>
                <p className="text-foreground/70 text-base leading-relaxed mb-6">
                  Our portfolio represents more than aesthetic excellence—each project demonstrates our commitment to 
                  delivering ROI-driven creative solutions that resonate with target audiences and amplify brand presence 
                  across digital platforms.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-foreground rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">Strategic Brand Positioning</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-foreground rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">Data-Driven Creative Direction</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-foreground rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">Multi-Platform Content Optimization</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-foreground rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">Influencer Partnership Strategy</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-foreground rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">Performance Analytics & Insights</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-foreground rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">Scalable Campaign Architecture</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Mission Statement */}
            <div className="lg:col-span-4 flex flex-col justify-center">
              <div className="bg-foreground/3 border border-foreground/10 rounded-2xl p-8">
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Our Creative Philosophy
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed mb-6">
                  Every project represents our dedication to excellence, innovation, 
                  and creating meaningful connections between brands and their audiences through authentic storytelling.
                </p>
                
                <ProfessionalButton 
                  variant="professional" 
                  size="lg"
                  className="font-montserrat font-medium w-full uppercase tracking-wider text-sm"
                  magneticStrength={20}
                  hoverScale={1.02}
                >
                  Explore Our Process
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </ProfessionalButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Behind-the-Scenes Section */}
      <div className="bg-foreground/3 py-24">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight mb-6">
            The <span className="italic font-baskerville tracking-tight">creative process</span> unveiled
          </h2>
          
          <p className="text-xl text-foreground/60 mb-12 max-w-4xl mx-auto leading-relaxed">
            Peek behind the curtain and witness the strategic thinking, collaborative energy, 
            and meticulous craftsmanship that goes into every campaign we deliver.
          </p>
          
          <ProfessionalButton 
            variant="professional" 
            size="xl"
            className="font-montserrat font-medium px-12 py-4 text-lg uppercase tracking-wider"
            magneticStrength={30}
            hoverScale={1.04}
          >
            Join Our Journey
            <ArrowUpRight className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </ProfessionalButton>
        </div>

        {/* Infinite Scrolling BTS Videos */}
        <div className="max-w-full mx-auto px-4 md:px-6 lg:px-8">
          <InfiniteBTSScroll />
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-foreground text-background py-20">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6">
            Ready to create something <span className="italic font-baskerville">extraordinary</span>?
          </h2>
          
          <p className="text-xl text-background/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Let's collaborate to transform your brand vision into compelling digital experiences 
            that drive engagement and deliver measurable results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 rounded-full px-8 py-4 font-medium group"
            >
              Start Your Project
              <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
            
            <ProfessionalButton 
              size="lg"
              variant="professional"
              className="border-background/40 text-background hover:bg-background/10 hover:text-foreground font-montserrat font-medium px-8 py-4 uppercase tracking-wider"
              magneticStrength={25}
              hoverScale={1.03}
            >
              View All Case Studies
            </ProfessionalButton>
          </div>
        </div>
      </div>
    </section>
  );
}
