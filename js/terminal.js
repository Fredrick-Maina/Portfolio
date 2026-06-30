function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

let currentDir = "/";
let isAskingName = false;
let currentInput = null;

// Command history tracking
let history = [];
let historyIndex = -1;

function addToHistory(cmd) {
    if (!cmd) return;
    history.push(cmd);
    historyIndex = history.length;
}

function getPrevHistory() {
    if (historyIndex > 0) historyIndex--;
    return history[historyIndex] || "";
}

function getNextHistory() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        return history[historyIndex] || "";
    }
    historyIndex = history.length;
    return "";
}

// Global focus handler
document.addEventListener("click", () => {
    if (currentInput) currentInput.focus();
});

function print(html, type = "output-line") {
    const targetScreen = document.getElementById("terminal-screen");
    const targetWrapper = document.getElementById("terminal-wrapper");
    if (!targetScreen || !targetWrapper) return;

    const div = document.createElement("div");
    div.className = `line ${type}`;
    div.innerHTML = html;
    targetScreen.appendChild(div);
    targetWrapper.scrollTop = targetWrapper.scrollHeight;
}

function clear() {
    const targetScreen = document.getElementById("terminal-screen");
    if (targetScreen) targetScreen.innerHTML = "";
}

function createInput(askingName = false) {
    const targetScreen = document.getElementById("terminal-screen");
    const targetWrapper = document.getElementById("terminal-wrapper");
    if (!targetScreen || !targetWrapper) return;

    isAskingName = askingName;
    
    // Cleanup any orphaned inputs
    const existing = document.querySelectorAll(".input-line");
    existing.forEach(el => {
        const inp = el.querySelector("input");
        if (inp) {
            const val = inp.value;
            const prompt = el.querySelector(".prompt") ? el.querySelector(".prompt").textContent : "";
            el.innerHTML = `<span class="prompt">${escapeHtml(prompt)}</span> <span class="cmd-text">${escapeHtml(val)}</span>`;
        }
    });

    const line = document.createElement("div");
    line.className = "input-line";

    const prompt = document.createElement("span");
    prompt.className = "prompt";
    
    if (isAskingName) {
        prompt.textContent = "Identity Verification > ";
    } else {
        const displayDir = currentDir === "/" ? "~" : `~${currentDir.replace(/\/$/, "")}`;
        prompt.textContent = `fred@portfolio:${displayDir}$`;
    }

    const input = document.createElement("input");
    input.type = "text";
    input.autocomplete = "off";
    input.spellcheck = false;

    line.appendChild(prompt);
    line.appendChild(input);
    targetScreen.appendChild(line);

    currentInput = input;
    
    // Immediate and delayed focus
    input.focus();
    setTimeout(() => input.focus(), 100);

    input.addEventListener("keydown", handleKeydown);
    targetWrapper.scrollTop = targetWrapper.scrollHeight;
}

function handleKeydown(e) {
    const input = e.target;
    const value = input.value.trim();

    if (e.key === "Enter") {
        const cmdText = input.value.trim();
        const line = input.parentElement;
        const promptSpan = line.querySelector(".prompt");
        const promptText = promptSpan ? promptSpan.textContent : "";
        
        line.innerHTML = `<span class="prompt">${escapeHtml(promptText)}</span> <span class="cmd-text">${escapeHtml(cmdText)}</span>`;
        currentInput = null;

        if (isAskingName) {
            isAskingName = false;
            if (window.finalizeBoot) window.finalizeBoot(cmdText);
            return;
        }

        if (cmdText) {
            addToHistory(cmdText);
            handleCommand(cmdText.toLowerCase()).then(() => {
                createInput();
            });
        } else {
            createInput();
        }
    }

    // Command History
    if (e.key === "ArrowUp") { e.preventDefault(); input.value = getPrevHistory(); }
    if (e.key === "ArrowDown") { e.preventDefault(); input.value = getNextHistory(); }

    // Tab Completion
    if (e.key === "Tab") {
        e.preventDefault();
        const parts = value.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const arg = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";

        if (parts.length === 1) {
            const match = Object.keys(COMMANDS).find(w => w.startsWith(value.toLowerCase()));
            if (match) input.value = match;
        } else if (["cat", "cd", "unlock"].includes(cmd)) {
            getFilesForDir(currentDir).then(files => {
                const match = files.find(f => f.toLowerCase().startsWith(arg));
                if (match) {
                    parts[parts.length - 1] = match;
                    input.value = parts.join(" ");
                }
            });
        }
    }
}

async function handleCommand(input) {
    const parts = input.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    if (cmd === "clear") { clear(); return; }

    if (COMMANDS[cmd]) {
        const result = await COMMANDS[cmd](args);
        if (result) print(result);
    } else {
        print(COMMANDS.error(cmd));
    }
}