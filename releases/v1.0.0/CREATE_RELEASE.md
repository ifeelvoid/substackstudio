# How to Create GitHub Release v1.0.0

All files are ready and pushed to your repository! Follow these steps to create the release on GitHub:

## Step 1: Go to GitHub Releases

1. Open your repository on GitHub
2. Click on **"Releases"** (in the right sidebar or under Code tab)
3. Click **"Draft a new release"** or **"Create a new release"**

## Step 2: Create Tag

1. Click **"Choose a tag"**
2. Type: `v1.0.0`
3. Click **"Create new tag: v1.0.0 on publish"**

## Step 3: Set Target Branch

- Select branch: `claude/substack-studio-clone-01GL2ATbGfa9DCbCbapCsja4`
- Or select `main` if you've merged the changes

## Step 4: Release Title

Enter: **Substack Studio v1.0.0**

## Step 5: Release Description

Copy and paste from `RELEASE_NOTES.md` or use this:

```markdown
# Substack Studio v1.0.0

A professional Substack management studio with scheduling, analytics, growth tracking, and performance insights.

## 🎉 What's New

**First official release!** This includes:

### ✨ Web Dashboard
- 📅 7-day calendar scheduler with time slots
- 📊 Analytics dashboard with interactive charts
- 📈 Growth & revenue tracking (MRR, ARPU, LTV)
- 📝 Notes performance segmentation (Dynamo, Rocket, Burner, Wonder)
- 💾 Export/Import (YAML, CSV)
- 🎨 Black & white minimal night mode UI

### 🔌 Chrome Extension
- Injects into Substack pages
- Extracts analytics automatically
- Schedule notes with browser notifications
- Quick popup interface
- Auto-sync with web dashboard
- Chrome storage for offline access

## 📦 Downloads

- **Chrome Extension**: `substack-studio-extension-v1.0.0.zip` (17 KB)
- **Source Code**: Available in repository

## 📚 Documentation

- [Installation Guide](releases/v1.0.0/INSTALLATION.md)
- [Release Notes](releases/v1.0.0/RELEASE_NOTES.md)
- [Main README](README.md)
- [Extension Docs](extension/README.md)

## 🚀 Quick Start

### Chrome Extension
1. Download the extension zip file below
2. Extract it
3. Load unpacked in Chrome (`chrome://extensions/`)
4. Visit Substack and see the Studio button!

### Web Dashboard
```bash
git clone <repo-url>
cd substackstudio
npm install
npm run dev
```

## 🔧 Tech Stack

Next.js 16 • TypeScript • Tailwind CSS • Recharts • Chrome Manifest V3

## 📝 Important Notes

- ✅ Extension complies with Substack ToS (no auto-posting)
- ✅ Reminder-only scheduling system
- ✅ All data stored locally
- ✅ No external tracking
- ✅ Open source

## 🙏 Credits

Built with ❤️ for Substack creators

Full changelog and detailed features in [RELEASE_NOTES.md](releases/v1.0.0/RELEASE_NOTES.md)
```

## Step 6: Upload Extension File

1. Scroll to **"Attach binaries"** section
2. Click **"Attach files by dropping them here or selecting them"**
3. Upload: `releases/v1.0.0/substack-studio-extension-v1.0.0.zip`
4. Wait for upload to complete

## Step 7: Publish

1. Check **"Set as the latest release"** (should be checked by default)
2. **Optionally**: Check "Set as a pre-release" if you want to test first
3. Click **"Publish release"**

## ✅ Done!

Your release is now live! Users can:
- Download the extension zip file
- Clone the repository
- View the release notes
- Install and use Substack Studio

## 📍 Release Location

After publishing, your release will be at:
`https://github.com/<your-username>/substackstudio/releases/tag/v1.0.0`

## 🔗 What to Share

Share these links with users:
- **Release Page**: `https://github.com/<your-username>/substackstudio/releases/tag/v1.0.0`
- **Direct Download**: Will be available after publishing
- **Repository**: `https://github.com/<your-username>/substackstudio`

---

**Note**: All files are already pushed to your repository in the `releases/v1.0.0/` folder. The GitHub release just makes them easily downloadable and visible to users.
