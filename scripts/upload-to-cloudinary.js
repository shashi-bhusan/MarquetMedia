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

class CloudinaryUploader {
  constructor() {
    this.publicDir = path.join(process.cwd(), 'public');
    this.uploadedAssets = [];
  }

  async uploadVideos() {
    console.log('🎥 Starting video uploads...');
    const videoDir = this.publicDir;
    
    try {
      const files = await fs.readdir(videoDir);
      const videoFiles = files.filter(file => file.match(/\.(mov|mp4|webm)$/i));
      
      console.log(`Found ${videoFiles.length} video files`);
      
      for (const file of videoFiles) {
        await this.uploadVideo(path.join(videoDir, file), file);
      }

      // Also check BTS folder
      const btsDir = path.join(videoDir, 'bts');
      try {
        const btsFiles = await fs.readdir(btsDir);
        const btsVideoFiles = btsFiles.filter(file => file.match(/\.(mov|mp4|webm)$/i));
        
        console.log(`Found ${btsVideoFiles.length} BTS video files`);
        
        for (const file of btsVideoFiles) {
          await this.uploadVideo(path.join(btsDir, file), `bts/${file}`);
        }
      } catch (error) {
        console.log('No BTS directory found or accessible');
      }
      
    } catch (error) {
      console.error('Error reading video directory:', error);
    }
  }

  async uploadVideo(filePath, filename) {
    try {
      console.log(`📤 Uploading video: ${filename}`);
      
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        public_id: `marquet-media/${path.parse(filename).name}`,
        folder: 'marquet-media',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1080, crop: 'limit' }
        ],
        eager: [
          { width: 480, quality: 'auto:low', format: 'mp4' },
          { width: 720, quality: 'auto:good', format: 'mp4' },
          { width: 1080, quality: 'auto:best', format: 'mp4' }
        ],
        eager_async: true
      });

      // Generate poster image from video
      console.log(`🖼️ Getting poster for: ${filename}`);
      const posterUrl = cloudinary.url(result.public_id, {
        resource_type: 'video',
        transformation: [
          { width: 800, height: 600, crop: 'fill', quality: 'auto', format: 'jpg' },
          { start_offset: '2' } // Get frame at 2 seconds
        ]
      });

      this.uploadedAssets.push({
        original: filename,
        publicId: result.public_id,
        url: result.secure_url,
        posterUrl: posterUrl,
        bytes: result.bytes,
        duration: result.duration,
        format: result.format
      });

      console.log(`✅ Uploaded: ${result.public_id} (${Math.round(result.bytes / 1024 / 1024)}MB)`);
    } catch (error) {
      console.error(`❌ Failed to upload ${filename}:`, error.message);
    }
  }

  async uploadImages() {
    console.log('🖼️ Starting image uploads...');
    
    // Check different image directories
    const imageDirs = [
      'protfolio_logo',
      'protfolio_logo_dark', 
      'protfolio_logo_light',
      'illustration',
      'bts'
    ];

    for (const dir of imageDirs) {
      const imageDir = path.join(this.publicDir, dir);
      try {
        const files = await fs.readdir(imageDir);
        const imageFiles = files.filter(file => file.match(/\.(jpg|jpeg|png|webp|svg)$/i));
        
        console.log(`Found ${imageFiles.length} images in ${dir}`);
        
        for (const file of imageFiles) {
          await this.uploadImage(path.join(imageDir, file), `${dir}/${file}`);
        }
      } catch (error) {
        console.log(`Directory ${dir} not found or accessible`);
      }
    }

    // Also upload root level images
    try {
      const files = await fs.readdir(this.publicDir);
      const imageFiles = files.filter(file => file.match(/\.(jpg|jpeg|png|webp|svg)$/i));
      
      for (const file of imageFiles) {
        await this.uploadImage(path.join(this.publicDir, file), file);
      }
    } catch (error) {
      console.log('Error reading root images:', error.message);
    }
  }

  async uploadImage(filePath, filename) {
    try {
      console.log(`📤 Uploading image: ${filename}`);
      
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: `marquet-media/images/${path.parse(filename).name}`,
        folder: 'marquet-media/images',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ],
        eager: [
          { width: 300, height: 200, crop: 'fill', quality: 'auto' },
          { width: 600, height: 400, crop: 'fill', quality: 'auto' },
          { width: 1200, height: 800, crop: 'fill', quality: 'auto' }
        ],
        eager_async: true
      });

      this.uploadedAssets.push({
        original: filename,
        publicId: result.public_id,
        url: result.secure_url,
        type: 'image',
        bytes: result.bytes,
        format: result.format
      });

      console.log(`✅ Uploaded: ${result.public_id} (${Math.round(result.bytes / 1024)}KB)`);
    } catch (error) {
      console.error(`❌ Failed to upload ${filename}:`, error.message);
    }
  }

  async generateManifest() {
    const totalSize = this.uploadedAssets.reduce((sum, asset) => sum + (asset.bytes || 0), 0);
    
    const manifest = {
      uploadDate: new Date().toISOString(),
      totalAssets: this.uploadedAssets.length,
      totalSizeMB: Math.round(totalSize / 1024 / 1024),
      videoAssets: this.uploadedAssets.filter(asset => asset.type !== 'image').length,
      imageAssets: this.uploadedAssets.filter(asset => asset.type === 'image').length,
      assets: this.uploadedAssets
    };

    await fs.writeFile(
      path.join(process.cwd(), 'cloudinary-manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    console.log(`📝 Generated manifest with ${this.uploadedAssets.length} assets (${manifest.totalSizeMB}MB total)`);
    return manifest;
  }

  async generateAssetMapping() {
    // Generate a mapping file for easy component integration
    const mapping = {
      videos: {},
      images: {},
      posters: {}
    };

    this.uploadedAssets.forEach(asset => {
      const originalName = path.parse(asset.original).name;
      
      if (asset.type === 'image') {
        mapping.images[originalName] = asset.publicId;
      } else {
        mapping.videos[originalName] = asset.publicId;
        if (asset.posterUrl) {
          mapping.posters[originalName] = asset.posterUrl;
        }
      }
    });

    await fs.writeFile(
      path.join(process.cwd(), 'src/lib/asset-mapping.json'),
      JSON.stringify(mapping, null, 2)
    );

    console.log('📋 Generated asset mapping file');
    return mapping;
  }
}

// Run the upload process
async function main() {
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
      !process.env.CLOUDINARY_API_KEY || 
      !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Missing Cloudinary environment variables!');
    console.log('Please set:');
    console.log('- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
    console.log('- CLOUDINARY_API_KEY');
    console.log('- CLOUDINARY_API_SECRET');
    return;
  }

  const uploader = new CloudinaryUploader();
  
  console.log('🚀 Starting Cloudinary upload process...');
  console.log(`Cloud: ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`);
  
  await uploader.uploadVideos();
  await uploader.uploadImages();
  
  const manifest = await uploader.generateManifest();
  await uploader.generateAssetMapping();
  
  console.log('✨ Upload process completed!');
  console.log(`📊 Summary: ${manifest.totalAssets} assets, ${manifest.totalSizeMB}MB total`);
  console.log(`💾 Estimated bandwidth savings: ${Math.round(manifest.totalSizeMB * 0.7)}MB per page load`);
}

// Handle command line execution
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { CloudinaryUploader };
