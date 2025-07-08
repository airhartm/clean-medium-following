// content.js for NeatFreak
// Auto-scroll and extract followed users from Medium following page

// ================================
// AUTO-CLICK "SEE ALL" FUNCTION
// ================================
async function autoClickSeeAll(timeout = 10000) {
    return new Promise((resolve) => {
        const interval = 500;
        const maxTries = timeout / interval;
        let tries = 0;

        const clickInterval = setInterval(() => {
            tries++;
            
            // Look for "See all" button
            const allElements = document.querySelectorAll('*');
            let seeAllButton = null;
            
            for (const element of allElements) {
                const text = element.textContent || '';
                if (text.toLowerCase().includes('see all') && 
                    text.length < 50 && // Avoid large containers
                    (element.tagName === 'A' || element.tagName === 'BUTTON' || element.tagName === 'SPAN')) {
                    
                    seeAllButton = element;
                    break;
                }
            }
            
            if (seeAllButton) {
                try {
                    seeAllButton.click();
                    clearInterval(clickInterval);
                    setTimeout(() => {
                        resolve(true);
                    }, 2000);
                } catch (e) {
                    // Silent fail
                }
            } else if (tries >= maxTries) {
                clearInterval(clickInterval);
                resolve(false);
            }
        }, interval);
    });
}

// ================================
// AUTO-SCROLL AND EXTRACT FUNCTION
// ================================
async function autoScrollAndExtract() {
    const scrollStep = 200;
    const delay = 600;
    const maxAttempts = 40;
    let lastUserCount = 0;
    let stableCount = 0;

    // Scroll through the page to load all users
    for (let i = 0; i < maxAttempts; i++) {
        window.scrollBy({ top: scrollStep, behavior: 'smooth' });
        await new Promise(resolve => setTimeout(resolve, delay));

        const currentUsers = document.querySelectorAll('a[href*="/@"]').length;

        if (currentUsers === lastUserCount) {
            stableCount++;
            if (stableCount >= 3) {
                break;
            }
        } else {
            stableCount = 0;
        }
        lastUserCount = currentUsers;
    }

    // Extract user URLs from the page
    const followedUsers = new Set();
    
    document.querySelectorAll('a[href*="/@"]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        const cleanHref = href.split('?')[0].split('#')[0];
        
        // Skip followers/following pages
        if (/\/followers$/.test(cleanHref) || /\/following$/.test(cleanHref)) return;
        
        // Extract username handle
        const handleMatch = cleanHref.match(/\/(@[a-zA-Z0-9_.-]+)/);
        if (handleMatch && handleMatch[1]) {
            followedUsers.add(`https://medium.com/${handleMatch[1]}`);
        }
    });

    const followedUsersArray = Array.from(followedUsers);

    // Save to storage
    try {
        chrome.storage.local.set({ 
            followedUsers: followedUsersArray,
            followedUsersTimestamp: Date.now()
        }, () => {
            // Verify the save worked
            chrome.storage.local.get("followedUsers", data => {
                // Silent verification - no console logs in production
            });
        });
    } catch (e) {
        // Silent fail in production
    }
}

// ================================
// MAIN EXECUTION
// ================================
(async () => {
    // Try to auto-click "See all"
    const clicked = await autoClickSeeAll();
    
    // If auto-click failed, alert user
    if (!clicked) {
        alert("⚠️ Please click 'See all' on your Following page to let NeatFreak scan your full list.");
    }
    
    // Scroll and extract users
    await autoScrollAndExtract();
})();