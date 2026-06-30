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
        if (i < text.length) {
            line.innerHTML += text[i];
            i++;
            setTimeout(type, speed);
            if (targetWrapper) targetWrapper.scrollTop = targetWrapper.scrollHeight;
        } else if (callback) {
            callback();
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
            setTimeout(nextLine, 200);
        }, 20);
    }
    nextLine();
}