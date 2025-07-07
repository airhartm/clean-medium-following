// modules/ui.js - NeatFreak for Medium
// UI initialization and stale data management
export function initializeUI(env) {
    if (window.isViewingLastResults) {
        console.log("🔹 Skipping UI reset, viewing last results.");
        return; // ✅ prevents UI reset
    }

    const goToMediumBtn = document.getElementById("goToMedium");
    const startScanBtn = document.getElementById("startScan");
    const exportCsvBtn = document.getElementById("exportCsv");
    const viewLastBtn = document.getElementById("viewLast");
    const clearDataBtn = document.getElementById("clearData");
    const status = document.getElementById("status");

    chrome.storage.local.get(["lastResults", "followedUsers"], (data) => {
        const hasPriorData = !!data.lastResults && !!data.followedUsers && data.followedUsers.length > 0;

        if (env.isMedium && env.isFollowingPage) {
            console.log("✅ On Medium Following page - enabling scan/export.");
            if (goToMediumBtn) goToMediumBtn.style.display = "none";
            if (startScanBtn) startScanBtn.style.display = hasPriorData ? "none" : "inline-block";
            if (exportCsvBtn) exportCsvBtn.style.display = hasPriorData ? "inline-block" : "none";
            if (viewLastBtn) viewLastBtn.style.display = hasPriorData ? "inline-block" : "none";
            if (clearDataBtn) clearDataBtn.style.display = hasPriorData ? "inline-block" : "none";
            if (status) status.textContent = hasPriorData
                ? "✅ Previous data found. View or clear before rescanning."
                : "✅ On Following page. Ready to scan.";
        } else if (env.isMedium) {
            console.log("ℹ️ On Medium, but not on Following page.");
            if (goToMediumBtn) goToMediumBtn.style.display = "inline-block";
            if (startScanBtn) startScanBtn.style.display = "none";
            if (exportCsvBtn) exportCsvBtn.style.display = "none";
            if (viewLastBtn) viewLastBtn.style.display = hasPriorData ? "inline-block" : "none";
            if (clearDataBtn) clearDataBtn.style.display = hasPriorData ? "inline-block" : "none";
            if (status) status.textContent = "ℹ️ On Medium. Navigate to your Following page to scan.";
        } else {
            console.log("🚩 Not on Medium - showing Go to Medium button.");
            if (goToMediumBtn) goToMediumBtn.style.display = "inline-block";
            if (startScanBtn) startScanBtn.style.display = "none";
            if (exportCsvBtn) exportCsvBtn.style.display = "none";
            if (viewLastBtn) viewLastBtn.style.display = hasPriorData ? "inline-block" : "none";
            if (clearDataBtn) clearDataBtn.style.display = hasPriorData ? "inline-block" : "none";
            if (status) status.textContent = "";
        }
    });
}

export function checkAndPurgeStaleData() {
    chrome.storage.local.get(["followedUsersTimestamp"], data => {
        const now = Date.now();
        const maxAge = 1000 * 60 * 60 * 24 * 3; // 3 days
        if (data.followedUsersTimestamp && now - data.followedUsersTimestamp > maxAge) {
            chrome.storage.local.remove(["followedUsers", "followedUsersTimestamp"], () => {
                console.log("🧹 NeatFreak: Stale followedUsers data cleared after 3 days.");
                const status = document.getElementById("status");
                if (status) status.textContent = "⚠️ Old data cleared. Please refresh your Following page and reopen NeatFreak to rescan.";
            });
        }
    });
}