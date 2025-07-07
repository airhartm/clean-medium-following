export function exportCsv() {
    chrome.storage.local.get(["lastResults"], (data) => {
        if (!data.lastResults) return;
        const rows = [["Username", "Last Post"]];
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.lastResults, "text/html");
        const tableRows = doc.querySelectorAll("tr");
        tableRows.forEach((tr, index) => {
            if (index === 0) return;
            const cells = tr.querySelectorAll("td");
            const username = cells[0]?.textContent || "";
            const lastPost = cells[1]?.textContent || "";
            rows.push([username, lastPost]);
        });
        const csvContent = rows.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "neatfreak_medium_following.csv";
        a.click();
        URL.revokeObjectURL(url);
    });
}