/**
 * Generates minimal valid PNG icons for PWA support.
 * Zero external dependencies — uses only Node.js built-ins.
 *
 * Produces solid #DC2626 (red) squares as placeholders.
 * Replace with proper branded artwork when available.
 */

import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcInput));
  return Buffer.concat([length, typeBytes, data, crc]);
}

function generatePng(size, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);   // width
  ihdr.writeUInt32BE(size, 4);   // height
  ihdr[8] = 8;                    // bit depth
  ihdr[9] = 2;                    // color type: RGB
  ihdr[10] = 0;                   // compression
  ihdr[11] = 0;                   // filter
  ihdr[12] = 0;                   // interlace

  // Raw image data: each row has a filter byte (0) followed by RGB pixels
  const rowBytes = 1 + size * 3;
  const raw = Buffer.alloc(rowBytes * size);
  for (let y = 0; y < size; y++) {
    const offset = y * rowBytes;
    raw[offset] = 0; // no filter
    for (let x = 0; x < size; x++) {
      const px = offset + 1 + x * 3;
      raw[px] = r;
      raw[px + 1] = g;
      raw[px + 2] = b;
    }
  }

  const compressed = deflateSync(raw);

  return Buffer.concat([
    signature,
    createChunk("IHDR", ihdr),
    createChunk("IDAT", compressed),
    createChunk("IEND", Buffer.alloc(0)),
  ]);
}

const RED = { r: 0xdc, g: 0x26, b: 0x26 }; // Tailwind red-600

const icons = [
  { size: 192, filename: "public/icons/icon-192x192.png" },
  { size: 512, filename: "public/icons/icon-512x512.png" },
  { size: 180, filename: "public/icons/apple-touch-icon.png" },
];

for (const { size, filename } of icons) {
  const png = generatePng(size, RED.r, RED.g, RED.b);
  writeFileSync(filename, png);
  console.log(`Generated ${filename} (${size}x${size})`);
}
