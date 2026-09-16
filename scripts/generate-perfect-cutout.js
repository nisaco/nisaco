import fs from 'fs';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const inputPath = 'C:\\Users\\NII KPAKPO\\.gemini\\antigravity\\brain\\eda127d5-d32c-412c-951c-1af07fb00f53\\profile_cutout_1789589514740.jpg';
const jpegData = fs.readFileSync(inputPath);
const rawImageData = jpeg.decode(jpegData, { useTArray: true });

const { width, height, data } = rawImageData;
const png = new PNG({ width, height });

// Check if a pixel is checkerboard pattern (grey or white checker square)
const isCheckerboardPixel = (r, g, b) => {
  const avg = (r + g + b) / 3;
  const isNeutralGrey = Math.abs(r - g) < 22 && Math.abs(r - b) < 22 && Math.abs(g - b) < 22;
  // Checkerboard squares are either bright white (avg > 230) or medium grey (avg > 150)
  return isNeutralGrey && avg > 140;
};

// Process all pixels: any checkerboard pixel gets alpha = 0
for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  if (isCheckerboardPixel(r, g, b)) {
    png.data[i] = 0;
    png.data[i + 1] = 0;
    png.data[i + 2] = 0;
    png.data[i + 3] = 0; // Completely transparent
  } else {
    png.data[i] = r;
    png.data[i + 1] = g;
    png.data[i + 2] = b;
    png.data[i + 3] = 255;
  }
}

// Write out PNG
const buffer = PNG.sync.write(png);
fs.writeFileSync('public/profile_cutout.png', buffer);
console.log('100% transparent PNG created at public/profile_cutout.png!');

