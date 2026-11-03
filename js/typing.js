// Set to true to finish all typing animations instantly (key press, tap, repeat visit, reduced motion)
let bootSkipped = false;

// setTimeout that collapses to (almost) nothing once the boot has been skipped
function pause(fn, ms) {
    setTimeout(fn, bootSkipped ? 0 : ms);
}

function typeText(text, callback, speed = 30) {
    const targetScreen = document.getElementById("terminal-screen");
    const targetWrapper = document.getElementById("terminal-wrapper");

    if (!targetScreen) {
        console.error("CRITICAL: #terminal-screen element not found.");
        return;
    }

    const line = document.createElement("div");
    line.className = "line output-line";
    targetScreen.appendChild(line);

    let i = 0;
    function type() {
        if (bootSkipped) {
            line.innerHTML = text;
            i = text.length;
        }
        if (i < text.length) {
            line.innerHTML += text[i];
            i++;
            setTimeout(type, speed);
            if (targetWrapper) targetWrapper.scrollTop = targetWrapper.scrollHeight;
        } else {
            if (targetWrapper) targetWrapper.scrollTop = targetWrapper.scrollHeight;
            if (callback) callback();
        }
    }
    type();
}

function typeIntroLines(lines, callback) {
    let i = 0;
    function nextLine() {
        if (i >= lines.length) {
            if (callback) callback();
            return;
        }

        typeText(lines[i], () => {
            i++;
            pause(nextLine, 200);
        }, 20);
    }
    nextLine();
}
