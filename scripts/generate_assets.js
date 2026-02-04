const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../assets/stage1');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
} else {
    // Clean directory
    try {
        const files = fs.readdirSync(OUTPUT_DIR);
        for (const file of files) {
            fs.unlinkSync(path.join(OUTPUT_DIR, file));
        }
    } catch (e) {
        console.warn("Could not clean directory completely:", e.message);
    }
}

console.log(`Generating 222 assets in ${OUTPUT_DIR}...`);

for (let i = 1; i <= 222; i++) {
    const svgContent = `
<svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#020617;stop-opacity:1" />
        </linearGradient>
        <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>
    
    <!-- Background -->
    <rect width="1000" height="1000" fill="url(#grad)" />
    
    <!-- Border Glow -->
    <rect x="10" y="10" width="980" height="980" fill="none" stroke="#00FFFF" stroke-width="2" opacity="0.5" />
    
    <!-- Text -->
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="80" fill="#ffffff" filter="url(#glow)">
        RIFT #${i.toString().padStart(3, '0')}
    </text>
    
    <!-- Status -->
    <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="40" fill="#00FFFF" opacity="0.8">
        STAGE 1: VOID
    </text>
</svg>`;

    fs.writeFileSync(path.join(OUTPUT_DIR, `${i}.svg`), svgContent.trim());
}

console.log('Done! Generated 500 assets.');
