// Cloudinary video optimization configurations

/** Same account as `asset-mapping.json` poster URLs — mirrors prod when `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is unset (e.g. staging). */
export const DEFAULT_CLOUDINARY_CLOUD_NAME = 'dhiqzdvm3';

export function getPublicCloudinaryCloudName(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  return fromEnv || DEFAULT_CLOUDINARY_CLOUD_NAME;
}

type VideoOptimizationType = 'hero' | 'portfolio' | 'bts' | 'poster';

interface TransformationConfig {
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  quality?: string;
  format?: string;
  fetch_format?: string;
}

interface VideoConfig {
  quality: string;
  format: string;
  flags?: string[];
  transformation: TransformationConfig[];
}

interface VideoOptimizations {
  [key: string]: VideoConfig;
}

export const videoOptimizations: VideoOptimizations = {
  // Hero video - High quality, optimized for web
  hero: {
    quality: 'auto:good',
    format: 'auto',
    flags: ['progressive:semi', 'immutable_cache'],
    transformation: [
      {
        width: 1920,
        height: 1080,
        crop: 'fill',
        gravity: 'center',
        quality: 'auto:good'
      },
      {
        format: 'auto',
        fetch_format: 'auto'
      }
    ]
  },

  // Portfolio videos - Balanced quality and size
  portfolio: {
    quality: 'auto:good',
    format: 'auto',
    flags: ['progressive:semi'],
    transformation: [
      {
        width: 800,
        height: 1422, // 9:16 aspect ratio
        crop: 'fill',
        gravity: 'center',
        quality: 'auto:good'
      },
      {
        format: 'auto',
        fetch_format: 'auto'
      }
    ]
  },

  // BTS videos - Optimized for scrolling
  bts: {
    quality: 'auto:eco',
    format: 'auto',
    flags: ['progressive:semi'],
    transformation: [
      {
        width: 480,
        height: 854, // 9:16 aspect ratio
        crop: 'fill',
        gravity: 'center',
        quality: 'auto:eco'
      },
      {
        format: 'auto',
        fetch_format: 'auto'
      }
    ]
  },

  // Thumbnail/poster images
  poster: {
    quality: 'auto:good',
    format: 'auto',
    transformation: [
      {
        width: 1920,
        height: 1080,
        crop: 'fill',
        gravity: 'center',
        quality: 'auto:good'
      },
      {
        format: 'auto',
        fetch_format: 'auto'
      }
    ]
  }
};

// Generate optimized video URL
export const getOptimizedVideoUrl = (publicId: string, type: VideoOptimizationType = 'portfolio'): string => {
  const config = videoOptimizations[type] || videoOptimizations.portfolio;
  
  // Build transformation string
  const transformations = config.transformation.map((t: TransformationConfig) => {
    return Object.entries(t)
      .map(([key, value]) => `${key}_${value}`)
      .join(',');
  }).join('/');

  const flags = config.flags ? `fl_${config.flags.join(',fl_')}` : '';
  const quality = config.quality ? `q_${config.quality}` : '';
  const format = config.format ? `f_${config.format}` : '';

  const params = [transformations, flags, quality, format]
    .filter(Boolean)
    .join('/');

  return `https://res.cloudinary.com/${getPublicCloudinaryCloudName()}/video/upload/${params}/${publicId}`;
};

// Generate optimized poster URL
export const getOptimizedPosterUrl = (publicId: string): string => {
  const config = videoOptimizations.poster;
  
  const transformations = config.transformation.map((t: TransformationConfig) => {
    return Object.entries(t)
      .map(([key, value]) => `${key}_${value}`)
      .join(',');
  }).join('/');

  const quality = config.quality ? `q_${config.quality}` : '';
  const format = config.format ? `f_${config.format}` : '';

  const params = [transformations, quality, format]
    .filter(Boolean)
    .join('/');

  return `https://res.cloudinary.com/${getPublicCloudinaryCloudName()}/video/upload/${params}/${publicId}.jpg`;
};

// Responsive video sources for different screen sizes
export const getResponsiveVideoSources = (publicId: string, type: VideoOptimizationType = 'portfolio') => {
  const baseConfig = videoOptimizations[type] || videoOptimizations.portfolio;
  
  return [
    // Desktop - High quality
    {
      src: getOptimizedVideoUrl(publicId, type),
      media: '(min-width: 1024px)',
      type: 'video/mp4'
    },
    // Tablet - Medium quality
    {
      src: getOptimizedVideoUrl(publicId, 'bts'), // Use smaller size
      media: '(min-width: 768px)',
      type: 'video/mp4'
    },
    // Mobile - Optimized for data usage
    {
      src: getOptimizedVideoUrl(publicId, 'bts'),
      media: '(max-width: 767px)',
      type: 'video/mp4'
    }
  ];
};
