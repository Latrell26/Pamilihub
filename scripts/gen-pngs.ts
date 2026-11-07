/**
 * Generates simple PNG placeholder images for demo products.
 * Each product gets a distinct color swatch with a simple food shape.
 * Run with: node --import tsx scripts/gen-pngs.ts
 */

import fs from "fs";
import path from "path";
import zlib from "zlib";

const OUT_DIR = path.join(process.cwd(), "scripts/demo-images");

const PRODUCTS: Array<{
  name: string;
  file: string;
  color: string; // hex
  shape: "pie" | "bun" | "drum" | "coffee";
}> = [
  { name: "Buko Pie", file: "buko-pie.png", color: "#c0392b", shape: "pie" },
  { name: "Egg Pie", file: "egg-pie.png", color: "#e67e22", shape: "pie" },
  { name: "Biko", file: "biko.png", color: "#d68910", shape: "bun" },
  { name: "Suman", file: "suman.png", color: "#a0522d", shape: "drum" },
  { name: "Barako Coffee", file: "barako-coffee.png", color: "#3e2723", shape: "coffee" },
];

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  return [
    parseInt(c.slice(0, 2), 16),
    parseInt(c.slice(2, 4), 16),
    parseInt(c.slice(4, 6), 16),
  ];
}

function blendColors(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function setPixel(
  raw: Buffer,
  rowBytes: number,
  width: number,
  height: number,
  x: number,
  y: number,
  color: [number, number, number]
) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const p = y * rowBytes + 1 + x * 3;
  raw[p] = color[0];
  raw[p + 1] = color[1];
  raw[p + 2] = color[2];
}

function fillRect(
  raw: Buffer,
  rowBytes: number,
  width: number,
  height: number,
  x: number,
  y: number,
  w: number,
  h: number,
  color: [number, number, number]
) {
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) {
      setPixel(raw, rowBytes, width, height, xx, yy, color);
    }
  }
}

function drawCircle(
  raw: Buffer,
  rowBytes: number,
  width: number,
  height: number,
  cx: number,
  cy: number,
  radius: number,
  color: [number, number, number]
) {
  const r2 = radius * radius;
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) {
        setPixel(raw, rowBytes, width, height, x, y, color);
      }
    }
  }
}

function drawLine(
  raw: Buffer,
  rowBytes: number,
  width: number,
  height: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: [number, number, number],
  thickness: number
) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(x0 + (x1 - x0) * t);
    const y = Math.round(y0 + (y1 - y0) * t);
    for (let dy = -Math.floor(thickness / 2); dy <= Math.floor(thickness / 2); dy++) {
      setPixel(raw, rowBytes, width, height, x, y + dy, color);
    }
  }
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcInput = Buffer.concat([typeBuf, data]);
  // CRC-32 (IEEE)
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < crcInput.length; i++) {
    crc ^= crcInput[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
    }
  }
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE((crc ^ 0xFFFFFFFF) >>> 0, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function writePng(
  file: string,
  width: number,
  height: number,
  rgb: [number, number, number],
  shape: string
) {
  const [r, g, b] = rgb;
  const bg = blendColors([255, 255, 255], [r, g, b], 0.82); // light tint bg
  const fg = blendColors([r, g, b], [0, 0, 0], 0.25); // darker accent

  const rowBytes = width * 3 + 1; // 1 filter byte + 3 bytes per pixel
  const raw = Buffer.alloc(rowBytes * height);

  // Fill background
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowBytes;
    raw[rowStart] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const p = rowStart + 1 + x * 3;
      raw[p] = bg[0];
      raw[p + 1] = bg[1];
      raw[p + 2] = bg[2];
    }
  }

  const cx = width / 2;
  const cy = height / 2;

  switch (shape) {
    case "pie": {
      // A pie: filled circle with a slice line
      drawCircle(raw, rowBytes, width, height, cx, cy, 140, fg);
      drawLine(raw, rowBytes, width, height, cx, cy, cx + 140, cy, fg, 4);
      drawLine(raw, rowBytes, width, height, cx, cy, cx, cy - 140, fg, 4);
      break;
    }
    case "bun": {
      // A bun: wider oval
      for (let y = cy - 110; y <= cy + 110; y++) {
        const dy = y - cy;
        const rx = Math.round(130 * Math.sqrt(1 - (dy * dy) / (110 * 110)));
        for (let x = cx - rx; x <= cx + rx; x++) {
          setPixel(raw, rowBytes, width, height, x, y, fg);
        }
      }
      break;
    }
    case "drum": {
      // A drum: rectangle wider than tall
      fillRect(raw, rowBytes, width, height, cx - 130, cy - 90, 260, 180, fg);
      break;
    }
    case "coffee": {
      // Coffee: cup circle with steam above
      drawCircle(raw, rowBytes, width, height, cx, cy + 10, 110, fg);
      drawLine(raw, rowBytes, width, height, cx - 30, cy - 95, cx - 30, cy - 130, fg, 4);
      drawLine(raw, rowBytes, width, height, cx + 30, cy - 95, cx + 20, cy - 130, fg, 4);
      drawLine(raw, rowBytes, width, height, cx, cy - 90, cx + 5, cy - 125, fg, 4);
      break;
    }
  }

  const compressed = zlib.deflateSync(raw);

  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdr = chunk("IHDR", ihdrData);
  const idat = chunk("IDAT", compressed);
  const iend = chunk("IEND", Buffer.alloc(0));

  const png = Buffer.concat([signature, ihdr, idat, iend]);
  fs.writeFileSync(file, png);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const p of PRODUCTS) {
  const file = path.join(OUT_DIR, p.file);
  const rgb = hexToRgb(p.color);
  writePng(file, 400, 400, rgb, p.shape);
  console.log(`Generated ${file}`);
}

console.log("✅ PNG images generated!");
