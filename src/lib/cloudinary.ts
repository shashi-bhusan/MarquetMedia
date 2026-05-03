import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { getPublicCloudinaryCloudName } from '@/lib/cloudinary-config';

export const cld = new Cloudinary({
  cloud: {
    cloudName: getPublicCloudinaryCloudName(),
  },
});

// Video optimization presets
export const videoPresets = {
  mobile: {
    width: 480,
    quality: 'auto:low',
    format: 'auto'
  },
  tablet: {
    width: 720,
    quality: 'auto:good',
    format: 'auto'
  },
  desktop: {
    width: 1080,
    quality: 'auto:best',
    format: 'auto'
  }
};

// Image optimization presets
export const imagePresets = {
  thumbnail: { width: 300, height: 200 },
  card: { width: 600, height: 400 },
  hero: { width: 1200, height: 800 },
  poster: { width: 800, height: 600 }
};

// Generate optimized URLs
export const getOptimizedVideoUrl = (publicId: string, preset: keyof typeof videoPresets) => {
  const config = videoPresets[preset];
  return cld.video(publicId)
    .resize(auto().width(config.width))
    .delivery(quality(config.quality))
    .delivery(format('auto'))
    .toURL();
};

export const getOptimizedImageUrl = (publicId: string, preset: keyof typeof imagePresets) => {
  const config = imagePresets[preset];
  return cld.image(publicId)
    .resize(auto().width(config.width).height(config.height))
    .delivery(quality('auto'))
    .delivery(format('auto'))
    .toURL();
};

// Device detection for responsive media
export const getDeviceType = (): keyof typeof videoPresets => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Generate responsive video URLs
export const getResponsiveVideoUrl = (publicId: string) => {
  const device = getDeviceType();
  return getOptimizedVideoUrl(publicId, device);
};
