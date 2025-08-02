'use client';

import { useState, useRef, useEffect } from 'react';
import { OptimizedReelPlayer } from '@/components/OptimizedReelPlayer';
import { ProfessionalButton } from '@/components/ui/professional-button';
import { ArrowUpRight } from 'lucide-react';
import { useScrollAnimations, ScrollAnimations } from '@/components/ScrollAnimations';
import assetMapping from '@/lib/asset-mapping.json';

// Updated portfolio data with Cloudinary public IDs
const portfolioShowcase = [
  {
    id: 1,
    videoPublicId: assetMapping.videos['reel-1'],
    posterPublicId: assetMapping.posters['reel-1'],
    title: 'Nike Air Max Campaign',
    description: 'High-energy campaign showcasing the latest Air Max collection with dynamic visual storytelling.',
    category: 'Brand Strategy',
    instagramUrl: 'https://www.instagram.com/reel/DF69CDJhGdo/',
    metrics: { views: '2.4M', likes: '89K', engagement: '12.3%' }
  },
  {
    id: 2,
    videoPublicId: assetMapping.videos['reel-2'],
    posterPublicId: assetMapping.posters['reel-2'],
    title: 'Tech Startup Launch',
    description: 'Revolutionary product launch with cutting-edge visual effects and strategic positioning.',
    category: 'Campaign Strategy',
    instagramUrl: 'https://www.instagram.com/reel/DBJO9AINY6L/',
    metrics: { views: '1.8M', likes: '67K', engagement: '9.8%' }
  },
  {
    id: 3,
    videoPublicId: assetMapping.videos['reel-3'],
    posterPublicId: assetMapping.posters['reel-3'],
    title: 'Luxury Fashion Editorial',
    description: 'Sophisticated fashion campaign combining artistic vision with commercial appeal.',
    category: 'Creative Direction',
    instagramUrl: 'https://www.instagram.com/reel/DHfz1XlygVw/',
    metrics: { views: '3.1M', likes: '124K', engagement: '15.2%' }
  },
  {
    id: 4,
    videoPublicId: assetMapping.videos['reel-4'],
    posterPublicId: assetMapping.posters['reel-4'],
    title: 'Food & Beverage Campaign',
    description: 'Mouth-watering culinary showcase with artistic food photography and immersive storytelling.',
    category: 'Brand Strategy',
    instagramUrl: 'https://www.instagram.com/reel/DIjD37aB0_s/',
    metrics: { views: '2.7M', likes: '98K', engagement: '11.4%' }
  },
  {
    id: 5,
    videoPublicId: assetMapping.videos['reel-5'],
    posterPublicId: assetMapping.posters['reel-5'],
    title: 'Influencer Collaboration',
    description: 'Authentic partnerships with content creators driving measurable engagement and ROI.',
    category: 'Influencer Strategy',
    instagramUrl: 'https://www.instagram.com/reel/example5/',
    metrics: { views: '1.9M', likes: '76K', engagement: '9.1%' }
  },
  {
    id: 6,
    videoPublicId: assetMapping.videos['reel-6'],
    posterPublicId: assetMapping.posters['reel-6'],
    title: 'Healthcare Innovation',
    description: 'Compassionate healthcare storytelling connecting emotionally while showcasing solutions.',
    category: 'Campaign Strategy',
    instagramUrl: 'https://www.instagram.com/reel/example6/',
    metrics: { views: '1.5M', likes: '54K', engagement: '8.7%' }
  }
];

// BTS videos with Cloudinary IDs
const btsVideos = [
  {
    id: 1,
    videoPublicId: assetMapping.videos['IMG_0038'],
    title: 'Creative Process',
    description: 'Behind the scenes of our strategic creative methodology'
  },
  {
    id: 2,
    videoPublicId: assetMapping.videos['IMG_0160'],
    title: 'Production Setup',
    description: 'Setting up for cinematic-quality content capture'
  },
  {
    id: 3,
    videoPublicId: assetMapping.videos['IMG_0397'],
    title: 'Team Collaboration',
    description: 'Cross-functional teamwork bringing visions to life'
  },
  {
    id: 4,
    videoPublicId: assetMapping.videos['IMG_1770'],
    title: 'Location Scouting',
    description: 'Strategic environment selection for brand storytelling'
  },
  {
    id: 5,
    videoPublicId: assetMapping.videos['IMG_2538'],
    title: 'Technical Excellence',
    description: 'Professional-grade equipment for flawless execution'
  },
  {
    id: 6,
    videoPublicId: assetMapping.videos['IMG_3287'],
    title: 'Creative Direction',
    description: 'Guiding talent through strategic performance coaching'
  }
];

// BTS Video Card Component
const BTSVideoCard = ({ video }: { video: typeof btsVideos[0] }) => {
  return (
    <div className="bts-card group relative bg-black overflow-hidden rounded-xl border border-foreground/10 hover:border-foreground/20 transition-all duration-500 flex-shrink-0" 
         style={{ width: '280px', height: '500px' }}>
      
      <OptimizedReelPlayer
        videoPublicId={video.videoPublicId}
        title={video.title}
        description={video.description}
        category="Behind the Scenes"
        instagramUrl="#"
        height="100%"
      />
      
      {/* Content overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h4 className="text-lg font-medium mb-2">{video.title}</h4>
          <p className="text-sm text-white/80 leading-relaxed">{video.description}</p>
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

export default function CloudinaryPortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Refs for scroll animations
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
  }, [selectedCategory]);
  
  const categories = ['All', 'Brand Strategy', 'Campaign Strategy', 'Creative Direction', 'Influencer Strategy'];
  
  const filteredProjects = selectedCategory === 'All' 
    ? portfolioShowcase 
    : portfolioShowcase.filter(project => project.category === selectedCategory);

  return (
    <section className="min-h-screen bg-cream dark:bg-background text-foreground relative overflow-hidden" id="portfolio">
      {/* Section Divider */}
      <div className="w-full border-t border-border/90 mb-16"></div>
      
      {/* Hero Section */}
      <div ref={heroRef} className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-32">
        <div className="text-center mb-20">
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-light text-foreground leading-none tracking-tight mb-6">
            CREATIVE
            <br />
            <span className="italic font-baskerville tracking-tight">excellence</span>
            <br />
            DELIVERED
          </h2>
          
          <div className="hero-divider w-24 h-px bg-foreground/20 mx-auto mb-8"></div>
          
          <p className="text-xl text-foreground/60 mb-12 max-w-4xl mx-auto leading-relaxed">
            Experience our portfolio of award-winning campaigns that drive measurable results 
            through strategic creativity and data-driven insights.
          </p>
          
          <ProfessionalButton 
            variant="professional" 
            size="xl"
            className="font-montserrat font-medium px-12 py-4 text-lg uppercase tracking-wider"
            magneticStrength={30}
            hoverScale={1.04}
            showContactForm={true}
          >
            Start Your Project
            <ArrowUpRight className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </ProfessionalButton>
        </div>

        {/* Featured Portfolio Item */}
        <div className="mb-16">
          <div className="relative aspect-[21/9] overflow-hidden">
            <OptimizedReelPlayer
              videoPublicId={filteredProjects[0].videoPublicId}
              posterPublicId={filteredProjects[0].posterPublicId}
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
        <div ref={reelsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProjects.slice(1).map((project) => (
            <div key={project.id} className="reel-card aspect-[9/16]">
              <OptimizedReelPlayer
                videoPublicId={project.videoPublicId}
                posterPublicId={project.posterPublicId}
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

        {/* Impact Stats */}
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
            <div className="text-4xl lg:text-5xl font-light text-foreground mb-2">12.4%</div>
            <div className="text-sm font-medium text-foreground/60 uppercase tracking-wide">Avg Engagement</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-light text-foreground mb-2">150+</div>
            <div className="text-sm font-medium text-foreground/60 uppercase tracking-wide">Campaigns</div>
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
        </div>

        {/* Infinite Scrolling BTS Videos */}
        <div ref={btsRef} className="max-w-full mx-auto px-4 md:px-6 lg:px-8">
          <InfiniteBTSScroll />
        </div>
      </div>
    </section>
  );
}
