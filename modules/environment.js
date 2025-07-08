// modules/environment.js - NeatFreak for Medium
// Environment detection for current tab

/**
 * Check current environment (Medium site and specific pages)
 */
export async function checkEnvironment() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = tabs[0]?.url || "";
            const isMedium = url.includes("medium.com");

            // Detect Following page for both /@username/following and /me/following
            const followingRegex = /^https:\/\/medium\.com\/(@[^\/?#]+|me)\/following\/?$/;
            const isFollowingPage = followingRegex.test(url);

            resolve({
                isMedium,
                isFollowingPage,
                currentUrl: url
            });
        });
    });
}