// modules/environment.js

export async function checkEnvironment() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = tabs[0]?.url || "";
            const isMedium = url.includes("medium.com");

            // Detect Following page for both /@username/following and /me/following:
            const followingRegex = /^https:\/\/medium\.com\/(@[^\/?#]+|me)\/following\/?$/;
            const isFollowingPage = followingRegex.test(url);

            console.log("🌎 URL checked:", url, "| isMedium:", isMedium, "| isFollowingPage:", isFollowingPage);

            resolve({
                isMedium,
                isFollowingPage,
                currentUrl: url
            });
        });
    });
}