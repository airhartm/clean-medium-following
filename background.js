// background.js - NeatFreak for Medium
// Service worker for Chrome extension

chrome.runtime.onInstalled.addListener(() => {
    // Extension installed successfully
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "followedUsers") {
        chrome.storage.local.set({ followedUsers: message.data });
    }
});