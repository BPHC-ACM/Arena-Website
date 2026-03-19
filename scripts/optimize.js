const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const INPUT_DIR = path.join(__dirname, "..", "raw-images");
const OUTPUT_DIR = path.join(__dirname, "..", "public", "images", "arena");

// Ensure the output directory exists
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const SUPPORTED = /\.(jpe?g|png|gif|tiff|webp|avif)$/i;

async function optimizeAll() {
    const files = fs.readdirSync(INPUT_DIR).filter((f) => SUPPORTED.test(f));

    if (files.length === 0) {
        console.log("No supported images found in ./raw-images");
        return;
    }

    for (const file of files) {
        const inputPath = path.join(INPUT_DIR, file);
        const baseName = path.basename(file, path.extname(file)).toLowerCase();
        const outputPath = path.join(OUTPUT_DIR, `${baseName}.webp`);

        try {
            const info = await sharp(inputPath)
                .webp({ quality: 80 })
                .toFile(outputPath);

            const inputKB = Math.round(fs.statSync(inputPath).size / 1024);
            const outputKB = Math.round(info.size / 1024);
            const saving = Math.round((1 - outputKB / inputKB) * 100);

            console.log(
                `✅ ${file.padEnd(24)} ${inputKB.toString().padStart(6)} KB  →  ${outputKB
                    .toString()
                    .padStart(6)} KB WebP  (${saving}% smaller)`
            );
        } catch (err) {
            console.error(`❌ Failed to process ${file}:`, err.message);
        }
    }

    console.log(`\n🎉 Done! ${files.length} images optimized → ${OUTPUT_DIR}`);
}

optimizeAll();
