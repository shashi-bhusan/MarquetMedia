/**
 * Upload JALAN + Maa Gayatri partner logos to Cloudinary (from public/).
 */
require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploads = [
  {
    local: 'public/protfolio_logo_dark/jalan.png',
    public_id: 'jalan',
  },
  {
    local: 'public/protfolio_logo_light/jalan-light.png',
    public_id: 'jalan_light',
  },
  {
    local: 'public/protfolio_logo_light/maa-gayatri-jewellers.png',
    public_id: 'maa-gayatri-jewellers',
  },
];

async function main() {
  for (const { local, public_id } of uploads) {
    const filePath = path.join(process.cwd(), local);
    console.log('Uploading', public_id, '…');
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'marquet-media/images',
      public_id,
      overwrite: true,
      resource_type: 'image',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });
    console.log('  ', result.secure_url);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
