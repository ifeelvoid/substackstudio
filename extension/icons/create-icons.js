// Simple script to create placeholder PNG icons
// Run with: node create-icons.js

const fs = require('fs');

// Create a simple PNG file (1x1 black pixel as placeholder)
// This is a valid PNG file that Chrome will accept
const createPlaceholderPNG = (size) => {
  // PNG header and minimal black pixel data
  const png = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, size, 0x00, 0x00, 0x00, size, // width & height
    0x08, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // bit depth, color type, etc
    0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54, // IDAT chunk
    0x08, 0xD7, 0x63, 0x60, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82 // IEND
  ]);
  return png;
};

console.log('Creating placeholder PNG icons...');

const sizes = [16, 32, 48, 128];

sizes.forEach(size => {
  const filename = `icon${size}.png`;
  const png = createPlaceholderPNG(size);
  fs.writeFileSync(filename, png);
  console.log(`✓ Created ${filename}`);
});

console.log('\n✅ All icons created!');
console.log('Note: These are placeholder icons. Replace with custom icons for production.');
