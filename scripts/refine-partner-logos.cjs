/**
 * Maa Gayatri: export true PNG with alpha (JPEG-as-.png has no alpha).
 * JALAN: canonical white+green PNG at public/protfolio_logo_dark/jalan.png; run
 * `npm run build-jalan-light` to regenerate public/protfolio_logo_light/jalan-light.png.
 */
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const root = path.join(__dirname, '..');

function lum(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

async function processMaaGayatri() {
  const input = path.join(root, 'public/protfolio_logo_light/maa-gayatri-jewellers.png');
  const buf = await fs.readFile(input);
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const stride = width * channels;
  const out = Buffer.from(data);

  const BLACK_CUT = 56;
  const EDGE_SOFT = 28;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * stride + x * channels;
      const r = out[i],
        g = out[i + 1],
        b = out[i + 2];
      const L = lum(r, g, b);
      let a = 255;
      if (L < BLACK_CUT) a = 0;
      else if (L < BLACK_CUT + EDGE_SOFT) {
        a = Math.round(((L - BLACK_CUT) / EDGE_SOFT) * 255);
      }
      out[i + 3] = a;
    }
  }

  const png = await sharp(out, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();

  const outL = path.join(root, 'public/protfolio_logo_light/maa-gayatri-jewellers.png');
  const outD = path.join(root, 'public/protfolio_logo_dark/maa-gayatri-jewellers.png');
  await fs.writeFile(outL, png);
  await fs.writeFile(outD, png);
  console.log('Maa Gayatri → PNG with transparent black matte removed');
}

async function main() {
  await processMaaGayatri();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
