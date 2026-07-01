// Expo uchun placeholder PNG assetlar yaratuvchi script
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length);
  const crcVal = crc32(Buffer.concat([typeBuf, data]));
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function createSolidPNG(width, height, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB (no alpha - simpler)
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  // Build one row then repeat - efficient for compression
  const rowSize = 1 + width * 3;
  const oneRow = Buffer.alloc(rowSize);
  oneRow[0] = 0; // filter none
  for (let x = 0; x < width; x++) {
    oneRow[1 + x * 3] = r;
    oneRow[1 + x * 3 + 1] = g;
    oneRow[1 + x * 3 + 2] = b;
  }
  const allRows = Buffer.concat(Array(height).fill(oneRow));
  const compressed = zlib.deflateSync(allRows, { level: 9 });

  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// Sihhat-AI asosiy yashil rang: #1B6B3E = rgb(27, 107, 62)
const GREEN_R = 27, GREEN_G = 107, GREEN_B = 62;
const DARK_R = 13, DARK_G = 72, DARK_B = 48; // #0D4830

const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

const files = [
  { name: 'icon.png',          w: 1024, h: 1024, r: GREEN_R, g: GREEN_G, b: GREEN_B },
  { name: 'adaptive-icon.png', w: 1024, h: 1024, r: GREEN_R, g: GREEN_G, b: GREEN_B },
  { name: 'splash.png',        w: 1284, h: 2778, r: DARK_R,  g: DARK_G,  b: DARK_B },
  { name: 'favicon.png',       w: 48,   h: 48,   r: GREEN_R, g: GREEN_G, b: GREEN_B },
];

files.forEach(({ name, w, h, r, g, b }) => {
  const filePath = path.join(assetsDir, name);
  const buf = createSolidPNG(w, h, r, g, b);
  fs.writeFileSync(filePath, buf);
  console.log(`✓ ${name} (${w}x${h}) - ${buf.length} bytes`);
});

console.log('\nAssets muvaffaqiyatli yaratildi!');
