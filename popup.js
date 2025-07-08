const DEBUG = false; // Production build
const SCAN_LIMIT = 3; // Max scans per 24 hours
const SCAN_WINDOW_MS = 1000 * 60 * 60 * 24; // 24 hours

import { checkEnvironment } from "./modules/environment.js";
import { initializeUI, checkAndPurgeStaleData, showThrottleUI } from "./modules/ui.js";
import { startScan } from "./modules/scanner.js";
import { exportCsv } from "./modules/exporter.js";

// Clear Data Button
document.getElementById("clearData").addEventListener("click", () => {
    chrome.storage.local.remove(["lastResults", "lastResultsTimestamp"], () => {
        const resultsContainer = document.getElementById("results");
        resultsContainer.innerHTML = "";
        
        // Check if throttle is still active after clearing data
        chrome.storage.local.get(["scanRunTimestamps"], (data) => {
            const now = Date.now();
            const timestamps = (data.scanRunTimestamps || []).filter(ts => now - ts < SCAN_WINDOW_MS);
            
            if (timestamps.length >= SCAN_LIMIT) {
                // Throttle still active - show appropriate message
                document.getElementById("status").textContent = "⚠️ Data cleared but scan limit still active (3 scans/24hr).";
                document.getElementById("startScan").style.display = "none";
                document.getElementById("clearData").style.display = "none";
            } else {
                // No throttle - can scan again
                document.getElementById("status").textContent = "✅ Data cleared. You may now scan again.";
                document.getElementById("startScan").style.display = "inline-block";
                document.getElementById("clearData").style.display = "none";
            }
        });
    });
});

// DOM Ready
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const env = await checkEnvironment();
        
        initializeUI(env);
        checkAndPurgeStaleData();

        // Scan throttling
        chrome.storage.local.get(["scanRunTimestamps"], (data) => {
            const now = Date.now();
            const timestamps = (data.scanRunTimestamps || []).filter(ts => now - ts < SCAN_WINDOW_MS);

            if (timestamps.length >= SCAN_LIMIT) {
                showThrottleUI();
            }

            // Always attach the event listener, but check throttle when clicked
            const startScanBtn = document.getElementById("startScan");
            if (startScanBtn) {
                startScanBtn.addEventListener("click", async () => {
                    // Re-check environment at click time
                    const currentEnv = await checkEnvironment();
                    
                    // Re-check throttle at click time
                    chrome.storage.local.get(["scanRunTimestamps"], (clickData) => {
                        const clickNow = Date.now();
                        const clickTimestamps = (clickData.scanRunTimestamps || []).filter(ts => clickNow - ts < SCAN_WINDOW_MS);
                        
                        if (clickTimestamps.length >= SCAN_LIMIT) {
                            showThrottleUI();
                            return;
                        }
                        
                        clickTimestamps.push(Date.now());
                        chrome.storage.local.set({ scanRunTimestamps: clickTimestamps });
                        startScan(currentEnv);
                    });
                });
            }
        });

        // Go to Medium
        document.getElementById("goToMedium")?.addEventListener("click", () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.update(tabs[0].id, { url: "https://medium.com/me/following" });
                
                // Wait for navigation to complete, then re-check environment
                setTimeout(async () => {
                    try {
                        const env = await checkEnvironment();
                        initializeUI(env);
                    } catch (e) {
                        // Silent fail in production
                    }
                }, 2000);
            });
        });

        // Export CSV
        document.getElementById("exportCsv")?.addEventListener("click", () => {
            exportCsv();
        });

        // Help Toggle with secret dev bypass
        let helpClickCount = 0;
        let helpClickTimer = null;

        document.getElementById("helpButton")?.addEventListener("click", () => {
            helpClickCount++;
            
            if (helpClickCount === 1) {
                helpClickTimer = setTimeout(() => {
                    helpClickCount = 0;
                }, 2000);
            }
            
            if (helpClickCount === 3) {
                // Secret dev bypass triggered
                clearTimeout(helpClickTimer);
                helpClickCount = 0;
                
                chrome.storage.local.remove(["scanRunTimestamps"], () => {
                    // Re-check environment and initialize UI properly
                    checkEnvironment().then((currentEnv) => {
                        initializeUI(currentEnv);
                        document.getElementById("status").textContent = "🔓 DEV: Throttle reset.";
                    }).catch((e) => {
                        document.getElementById("status").textContent = "🔓 DEV: Throttle reset. Please reload popup.";
                    });
                });
            }
            
            // Original help toggle functionality
            const helpSection = document.getElementById("helpSection");
            helpSection.style.display = helpSection.style.display === "none" ? "block" : "none";
        });

        // Close Button
        document.getElementById("closeButton")?.addEventListener("click", () => {
            window.close();
        });

        // View Last Results
        document.getElementById("viewLast")?.addEventListener("click", () => {
            chrome.storage.local.get(["lastResults", "lastResultsTimestamp"], (data) => {
                const resultsContainer = document.getElementById("results");
                const startScanBtn = document.getElementById("startScan");
                const clearDataBtn = document.getElementById("clearData");
                const status = document.getElementById("status");

                if (data.lastResults && data.lastResultsTimestamp) {
                    const date = new Date(data.lastResultsTimestamp);
                    resultsContainer.innerHTML = `<p><b>Previous Results from:</b> ${date.toLocaleString()}</p>` + data.lastResults;
                    startScanBtn.style.display = "none";
                    clearDataBtn.style.display = "inline-block";
                    status.textContent = "⚠️ Viewing previous results. Export or clear before rescanning.";
                } else {
                    resultsContainer.textContent = "No previous results found.";
                    status.textContent = "ℹ️ No stored results. Please scan first.";
                }
            });
        });

    } catch (e) {
        const resultsContainer = document.getElementById("results");
        if (resultsContainer) {
            resultsContainer.textContent = "Error loading extension. Please refresh and try again.";
        }
    }
});