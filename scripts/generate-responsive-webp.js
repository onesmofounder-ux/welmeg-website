const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
  'logistics.jpg',
  'agriculture.jpg',
  'site-background.jpg',
  'construction.jpg',
  'team.jpg',
  'commercial building.jpg',
  'hero.jpg'
];

const sizes = [640, 1024, 1600];

const srcDir = path.join(__dirname, '..', 'public', 'images');
const outDir = path.join(srcDir, 'optimized');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

(async () => {
  for (const name of images) {
    const input = path.join(srcDir, name);
    if (!fs.existsSync(input)) {
      console.error(`Missing source: ${input}`);
      continue;
    }
    try {
      const image = sharp(input);
      const meta = await image.metadata();
      const origWidth = meta.width || null;
      const base = path.parse(name).name;

      for (const w of sizes) {
        if (!origWidth || origWidth < w) {
          // skip upscaling
          // but still create the largest available variant if user wants—skip per requirement
          continue;
        }
        const output = path.join(outDir, `${base}-${w}.webp`);
        await image
          .resize({ width: w })
          .webp({ quality: 75, effort: 6 })
          .toFile(output);
        console.log(`Created ${path.relative(process.cwd(), output)}`);
      }
    } catch (err) {
      console.error(`Failed ${name}: ${err.message || err}`);
    }
  }
})();
