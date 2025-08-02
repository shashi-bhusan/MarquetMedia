require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('🔧 Testing Cloudinary Configuration...');
console.log('Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '[PRESENT]' : '[MISSING]');

// Test connection with simple API call
async function testConnection() {
  try {
    console.log('\n🔍 Testing Cloudinary connection...');
    
    // Test basic connectivity
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful:', result);
    
    // Test folder access
    const folders = await cloudinary.api.root_folders();
    console.log('📁 Available folders:', folders.folders.map(f => f.name));
    
  } catch (error) {
    console.error('❌ Cloudinary connection failed:');
    console.error('Error:', error);
    
    const errorMessage = error.message || error.toString();
    
    if (errorMessage.includes('Invalid API Key')) {
      console.log('\n💡 Solutions:');
      console.log('1. Double-check your API Key in .env.local');
      console.log('2. Ensure API Key is active in Cloudinary dashboard');
    }
    
    if (errorMessage.includes('Invalid signature')) {
      console.log('\n💡 Solutions:');
      console.log('1. Check if API Secret is correct');
      console.log('2. Regenerate credentials in Cloudinary dashboard');
    }
    
    if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('ECONNREFUSED')) {
      console.log('\n💡 Network issue - check internet connection');
    }
  }
}

testConnection();
