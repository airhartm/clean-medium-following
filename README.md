# NeatFreak for Medium

**Easily audit and tidy your Medium Following list.**

NeatFreak helps you:
- See who you follow on Medium, when they last posted, and how active they are.
- Identify inactive or quiet accounts.
- Export your following activity to CSV for tracking.

---

## 🚀 Features

✅ **Auto-scrolls** your Following page to load all connections.  
✅ **Fetches last post dates** and **posts in the past 90 days** via each user’s RSS feed.  
✅ **Color-coded activity tiers**:
- 🟩 Active (posted within 30 days)
- 🟨 Occasional (31–90 days)
- ⚫ Quiet (over 90 days or inactive)

✅ **CSV export** with:
- Username
- Last post date
- Posts in the last 90 days
- Activity tier
- Profile URL

✅ **Modular architecture** for easier maintenance.

✅ **Lightweight, respectful scraping** with polite throttling to reduce Medium load.

---

## 📚 **Workflow**

1️⃣ **Navigate to your Medium Following page** (`https://medium.com/me/following`).  
2️⃣ **Open the extension.**  
3️⃣ Click **“Start Scan”** to begin the audit.  
4️⃣ View **live progress** as profiles are scanned.  
5️⃣ Export your results via **Download CSV**.

---

## ⚠️ **Limitations**

- Medium **only shows a limited number of connections at a time**; NeatFreak can only scan what Medium loads in the browser.
- Medium’s RSS feeds may **limit post history**, so post counts may not capture every post for highly active authors.
- Heavy usage may hit **rate limits**; scans are throttled to minimize server load.
- Followers scanning is a **planned premium feature** and currently disabled to discourage overuse.

---

## 🔐 **Privacy**

NeatFreak does not collect or transmit your data. All processing happens **locally in your browser**, and exports are generated only when you click “Download CSV.”

---

## 🛠️ Development

- Built with **Manifest V3**.
- Uses modular structure:
  - `popup.js`, `popup.html`, `popup.css`
  - `modules/environment.js`, `ui.js`, `scanner.js`, `storage.js`
  - `content.js` (auto-scroll + user extraction)

---

## ✅ Deployment

### 1️⃣ Testing Locally
- Enable Developer Mode in `chrome://extensions`.
- Click **“Load unpacked”** and select your extension folder.
- Test on Medium.

### 2️⃣ Preparing for the Chrome Web Store
- Ensure:
  - `manifest.json` is correct (no unnecessary permissions).
  - Screenshots (1280x800) demonstrating your extension.
  - 128x128, 48x48 icons.
  - A clear, short description (132 characters max).
- Create a ZIP of your extension folder:
  - Ensure it **does not contain .git, design files, or unrelated drafts**.
- Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
- Upload ZIP, fill in details, and pay the one-time developer fee if not already done.
- Wait for Google’s review (typically 1-3 business days).

---

## 🤝 Contributing

Currently closed-source, but feedback and improvement suggestions are welcome.

---

## 📧 Contact

For feedback or premium feature inquiries, contact:

- [Your Name or Handle]
- [Your Email]
- [Your Website, if applicable]

---

## 📝 License

See [LICENSE](LICENSE) for details.