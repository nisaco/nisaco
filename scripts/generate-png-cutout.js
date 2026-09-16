import fs from 'fs';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const jpegData = fs.readFileSync('public/profile_cutout.jpg');
const rawImageData = jpeg.decode(jpegData, { useTArray: true });

const { width, height, data } = rawImageData;
const png = new PNG({ width, height });

// BFS Flood Fill from all outer boundaries
const visited = new Uint8Array(width * height);
const queue = new Int32Array(width * height);
let head = 0;
let tail = 0;

const isBackgroundPixel = (idx) => {
  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];
  return r < 40 && g < 40 && b < 40;
};

// Seed top & bottom
for (let x = 0; x < width; x++) {
  const topIdx = (0 * width + x) * 4;
  if (isBackgroundPixel(topIdx)) {
    visited[0 * width + x] = 1;
    queue[tail++] = 0 * width + x;
  }
  const btmIdx = ((height - 1) * width + x) * 4;
  if (isBackgroundPixel(btmIdx)) {
    visited[(height - 1) * width + x] = 1;
    queue[tail++] = (height - 1) * width + x;
  }
}

// Seed left & right
for (let y = 0; y < height; y++) {
  const leftIdx = (y * width + 0) * 4;
  if (!visited[y * width + 0] && isBackgroundPixel(leftIdx)) {
    visited[y * width + 0] = 1;
    queue[tail++] = y * width + 0;
  }
  const rightIdx = (y * width + (width - 1)) * 4;
  if (!visited[y * width + (width - 1)] && isBackgroundPixel(rightIdx)) {
    visited[y * width + (width - 1)] = 1;
    queue[tail++] = y * width + (width - 1);
  }
}

// Flood fill
while (head < tail) {
  const curr = queue[head++];
  const cx = curr % width;
  const cy = (curr / width) | 0;

  // Set alpha = 0
  data[curr * 4 + 3] = 0;

  const neighbors = [
    cy > 0 ? (cy - 1) * width + cx : -1,
    cy < height - 1 ? (cy + 1) * width + cx : -1,
    cx > 0 ? cy * width + (cx - 1) : -1,
    cx < width - 1 ? cy * width + (cx + 1) : -1
  ];

  for (let i = 0; i < 4; i++) {
    const n = neighbors[i];
    if (n !== -1 && !visited[n]) {
      const nIdx = n * 4;
      if (isBackgroundPixel(nIdx)) {
        visited[n] = 1;
        queue[tail++] = n;
      }
    }
  }
}

// Copy to png data with smooth anti-aliased edge
for (let i = 0; i < data.length; i += 4) {
  png.data[i] = data[i];
  png.data[i + 1] = data[i + 1];
  png.data[i + 2] = data[i + 2];
  png.data[i + 3] = data[i + 3];
}

const buffer = PNG.sync.write(png);
fs.writeFileSync('public/profile_cutout.png', buffer);
console.log('Successfully generated 100% transparent public/profile_cutout.png!');

