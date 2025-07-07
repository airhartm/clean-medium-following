// modules/ui.js

export function initializeUI(env) {
    const goToMediumBtn = document.getElementById("goToMedium");
    const startScanBtn = document.getElementById("startScan");
    const exportCsvBtn = document.getElementById("exportCsv");
    const status = document.getElementById("status");

    if (env.isMedium && env.isFollowingPage) {
        console.log("✅ On Medium Following page - enabling scan/export.");
        if (goToMediumBtn) goToMediumBtn.style.display = "none";
        if (startScanBtn) startScanBtn.style.display = "inline-block";
        if (exportCsvBtn) exportCsvBtn.style.display = "inline-block";
        if (status) status.textContent = "✅ On Medium Following page. Ready to scan.";
    } else if (env.isMedium) {
        console.log("ℹ️ On Medium, but not on Following page.");
        if (goToMediumBtn) goToMediumBtn.style.display = "none";
        if (startScanBtn) startScanBtn.style.display = "none";
        if (exportCsvBtn) exportCsvBtn.style.display = "none";
        if (status) status.textContent = "ℹ️ On Medium. Please navigate to your Following page to scan.";
    } else {
        console.log("🚩 Not on Medium - showing Go to Medium button.");
        if (goToMediumBtn) goToMediumBtn.style.display = "inline-block";
        if (startScanBtn) startScanBtn.style.display = "none";
        if (exportCsvBtn) exportCsvBtn.style.display = "none";
        if (status) status.textContent = "";
    }
}
export function checkAndPurgeStaleData() {
    chrome.storage.local.get(["followedUsersTimestamp"], data => {
        const now = Date.now();
        const maxAge = 1000 * 60 * 60 * 24 * 3; // 3 days
        if (data.followedUsersTimestamp && now - data.followedUsersTimestamp > maxAge) {
            chrome.storage.local.remove(["followedUsers", "followedUsersTimestamp"], () => {
                console.log("🧹 Stale followedUsers data cleared after 3 days.");
                const status = document.getElementById("status");
                if (status) status.textContent = "⚠️ Old data cleared. Please refresh your Following page and reopen NeatFreak to rescan.";
            });
        }
    });
}
