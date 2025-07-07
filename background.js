chrome.runtime.onInstalled.addListener(() => {
    console.log("✅ NeatFreak service worker active.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "followedUsers") {
        chrome.storage.local.set({ followedUsers: message.data }, () => {
            console.log(`✅ Saved ${message.data.length} followed users in background.`);
        });
    }
});