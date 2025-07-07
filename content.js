// content.js for NeatFreak
// Auto-scroll, extract followed users, and send to background for stable storage

(async function autoScrollAndExtract() {
    const scrollStep = 300;
    const delay = 400;
    const maxAttempts = 30;
    let lastUserCount = 0;

    console.log("🔄 Starting auto-scroll to load all followed users...");

    for (let i = 0; i < maxAttempts; i++) {
        window.scrollBy(0, scrollStep);
        await new Promise(resolve => setTimeout(resolve, delay));

        const currentUsers = document.querySelectorAll('a[href*="/@"]').length;
        console.log(`Scroll iteration ${i + 1}: ${currentUsers} user links found.`);

        if (currentUsers === lastUserCount) {
            console.log(`✅ Auto-scroll complete after ${i + 1} iterations with ${currentUsers} user links loaded.`);
            break;
        }
        lastUserCount = currentUsers;
    }

    console.log("🔍 Extracting followed user URLs...");
    const followedUsers = new Set();
    document.querySelectorAll('a[href*="/@"]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const cleanHref = href.split('?')[0].split('#')[0];
        if (/\/followers$/.test(cleanHref) || /\/following$/.test(cleanHref)) return;
        const handleMatch = cleanHref.match(/\/(@[a-zA-Z0-9_.-]+)/);
        if (handleMatch && handleMatch[1]) {
            followedUsers.add(`https://medium.com/${handleMatch[1]}`);
        }
    });

    const followedUsersArray = Array.from(followedUsers);
    console.log(`✅ Extracted ${followedUsersArray.length} clean followed user URLs:`, followedUsersArray);

try {
    console.log("📦 Attempting to save followedUsers to storage:", followedUsersArray);
    chrome.storage.local.set({ followedUsers: followedUsersArray }, () => {
        console.log("✅ Followed users saved to storage. Verifying...");
        chrome.storage.local.get("followedUsers", data => {
            if (data.followedUsers && data.followedUsers.length > 0) {
                console.log("✅ Verified followedUsers count:", data.followedUsers.length);
                console.log("✅ Verified followedUsers array:", data.followedUsers);
            } else {
                console.error("❌ Verification failed: followedUsers is empty or undefined in storage.");
            }
        });
    });
} catch (e) {
    console.error("❌ Error during chrome.storage.local.set in content.js:", e);
}

})();