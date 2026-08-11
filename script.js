document.addEventListener("DOMContentLoaded", () => {
    // Live Clock Update
    function updateClock() {
        const clockEl = document.getElementById("live-clock");
        if (clockEl) clockEl.textContent = new Date().toLocaleTimeString();
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Fail-safe: ensure terminal logic is loaded
    function ensureReady(callback) {
        if (typeof typeText === "function" && typeof createInput === "function") {
            callback();
        } else {
            setTimeout(() => ensureReady(callback), 100);
        }
    }

    // Start Boot Sequence
    function bootSequence() {
        ensureReady(() => {
            const timeStr = new Date().toLocaleTimeString();
            typeText(`[${timeStr}] Initializing Neural Link...`, () => {
                setTimeout(() => {
                    typeText(`[${new Date().toLocaleTimeString()}] Decrypting Portfolio Data...`, () => {
                        setTimeout(() => {
                            print(`[${new Date().toLocaleTimeString()}] <span class='accent'>[ SUCCESS ]</span> Secure connection established.`);
                            print("");
                            window.finalizeBoot("Guest User");
                        }, 500);
                    }, 30);
                }, 600);
            }, 30);
        });
    }

    window.finalizeBoot = (userName) => {
        print(`Welcome to my portfolio, <span class="accent">${escapeHtml(userName)}</span>.`);
        print("");
        
        typeIntroLines([
            "Hi, I'm Fredrick Maina.",
            "Ethical Hacker | Penetration Tester | Cybersecurity Professional | Backend Developer",
            "Type 'help' to begin your exploration."
        ], () => {
            createInput(); // Regular terminal mode
        });
    };

    // Initialize with a slight delay
    setTimeout(bootSequence, 500);
});