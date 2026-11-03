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

    async function getRandomCyberFact() {
        // Local curated cybersecurity facts dataset
        try {
            const response = await fetch('data/cyber_facts.json');
            const facts = await response.json();
            if (Array.isArray(facts) && facts.length > 0) {
                const randomIndex = Math.floor(Math.random() * facts.length);
                return facts[randomIndex];
            }
        } catch (e) {
            console.error("Failed to load local cyber facts:", e);
        }

        return "Over 90% of cyber attacks and data breaches start with a phishing email targeting an individual.";
    }

    // Skip the typing animation: on repeat visits, for reduced-motion users, or on any key/tap
    const screen = document.getElementById("terminal-screen");
    let seenBefore = false;
    try { seenBefore = localStorage.getItem("boot_seen") === "1"; } catch (e) {}
    if (seenBefore || window.matchMedia("(prefers-reduced-motion: reduce)").matches) bootSkipped = true;

    function skipBoot() { bootSkipped = true; }
    const skipEvents = ["keydown", "pointerdown"];
    skipEvents.forEach(ev => document.addEventListener(ev, skipBoot));

    // Screen readers: hold announcements until the boot text is complete
    if (screen) screen.setAttribute("aria-busy", "true");

    // Start Boot Sequence
    function bootSequence() {
        ensureReady(async () => {
            const timeStr = new Date().toLocaleTimeString();
            const fact = await getRandomCyberFact();

            if (!bootSkipped) print(`<span class="boot-hint">Press any key or tap to skip...</span>`);

            typeText(`[${timeStr}] Initializing Neural Link...`, () => {
                pause(() => {
                    typeText(`[${new Date().toLocaleTimeString()}] Decrypting Portfolio Data...`, () => {
                        pause(() => {
                            print(`[${new Date().toLocaleTimeString()}] <span class='accent'>[ SUCCESS ]</span> Secure connection established.`);
                            print("");
                            print(`<div class="stack" style="margin-bottom: 8px;"><span class="accent">[ CYBERSECURITY FACT OF THE DAY ]</span><br>${escapeHtml(fact)}</div>`);
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
            "Type 'help' or tap a command below to begin your exploration."
        ], () => {
            document.querySelectorAll(".boot-hint").forEach(el => el.parentElement.remove());
            skipEvents.forEach(ev => document.removeEventListener(ev, skipBoot));
            try { localStorage.setItem("boot_seen", "1"); } catch (e) {}
            if (screen) screen.setAttribute("aria-busy", "false");
            createInput(); // Regular terminal mode
        });
    };

    // Initialize with a slight delay
    setTimeout(bootSequence, bootSkipped ? 0 : 500);
});
