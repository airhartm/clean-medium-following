# 🧹 NeatFreak for Medium

**Easily audit and tidy the online list of people that you follow, or subscribe to, on Medium.com.**

A Chrome extension that helps you analyze your Medium "following" list by identifying inactive accounts and providing detailed activity insights. Perfect for curating a high-quality reading feed.

## 🚀 Features

✅ **Auto-scrolls** your Following page to load all connections  
✅ **Fetches last post dates** and **posts in the past 90 days** via each user's RSS feed  
✅ **Color-coded activity tiers**:
- 🟩 **Active** (posted within 30 days)
- 🟨 **Occasional** (31–90 days)  
- ⚫ **Quiet** (over 90 days or inactive)

✅ **CSV export** with:
- Author name (cleaned from RSS feeds)
- Last post date
- Posts in the last 90 days
- Activity tier
- Profile URL

✅ **Modular architecture** for easier maintenance  
✅ **Lightweight, respectful scraping** with polite throttling to reduce Medium server load  
✅ **Privacy-first design** - all processing happens locally in your browser

## 📚 Workflow

1️⃣ **Navigate to your Medium Following page** (`https://medium.com/me/following`)  
2️⃣ **Open the extension** and click "Go to Medium Follow Page" if needed  
3️⃣ Click **"Start Scan"** to begin the audit  
4️⃣ View **live progress** as profiles are scanned in batches  
5️⃣ **Review results** sorted by activity level  
6️⃣ **Export via CSV** for further analysis in Excel or Google Sheets

## Installation

### From Chrome Web Store
1. Visit the [NeatFreak for Medium](https://chrome.google.com/webstore) page
2. Click "Add to Chrome"
3. Confirm installation

### For Developers
1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project folder

## Usage

### Basic Scanning
1. Open the extension popup
2. Click "Go to Medium Follow Page" 
3. Wait for your following list to load completely
4. Click "Start Scan"
5. Review results showing author activity levels

## ⚠️ Limitations

- Medium **only shows a limited number of connections at a time**; NeatFreak can only scan what Medium loads in the browser
- Medium's RSS feeds may **limit post history**, so post counts may not capture every post for highly active authors  
- **Free version limits**: Up to 250 users per scan, 3 scans per 24 hours
- Heavy usage may hit **rate limits**; scans are throttled to minimize server load
- Follower scanning is a **planned premium feature** (currently disabled)

## 🔐 Privacy & Data

**Your data stays completely private:**
- **Local Processing**: All analysis happens in your browser
- **No External Servers**: Your data never leaves your device  
- **Public Data Only**: Only reads publicly available RSS feeds
- **Clear Anytime**: Remove all stored data with "Clear Old Data" button
- **No Tracking**: NeatFreak does not collect or transmit any personal data

## Technical Details

### Rate Limiting & Respectful Usage
- Maximum 3 scans per 24 hours
- 1.5 second delay between user requests
- 3 second delay between batches of 10 users
- Respectful of Medium's server resources

### Free Version Features
- Up to 250 users per scan
- Activity analysis and categorization  
- CSV export functionality
- Standard scanning speed

### Browser Compatibility
- Chrome (primary)
- Edge (Chromium-based)
- Other Chromium-based browsers such as Vivaldi

## 🛠️ Development

### File Structure
```
/
├── icons/              # Extension icons (16px to 512px)
├── modules/            # Core functionality modules
│   ├── environment.js  # Environment detection
│   ├── scanner.js      # Main scanning logic with batch processing
│   ├── ui.js          # UI state management
│   ├── exporter.js    # CSV export functionality
│   └── storage.js     # Data storage utilities
├── background.js       # Service worker
├── content.js         # Page interaction script (auto-scroll + extraction)
├── popup.html         # Extension popup UI
├── popup.js           # Popup functionality and event handlers
├── style.css          # Styling
├── manifest.json      # Extension manifest (Manifest V3)
└── README.md          # This file
```

### Building for Production
1. Set `DEBUG = false` in all JavaScript files
2. Remove console.log statements  
3. Test thoroughly on different Medium pages
4. Create extension package for Chrome Web Store

## ✅ Installation & Deployment

### Installation from Chrome Web Store
1. Visit the [NeatFreak for Medium](https://chrome.google.com/webstore) page
2. Click "Add to Chrome"
3. Confirm installation

### Testing Locally (Developers)
1. Clone this repository
2. Enable **Developer Mode** in `chrome://extensions`
3. Click **"Load unpacked"** and select the project folder
4. Test on Medium following pages

### Preparing for Chrome Web Store
- Ensure `manifest.json` is correct (no unnecessary permissions)
- Create screenshots (1280x800) demonstrating the extension
- Include 128x128, 48x48 icons
- Write clear, short description (132 characters max)
- Create ZIP of extension folder (exclude .git, design files, drafts)
- Submit via [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- Pay one-time developer fee if not already done
- Wait for Google's review (typically 1-7 business days)

## 🤝 Contributing

NeatFreak for Medium is **open source** with premium features available as a paid service. We welcome contributions to the core functionality!

**How to contribute:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Contribution Guidelines:**
- Focus on core scanning functionality, UI improvements, and bug fixes
- Premium features (unlimited scanning, advanced analytics) are implemented server-side
- All contributions will be reviewed for code quality and alignment with project goals
- By contributing, you agree that your contributions will be licensed under the MIT License

**Areas where we especially welcome contributions:**
- Performance optimizations
- UI/UX improvements  
- Bug fixes and error handling
- Browser compatibility improvements
- Documentation and help content

## 📧 Support & Contact

- **Issues**: Report bugs via [GitHub Issues](https://github.com/yourusername/neatfreak-medium/issues)
- **Feature Requests**: Suggest improvements via GitHub Issues
- **Email**: support@neatfreak.app (for Chrome Web Store users)
- **Feedback**: For premium feature inquiries and general feedback

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Roadmap

### Open Source Core Features - Always Free
- ✅ Activity analysis and categorization
- ✅ CSV export functionality
- ✅ Basic UI and scanning logic
- 🔄 Performance optimizations
- 🔄 Enhanced error handling
- 🔄 Additional export formats

### Future Premium Features (Server-Side Service)
- 🔐 **Unlimited user scanning** (no 250-user limit)
- 🔐 **Faster scanning** with priority server access
- 🔐 **Historical tracking** of network changes over time
- 🔐 **Bulk management tools** and unfollow suggestions
- 🔐 **Team/business features** for multiple accounts
- 🔐 **API access** for integration with other tools
- 🔐 **Priority email support**

*Premium features will be implemented as a paid service to support ongoing development and server costs while keeping the core extension free and open source.*

---

**Made with ❤️ for the Medium community**
