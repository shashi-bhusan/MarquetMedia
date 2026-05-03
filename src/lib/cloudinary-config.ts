// Cloudinary video delivery — transformation strings use official parameter names
// (e.g. w_1920 not width_1920). Invalid names caused 404s and broken staging video.

/** Same account as `asset-mapping.json` poster URLs — mirrors prod when env unset. */
export const DEFAULT_CLOUDINARY_CLOUD_NAME = 'dhiqzdvm3';

export function getPublicCloudinaryCloudName(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  return fromEnv || DEFAULT_CLOUDINARY_CLOUD_NAME;
}

export type VideoOptimizationType = 'hero' | 'portfolio' | 'bts' | 'poster';

/** Valid Cloudinary video transformation chains per use-case */
const VIDEO_TRANSFORMS: Record<VideoOptimizationType, string> = {
  hero: 'w_1920,h_1080,c_fill,g_center,q_auto:good,f_auto',
  portfolio: 'w_800,h_1422,c_fill,g_center,q_auto:good,f_auto',
  bts: 'w_480,h_854,c_fill,g_center,q_auto:eco,f_auto',
  poster: 'w_1920,h_1080,c_fill,g_center,q_auto:good,f_auto',
};

function transformForType(type: VideoOptimizationType): string {
  return VIDEO_TRANSFORMS[type] || VIDEO_TRANSFORMS.portfolio;
}

/** Streamable MP4 URL for a Cloudinary video `publicId` (folder/resource, no file extension). */
export const getOptimizedVideoUrl = (
  publicId: string,
  type: VideoOptimizationType = 'portfolio'
): string => {
  const t = transformForType(type === 'poster' ? 'hero' : type);
  return `https://res.cloudinary.com/${getPublicCloudinaryCloudName()}/video/upload/${t}/${publicId}`;
};

/** JPEG poster frame derived from the same video asset */
export const getOptimizedPosterUrl = (publicId: string): string => {
  return `https://res.cloudinary.com/${getPublicCloudinaryCloudName()}/video/upload/so_0,w_800,h_600,c_fill,q_auto,f_jpg/${publicId}.jpg`;
};

export const getResponsiveVideoSources = (
  publicId: string,
  type: VideoOptimizationType = 'portfolio'
) => {
  const desktop = getOptimizedVideoUrl(publicId, type);
  const tablet =
    type === 'hero'
      ? `https://res.cloudinary.com/${getPublicCloudinaryCloudName()}/video/upload/w_1280,h_720,c_fill,g_center,q_auto:good,f_auto/${publicId}`
      : type === 'bts'
        ? getOptimizedVideoUrl(publicId, 'bts')
        : `https://res.cloudinary.com/${getPublicCloudinaryCloudName()}/video/upload/w_640,h_1138,c_fill,g_center,q_auto:good,f_auto/${publicId}`;
  const mobile =
    type === 'hero'
      ? `https://res.cloudinary.com/${getPublicCloudinaryCloudName()}/video/upload/w_960,h_540,c_fill,g_center,q_auto:eco,f_auto/${publicId}`
      : getOptimizedVideoUrl(publicId, 'bts');

  return [
    { src: desktop, media: '(min-width: 1024px)', type: 'video/mp4' as const },
    { src: tablet, media: '(min-width: 768px)', type: 'video/mp4' as const },
    { src: mobile, media: '(max-width: 767px)', type: 'video/mp4' as const },
  ];
};
