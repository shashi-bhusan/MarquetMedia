/**
 * Maps local public/ video paths to Cloudinary streaming URLs so staging/prod
 * match without relying on Git LFS binaries in the deployment bundle.
 */
import assetMapping from '@/lib/asset-mapping.json';
import { getOptimizedVideoUrl } from '@/lib/cloudinary-config';

const videos = assetMapping.videos as Record<string, string>;
const posters = assetMapping.posters as Record<string, string>;

function cloudinaryEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
}

/** e.g. /reel-1.mp4 → reel-1, /bts/IMG_0038.MOV → IMG_0038, /marquetmedia.mp4 → marquetmedia */
export function videoAssetKeyFromLocalPath(localPath: string): string | null {
  const p = decodeURIComponent(localPath).replace(/\\/g, '/');
  const reel = p.match(/\/reel-(\d+)\.mp4$/i);
  if (reel) return `reel-${reel[1]}`;
  const bts = p.match(/\/bts\/([^/]+?)\.(MOV|MP4|mov|mp4)$/i);
  if (bts) return bts[1];
  if (/\/marquetmedia\.mp4$/i.test(p)) return 'marquetmedia';
  return null;
}

function optimizationType(localPath: string): 'hero' | 'portfolio' | 'bts' {
  if (localPath.includes('/bts/')) return 'bts';
  if (/reel-/i.test(localPath)) return 'portfolio';
  return 'hero';
}

/** Playback URL: Cloudinary when configured, otherwise the original path (local / LFS). */
export function resolveVideoPlaybackUrl(localPath: string): string {
  if (!cloudinaryEnabled()) return localPath;
  const key = videoAssetKeyFromLocalPath(localPath);
  if (!key) return localPath;
  const publicId = videos[key];
  if (!publicId) return localPath;
  return getOptimizedVideoUrl(publicId, optimizationType(localPath));
}

/** Poster: Cloudinary frame URL from asset-mapping when configured, else local thumbnail path. */
export function resolveVideoPosterUrl(localPath: string): string {
  const key = videoAssetKeyFromLocalPath(localPath);
  if (cloudinaryEnabled() && key && posters[key]) {
    return posters[key] as string;
  }
  if (localPath.includes('/reel-')) {
    const jpg = localPath.split('/').pop()?.replace(/\.mp4$/i, '.jpg');
    return jpg ? `/thumbnails/reels/${jpg}` : '/thumbnails/reels/reel-1.jpg';
  }
  if (localPath.includes('/bts/')) {
    const base = localPath.split('/').pop()?.replace(/\.(MOV|MP4|mov|mp4)$/i, '.jpg');
    return base ? `/thumbnails/bts/${base}` : '/thumbnails/bts/IMG_0038.jpg';
  }
  if (/marquetmedia\.mp4/i.test(localPath)) return '/thumbnails/hero/marquetmedia.jpg';
  return '/thumbnails/hero/marquetmedia.jpg';
}
