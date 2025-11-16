# Substack Studio

A professional Substack management studio with scheduling, analytics, growth tracking, and performance insights. Built with Next.js, TypeScript, and Tailwind CSS featuring a sleek black and white minimal night mode aesthetic.

## 🎯 Two Ways to Use

### 1. Web Dashboard Only
Use the standalone web app with demo data for planning and visualization.

### 2. Hybrid System (Recommended)
**Chrome Extension + Web Dashboard** for full Substack integration:
- Extension extracts real analytics from Substack
- Schedule notes with browser notifications
- Auto-sync between extension and dashboard
- Real-time data updates

See [Extension README](extension/README.md) for installation instructions.

## Features

### 📅 Scheduler
- **7-Day Calendar Grid View**: Weekly schedule with customizable time slots
- **Time Slot Management**: Standard 2-hour intervals from 8 AM to 8 PM (customizable)
- **Click-to-Edit**: Quick modal editor for any time slot
- **Visual Status Indicators**: Clearly see draft, scheduled, and published notes
- **Drag-and-drop** scheduling interface (coming soon)

### 📊 Analytics Dashboard
- **Real-time Metrics Integration**:
  - Reactions
  - Restacks
  - Comments
  - Clicks
  - Free Subscribers
  - Paid Subscribers
- **Interactive Charts**:
  - Subscriber growth trends
  - Engagement metrics visualization
  - 14-day historical data views
- **Performance Tracking**: Track your content's performance over time

### 📈 Growth & Revenue
- **Growth Heatmap**: Visual 28-day heatmap showing daily subscriber growth
- **Weekly Growth Trends**: Bar chart visualization of weekly performance
- **Revenue Analytics**:
  - **MRR** (Monthly Recurring Revenue)
  - **ARPU** (Average Revenue Per User)
  - **LTV** (Lifetime Value estimation)
- **Projected Revenue**: Annual revenue projections based on current metrics

### 📝 Notes Performance
- **Performance Segmentation**:
  - **Dynamo**: High conversion & engagement (⚡)
  - **Rocket**: Viral content, low conversion (🚀)
  - **Burner**: Steady performers (🔥)
  - **Wonder**: Content needing optimization (?)
- **Detailed Metrics**: View complete performance data for each note
- **Export/Import**:
  - YAML format support
  - CSV format support
  - Bulk data management

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Data Export**: js-yaml, papaparse

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Design Philosophy

The application follows a strict **black and white minimal aesthetic** with:
- Pure black background (#000000)
- White text and accents (#ffffff)
- Grayscale intermediate colors
- Clean, spacious layouts
- High contrast for readability
- Minimal, professional interface

## Usage

### Scheduling Notes

1. Navigate to the **Scheduler** tab
2. Click on any time slot to create a new note
3. Click the **+ New Note** button to create a draft
4. Edit existing notes by clicking on them in the calendar

### Viewing Analytics

1. Navigate to the **Analytics** tab
2. View subscriber growth, engagement metrics, and trends
3. All data updates automatically with new notes

### Tracking Growth

1. Navigate to the **Growth** tab
2. View revenue metrics (MRR, ARPU, LTV)
3. Analyze weekly growth trends
4. Examine the daily growth heatmap

### Managing Notes

1. Navigate to the **Notes** tab
2. Filter by performance category (Dynamo, Rocket, Burner, Wonder)
3. View detailed metrics for each published note
4. Export data in YAML or CSV format
5. Import previously exported data

## Data Management

### Exporting Data

Click the **Export YAML** or **Export CSV** button in the Notes tab to download your data.

### Importing Data

Click the **Import** button and select a previously exported YAML or CSV file.

## Chrome Extension

### Quick Setup

1. **Install Extension**:
   ```bash
   # Generate icons first (see extension/icons/README.md)
   # Then in Chrome:
   # 1. Go to chrome://extensions/
   # 2. Enable "Developer mode"
   # 3. Click "Load unpacked"
   # 4. Select the `extension` folder
   ```

2. **Visit Substack**:
   - Extension adds a "📊 Studio" button to Substack pages
   - Click to open the web dashboard

3. **Use Popup**:
   - Click extension icon for quick scheduling
   - View stats and upcoming notes
   - Manual sync with dashboard

### Extension Features

- ✅ Extracts analytics from Substack pages
- ✅ Schedule notes with notifications
- ✅ Real-time sync with web dashboard
- ✅ Chrome storage for offline access
- ✅ Background alarms for post reminders

See [Extension Documentation](extension/README.md) for detailed setup and usage.

## Project Structure

```
substackstudio/
├── app/              # Next.js app (web dashboard)
├── components/       # React components
├── lib/              # Utilities and types
├── extension/        # Chrome extension
│   ├── popup/       # Extension popup UI
│   ├── content/     # Content scripts (inject into Substack)
│   ├── background/  # Service worker (scheduling, sync)
│   └── icons/       # Extension icons
└── public/          # Static assets
```

## Future Enhancements

### Web Dashboard
- [ ] AI-powered content analysis
- [ ] Custom GPT integration for note optimization
- [ ] Advanced filtering and search
- [ ] Note templates
- [ ] Collaborative features
- [ ] Mobile responsive improvements

### Chrome Extension
- [ ] OAuth integration with Substack
- [ ] Enhanced analytics parsing
- [ ] Bulk scheduling
- [ ] Cross-browser support (Firefox, Edge)
- [ ] Auto-post compliance mode

## License

MIT

## Author

Built with ❤️ for Substack creators
