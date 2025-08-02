'use client';

import { useState, useRef, useEffect } from 'react';
import { CldImage } from 'next-cloudinary';
import { CloudinaryVideo } from './CloudinaryVideo';
import { Button } from '@/components/ui/button';
import { Play, Eye, Heart, MessageCircle, TrendingUp, Star, ExternalLink } from 'lucide-react';
import { gsap } from 'gsap';

interface OptimizedReelPlayerProps {
  videoPublicId: string;
  posterPublicId?: string;
  title: string;
  description: string;
  category: string;
  instagramUrl: string;
  metrics?: { views: string; likes: string; engagement: string };
  isHero?: boolean;
  height?: string;
}

export const OptimizedReelPlayer = ({
  videoPublicId,
  posterPublicId,
  title,
  description,
  category,
  instagramUrl,
  metrics = { views: '1.2M', likes: '47K', engagement: '8.4%' },
  isHero = false,
  height = 'auto'
}: OptimizedReelPlayerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const details = detailsRef.current;

    if (!overlay || !details) return;

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

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="group cursor-pointer relative bg-black overflow-hidden w-full rounded-2xl border border-foreground/10"
      style={{ height }}
    >
      {/* Video Player */}
      <CloudinaryVideo
        publicId={videoPublicId}
        poster={posterPublicId}
        title={title}
        className="w-full h-full"
        autoPlay={isHovered}
        muted
        loop
        controls={false}
        lazy
      />

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

      {/* Overlay content */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0"
      >
        <div 
          ref={detailsRef}
          className="absolute bottom-6 left-6 right-6 text-white opacity-0 translate-y-6"
        >
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-sm text-white/80 mb-4 line-clamp-2">{description}</p>
          
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
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded-full px-4"
              onClick={() => window.open(instagramUrl, '_blank')}
            >
              <Play className="w-3 h-3 mr-1" />
              View
            </Button>
          </div>
        </div>
      </div>

      {/* Play State Indicator */}
      {!isPlaying && !isHovered && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};
