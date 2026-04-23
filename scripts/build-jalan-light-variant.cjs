/**
 * Builds public/protfolio_logo_light/jalan-light.png from the canonical dark
 * JALAN PNG: white / gray wordmark → blue for light (cream) UI; green leaf kept.
 *
 * Source of truth: public/protfolio_logo_dark/jalan.png
 * Run: node scripts/build-jalan-light-variant.cjs
 */
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const src = path.join(root, 'public/protfolio_logo_dark/jalan.png');
const out = path.join(root, 'public/protfolio_logo_light/jalan-light.png');

/** Blue-700 — strong contrast on cream (#F8F4E8) */
const BLUE = { r: 29, g: 78, b: 216 };

function isGreenLeaf(r, g, b, a) {
  if (a < 25) return false;
  if (g >= 90 && g - r >= 18 && g - b >= 12) return true;
  if (g >= 70 && r >= 55 && b < 100 && g - b >= 15 && g >= r * 0.85) return true;
  return false;
}

function shouldRecolorToBlue(r, g, b, a) {
  if (a < 12) return false;
  if (isGreenLeaf(r, g, b, a)) return false;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const avg = (r + g + b) / 3;
  const chroma = max - min;
  if (avg >= 95 && chroma <= 72) return true;
  if (avg >= 70 && chroma <= 38) return true;
  return false;
}

async function main() {
  const buf = await fs.readFile(src);
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const stride = width * channels;
  const outBuf = Buffer.from(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * stride + x * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (shouldRecolorToBlue(r, g, b, a)) {
        outBuf[i] = BLUE.r;
        outBuf[i + 1] = BLUE.g;
        outBuf[i + 2] = BLUE.b;
      }
    }
  }

  await fs.mkdir(path.dirname(out), { recursive: true });
  await sharp(outBuf, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log('Wrote', path.relative(root, out));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
