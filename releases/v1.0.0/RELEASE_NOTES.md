# Substack Studio v1.0.0

**Release Date**: November 16, 2025

A professional Substack management studio with scheduling, analytics, growth tracking, and performance insights. This release includes both a web dashboard and Chrome extension for full Substack integration.

## 📦 What's Included

### 1. Web Dashboard
A standalone Next.js application with:
- 📅 7-day calendar scheduler
- 📊 Analytics dashboard with charts
- 📈 Growth & revenue tracking (MRR, ARPU, LTV)
- 📝 Notes performance segmentation
- 💾 Export/Import (YAML, CSV)
- 🎨 Black & white minimal night mode UI

### 2. Chrome Extension
Browser extension for Substack integration:
- ✅ Injects "Studio" button into Substack pages
- ✅ Extracts analytics from Substack
- ✅ Schedule notes with browser notifications
- ✅ Popup UI for quick scheduling
- ✅ Auto-sync with web dashboard
- ✅ Chrome storage for offline access

## 🚀 Installation

### Web Dashboard

```bash
# Clone the repository
git clone <repo-url>
cd substackstudio

# Install dependencies
npm install

# Run development server
npm run dev

# Or build for production
npm run build
npm start
```

Dashboard will be available at `http://localhost:3000`

### Chrome Extension

**Option 1: Load Unpacked (Development)**

1. Download `substack-studio-extension-v1.0.0.zip` from this release
2. Extract the zip file
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" (top right toggle)
5. Click "Load unpacked"
6. Select the extracted `extension` folder
7. Extension is now installed!

**Option 2: From Source**

```bash
# From repository root
cd extension
# Load the extension folder in Chrome as described above
```

### Using Together

1. **Install Extension** in Chrome (see above)
2. **Run Web Dashboard**: `npm run dev`
3. **Visit Substack** - you'll see the Studio button
4. **Click Extension Icon** - quick scheduling popup
5. **Open Dashboard** - see real-time sync

## ✨ Features

### Scheduler
- 7-day calendar grid view
- Time slot management (8 AM - 8 PM, customizable)
- Click-to-edit interface
- Visual status indicators (draft, scheduled, published)

### Analytics Dashboard
- Subscriber growth trends
- Engagement metrics (reactions, restacks, comments, clicks)
- 14-day historical views
- Interactive charts powered by Recharts

### Growth & Revenue
- 28-day growth heatmap
- Weekly growth trends
- MRR (Monthly Recurring Revenue) calculation
- ARPU (Average Revenue Per User)
- LTV (Lifetime Value) estimation

### Notes Performance
- **Dynamo**: High conversion & engagement ⚡
- **Rocket**: Viral, low conversion 🚀
- **Burner**: Steady performers 🔥
- **Wonder**: Needs optimization ❓
- Detailed metrics for each note
- Filter by performance category

### Data Management
- Export notes to YAML or CSV
- Import previously exported data
- Bulk data management

## 🔧 Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Data Export**: js-yaml, papaparse
- **Extension**: Chrome Manifest V3

## 📝 Important Notes

### Extension Compliance
- ✅ **No auto-posting** - Complies with Substack ToS
- ✅ **Reminder-only system** - User must manually post
- ✅ **Browser must be open** - For scheduled notifications to work
- ✅ **Local data only** - No external servers (except your dashboard)

### Data Privacy
- All data stored locally (Chrome storage or localStorage)
- No external tracking or analytics
- Open source - inspect the code yourself
- Extension only accesses `*.substack.com` pages

## 🐛 Known Limitations

1. **Browser Dependency**: Browser must be open for scheduled post notifications
2. **Manual Posting**: Extension provides reminders only, cannot auto-post
3. **Analytics Extraction**: Limited to visible page data on Substack
4. **Icon Quality**: Placeholder icons included - replace for production

## 📚 Documentation

- **Main README**: Complete project overview
- **Extension README**: `extension/README.md` - Detailed extension guide
- **Icon Guide**: `extension/icons/README.md` - How to create custom icons

## 🔄 What's Next

### Planned Features
- AI-powered content analysis
- Custom GPT integration for note optimization
- Real Substack API integration (when available)
- Advanced filtering and search
- Note templates
- Collaborative features
- Mobile responsive improvements
- Firefox/Edge support

## 📋 Changelog

### v1.0.0 (Initial Release)
- ✅ Web dashboard with scheduler, analytics, growth tracking
- ✅ Chrome extension with Substack integration
- ✅ Real-time data sync between extension and dashboard
- ✅ Schedule notes with browser notifications
- ✅ Analytics extraction from Substack pages
- ✅ Export/Import functionality (YAML, CSV)
- ✅ Performance segmentation (Dynamo, Rocket, Burner, Wonder)
- ✅ Black & white minimal UI
- ✅ Full TypeScript support
- ✅ Complete documentation

## 🤝 Contributing

Contributions welcome! Please read the main README for development setup.

## 📄 License

MIT License - See LICENSE file

## 🙏 Acknowledgments

Built with ❤️ for Substack creators

Inspired by Finntropy's Substack Pro Studio and Control Center

---

**Installation Help**: See README.md for detailed setup instructions

**Issues**: Report bugs on GitHub Issues

**Questions**: Check documentation or open a discussion
