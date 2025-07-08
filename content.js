// content.js for NeatFreak
// Auto-scroll, extract followed users, and send to background for stable storage

// ================================
// AUTO-CLICK "SEE ALL" FUNCTION
// ================================
async function autoClickSeeAll(timeout = 10000) {
    return new Promise((resolve) => {
        const interval = 500;
        const maxTries = timeout / interval;
        let tries = 0;

        console.log("🔍 Looking for 'See all' button...");

        const clickInterval = setInterval(() => {
            tries++;
            
            // Look for any element containing "See all" text
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
                console.log("✅ 'See all' button found, clicking...");
                try {
                    seeAllButton.click();
                    clearInterval(clickInterval);
                    setTimeout(() => {
                        resolve(true);
                    }, 2000); // Wait for content to load
                } catch (e) {
                    console.error("❌ Error clicking 'See all' button:", e);
                }
            } else if (tries >= maxTries) {
                console.warn("⚠️ 'See all' button not found within timeout.");
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
    const scrollStep = 200; // Reduced for smoother scrolling
    const delay = 600; // Increased delay to be more respectful
    const maxAttempts = 40; // Increased to compensate for smaller steps
    let lastUserCount = 0;
    let stableCount = 0; // Track how many times count stayed the same

    console.log("🔄 Starting auto-scroll to load all followed users...");

    // Scroll through the page to load all users
    for (let i = 0; i < maxAttempts; i++) {
        // Use smooth scrolling instead of instant jumping
        window.scrollBy({ top: scrollStep, behavior: 'smooth' });
        await new Promise(resolve => setTimeout(resolve, delay));

        const currentUsers = document.querySelectorAll('a[href*="/@"]').length;

        if (currentUsers === lastUserCount) {
            stableCount++;
            // Wait for 3 stable iterations before concluding we're done
            if (stableCount >= 3) {
                console.log(`✅ Auto-scroll complete after ${i + 1} iterations with ${currentUsers} user links loaded.`);
                break;
            }
        } else {
            stableCount = 0; // Reset if count changed
        }
        lastUserCount = currentUsers;
    }

    // Extract user URLs from the page
    console.log("🔍 Extracting followed user URLs...");
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
    console.log(`✅ Extracted ${followedUsersArray.length} followed users`);

    // Save to storage with verification
    try {
        chrome.storage.local.set({ 
            followedUsers: followedUsersArray,
            followedUsersTimestamp: Date.now()
        }, () => {
            console.log("✅ Followed users saved to storage");
            
            // Verify the save worked
            chrome.storage.local.get("followedUsers", data => {
                if (data.followedUsers && data.followedUsers.length > 0) {
                    console.log("✅ Verified storage:", data.followedUsers.length, "users");
                } else {
                    console.error("❌ Storage verification failed");
                }
            });
        });
    } catch (e) {
        console.error("❌ Error saving to storage:", e);
    }
}

// ================================
// MAIN EXECUTION
// ================================
(async () => {
    // First try to auto-click "See all"
    const clicked = await autoClickSeeAll();
    
    // If auto-click failed, alert user
    if (!clicked) {
        alert("⚠️ Please click 'See all' on your Following page to let NeatFreak scan your full list.");
    }
    
    // Then scroll and extract users
    await autoScrollAndExtract();
})();