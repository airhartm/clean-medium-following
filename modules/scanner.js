// modules/scanner.js - NeatFreak for Medium
// Scans stored followed users, fetches user RSS feeds, tracks progress with live counter, polite throttling, color-coded output.

import { saveLastResults } from "./storage.js";

const DEBUG = true; // Toggle false for release

/**
 * Wait for followedUsers array to be available in storage.
 */
export function waitForFollowedUsers(timeout = 5000, interval = 500) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const maxAge = 1000 * 60 * 60 * 24 * 3; // 3 days in ms

        const check = () => {
            chrome.storage.local.get(["followedUsers", "followedUsersTimestamp"], (data) => {
                const now = Date.now();
                const age = data.followedUsersTimestamp ? now - data.followedUsersTimestamp : null;

                if (data.followedUsers && data.followedUsers.length > 0) {
                    if (age !== null && age > maxAge) {
                        // Stale data detected
                        chrome.storage.local.remove(["followedUsers", "followedUsersTimestamp"], () => {
                            console.log("🧹 Stale followedUsers data cleared after 3 days.");
                            reject(new Error("⚠️ Followed users data is stale. Please refresh your Following page and reopen NeatFreak to rescan."));
                        });
                    } else {
                        if (DEBUG) console.log("✅ Followed users loaded for scan:", data.followedUsers.length);
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
 * Start scan using environment validation.
 */
export async function startScan(env) {
    const resultsContainer = document.getElementById("results");
    const statusElem = document.getElementById("status");

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

    const total = followedUsers.length;
    let count = 0;
    const results = [];

    for (const profileUrl of followedUsers) {
        count++;
        updateStatus(`🔍 Scanning ${count} of ${total}...`);

        const { lastPostDate, posts90d } = await fetchUserActivity(profileUrl);
        const daysAgo = lastPostDate ? daysSince(lastPostDate) : "N/A";
        const lastPost = lastPostDate ? lastPostDate.toISOString().split("T")[0] : "None";

        let activity = "⚫ Quiet";
        if (daysAgo !== "N/A") {
            if (daysAgo <= 30) activity = "🟩 Active";
            else if (daysAgo <= 90) activity = "🟨 Occasional";
        }

        results.push({ profileUrl, lastPost, posts90d, activity });

        await new Promise(res => setTimeout(res, 700)); // polite throttling
    }

    // Sort by most recent activity
    results.sort((a, b) => {
        if (a.lastPost === "None") return 1;
        if (b.lastPost === "None") return -1;
        return new Date(b.lastPost) - new Date(a.lastPost);
    });

    // Build HTML table for display
    let html = `
        <table>
            <tr><th>Username</th><th>Last Post</th><th>Posts (90d)</th><th>Activity</th></tr>`;
    results.forEach(r => {
        const username = r.profileUrl.match(/medium\.com\/(@[a-zA-Z0-9_.-]+)/)?.[1] || r.profileUrl;
        html += `<tr>
            <td><a href="${r.profileUrl}" target="_blank">${username}</a></td>
            <td>${r.lastPost}</td>
            <td>${r.posts90d}</td>
            <td>${r.activity}</td>
        </tr>`;
    });
    html += `</table>`;

    resultsContainer.innerHTML = html;

    // Save results for CSV export
    chrome.storage.local.set({ lastResults: html }, () => {
        if (DEBUG) console.log("✅ Results saved for CSV export.");
    });

    updateStatus(`✅ Scan complete: ${total} profiles checked.`);
    if (DEBUG) console.log("✅ Scan complete with results:", results);
}

/**
 * Fetch user RSS feed and extract last post date and 90-day post count.
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
        const now = new Date();

        items.forEach(item => {
            const pubDate = new Date(item.querySelector("pubDate").textContent);
            if (!lastPostDate || pubDate > lastPostDate) lastPostDate = pubDate;
            if ((now - pubDate) / (1000 * 60 * 60 * 24) <= 90) posts90d++;
        });

        return { lastPostDate, posts90d };
    } catch (e) {
        console.error(`❌ Error fetching feed for ${profileUrl}:`, e);
        return { lastPostDate: null, posts90d: 0 };
    }
}

/**
 * Utility: Calculate days since a date.
 */
function daysSince(date) {
    const now = new Date();
    return Math.floor((now - date) / (1000 * 60 * 60 * 24));
}

/**
 * Utility: Update status display in popup.
 */
function updateStatus(message) {
    const status = document.getElementById("status");
    if (status) status.textContent = message;
}