import { cld } from './cloudinary';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { videoEdit } from '@cloudinary/url-gen/actions/videoEdit';
import { preview } from '@cloudinary/url-gen/actions/videoEdit';

// Enhanced video presets for different use cases
export const videoPresets = {
  hero: {
    mobile: {
      width: 480,
      height: 854, // 9:16 aspect ratio
      quality: 'auto:good',
      format: 'auto',
      bitrate: '500k'
    },
    tablet: {
      width: 768,
      height: 432, // 16:9 aspect ratio  
      quality: 'auto:good',
      format: 'auto',
      bitrate: '1000k'
    },
    desktop: {
      width: 1920,
      height: 1080, // Full HD
      quality: 'auto:best',
      format: 'auto',
      bitrate: '2000k'
    }
  },
  reel: {
    mobile: {
      width: 480,
      height: 854,
      quality: 'auto:low',
      format: 'auto',
      bitrate: '400k'
    },
    tablet: {
      width: 720,
      height: 1280,
      quality: 'auto:good',
      format: 'auto',
      bitrate: '800k'
    },
    desktop: {
      width: 1080,
      height: 1920,
      quality: 'auto:best',
      format: 'auto',
      bitrate: '1500k'
    }
  }
};

// Device detection with better accuracy
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  const pixelRatio = window.devicePixelRatio || 1;
  const effectiveWidth = width * pixelRatio;
  
  // More precise device detection
  if (width <= 768 || effectiveWidth <= 1536) return 'mobile';
  if (width <= 1024 || effectiveWidth <= 2048) return 'tablet';
  return 'desktop';
};

// Connection-aware quality adjustment
export const getConnectionAwareQuality = (): 'auto:low' | 'auto:good' | 'auto:best' => {
  if (typeof navigator === 'undefined') return 'auto:good';
  
  // @ts-ignore - navigator.connection is experimental
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!connection) return 'auto:good';
  
  const { effectiveType, downlink } = connection;
  
  // Adjust quality based on connection
  if (effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1) {
    return 'auto:low';
  } else if (effectiveType === '3g' || downlink < 3) {
    return 'auto:good';
  } else {
    return 'auto:best';
  }
};

// Generate optimized video URL with advanced transformations
export const getOptimizedVideoUrl = (
  publicId: string, 
  type: 'hero' | 'reel' = 'hero',
  device?: 'mobile' | 'tablet' | 'desktop'
): string => {
  const deviceType = device || getDeviceType();
  const connectionQuality = getConnectionAwareQuality();
  const config = videoPresets[type][deviceType];

  try {
    const video = cld.video(publicId);
    
    // Apply resize transformation
    video.resize(fill().width(config.width).height(config.height));
    
    // Apply quality and format optimizations
    video.delivery(quality(connectionQuality));
    video.delivery(format('auto'));
    
    // Add video-specific optimizations
    video.videoEdit(preview().duration(2)); // 2-second preview for faster loading
    
    return video.toURL();
  } catch (error) {
    console.warn('Error generating optimized video URL:', error);
    // Fallback to basic URL
    return `/videos/${publicId}.mp4`;
  }
};

// Generate poster image from video
export const getVideoPosterUrl = (
  publicId: string,
  timeOffset: number = 0
): string => {
  try {
    const image = cld.image(publicId);
    
    // Convert video to image at specific time
    image.format('jpg');
    image.delivery(quality('auto:best'));
    
    // Add video-to-image transformation
    if (timeOffset > 0) {
      // Add time offset if supported
      image.addTransformation(`so_${timeOffset}`);
    }
    
    return image.toURL();
  } catch (error) {
    console.warn('Error generating poster URL:', error);
    return `/posters/${publicId}-poster.jpg`;
  }
};

// Preload video with connection awareness
export const preloadVideo = (src: string, priority: 'high' | 'low' = 'low'): void => {
  if (typeof window === 'undefined') return;
  
  // Check if preloading is appropriate
  const connection = getConnectionAwareQuality();
  if (connection === 'auto:low' && priority === 'low') {
    return; // Skip preloading on slow connections for low priority videos
  }
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'video';
  link.href = src;
  link.crossOrigin = 'anonymous';
  
  document.head.appendChild(link);
  
  // Clean up after 30 seconds
  setTimeout(() => {
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  }, 30000);
};

// Video loading states for better UX
export interface VideoLoadingState {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  progress: number;
}

// Enhanced video loader with progress tracking
export const createVideoLoader = (
  src: string,
  onStateChange: (state: VideoLoadingState) => void
): () => void => {
  const video = document.createElement('video');
  let state: VideoLoadingState = {
    isLoading: true,
    isLoaded: false,
    hasError: false,
    progress: 0
  };
  
  const updateState = (updates: Partial<VideoLoadingState>) => {
    state = { ...state, ...updates };
    onStateChange(state);
  };
  
  const handleProgress = () => {
    if (video.buffered.length > 0) {
      const progress = (video.buffered.end(0) / video.duration) * 100;
      updateState({ progress });
    }
  };
  
  const handleCanPlay = () => {
    updateState({ 
      isLoading: false, 
      isLoaded: true,
      progress: 100 
    });
  };
  
  const handleError = () => {
    updateState({ 
      isLoading: false, 
      hasError: true 
    });
  };
  
  // Set up event listeners
  video.addEventListener('progress', handleProgress);
  video.addEventListener('canplaythrough', handleCanPlay);
  video.addEventListener('error', handleError);
  
  // Start loading
  video.preload = 'metadata';
  video.src = src;
  video.load();
  
  // Cleanup function
  return () => {
    video.removeEventListener('progress', handleProgress);
    video.removeEventListener('canplaythrough', handleCanPlay);
    video.removeEventListener('error', handleError);
    video.src = '';
  };
};

export default {
  getOptimizedVideoUrl,
  getVideoPosterUrl,
  preloadVideo,
  createVideoLoader,
  getDeviceType,
  getConnectionAwareQuality
};
