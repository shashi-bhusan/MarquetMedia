#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class VideoOptimizer {
  constructor() {
    this.publicDir = path.join(process.cwd(), 'public');
  }

  // Enhanced video upload with multiple quality versions
  async uploadVideoWithOptimizations(filePath, publicId) {
    console.log(`🎥 Uploading and optimizing: ${publicId}`);

    try {
      // Upload original with compatible settings
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        public_id: publicId,
        folder: 'marquet-media',
        overwrite: true,
        quality_analysis: true,
        
        // Compatible upload settings
        video_codec: 'auto', // Let Cloudinary choose the best codec
        audio_codec: 'auto',
        
        // Responsive breakpoints for different devices
        responsive_breakpoints: [
          {
            create_derived: true,
            bytes_step: 20000,
            min_width: 480,
            max_width: 1920,
            max_images: 3
          }
        ],

        // Eager transformations for immediate availability
        eager: [
          // Hero video - Ultra high quality
          {
            width: 1920,
            height: 1080,
            crop: 'fill',
            gravity: 'center',
            quality: 'auto:good',
            format: 'mp4'
          },
          // Desktop version
          {
            width: 1280,
            height: 720,
            crop: 'fill',
            gravity: 'center',
            quality: 'auto:good',
            format: 'mp4'
          },
          // Mobile version
          {
            width: 854,
            height: 480,
            crop: 'fill',
            gravity: 'center',
            quality: 'auto:eco',
            format: 'mp4'
          }
        ],

        // Auto-generate poster frames
        eager_async: false // Synchronous for reliability
      });

      console.log(`✅ Successfully optimized: ${publicId}`);
      console.log(`📊 Original size: ${(result.bytes / 1024 / 1024).toFixed(2)} MB`);
      console.log(`⏱️  Duration: ${result.duration}s`);
      console.log(`📐 Dimensions: ${result.width}x${result.height}`);
      
      return result;
    } catch (error) {
      console.error(`❌ Failed to optimize ${publicId}:`, error.message);
      
      // Try with basic settings as fallback
      try {
        console.log(`🔄 Retrying with basic settings: ${publicId}`);
        const fallbackResult = await cloudinary.uploader.upload(filePath, {
          resource_type: 'video',
          public_id: publicId,
          folder: 'marquet-media',
          overwrite: true,
          quality: 'auto'
        });
        
        console.log(`✅ Fallback upload successful: ${publicId}`);
        return fallbackResult;
      } catch (fallbackError) {
        console.error(`❌ Fallback also failed for ${publicId}:`, fallbackError.message);
        return null;
      }
    }
  }

  // Upload and optimize hero video
  async optimizeHeroVideo() {
    const heroVideoPath = path.join(this.publicDir, 'marquetmedia.mp4');
    
    try {
      await fs.access(heroVideoPath);
      await this.uploadVideoWithOptimizations(heroVideoPath, 'hero/marquetmedia');
    } catch (error) {
      console.log('Hero video not found, skipping...');
    }
  }

  // Upload and optimize portfolio videos
  async optimizePortfolioVideos() {
    const videoFiles = [
      'reel-1.mp4', 'reel-2.mp4', 'reel-3.mp4', 
      'reel-4.mp4', 'reel-5.mp4', 'reel-6.mp4'
    ];

    for (const file of videoFiles) {
      const filePath = path.join(this.publicDir, file);
      try {
        await fs.access(filePath);
        const publicId = `portfolio/${file.replace('.mp4', '')}`;
        await this.uploadVideoWithOptimizations(filePath, publicId);
      } catch (error) {
        console.log(`Portfolio video ${file} not found, skipping...`);
      }
    }
  }

  // Upload and optimize BTS videos
  async optimizeBTSVideos() {
    const btsDir = path.join(this.publicDir, 'bts');
    
    try {
      const files = await fs.readdir(btsDir);
      const videoFiles = files.filter(file => file.match(/\.(mov|mp4)$/i));
      
      for (const file of videoFiles) {
        const filePath = path.join(btsDir, file);
        const publicId = `bts/${file.replace(/\.(mov|mp4)$/i, '')}`;
        await this.uploadVideoWithOptimizations(filePath, publicId);
      }
    } catch (error) {
      console.log('BTS directory not found, skipping...');
    }
  }

  // Generate optimized asset manifest
  async generateAssetManifest() {
    console.log('📋 Generating asset manifest...');
    
    try {
      // Get all video resources from Cloudinary
      const result = await cloudinary.search
        .expression('resource_type:video AND folder:marquet-media/*')
        .sort_by([['created_at', 'desc']])
        .max_results(100)
        .execute();

      const videos = result.resources || [];

      const manifest = {
        generated_at: new Date().toISOString(),
        total_videos: videos.length,
        videos: {},
        hero: {},
        portfolio: {},
        bts: {}
      };

      // Organize videos by type
      videos.forEach(video => {
        const publicId = video.public_id.replace('marquet-media/', '');
        
        const videoData = {
          public_id: video.public_id,
          secure_url: video.secure_url,
          width: video.width,
          height: video.height,
          duration: video.duration,
          format: video.format,
          bytes: video.bytes
        };

        if (publicId.startsWith('hero/')) {
          manifest.hero[publicId.replace('hero/', '')] = videoData;
        } else if (publicId.startsWith('portfolio/')) {
          manifest.portfolio[publicId.replace('portfolio/', '')] = videoData;
        } else if (publicId.startsWith('bts/')) {
          manifest.bts[publicId.replace('bts/', '')] = videoData;
        }
      });

      // Save manifest
      const manifestPath = path.join(process.cwd(), 'optimized-video-manifest.json');
      await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
      
      console.log('✅ Asset manifest generated successfully');
      console.log(`📁 Found ${videos.length} optimized videos`);
      console.log(`🎬 Hero videos: ${Object.keys(manifest.hero).length}`);
      console.log(`📸 Portfolio videos: ${Object.keys(manifest.portfolio).length}`);
      console.log(`🎭 BTS videos: ${Object.keys(manifest.bts).length}`);
      
      return manifest;
    } catch (error) {
      console.error('❌ Failed to generate manifest:', error.message);
      console.log('⚠️  Continuing without manifest...');
      return null;
    }
  }

  // Run complete optimization process
  async optimizeAll() {
    console.log('🚀 Starting video optimization process...\n');
    
    try {
      await this.optimizeHeroVideo();
      await this.optimizePortfolioVideos();
      await this.optimizeBTSVideos();
      await this.generateAssetManifest();
      
      console.log('\n🎉 Video optimization completed successfully!');
      console.log('📱 Your videos are now optimized for all devices and connection speeds.');
      
    } catch (error) {
      console.error('\n💥 Optimization failed:', error.message);
      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const optimizer = new VideoOptimizer();
  optimizer.optimizeAll();
}

module.exports = VideoOptimizer;
