// modules/ui.js - NeatFreak for Medium
// UI initialization and state management

/**
 * Initialize UI based on current environment
 */
export function initializeUI(env) {
    if (window.isViewingLastResults) {
        return; // Prevent UI reset when viewing last results
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
            // On Medium Following page - enable scan/export
            if (goToMediumBtn) goToMediumBtn.style.display = "none";
            if (startScanBtn) startScanBtn.style.display = hasPriorData ? "none" : "inline-block";
            if (exportCsvBtn) exportCsvBtn.style.display = hasPriorData ? "inline-block" : "none";
            if (viewLastBtn) viewLastBtn.style.display = hasPriorData ? "inline-block" : "none";
            if (clearDataBtn) clearDataBtn.style.display = hasPriorData ? "inline-block" : "none";
            if (status) status.textContent = hasPriorData
                ? "✅ Previous data found. View or clear before rescanning."
                : "✅ On Following page. Ready to scan.";
        } else if (env.isMedium) {
            // On Medium, but not on Following page
            if (goToMediumBtn) goToMediumBtn.style.display = "inline-block";
            if (startScanBtn) startScanBtn.style.display = "none";
            if (exportCsvBtn) exportCsvBtn.style.display = "none";
            if (viewLastBtn) viewLastBtn.style.display = hasPriorData ? "inline-block" : "none";
            if (clearDataBtn) clearDataBtn.style.display = hasPriorData ? "inline-block" : "none";
            if (status) status.textContent = "ℹ️ On Medium. Navigate to your Following page to scan.";
        } else {
            // Not on Medium - show Go to Medium button
            if (goToMediumBtn) goToMediumBtn.style.display = "inline-block";
            if (startScanBtn) startScanBtn.style.display = "none";
            if (exportCsvBtn) exportCsvBtn.style.display = "none";
            if (viewLastBtn) viewLastBtn.style.display = hasPriorData ? "inline-block" : "none";
            if (clearDataBtn) clearDataBtn.style.display = hasPriorData ? "inline-block" : "none";
            if (status) status.textContent = "";
        }
    });
}

/**
 * Check and purge stale data (older than 3 days)
 */
export function checkAndPurgeStaleData() {
    chrome.storage.local.get(["followedUsersTimestamp"], data => {
        const now = Date.now();
        const maxAge = 1000 * 60 * 60 * 24 * 3; // 3 days
        if (data.followedUsersTimestamp && now - data.followedUsersTimestamp > maxAge) {
            chrome.storage.local.remove(["followedUsers", "followedUsersTimestamp"], () => {
                const status = document.getElementById("status");
                if (status) status.textContent = "⚠️ Old data cleared. Please refresh your Following page and reopen NeatFreak to rescan.";
            });
        }
    });
}

/**
 * Show UI when throttle limit is reached
 */
export function showThrottleUI() {
    const goToMediumBtn = document.getElementById("goToMedium");
    const startScanBtn = document.getElementById("startScan");
    const exportCsvBtn = document.getElementById("exportCsv");
    const viewLastBtn = document.getElementById("viewLast");
    const clearDataBtn = document.getElementById("clearData");
    const status = document.getElementById("status");

    chrome.storage.local.get(["lastResults", "lastResultsTimestamp"], (data) => {
        const hasResults = !!data.lastResults && !!data.lastResultsTimestamp;

        // Always hide these when throttled
        if (goToMediumBtn) goToMediumBtn.style.display = "none";
        if (startScanBtn) startScanBtn.style.display = "none";
        
        // Always show clear data when throttled
        if (clearDataBtn) clearDataBtn.style.display = "inline-block";
        
        // Show view/export buttons if we have results
        if (hasResults) {
            if (viewLastBtn) viewLastBtn.style.display = "inline-block";
            if (exportCsvBtn) exportCsvBtn.style.display = "inline-block";
            if (status) status.textContent = "⚠️ Scan limit reached (3 scans/24hr). View/export previous results or clear data.";
        } else {
            if (viewLastBtn) viewLastBtn.style.display = "none";
            if (exportCsvBtn) exportCsvBtn.style.display = "none";
            if (status) status.textContent = "⚠️ Scan limit reached (3 scans/24hr). Clear data to reset.";
        }
    });
}