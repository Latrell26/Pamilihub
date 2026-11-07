/**
 * Generates simple PNG placeholder images for demo products.
 * Each product gets a distinct color swatch. No external dependencies.
 * Run with: node --import tsx scripts/gen-pngs.ts
 */

import fs from "fs";
import path from "path";
import zlib from "zlib";
import { createHash } from "crypto";

const OUT_DIR = path.join(process.cwd(), "scripts/demo-images");

const PRODUCTS: Array<{
  name: string;
  file: string;
  color: string; // hex
}> = [
  { name: "Buko Pie", file: "buko-pie.png", color: "#fdecea" },
  { name: "Egg Pie", file: "egg-pie.png", color: "#fff7e6" },
  { name: "Biko", file: "biko.png", color: "#fff3e0" },
  { name: "Suman", file: "suman.png", color: "#f5deb3" },
  { name: "Barako Coffee", file: "barako-coffee.png", color: "#3e2723" },
];

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  return [
    parseInt(c.slice(0, 2), 16),
    parseInt(c.slice(2, 4), 16),
    parseInt(c.slice(4, 6), 16),
  ];
}

function crc32(data: Buffer): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcInput);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function writePng(file: string, width: number, height: number, rgb: [number, number, number]) {
  const [r, g, b] = rgb;

  // Build raw scanlines (PNG filter byte 0 = none per row)
  const rowBytes = width * 3 + 1; // 1 filter byte + 3 bytes per pixel
  const raw = Buffer.alloc(rowBytes * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowBytes;
    raw[rowStart] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const p = rowStart + 1 + x * 3;
      raw[p] = r;
      raw[p + 1] = g;
      raw[p + 2] = b;
    }
  }

  const compressed = zlib.deflateRawSync(raw);

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
  writePng(file, 400, 400, rgb);
  console.log(`Generated ${file}`);
}

console.log("✅ PNG images generated!");
