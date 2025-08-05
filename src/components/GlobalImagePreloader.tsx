'use client';

import { useImageBatchPreloader } from '@/hooks/useImageCache';
import { useEffect } from 'react';

// All logo mappings from the application
const allLogoMappings = {
  testimonials: {
    "Mocha Cafe & Bar": { 
      lightLogo: '/protfolio_logo_light/Frame 3.png', 
      darkLogo: '/protfolio_logo_dark/Frame 3.png' 
    },
    "Anardana": { 
      lightLogo: '/protfolio_logo_light/Frame 8.png', 
      darkLogo: '/protfolio_logo_dark/Frame 8.png' 
    },
    "Swarnabhumi": { 
      lightLogo: '/protfolio_logo_light/Frame 11.png', 
      darkLogo: '/protfolio_logo_dark/Frame 11.png' 
    },
    "Engine": { 
      lightLogo: '/protfolio_logo_light/Frame 15.png', 
      darkLogo: '/protfolio_logo_dark/Frame 15.png' 
    },
    "Jerry Land": { 
      lightLogo: '/protfolio_logo_light/1.png', 
      darkLogo: '/protfolio_logo_dark/1.png' 
    },
    "Minu Enhance Developers": { 
      lightLogo: '/protfolio_logo_light/Frame 9.png', 
      darkLogo: '/protfolio_logo_dark/Frame 9.png' 
    },
    "FirstCry.com": { 
      lightLogo: '/protfolio_logo_light/Frame 2.png', 
      darkLogo: '/protfolio_logo_dark/Frame 2.png' 
    },
  },
  portfolio: {
    light: [
      '1.png', 'Frame 2.png', 'Frame 3.png', 'Frame 5.png', 'Frame 6.png',
      'Frame 7.png', 'Frame 8.png', 'Frame 9.png', 'Frame 10.png', 'Frame 11.png',
      'Frame 12.png', 'Frame 13.png', 'Frame 14.png', 'Frame 15.png', 'Frame 16.png',
      'Frame 17.png', 'Frame 18.png', 'Frame 19.png', 'Frame 20.png', 'Frame 21.png'
    ],
    dark: [
      '1.png', 'Frame 2.png', 'Frame 3.png', 'Frame 4.png', 'Frame 5.png',
      'Frame 6.png', 'Frame 7.png', 'Frame 8.png', 'Frame 9.png', 'Frame 10.png',
      'Frame 11.png', 'Frame 12.png', 'Frame 13.png', 'Frame 14.png', 'Frame 15.png',
      'Frame 16.png', 'Frame 17.png', 'Frame 18.png', 'Frame 19.png', 'Frame 20.png'
    ]
  },
  other: [
    '/client-1.png',
    '/client-2.png', 
    '/client-3.webp',
    '/MARQUET.svg',
    '/image.png'
  ]
};

export function GlobalImagePreloader() {
  const { preloadImages } = useImageBatchPreloader();

  useEffect(() => {
    // Extract all unique image URLs
    const allImageUrls = new Set<string>();

    // Add testimonial logos
    Object.values(allLogoMappings.testimonials).forEach(logos => {
      allImageUrls.add(logos.lightLogo);
      allImageUrls.add(logos.darkLogo);
    });

    // Add portfolio logos
    allLogoMappings.portfolio.light.forEach(logo => {
      allImageUrls.add(`/protfolio_logo_light/${logo}`);
    });
    allLogoMappings.portfolio.dark.forEach(logo => {
      allImageUrls.add(`/protfolio_logo_dark/${logo}`);
    });

    // Add other static images
    allLogoMappings.other.forEach(image => {
      allImageUrls.add(image);
    });

    // Start preloading after a short delay to not block initial render
    const timer = setTimeout(() => {
      preloadImages(Array.from(allImageUrls));
    }, 2000);

    return () => clearTimeout(timer);
  }, [preloadImages]);

  return null; // This component doesn't render anything
}

// Hook for critical image preloading (above-the-fold content)
export function useCriticalImagePreloader() {
  const { preloadImages } = useImageBatchPreloader();

  useEffect(() => {
    // Preload only critical images immediately
    const criticalImages = [
      '/MARQUET.svg',
      '/image.png',
      '/client-1.png',
      '/client-2.png',
      '/client-3.webp',
      // Add critical theme logos
      '/protfolio_logo_light/Frame 3.png',
      '/protfolio_logo_dark/Frame 3.png',
      '/protfolio_logo_light/Frame 8.png',
      '/protfolio_logo_dark/Frame 8.png',
    ];

    preloadImages(criticalImages);
  }, [preloadImages]);
}

export default GlobalImagePreloader;
