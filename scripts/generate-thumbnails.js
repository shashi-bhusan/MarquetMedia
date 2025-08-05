#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class ThumbnailGenerator {
  constructor() {
    this.publicDir = path.join(process.cwd(), 'public');
    this.thumbnailsDir = path.join(this.publicDir, 'thumbnails');
  }

  // Execute FFMPEG command with promise wrapper
  async executeFFmpeg(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ FFMPEG Error: ${error.message}`);
          reject(error);
          return;
        }
        if (stderr) {
          console.log(`ℹ️  FFMPEG Info: ${stderr}`);
        }
        resolve(stdout);
      });
    });
  }

  // Check if FFMPEG is available
  async checkFFmpeg() {
    try {
      await this.executeFFmpeg('ffmpeg -version');
      console.log('✅ FFMPEG is available');
      return true;
    } catch (error) {
      console.error('❌ FFMPEG is not installed or not available in PATH');
      console.log('Please install FFMPEG from: https://ffmpeg.org/download.html');
      return false;
    }
  }

  // Ensure directory exists
  async ensureDirectory(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`📁 Created directory: ${dirPath}`);
    }
  }

  // Generate thumbnail for a single video
  async generateThumbnail(videoPath, outputPath) {
    const command = `ffmpeg -i "${videoPath}" -vf "thumbnail" -frames:v 1 -y "${outputPath}"`;
    
    console.log(`🎬 Generating thumbnail: ${path.basename(videoPath)} -> ${path.basename(outputPath)}`);
    
    try {
      await this.executeFFmpeg(command);
      console.log(`✅ Successfully generated: ${path.basename(outputPath)}`);
    } catch (error) {
      console.error(`❌ Failed to generate thumbnail for ${path.basename(videoPath)}: ${error.message}`);
      throw error;
    }
  }

  // Generate hero video thumbnail
  async generateHeroThumbnail() {
    const videoPath = path.join(this.publicDir, 'marquetmedia.mp4');
    const outputDir = path.join(this.thumbnailsDir, 'hero');
    const outputPath = path.join(outputDir, 'marquetmedia.jpg');

    try {
      await fs.access(videoPath);
      await this.ensureDirectory(outputDir);
      await this.generateThumbnail(videoPath, outputPath);
    } catch (error) {
      console.log('⚠️  Hero video not found, skipping...');
    }
  }

  // Generate reel video thumbnails
  async generateReelThumbnails() {
    const outputDir = path.join(this.thumbnailsDir, 'reels');
    await this.ensureDirectory(outputDir);

    const reelFiles = [
      'reel-1.mp4', 'reel-2.mp4', 'reel-3.mp4',
      'reel-4.mp4', 'reel-5.mp4', 'reel-6.mp4'
    ];

    for (const file of reelFiles) {
      const videoPath = path.join(this.publicDir, file);
      const outputPath = path.join(outputDir, file.replace('.mp4', '.jpg'));

      try {
        await fs.access(videoPath);
        await this.generateThumbnail(videoPath, outputPath);
      } catch (error) {
        console.log(`⚠️  ${file} not found, skipping...`);
      }
    }
  }

  // Generate BTS video thumbnails
  async generateBTSThumbnails() {
    const btsDir = path.join(this.publicDir, 'bts');
    const outputDir = path.join(this.thumbnailsDir, 'bts');

    try {
      await fs.access(btsDir);
      await this.ensureDirectory(outputDir);

      const files = await fs.readdir(btsDir);
      const videoFiles = files.filter(file => 
        file.toLowerCase().match(/\.(mp4|mov|avi|mkv|webm)$/i)
      );

      for (const file of videoFiles) {
        const videoPath = path.join(btsDir, file);
        const outputName = file.replace(/\.(mp4|mov|avi|mkv|webm)$/i, '.jpg');
        const outputPath = path.join(outputDir, outputName);

        try {
          await this.generateThumbnail(videoPath, outputPath);
        } catch (error) {
          console.log(`⚠️  Failed to process ${file}, continuing...`);
        }
      }
    } catch (error) {
      console.log('⚠️  BTS directory not found, skipping...');
    }
  }

  // Generate main video thumbnails (for any other videos in root)
  async generateMainThumbnails() {
    const outputDir = path.join(this.thumbnailsDir, 'main');
    await this.ensureDirectory(outputDir);

    try {
      const files = await fs.readdir(this.publicDir);
      const videoFiles = files.filter(file => 
        file.toLowerCase().match(/\.(mp4|mov|avi|mkv|webm)$/i) &&
        !file.startsWith('reel-') &&
        file !== 'marquetmedia.mp4'
      );

      for (const file of videoFiles) {
        const videoPath = path.join(this.publicDir, file);
        const outputName = file.replace(/\.(mp4|mov|avi|mkv|webm)$/i, '.jpg');
        const outputPath = path.join(outputDir, outputName);

        try {
          await this.generateThumbnail(videoPath, outputPath);
        } catch (error) {
          console.log(`⚠️  Failed to process ${file}, continuing...`);
        }
      }
    } catch (error) {
      console.log('⚠️  Error reading public directory');
    }
  }

  // Generate all thumbnails
  async generateAll() {
    console.log('🚀 Starting thumbnail generation process...\n');

    // Check if FFMPEG is available
    const ffmpegAvailable = await this.checkFFmpeg();
    if (!ffmpegAvailable) {
      return;
    }

    try {
      console.log('\n📸 Generating hero video thumbnail...');
      await this.generateHeroThumbnail();

      console.log('\n📸 Generating reel video thumbnails...');
      await this.generateReelThumbnails();

      console.log('\n📸 Generating BTS video thumbnails...');
      await this.generateBTSThumbnails();

      console.log('\n📸 Generating main video thumbnails...');
      await this.generateMainThumbnails();

      console.log('\n✅ Thumbnail generation completed successfully!');
      console.log(`📁 Thumbnails saved in: ${this.thumbnailsDir}`);

    } catch (error) {
      console.error('\n❌ Thumbnail generation failed:', error.message);
      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const generator = new ThumbnailGenerator();
  generator.generateAll();
}

module.exports = ThumbnailGenerator;
