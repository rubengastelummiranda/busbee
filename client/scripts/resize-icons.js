import { Jimp } from 'jimp';
import path from 'path';
import fs from 'fs';

const sourcePath = 'C:\\Users\\PRACTICANTE-ADD3\\.gemini\\antigravity-cli\\brain\\ceae16da-ba99-40db-9419-3f890b699898\\master_bee_logo_1779339126995.png';
const outputDir = 'C:\\Users\\PRACTICANTE-ADD3\\Desktop\\busbee\\client\\public\\icons';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('Created output directory:', outputDir);
}

async function resize() {
  console.log('Reading source image from:', sourcePath);
  const image = await Jimp.read(sourcePath);
  
  const targets = [
    { name: 'icon-192.png', width: 192, height: 192 },
    { name: 'icon-512.png', width: 512, height: 512 },
    { name: 'icon-192-maskable.png', width: 192, height: 192 },
    { name: 'icon-512-maskable.png', width: 512, height: 512 },
  ];

  for (const target of targets) {
    const outputPath = path.join(outputDir, target.name);
    console.log(`Generating: ${target.name} (${target.width}x${target.height})...`);
    
    const cloned = image.clone();
    
    // Support Jimp v1.x resize signature
    if (typeof cloned.resize === 'function') {
      try {
        cloned.resize({ w: target.width, h: target.height });
      } catch (err) {
        cloned.resize(target.width, target.height);
      }
    }
    
    await cloned.write(outputPath);
    console.log(`Saved successfully at: ${outputPath}`);
  }
  
  console.log('All PWA icons have been successfully generated!');
}

resize().catch((err) => {
  console.error('Failed to generate PWA icons:', err);
  process.exit(1);
});
