const DEBUG = true; // Toggle false for release builds
 
import { checkEnvironment } from "./modules/environment.js";
import { initializeUI, checkAndPurgeStaleData } from "./modules/ui.js";
import { startScan } from "./modules/scanner.js";
import { exportCsv } from "./modules/exporter.js";

document.addEventListener("DOMContentLoaded", async () => {
    if (DEBUG) console.log("🟢 NeatFreak: DOMContentLoaded triggered");

    try {
        const env = await checkEnvironment();
        console.log("✅ Environment detected:", env);

        initializeUI(env);
        checkAndPurgeStaleData();

        const goToMediumBtn = document.getElementById("goToMedium");
        if (goToMediumBtn) {
            goToMediumBtn.addEventListener("click", () => {
                console.log("🌐 Go to Medium clicked.");
                chrome.tabs.create({ url: "https://medium.com" });
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
                chrome.storage.local.get(["lastResults"], (data) => {
                    const resultsContainer = document.getElementById("results");
                    if (data.lastResults) {
                        resultsContainer.innerHTML = data.lastResults;
                    } else {
                        resultsContainer.textContent = "No previous results found.";
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