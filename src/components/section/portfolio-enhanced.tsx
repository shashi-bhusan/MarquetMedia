'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ProfessionalButton } from '@/components/ui/professional-button';
import { ArrowUpRight, ExternalLink, Play, ChevronRight, Eye, Heart, MessageCircle, Star, TrendingUp, Award, Users, Zap } from 'lucide-react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { OptimizedVideo } from '@/components/OptimizedVideo';


// Enhanced Portfolio Video Player with Agency-style Interactions
const PortfolioVideoPlayer = ({ 
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
      <OptimizedVideo
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loop
        muted
        playsInline
        preload="metadata"
        onTimeUpdate={() => {
          // Handle progress updates
          if (videoRef.current && !videoRef.current.paused && videoRef.current.duration) {
            const progressPercent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            gsap.set(progressRef.current, { width: `${progressPercent}%` });
          }
        }}
      />

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
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div className="flex items-center gap-4 text-xs text-white/80">
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{metrics.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>2.1K</span>
            </div>
          </div>
          
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium hover:underline transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            View on Instagram
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Play State Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Portfolio Data with Professional UX Writing
const portfolioShowcase = [
  {
    id: 1,
    videoSrc: '/reel-3.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DHfz1XlygVw/',
    title: 'Authentic Brand Partnerships That Convert',
    description: 'Strategic influencer collaborations that forge genuine connections between brands and audiences, delivering measurable impact through authentic storytelling and data-driven campaign optimization.',
    category: 'Influencer Strategy',
    metrics: { views: '2.8M', likes: '124K', engagement: '12.4%' }
  },
  {
    id: 2,
    videoSrc: '/reel-4.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DIjD37aB0_s/',
    title: 'Visual Excellence in Digital Storytelling',
    description: 'Award-winning creative direction that transforms brand narratives into compelling visual experiences, combining artistic vision with strategic messaging for maximum audience impact.',
    category: 'Creative Direction',
    metrics: { views: '1.9M', likes: '89K', engagement: '9.8%' }
  },
  {
    id: 3,
    videoSrc: '/reel-2.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DBJO9AINY6L/',
    title: 'Launch Campaigns That Break Through',
    description: 'Data-driven product launches engineered for viral reach through strategic content planning, precision audience targeting, and innovative creative execution that drives measurable ROI.',
    category: 'Campaign Strategy',
    metrics: { views: '4.1M', likes: '186K', engagement: '15.2%' }
  },
  {
    id: 4,
    videoSrc: '/reel-1.mp4',
    instagramUrl: 'https://www.instagram.com/reel/DF69CDJhGdo/',
    title: 'Brand Narratives That Resonate',
    description: 'Revolutionary storytelling methodologies that redefine brand communication, creating profound emotional connections that drive long-term customer loyalty and sustainable growth.',
    category: 'Brand Strategy',
    metrics: { views: '1.7M', likes: '78K', engagement: '8.9%' }
  },
];

// Premium Client Portfolio with Industry Context
const clientPortfolio = [
  { name: 'MidFunnel', logo: '/client-1.png', industry: 'Technology', result: '+300% Lead Generation' },
  { name: 'Achieve', logo: '/client-2.png', industry: 'Education', result: '+150% Course Enrollment' },
  { name: 'Momentum', logo: '/client-3.webp', industry: 'Finance', result: '+240% App Downloads' },
  { name: 'Tangent', logo: '/client-1.png', industry: 'Creative Agency', result: '+180% Brand Awareness' },
  { name: 'Utility', logo: '/client-2.png', industry: 'Energy', result: '+220% Customer Acquisition' },
  { name: 'SuperIntelligent', logo: '/client-3.webp', industry: 'AI/ML', result: '+350% User Engagement' },
];

// Impact Statistics Component
const ImpactMetrics = () => {
  const metrics = [
    { 
      number: '250+', 
      label: 'Successful Campaigns', 
      description: 'Delivered with measurable ROI',
      icon: <Award className="w-5 h-5" />
    },
    { 
      number: '78M+', 
      label: 'Content Impressions', 
      description: 'Across all digital platforms',
      icon: <Eye className="w-5 h-5" />
    },
    { 
      number: '98%', 
      label: 'Client Retention Rate', 
      description: 'Based on long-term partnerships',
      icon: <Users className="w-5 h-5" />
    },
    { 
      number: '4.2x', 
      label: 'Average ROI Increase', 
      description: 'Measured against baseline metrics',
      icon: <Zap className="w-5 h-5" />
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-20 border-y border-border/10">
      {metrics.map((stat, index) => (
        <div key={index} className="text-center group">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-foreground/5 rounded-full flex items-center justify-center text-foreground/60 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300">
              {stat.icon}
            </div>
          </div>
          <div className="text-4xl lg:text-5xl font-light text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {stat.number}
          </div>
          <div className="text-sm font-medium text-foreground/80 mb-1 tracking-wide">
            {stat.label}
          </div>
          <div className="text-xs text-foreground/50 leading-tight px-2">
            {stat.description}
          </div>
        </div>
      ))}
    </div>
  );
};

// Enhanced Client Showcase
const ClientShowcase = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const originalLogos = scrollContainer.children[0] as HTMLElement;
    const clonedLogos = originalLogos.cloneNode(true) as HTMLElement;
    scrollContainer.appendChild(clonedLogos);

    const totalWidth = originalLogos.offsetWidth;

    const animation = gsap.fromTo(scrollContainer, 
      { x: 0 }, 
      {
        x: -totalWidth,
        duration: 25,
        ease: 'none',
        repeat: -1,
      }
    );

    const handleMouseEnter = () => {
      gsap.to(animation, { timeScale: 0.3, duration: 0.8, ease: "power2.out" });
    };
    
    const handleMouseLeave = () => {
      gsap.to(animation, { timeScale: 1, duration: 0.8, ease: "power2.out" });
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      animation.kill();
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative py-20">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-2 bg-foreground/5 rounded-full text-sm font-medium text-foreground/70 border border-foreground/10 mb-4">
          Trusted Partnerships
        </span>
        <h3 className="text-2xl md:text-3xl font-light text-foreground mb-4">
          Brands That <span className="italic font-baskerville tracking-tight">Trust Our Vision</span>
        </h3>
        <p className="text-foreground/70 max-w-2xl mx-auto">
          Collaborating with industry leaders to create meaningful impact through strategic creative solutions
        </p>
      </div>

      {/* Logo Scroll */}
      <div className="overflow-hidden w-full border-y border-border/20 py-12 bg-foreground/2">
        <div ref={scrollRef} className="flex items-center">
          <div className="flex items-center gap-24 shrink-0">
            {clientPortfolio.map((client, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center justify-center group cursor-pointer"
              >
                <div className="opacity-30 hover:opacity-90 transition-all duration-700 group-hover:scale-110 mb-4">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={160}
                    height={80}
                    className="h-12 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="text-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-xs text-foreground/60 font-medium block mb-1">
                    {client.industry}
                  </span>
                  <span className="text-xs text-primary font-semibold">
                    {client.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Behind the Scenes videos data
const btsVideos = [
  { id: 1, videoSrc: '/bts/IMG_0038.MOV', title: 'Strategic Creative Process', description: 'Behind the scenes of our collaborative creative methodology' },
  { id: 2, videoSrc: '/bts/IMG_0160.MOV', title: 'Production Excellence', description: 'Setting up for cinematic-quality content capture' },
  { id: 3, videoSrc: '/bts/IMG_0397.MOV', title: 'Team Collaboration', description: 'Cross-functional teamwork bringing visions to life' },
  { id: 4, videoSrc: '/bts/IMG_1770.MOV', title: 'Location Intelligence', description: 'Strategic environment selection for brand storytelling' },
  { id: 5, videoSrc: '/bts/IMG_2538.MOV', title: 'Technical Precision', description: 'Professional-grade equipment for flawless execution' },
  { id: 6, videoSrc: '/bts/IMG_3287.MOV', title: 'Creative Direction', description: 'Guiding talent through strategic performance coaching' },
  { id: 7, videoSrc: '/bts/IMG_3288.MOV', title: 'Quality Assurance', description: 'Meticulous attention to detail in final production' },
  { id: 8, videoSrc: '/bts/IMG_7721.MOV', title: 'Campaign Success', description: 'Celebrating measurable results and client satisfaction' },
];

// BTS Video Component
const BTSVideoCard = ({ video }: { video: typeof btsVideos[0] }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

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
            playVideo();
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex-shrink-0 w-96 h-[500px] bg-foreground/5 overflow-hidden rounded-2xl border border-border/20 group hover:border-foreground/30 transition-all duration-500 hover:shadow-2xl hover:shadow-foreground/10">
      <div className="relative h-full">
        <OptimizedVideo
          ref={videoRef}
          src={video.videoSrc}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          preload="metadata"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <h4 className="text-2xl font-light mb-3 leading-tight">{video.title}</h4>
          <p className="text-base text-white/90 leading-relaxed">{video.description}</p>
        </div>

        {/* Corner accent */}
        <div className="absolute top-6 right-6 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-full h-full border-t-2 border-r-2 border-white/40 rounded-tr-lg"></div>
        </div>
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
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-bts-scroll {
          animation: scroll-bts 20s linear infinite;
        }
        
        .animate-bts-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="overflow-hidden w-full">
        <div className="flex gap-8 animate-bts-scroll" style={{ width: 'fit-content' }}>
          {/* First set */}
          {btsVideos.map((video) => (
            <BTSVideoCard key={`first-${video.id}`} video={video} />
          ))}
          {/* Duplicate set for seamless loop */}
          {btsVideos.map((video) => (
            <BTSVideoCard key={`second-${video.id}`} video={video} />
          ))}
        </div>
      </div>
    </>
  );
};

export default function EnhancedPortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Brand Strategy', 'Campaign Strategy', 'Creative Direction', 'Influencer Strategy'];

  const filteredProjects = selectedCategory === 'All' 
    ? portfolioShowcase 
    : portfolioShowcase.filter(project => project.category === selectedCategory);

  return (
    <section 
      id="portfolio"
      className="min-h-screen bg-background dark:bg-background"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          
          {/* Main Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">
            
            {/* Left Column - Main Heading */}
            <div className="lg:col-span-8">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-foreground/5 rounded-full text-sm font-medium text-foreground/70 border border-foreground/10">
                  Portfolio Excellence
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-[0.9] mb-8">
                <span className="block">WHERE</span>
                <span className="block italic font-baskerville tracking-tighter">creativity meets</span>
                <span className="block">STRATEGY</span>
              </h1>

              <div className="h-px bg-gradient-to-r from-foreground/20 to-transparent mb-8"></div>
              
              <p className="text-xl text-foreground/70 max-w-2xl leading-relaxed">
                Discover how we transform brands through strategic storytelling, 
                innovative design, and data-driven campaigns that deliver measurable results.
              </p>
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
                  className="w-full group font-montserrat font-medium px-6 py-3 text-sm uppercase tracking-wider"
                  magneticStrength={20}
                  hoverScale={1.03}
                >
                  Partner with Us
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </ProfessionalButton>
              </div>
            </div>
          </div>

          {/* Impact Statistics */}
          <ImpactMetrics />
        </div>
      </div>

      {/* Client Showcase */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <ClientShowcase />
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-foreground text-background shadow-lg'
                    : 'bg-foreground/5 text-foreground/70 hover:bg-foreground/10 border border-foreground/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Portfolio Item */}
          <div className="mb-16">
            <div className="relative aspect-[21/9] overflow-hidden">
              <PortfolioVideoPlayer
                videoSrc={filteredProjects[0].videoSrc}
                title={filteredProjects[0].title}
                description={filteredProjects[0].description}
                category={filteredProjects[0].category}
                instagramUrl={filteredProjects[0].instagramUrl}
                metrics={filteredProjects[0].metrics}
                height="100%"
                isHero={true}
              />
            </div>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.slice(1).map((project, index) => (
              <div key={project.id} className="relative aspect-[9/16] overflow-hidden">
                <PortfolioVideoPlayer
                  videoSrc={project.videoSrc}
                  title={project.title}
                  description={project.description}
                  category={project.category}
                  instagramUrl={project.instagramUrl}
                  metrics={project.metrics}
                  height="100%"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Behind the Scenes Section */}
      <div className="py-20">
        <div className="text-center mb-20 max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <span className="inline-block px-4 py-2 bg-foreground/5 rounded-full text-sm font-medium text-foreground/70 border border-foreground/10 mb-6">
            Behind the Scenes
          </span>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-6 leading-tight">
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

      {/* Bottom CTA */}
      <div className="py-20 text-center max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6 leading-tight">
          Ready to <span className="italic font-baskerville tracking-tight">transform</span> your<br />
          brand story?
        </h2>
        <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed">
          Let's collaborate to create compelling content that resonates with your audience 
          and drives meaningful engagement across all digital platforms.
        </p>
        <ProfessionalButton 
          variant="professional"
          size="xl"
          className="font-montserrat font-medium px-12 py-4 text-lg uppercase tracking-wider"
          magneticStrength={30}
          hoverScale={1.04}
        >
          Start Our Partnership
          <ArrowUpRight className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </ProfessionalButton>
      </div>
    </section>
  );
}
