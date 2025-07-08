// modules/scanner.js - NeatFreak for Medium
// Core scanning functionality for analyzing Medium followers

import { saveLastResults } from "./storage.js";

const DEBUG = false; // Production build
const FREE_USER_LIMIT = 250;
const BATCH_SIZE = 10;
const BATCH_DELAY = 3000; // 3 seconds between batches
const REQUEST_DELAY = 1500; // 1.5 seconds between requests

/**
 * Fetch user RSS feed and extract posting activity data
 */
async function fetchUserActivity(profileUrl) {
    try {
        const url = new URL(profileUrl);
        const path = url.pathname.split('?')[0];
        let rssUrl = "";

        if (path.startsWith("/@")) {
            const username = path.split("/")[1];
            rssUrl = `https://medium.com/feed/@${username}`;
        } else {
            const slug = path.split("/")[1];
            rssUrl = `https://medium.com/feed/${slug}`;
        }

        const response = await fetch(rssUrl);
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const items = xml.querySelectorAll("item");

        let posts90d = 0;
        let lastPostDate = null;
        let authorName = null;
        const now = new Date();

        // Extract clean author name from RSS feed
        const channelTitle = xml.querySelector("channel title");
        if (channelTitle) {
            let rawName = channelTitle.textContent.trim();
            authorName = rawName
                .replace(/^Stories by\s+/i, '')
                .replace(/\s+–\s+Medium$/i, '')
                .replace(/\s+on\s+Medium$/i, '')
                .trim();
        }

        // Analyze posting activity
        items.forEach(item => {
            const pubDate = new Date(item.querySelector("pubDate").textContent);
            if (!lastPostDate || pubDate > lastPostDate) lastPostDate = pubDate;
            if ((now - pubDate) / (1000 * 60 * 60 * 24) <= 90) posts90d++;
        });

        return { lastPostDate, posts90d, authorName };
    } catch (e) {
        return { lastPostDate: null, posts90d: 0, authorName: null };
    }
}

/**
 * Wait for followed users data to be available in storage
 */
export function waitForFollowedUsers(timeout = 5000, interval = 500) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const maxAge = 1000 * 60 * 60 * 24 * 3; // 3 days

        const check = () => {
            chrome.storage.local.get(["followedUsers", "followedUsersTimestamp"], (data) => {
                const now = Date.now();
                const age = data.followedUsersTimestamp ? now - data.followedUsersTimestamp : null;

                if (data.followedUsers && data.followedUsers.length > 0) {
                    if (age !== null && age > maxAge) {
                        // Clear stale data
                        chrome.storage.local.remove(["followedUsers", "followedUsersTimestamp"], () => {
                            reject(new Error("⚠️ Followed users data is stale. Please refresh your Following page and reopen NeatFreak to rescan."));
                        });
                    } else {
                        resolve(data.followedUsers);
                    }
                } else if (Date.now() - start >= timeout) {
                    reject(new Error("❌ Timed out waiting for followed users in storage."));
                } else {
                    setTimeout(check, interval);
                }
            });
        };
        check();
    });
}

/**
 * Main scanning function with batch processing
 */
export async function startScan(env) {
    const resultsContainer = document.getElementById("results");

    if (!env.isMedium || !env.isFollowingPage) {
        updateStatus("❌ Please navigate to your Medium Following page to scan.");
        return;
    }

    updateStatus("🔄 Preparing scan...");
    resultsContainer.innerHTML = "<p>🔄 Scanning your connections, this may take up to a minute...</p>";

    let followedUsers = [];
    try {
        followedUsers = await waitForFollowedUsers(10000, 500);
    } catch (e) {
        updateStatus(e.message);
        return;
    }

    if (!followedUsers || followedUsers.length === 0) {
        updateStatus("❌ No followed users found. Please refresh your Following page and try again.");
        return;
    }

    // Apply free version limit
    const totalUsers = followedUsers.length;
    const usersToProcess = followedUsers.slice(0, FREE_USER_LIMIT);
    const limitMessage = totalUsers > FREE_USER_LIMIT ? 
        ` (processing first ${FREE_USER_LIMIT} of ${totalUsers} users - upgrade for unlimited scanning)` : "";

    updateStatus(`🔄 Scanning ${usersToProcess.length} users${limitMessage}...`);

    const results = [];
    let processed = 0;

    // Process users in batches to respect server limits
    for (let batchStart = 0; batchStart < usersToProcess.length; batchStart += BATCH_SIZE) {
        const batch = usersToProcess.slice(batchStart, Math.min(batchStart + BATCH_SIZE, usersToProcess.length));
        const batchNum = Math.floor(batchStart / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(usersToProcess.length / BATCH_SIZE);

        updateStatus(`🔄 Processing batch ${batchNum}/${totalBatches} (${processed + 1}-${processed + batch.length} of ${usersToProcess.length})...`);

        // Process current batch
        for (const profileUrl of batch) {
            processed++;
            updateStatus(`🔍 Scanning ${processed} of ${usersToProcess.length}... (${Math.round((processed/usersToProcess.length) * 100)}%)${limitMessage}`);

            const { lastPostDate, posts90d, authorName } = await fetchUserActivity(profileUrl);
            const daysAgo = lastPostDate ? daysSince(lastPostDate) : "N/A";
            const lastPost = lastPostDate ? lastPostDate.toISOString().split("T")[0] : "None";

            let activity = "⚫ Quiet";
            if (daysAgo !== "N/A") {
                if (daysAgo <= 30) activity = "🟩 Active";
                else if (daysAgo <= 90) activity = "🟨 Occasional";
            }

            results.push({ profileUrl, lastPost, posts90d, activity, authorName });

            // Respectful delay between requests
            if (processed < usersToProcess.length) {
                await new Promise(res => setTimeout(res, REQUEST_DELAY));
            }
        }

        // Delay between batches
        if (batchStart + BATCH_SIZE < usersToProcess.length) {
            updateStatus(`⏸️ Waiting ${BATCH_DELAY/1000}s between batches to respect Medium's servers...`);
            await new Promise(res => setTimeout(res, BATCH_DELAY));
        }
    }

    // Sort by activity level, then by recency
    results.sort((a, b) => {
        const activityPriority = {
            "🟩 Active": 1,
            "🟨 Occasional": 2,
            "⚫ Quiet": 3
        };
        
        const aPriority = activityPriority[a.activity] || 4;
        const bPriority = activityPriority[b.activity] || 4;
        
        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }
        
        if (a.lastPost === "None" && b.lastPost === "None") return 0;
        if (a.lastPost === "None") return 1;
        if (b.lastPost === "None") return -1;
        return new Date(b.lastPost) - new Date(a.lastPost);
    });

    // Generate results table
    let html = `
        <table>
            <tr><th>Author</th><th>Last Post</th><th>Posts (90 days)</th><th>Activity</th></tr>`;
    results.forEach(r => {
        const displayName = r.authorName || r.profileUrl.match(/medium\.com\/(@[a-zA-Z0-9_.-]+)/)?.[1] || r.profileUrl;
        html += `<tr>
            <td><a href="${r.profileUrl}" target="_blank">${displayName}</a></td>
            <td>${r.lastPost}</td>
            <td>${r.posts90d}</td>
            <td>${r.activity}</td>
        </tr>`;
    });
    html += `</table>`;

    // Add upgrade message if user hit the limit
    if (totalUsers > FREE_USER_LIMIT) {
        html += `<p style="margin-top: 15px; padding: 10px; background-color: #f0f8ff; border: 1px solid #0066cc; border-radius: 5px;">
            <strong>📈 Want to scan all ${totalUsers} users?</strong><br>
            Upgrade to NeatFreak Pro for unlimited scanning, advanced filtering, and priority support.
            <a href="#" style="color: #0066cc;">Learn more about Pro features</a>
        </p>`;
    }

    resultsContainer.innerHTML = html;

    // Save results for export
    chrome.storage.local.set({
        lastResults: html,
        lastResultsTimestamp: Date.now()
    });

    const completionMessage = totalUsers > FREE_USER_LIMIT ? 
        `✅ Scan complete: ${usersToProcess.length} of ${totalUsers} profiles checked (free limit)` :
        `✅ Scan complete: ${usersToProcess.length} profiles checked`;
    
    updateStatus(completionMessage);

    // Update UI state after completion
    const startScanBtn = document.getElementById("startScan");
    const clearDataBtn = document.getElementById("clearData");
    const exportCsvBtn = document.getElementById("exportCsv");
    const status = document.getElementById("status");

    if (startScanBtn) startScanBtn.style.display = "none";
    if (clearDataBtn) clearDataBtn.style.display = "inline-block";
    if (exportCsvBtn) exportCsvBtn.style.display = "inline-block";
    if (status) status.textContent = completionMessage;
}

/**
 * Calculate days since a given date
 */
function daysSince(date) {
    const now = new Date();
    return Math.floor((now - date) / (1000 * 60 * 60 * 24));
}

/**
 * Update status display in popup
 */
function updateStatus(message) {
    const status = document.getElementById("status");
    if (status) status.textContent = message;
}