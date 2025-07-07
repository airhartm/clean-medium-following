const DEBUG = true; // Toggle false for release builds
 
import { checkEnvironment } from "./modules/environment.js";
import { initializeUI, checkAndPurgeStaleData } from "./modules/ui.js";
import { startScan } from "./modules/scanner.js";
import { exportCsv } from "./modules/exporter.js";

document.getElementById("clearData").addEventListener("click", () => {
    chrome.storage.local.remove(["lastResults", "lastResultsTimestamp"], () => {
        const resultsContainer = document.getElementById("results");
        resultsContainer.innerHTML = "";
        document.getElementById("status").textContent = "✅ Data cleared. You may now scan again.";
        document.getElementById("startScan").style.display = "inline-block";
        document.getElementById("clearData").style.display = "none";
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    if (DEBUG) console.log("🟢 NeatFreak: DOMContentLoaded triggered");

    if (window.isViewingLastResults) {
        console.log("🔹 Skipping UI reset, viewing last results.");
        return;
    }

    try {
        const env = await checkEnvironment();
        console.log("✅ Environment detected:", env);

        initializeUI(env);
        checkAndPurgeStaleData();

        const goToMediumBtn = document.getElementById("goToMedium");
        if (goToMediumBtn) {
            goToMediumBtn.addEventListener("click", () => {
                console.log("🌐 Go to Medium clicked.");
                chrome.tabs.create({ url: "https://medium.com/me/following" });
                window.close();
            });
        }

        const startScanBtn = document.getElementById("startScan");
        if (startScanBtn) {
            startScanBtn.addEventListener("click", () => {
                console.log("▶️ Start Scan clicked.");
                startScan(env);
            });
        }

        const exportCsvBtn = document.getElementById("exportCsv");
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener("click", () => {
                console.log("💾 Export CSV clicked.");
                exportCsv();
            });
        }

        const helpBtn = document.getElementById("helpButton");
        if (helpBtn) {
            helpBtn.addEventListener("click", () => {
                const helpSection = document.getElementById("helpSection");
                helpSection.style.display = helpSection.style.display === "none" ? "block" : "none";
                console.log("❓ Help toggled:", helpSection.style.display);
            });
        }

        const closeBtn = document.getElementById("closeButton");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                console.log("❌ Close clicked.");
                window.close();
            });
        }

        const viewLastBtn = document.getElementById("viewLast");
        if (viewLastBtn) {
            viewLastBtn.addEventListener("click", () => {
                console.log("📄 View Last Results clicked.");
                window.isViewingLastResults = true;
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
                        status.textContent = "⚠️ Previous scan data found. Clear before rescanning. Recommended: scan only once daily.";
                    } else {
                        startScanBtn.style.display = "inline-block";
                        clearDataBtn.style.display = "none";
                        status.textContent = "✅ Ready to scan your Medium Following list.";
                    }
                });
            });
        }

    } catch (e) {
        console.error("❌ Error initializing popup:", e);
        const resultsContainer = document.getElementById("results");
        if (resultsContainer) {
            resultsContainer.textContent = "Error. Please reload the extension.";
        }
    }
});