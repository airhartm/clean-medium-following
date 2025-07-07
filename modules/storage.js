export function saveLastResults(htmlString) {
    chrome.storage.local.set({ lastResults: htmlString });
}

export function loadLastResults(callback) {
    chrome.storage.local.get(["lastResults"], (data) => {
        callback(data.lastResults || null);
    });
}