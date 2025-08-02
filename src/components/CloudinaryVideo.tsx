'use client';

import { CldVideoPlayer } from 'next-cloudinary';
import { useState, useRef, useEffect } from 'react';

interface CloudinaryVideoProps {
  publicId: string;
  poster?: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
  lazy?: boolean;
  width?: number;
  height?: number;
}

export const CloudinaryVideo = ({
  publicId,
  poster,
  title,
  className,
  autoPlay = false,
  muted = true,
  controls = false,
  loop = true,
  lazy = true,
  width = 1920,
  height = 1080
}: CloudinaryVideoProps) => {
  const [shouldLoad, setShouldLoad] = useState(!lazy);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            setShouldLoad(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [lazy]);

  return (
    <div ref={videoRef} className={className}>
      {shouldLoad ? (
        <CldVideoPlayer
          src={publicId}
          width={width}
          height={height}
          poster={poster}
          autoPlay={autoPlay && isIntersecting}
          muted={muted}
          loop={loop}
          controls={controls}
          className="w-full h-full object-cover"
          transformation={{
            quality: 'auto',
            fetch_format: 'auto'
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading video...</div>
        </div>
      )}
    </div>
  );
};
