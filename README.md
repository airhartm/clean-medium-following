# 🧹 NeatFreak for Medium

Easily audit and tidy your Medium connections by analyzing who's still actively posting. A Chrome extension that helps you organize your reading feed by identifying inactive accounts.

**⚠️ Privacy-First Design: Only works on YOUR own followers/following pages for ethical compliance.**

## 🚀 Features

### Smart Profile Analysis
✅ **Scan Profiles** - Gathers your complete connection list with intelligent scrolling  
✅ **Activity Detection** - Uses RSS feeds + profile indicators to identify posting patterns  
✅ **6-Tier Classification System:**
- 🟢 **Active** (posted within 30 days)
- 🔵 **Occasional** (31–90 days) 
- 🟡 **Quiet** (90+ days)
- 🟠 **Inactive** (18+ months)
- ⚫ **None** (no posts found)
- 🔴 **Unmaintained** (missing bio/avatar)

### Professional Export & Management
✅ **CSV Export** with comprehensive metadata and activity explanations  
✅ **Dynamic versioning** from extension manifest  
✅ **Emoji-free data** for spreadsheet compatibility  
✅ **Rate limiting** - 3 scans per 24 hours, 250 connections per scan  

### User Experience
✅ **Ethical validation** - automatically redirects to your own profile pages  
✅ **Smart optimization** - profile indicators + partial RSS fetches for speed  
✅ **Time estimates** - accurate analysis time prediction  
✅ **Progress tracking** - real-time scanning with stop capability  

## 📚 Workflow

1️⃣ **Navigate** to your Medium Following page (`https://medium.com/me/following`)  
2️⃣ **Open extension** - click the NeatFreak icon  
3️⃣ **Scan Profiles** - gather your connection data (~2-5 minutes)  
4️⃣ **Analyze Your Following** - RSS analysis for activity levels  
5️⃣ **Review results** - sorted by activity with clear categorization  
6️⃣ **Download CSV** - export for further analysis  

## 🛠️ Installation

### From Chrome Web Store
1. Visit the [NeatFreak for Medium page](https://chrome.google.com/webstore/detail/neatfreak-for-medium/your-extension-id)
2. Click "Add to Chrome"
3. Confirm installation

### For Developers
1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project folder

## 📖 Usage

### Basic Scanning
1. Open the extension popup
2. Extension will guide you to your Medium following page if needed
3. Click "Scan Profiles" to gather your connections
4. Click "Analyze Your Following" to check activity levels
5. Review results showing detailed activity insights
6. Export results as CSV for organization

### Supported Pages
✅ `medium.com/me/following` (guaranteed your own data)  
✅ `medium.com/me/followers` (guaranteed your own data)  
❌ Other users' pages (blocked for privacy compliance)  

## ⚠️ Important Limitations

### Data Policy Compliance
- **250 connection limit** per scan (respects Medium's servers and data usage policies)
- **Own data only** - extension blocked from analyzing other users' connections
- **3 scans per 24 hours** to maintain responsible usage

### Technical Constraints  
- Medium's interface limitations affect what can be scanned
- RSS feed history may be limited for highly active authors
- "See all" button failures handled with username fallback (Following only)
- Heavy usage may hit rate limits despite built-in throttling

## 🔐 Privacy & Data

Your data stays completely private with our **privacy-first design**:

### Local Processing
- ✅ All analysis happens in your browser
- ✅ No external servers or data transmission
- ✅ Only reads publicly available RSS feeds and profile data

### Ethical Compliance
- ✅ **Own data only** - works exclusively on your profile pages
- ✅ Automatic validation prevents access to others' data
- ✅ Clear user guidance about data ownership
- ✅ Respects Medium's rate limits and server resources

### Data Control
- ✅ Remove all stored data with "Clear Old Data" button
- ✅ No tracking or analytics collection
- ✅ Open source for transparency

## 🏗️ Technical Details

### Architecture
```
extension/
├── manifest.json          # Chrome Extension V3 manifest
├── popup.html            # Extension popup UI  
├── popup.js              # Main orchestrator with ethical validation
├── style.css             # Styling
└── modules/
    ├── environment.js    # Page detection and validation
    ├── ui.js            # UI state management
    ├── scanner.js       # RSS analysis and profile indicators  
    └── exporter.js      # Professional CSV export
```

### Rate Limiting & Respectful Usage
- Maximum 3 scans per 24 hours
- 1.5 second delay between user requests  
- 3 second delay between batches of 10 users
- 250 user limit per scan for server respect
- Graceful error handling and fallbacks

### Smart Optimization
- **Profile indicators** - detect abandoned accounts quickly
- **Partial RSS fetches** - 1KB downloads for speed
- **Three-tier scanning** - count → profiles → RSS analysis
- **Batch processing** - respectful request grouping

## 🌐 Browser Compatibility

- ✅ **Chrome** (primary)
- ✅ **Edge** (Chromium-based)  
- ✅ **Vivaldi** and other Chromium browsers

## 🛠️ Development

### Building for Production
1. Set `DEBUG = false` in all JavaScript files
2. Remove console.log statements
3. Test thoroughly on Medium pages
4. Update version in manifest.json
5. Create extension package for Chrome Web Store

### File Structure Details
- **popup.js** - Restructured for ethical compliance and user guidance
- **modules/scanner.js** - Enhanced with profile indicators and RSS optimization
- **modules/ui.js** - Environment-aware state management  
- **modules/exporter.js** - Professional CSV with dynamic versioning

### Configuration Variables
```javascript
const FREE_USER_LIMIT = 250;     // Data policy compliance limit
const WARNING_THRESHOLD = 100;   // Time warning threshold
const SCAN_LIMIT = 3;            // Daily scan limit
```

## 🤝 Contributing

NeatFreak for Medium is open source and focused on ethical Medium connection analysis.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Areas
- 🔧 Performance optimizations
- 🎨 UI/UX improvements  
- 🐛 Bug fixes and error handling
- 📖 Documentation improvements
- 🔒 Privacy and security enhancements

### Guidelines
- Focus on core scanning functionality and user experience
- Maintain ethical compliance (own-data-only access)
- Follow existing code structure and naming conventions
- All contributions licensed under MIT License

## 📧 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/airhartm/clean-medium-following/issues)
- **Feature Requests**: [GitHub Issues](https://github.com/airhartm/clean-medium-following/issues)  
- **Privacy Policy**: [View Policy](https://neatfreak.kgraph.pro/PRIVACY-POLICY.md)
- **Chrome Web Store**: [Leave Review](https://chrome.google.com/webstore/detail/neatfreak-for-medium/your-extension-id)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🗺️ Roadmap

### ✅ Current Features (Chrome Web Store Ready)
- Complete ethical validation and user guidance
- 6-tier activity analysis system
- Professional CSV export with metadata
- Smart optimization (profile indicators + RSS)
- Rate limiting and server respect
- Own-data-only validation

### 🔄 Planned Improvements  
- Enhanced error handling and user feedback
- Additional export formats (JSON, Excel)
- Performance optimizations for large lists
- UI/UX refinements based on user feedback
- Browser compatibility improvements

### 🚫 Removed Features
- **Premium features** - Removed unlimited scanning for ethical compliance
- **Other users' data access** - Blocked for privacy compliance  
- **Followers redirect** - Removed due to username detection unreliability

---

**Note**: This extension prioritizes ethical use and privacy compliance. It's designed specifically to help users organize their own Medium reading experience while respecting both user privacy and Medium's platform policies.
