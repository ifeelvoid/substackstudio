# Install Substack Studio v1.1.0

## 🚀 Quick Install

### Chrome Extension

1. **Download**: `substack-studio-extension-v1.1.0.zip` from this release
2. **Extract**: Unzip to a folder on your computer
3. **Load in Chrome**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the extracted `extension` folder
4. **Accept Permissions**: Accept the new `notifications` permission
5. **Done!** Extension is ready

### Web Dashboard

No changes needed - same as v1.0.0:

```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

## ✨ What's Different from v1.0.0?

### New Permission
The extension now requests **notifications** permission to show you when posts are published (or if they fail).

### Auto-Posting Enabled
- Your scheduled Notes will **automatically publish** at their scheduled time
- Browser must be **open** and computer must be **awake**
- You must be **logged into Substack**

## 🎯 Testing Auto-Post

1. **Schedule a test note** (5 minutes from now)
2. **Keep browser open**
3. **Watch for**:
   - New tab opening at scheduled time
   - Note being filled in automatically
   - Post button being clicked
   - Success notification

## ⚙️ Configuration

**Auto-post is ON by default**

If auto-post fails for any reason, it automatically falls back to showing you a notification to post manually.

## 📝 Requirements

- ✅ Chrome/Edge/Brave browser
- ✅ Browser must be open at scheduled times
- ✅ Computer must not sleep
- ✅ Logged into Substack account
- ✅ Active internet connection

## 🔄 Upgrading from v1.0.0

1. Delete the old extension folder (or keep it as backup)
2. Extract the new v1.1.0 zip
3. In Chrome extensions, click the **reload** button on Substack Studio
4. OR remove old extension and load the new one
5. Accept the new notifications permission

All your scheduled notes and data are preserved in Chrome storage!

## ⚠️ Troubleshooting

### Auto-Post Not Working?

**Check:**
- [ ] Browser is open
- [ ] Logged into Substack
- [ ] Extension is enabled
- [ ] Notifications permission granted
- [ ] Internet connection active

**Debug:**
1. Open extension popup (right-click → Inspect)
2. Check Console for errors
3. Look for "Auto-posting note..." message
4. Check for success/failure notifications

### Still Issues?

The extension will automatically fall back to manual mode if auto-posting fails. You'll get a notification to post manually.

## 🎉 You're Ready!

Your Substack Studio now has **full auto-posting capability**!

Schedule your Notes and let the extension publish them automatically.

---

**Need Help?**
- Check [RELEASE_NOTES.md](RELEASE_NOTES.md) for full details
- See [extension/README.md](../../extension/README.md) for documentation
- Report issues on GitHub
