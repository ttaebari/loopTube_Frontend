import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { deflateSync } from "node:zlib";

const outputFiles = [
  { size: 180, path: "public/apple-touch-icon.png" },
  { size: 192, path: "public/icons/icon-192.png" },
  { size: 512, path: "public/icons/icon-512.png" }
];

const crcTable = new Uint32Array(256);

for (let i = 0; i < 256; i += 1) {
  let c = i;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c >>> 0;
}

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  const crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function insideRoundedRect(x, y, left, top, right, bottom, radius) {
  const cx = x < left + radius ? left + radius : x > right - radius ? right - radius : x;
  const cy = y < top + radius ? top + radius : y > bottom - radius ? bottom - radius : y;
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2;
}

function pointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
  const area = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
  const s = ((ay - cy) * (px - cx) + (cx - ax) * (py - cy)) / area;
  const t = ((cy - by) * (px - cx) + (bx - cx) * (py - cy)) / area;
  const u = 1 - s - t;
  return s >= 0 && t >= 0 && u >= 0;
}

function colorForPixel(x, y, size) {
  const margin = size * 0.12;
  const radius = size * 0.22;
  const inPlate = insideRoundedRect(x, y, margin, margin, size - margin, size - margin, radius);
  const inPlay = pointInTriangle(
    x,
    y,
    size * 0.44,
    size * 0.33,
    size * 0.44,
    size * 0.67,
    size * 0.70,
    size * 0.50
  );

  if (inPlay) return [255, 255, 255, 255];
  if (inPlate) return [255, 0, 51, 255];
  return [15, 15, 15, 255];
}

function createPng(size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);

  for (let y = 0; y < size; y += 1) {
    const rowOffset = y * (size * 4 + 1);
    raw[rowOffset] = 0;

    for (let x = 0; x < size; x += 1) {
      const [r, g, b, a] = colorForPixel(x, y, size);
      const pixelOffset = rowOffset + 1 + x * 4;
      raw[pixelOffset] = r;
      raw[pixelOffset + 1] = g;
      raw[pixelOffset + 2] = b;
      raw[pixelOffset + 3] = a;
    }
  }

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    header,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

for (const file of outputFiles) {
  const absolutePath = resolve(file.path);
  mkdirSync(dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, createPng(file.size));
  console.log(`generated ${file.path}`);
}
