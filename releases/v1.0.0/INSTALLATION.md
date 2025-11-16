# Quick Installation Guide - Substack Studio v1.0.0

## 🚀 Chrome Extension Installation

### Step 1: Download
Download `substack-studio-extension-v1.0.0.zip` from the release

### Step 2: Extract
Unzip the file to a location on your computer

### Step 3: Load in Chrome
1. Open Chrome browser
2. Type `chrome://extensions/` in the address bar
3. Enable **"Developer mode"** (toggle in top right)
4. Click **"Load unpacked"** button
5. Navigate to and select the extracted `extension` folder
6. Click **"Select Folder"**

### Step 4: Verify
- You should see "Substack Studio" in your extensions list
- Pin it to your toolbar for easy access (click the puzzle icon → pin)

### Step 5: Test
1. Visit `https://substack.com` (log in if needed)
2. Look for the **"📊 Studio"** button in the navigation
3. Click the extension icon in your toolbar to see the popup

## 🌐 Web Dashboard Installation

### From Source

```bash
# 1. Clone repository
git clone <your-repo-url>
cd substackstudio

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
```

Dashboard opens at: `http://localhost:3000`

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔗 Connect Extension to Dashboard

The extension and dashboard sync automatically!

1. **Run dashboard**: `npm run dev` at `localhost:3000`
2. **Extension detects it**: Opens dashboard when you click "Open Dashboard" button
3. **Auto-sync**: Data syncs every 30 seconds

### If Using Different URL

Edit `extension/background/service-worker.js`:

```javascript
// Change this line:
const DASHBOARD_URL = 'http://localhost:3000';

// To your URL:
const DASHBOARD_URL = 'https://your-dashboard.com';
```

Then reload the extension in `chrome://extensions/`

## ✅ Verification Checklist

After installation:

- [ ] Extension appears in Chrome extensions list
- [ ] Extension icon visible in toolbar
- [ ] Visiting Substack shows "📊 Studio" button
- [ ] Clicking extension icon opens popup
- [ ] Dashboard runs at localhost:3000
- [ ] Dashboard shows "Extension Connected" banner
- [ ] Can schedule a note in extension popup
- [ ] Can schedule a note in dashboard

## 🆘 Troubleshooting

### Extension won't load
- **Check icons exist**: `extension/icons/` should have icon16.png, icon32.png, icon48.png, icon128.png
- **Check manifest**: Verify `extension/manifest.json` exists
- **Chrome console**: Check for errors in extension console

### Dashboard won't connect
- **Check URL**: Verify `DASHBOARD_URL` in service-worker.js matches your dashboard
- **CORS**: If deployed remotely, ensure CORS is configured
- **Extension loaded**: Verify extension is active in Chrome

### No Studio button on Substack
- **Verify URL**: Must be on `*.substack.com`
- **Check console**: Open browser console (F12) and look for errors
- **Content script**: Verify `extension/content/content-script.js` exists

### Data not syncing
- **Check storage**: Open extension console and run `chrome.storage.local.get(null, console.log)`
- **Reload extension**: Go to `chrome://extensions/` and click reload
- **Check dashboard**: Verify connection banner shows "Extension Connected"

## 📱 Using the System

### Quick Scheduling (Extension Popup)
1. Click extension icon
2. Enter note content
3. Select date and time
4. Click "Schedule Note"
5. Get browser notification at scheduled time

### Full Dashboard
1. Open dashboard (click "Open Dashboard" in popup)
2. Use **Scheduler** tab for calendar view
3. Use **Analytics** tab to see metrics
4. Use **Growth** tab for revenue tracking
5. Use **Notes** tab for performance analysis

### Data Export
1. Go to Notes tab in dashboard
2. Click "Export YAML" or "Export CSV"
3. Data downloads to your computer
4. Import later using "Import" button

## 🔒 Privacy & Security

- ✅ All data stored locally (no cloud)
- ✅ Extension only accesses Substack.com
- ✅ No tracking or analytics
- ✅ Open source code
- ✅ No account required

## 📚 Next Steps

1. Read the full [README.md](../../README.md)
2. Read [Extension Documentation](../../extension/README.md)
3. Customize icons (see `extension/icons/README.md`)
4. Schedule your first note!
5. Track your Substack growth

## 💡 Tips

- **Pin Extension**: Pin to toolbar for quick access
- **Keyboard Shortcut**: Set custom keyboard shortcut in `chrome://extensions/shortcuts`
- **Multiple Accounts**: Extension works with whichever Substack account you're logged into
- **Backup Data**: Use Export function regularly to backup your schedule

## 🎯 Ready to Go!

You're all set! Visit Substack and start using your new Studio.

Questions? Check the main README or open an issue on GitHub.
