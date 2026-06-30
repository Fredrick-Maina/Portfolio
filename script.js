document.addEventListener("DOMContentLoaded", () => {
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
            typeText("Initializing Neural Link...", () => {
                setTimeout(() => {
                    typeText("Decrypting Portfolio Data...", () => {
                        setTimeout(() => {
                            print("<span class='accent'>[ SUCCESS ]</span> Secure connection established.");
                            print("");
                            askName();
                        }, 500);
                    }, 30);
                }, 600);
            }, 30);
        });
    }

    function askName() {
        setTimeout(() => {
            print("Please identify yourself to continue.");
            createInput(true); // Identity mode
        }, 400);
    }

    window.finalizeBoot = (name) => {
        const userName = name || "Guest User";
        print("");
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