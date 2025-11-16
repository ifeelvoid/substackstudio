# Substack Studio - Chrome Extension

A Chrome extension that integrates with Substack to provide scheduling, analytics extraction, and seamless synchronization with the Substack Studio web dashboard.

## Features

### 📊 Analytics Extraction
- Automatically extracts subscriber counts from Substack pages
- Monitors analytics and stats pages for metrics
- Syncs data to web dashboard every 5 minutes

### 📅 Scheduling
- Schedule Substack Notes directly from the extension
- Browser-based alarms for post reminders
- Notification system for scheduled posts

### 🔄 Data Sync
- Real-time sync with web dashboard
- Chrome storage for offline access
- Automatic background synchronization

### 🎨 Minimal UI
- Black and white aesthetic matching the web dashboard
- Quick access popup interface
- Integrated button on Substack pages

## Installation

### Option 1: Load Unpacked (Development)

1. **Generate Icons First** (Important!)
   - Navigate to `icons/` folder
   - Follow instructions in `icons/README.md` to create icon files
   - Or use the `scripts/generate-icons.html` method

2. **Open Chrome Extensions**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top right)

3. **Load Extension**
   - Click "Load unpacked"
   - Select the `extension` folder from this project

4. **Verify Installation**
   - You should see "Substack Studio" in your extensions
   - Pin it to toolbar for easy access

### Option 2: Package as CRX (Production)

```bash
# From the extension directory
zip -r substack-studio.zip ./*

# Then in Chrome:
# 1. Go to chrome://extensions/
# 2. Click "Pack extension"
# 3. Select the extension folder
# 4. Install the generated .crx file
```

## Usage

### Getting Started

1. **Install the Extension** (see above)

2. **Visit Substack**
   - Go to your Substack dashboard
   - You'll see a "📊 Studio" button added to the navigation

3. **Open Web Dashboard**
   - Click the extension icon in Chrome toolbar
   - Click "Open Dashboard" button
   - Or click the "📊 Studio" button on Substack pages

4. **Schedule Notes**
   - Use the popup to quickly schedule notes
   - Or use the full web dashboard for advanced features

### Popup Interface

Click the extension icon to access:
- **Quick Stats**: View subscriber count and scheduled notes
- **Upcoming Notes**: See your next 3 scheduled posts
- **Quick Schedule**: Fast note scheduling
- **Sync Data**: Manual sync with web dashboard

### Analytics Extraction

The extension automatically extracts:
- Subscriber counts from Substack pages
- Post performance metrics
- Engagement data
- Growth trends

Data is stored locally and synced to the web dashboard.

### Scheduling System

1. **Schedule a Note**
   - Enter content, date, and time
   - Extension creates a Chrome alarm
   - You'll get a notification when it's time to post

2. **Post Reminders**
   - Notification appears at scheduled time
   - Click "Open Substack" to post immediately
   - Or dismiss if you've already posted

**Note**: For scheduled posting, your browser must be open at the scheduled time (Chrome extension limitation).

## Configuration

### Dashboard URL

By default, the extension connects to `http://localhost:3000`.

To change:
1. Edit `background/service-worker.js`
2. Update `DASHBOARD_URL` constant
3. Reload extension

For production:
```javascript
const DASHBOARD_URL = 'https://your-deployed-dashboard.com';
```

### Permissions

The extension requires:
- **storage**: Store notes and analytics locally
- **alarms**: Schedule post notifications
- **tabs**: Open Substack pages
- **activeTab**: Extract data from current page
- **host_permissions** (`*.substack.com`): Access Substack pages

## Development

### File Structure

```
extension/
├── manifest.json              # Extension configuration
├── popup/
│   ├── popup.html            # Popup interface
│   ├── popup.css             # Popup styles
│   └── popup.js              # Popup logic
├── content/
│   ├── content-script.js     # Injects into Substack pages
│   └── content-styles.css    # Injected styles
├── background/
│   └── service-worker.js     # Background tasks & alarms
├── icons/
│   ├── icon16.png            # Extension icons
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   └── README.md             # Icon generation instructions
└── scripts/
    └── generate-icons.html   # Icon generator tool
```

### Testing

1. **Load Extension** (unpacked)
2. **Open Console**:
   - Popup: Right-click extension icon → Inspect
   - Content Script: F12 on Substack page → Console
   - Background: chrome://extensions → Details → Inspect service worker

3. **Test Features**:
   - Schedule a note
   - Visit Substack.com and check for injected button
   - Verify data sync with dashboard

### Debugging

**Check Extension Console**:
```javascript
// Background service worker
console.log('Service worker loaded');

// Content script
console.log('Substack Studio: Content script loaded');

// Popup
console.log('Popup initialized');
```

**View Storage**:
```javascript
chrome.storage.local.get(null, (data) => {
  console.log('All storage:', data);
});
```

**Clear All Data**:
```javascript
chrome.storage.local.clear();
```

## Web Dashboard Integration

### How It Works

1. Extension extracts data from Substack
2. Data stored in Chrome storage
3. Dashboard reads from Chrome storage API
4. Auto-sync every 30 seconds (dashboard) and 5 minutes (extension)

### Sync Status

- **Connected**: Extension and dashboard are syncing
- **Disconnected**: Using demo data (no extension)

Check status in web dashboard banner.

## Troubleshooting

### Extension Not Loading
- Check that all required icons exist in `icons/` folder
- Verify manifest.json syntax
- Check Chrome console for errors

### Data Not Syncing
- Ensure extension is loaded and active
- Check Chrome storage permissions
- Verify dashboard URL in service worker

### Scheduled Posts Not Firing
- Browser must be open at scheduled time
- Check Chrome alarms: `chrome://extensions/` → Background page console
- Verify notification permissions

### Analytics Not Extracting
- Make sure you're on a Substack.com page
- Check content script console for errors
- Visit stats/analytics page for best results

## Privacy & Security

- **All data stored locally** in Chrome storage
- **No external servers** (except your own dashboard)
- **No tracking or analytics**
- **Open source** - inspect the code yourself

## Limitations

- Browser must be open for scheduled posts (Chrome limitation)
- Cannot auto-post to Substack (violates ToS)
- Reminder-only system for compliance
- Analytics extraction limited to visible page data

## Future Enhancements

- [ ] OAuth integration with Substack
- [ ] Enhanced analytics parsing
- [ ] Bulk scheduling
- [ ] Template library
- [ ] AI-powered content suggestions
- [ ] Cross-browser support (Firefox, Edge)

## Support

For issues or questions:
1. Check this README
2. Review console errors
3. Open an issue on GitHub

## License

MIT License - See main project README

---

**Made with ❤️ for Substack creators**
