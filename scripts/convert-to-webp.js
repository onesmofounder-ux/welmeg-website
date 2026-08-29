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

const srcDir = path.join(__dirname, '..', 'public', 'images');
const outDir = path.join(srcDir, 'optimized');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

(async () => {
  for (const name of images) {
    const input = path.join(srcDir, name);
    const base = path.parse(name).name;
    const output = path.join(outDir, base + '.webp');
    try {
      if (!fs.existsSync(input)) {
        console.error(`Skipping missing file: ${input}`);
        continue;
      }
      // Convert to WebP with good visual quality but strong compression
      await sharp(input)
        .webp({ quality: 75, effort: 6 })
        .toFile(output);
      console.log(`Converted: ${name} -> optimized/${base}.webp`);
    } catch (err) {
      console.error(`Failed to convert ${name}:`, err.message || err);
    }
  }
})();
