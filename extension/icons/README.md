# Extension Icons

## Quick Setup

You need to generate PNG icons from the SVG file. Here are your options:

### Option 1: Use Online Converter
1. Open `icon.svg` in this folder
2. Go to https://convertio.co/svg-png/
3. Upload `icon.svg`
4. Download and create these sizes:
   - icon16.png (16x16)
   - icon32.png (32x32)
   - icon48.png (48x48)
   - icon128.png (128x128)

### Option 2: Use ImageMagick (if installed)
```bash
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 32x32 icon32.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

### Option 3: Open generate-icons.html
1. Open `../scripts/generate-icons.html` in your browser
2. Right-click each canvas and "Save Image As"
3. Save to this folder with correct names

### Option 4: Use Any Icon (Temporary)
For testing, you can use any PNG images named correctly. The extension will work with any icons.

## Custom Icons

Replace the generated icons with your own custom icons if desired. Just maintain the filenames:
- icon16.png
- icon32.png
- icon48.png
- icon128.png
