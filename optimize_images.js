import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const targetDir = './public/images';
const MAX_WIDTH = 1920;
const QUALITY = 85;

async function optimizeImages(directory) {
    try {
        const files = await fs.readdir(directory, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(directory, file.name);

            if (file.isDirectory()) {
                await optimizeImages(fullPath);
                continue;
            }

            if (!/\.(jpg|jpeg|png)$/i.test(file.name)) continue;

            const webpPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

            // const webpPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

            // Force overwrite logic: Always process if it matches criteria

            try {
                // Skip existence check to force update
                console.log(`Processing: ${file.name}...`);

                const image = sharp(fullPath);
                const metadata = await image.metadata();

                let pipeline = image;

                if (metadata.width > MAX_WIDTH) {
                    console.log(`Resizing ${file.name} from ${metadata.width}px to ${MAX_WIDTH}px`);
                    pipeline = pipeline.resize(MAX_WIDTH);
                }

                await pipeline
                    .webp({ quality: QUALITY })
                    .toFile(webpPath);

                const oldSize = (await fs.stat(fullPath)).size;
                const newSize = (await fs.stat(webpPath)).size;
                const savings = ((oldSize - newSize) / oldSize * 100).toFixed(1);

                console.log(`✅ Optimized ${file.name}: ${Math.round(oldSize / 1024)}KB -> ${Math.round(newSize / 1024)}KB (-${savings}%)`);

            } catch (err) {
                console.error(`❌ Failed to process ${file.name}:`, err.message);
            }
        }
    } catch (err) {
        console.error('Error reading directory:', err);
    }
}

console.log('Starting image optimization...');
optimizeImages(targetDir);
