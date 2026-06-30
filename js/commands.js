const GITHUB_USERNAME = "Fredrick-Maina";
const GITHUB_REPO = "Portfolio";

const COMMANDS = {
    help: () => `
<div class="command-list">
    <span class="cmd-name">help</span><span class="cmd-desc">Show available commands</span>
    <span class="cmd-name">about</span><span class="cmd-desc">Learn about my background</span>
    <span class="cmd-name">projects</span><span class="cmd-desc">View my latest work</span>
    <span class="cmd-name">writeups</span><span class="cmd-desc">List all available reports</span>
    <span class="cmd-name">certs</span><span class="cmd-desc">View professional certifications</span>
    <span class="cmd-name">cd</span><span class="cmd-desc">Change directory (e.g., cd projects)</span>
    <span class="cmd-name">ls</span><span class="cmd-desc">List files in current directory</span>
    <span class="cmd-name">cat</span><span class="cmd-desc">Read a file (e.g., cat ghostcat.txt)</span>
    <span class="cmd-name">history</span><span class="cmd-desc">View command history</span>
    <span class="cmd-name">contact</span><span class="cmd-desc">Ways to reach me</span>
    <span class="cmd-name">whoami</span><span class="cmd-desc">Display current user info</span>
    <span class="cmd-name">clear</span><span class="cmd-desc">Clear the terminal screen</span>
    <span class="cmd-name">sudo</span><span class="cmd-desc">Try it and see...</span>
</div>`,
    
    about: () => `
<div class="profile">
    <img src="images/profile.jpg" class="profile-pic" alt="Profile">
    <div>
        <div class="profile-name">Fredrick Maina</div>
        <div class="profile-title">Ethical Hacker | Cybersecurity Professional</div>
    </div>
</div>
Certified cybersecurity professional specialized in vulnerability assessment and offensive security.
Holding certifications from Cisco and ICT Authority Kenya. 
Focused on Web Security, Ethical Hacking, and Automation.`,

    certs: async () => {
        const docs = await fetchDocs();
        if (docs.length === 0) return "No certifications found in /documents/.";
        
        let list = '<div class="stack">';
        docs.forEach((doc, i) => {
            const displayName = doc.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
            list += `<div><strong>${i + 1}. ${escapeHtml(displayName)}</strong> <a href="${escapeHtml(doc.url)}" target="_blank" class="writeup-link">[View Cert]</a></div>`;
        });
        list += '</div><br>Use "cd documents" to view files in the terminal.';
        return list;
    },

    projects: async () => {
        const repos = await fetchGitHubRepos();
        if (repos.length === 0) return "No projects found on GitHub or API limit reached.";
        
        let list = '<div class="stack">';
        repos.slice(0, 6).forEach((repo, i) => {
            list += `<div><strong>${i + 1}. ${repo.name}</strong> - ${repo.description || 'No description'} <a href="${repo.html_url}" target="_blank" class="writeup-link">[View Repo]</a></div>`;
        });
        list += '</div><br>Use "cd projects" and "cat &lt;repo_name&gt;" for more details.';
        return list;
    },

    writeups: async () => {
        const files = await getFilesForDir("/writeups/");
        let list = '<div class="stack">';
        files.forEach(f => {
            list += `<div>- ${f}</div>`;
        });
        list += '</div><br>Use "cat &lt;filename&gt;" to read.';
        return list;
    },

    contact: () => `
<div class="stack">
    <div>Email: <a href="mailto:fredrickmaina351@gmail.com" class="writeup-link">fredrickmaina351@gmail.com</a></div>
    <div>Phone: <a href="tel:+254796101276" class="writeup-link">+254 796 101 276</a></div>
    <div>GitHub: <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" class="writeup-link">github.com/${GITHUB_USERNAME}</a></div>
    <div>LinkedIn: <a href="https://www.linkedin.com/in/fredrick-maina-wanjohi-0a51561a3" target="_blank" class="writeup-link">linkedin.com/in/fredrick-maina</a></div>
</div>`,

    whoami: () => `guest_user@portfolio_v2`,

    ls: async () => {
        const files = await getFilesForDir(currentDir);
        return files.join("    ");
    },

    cd: async (args) => {
        if (!args || args === "/" || args === "~") {
            currentDir = "/";
            return "";
        }
        if (args === "..") {
            if (currentDir !== "/") {
                const parts = currentDir.split("/").filter(p => p);
                parts.pop();
                currentDir = parts.length === 0 ? "/" : "/" + parts.join("/") + "/";
            }
            return "";
        }

        const target = args.endsWith("/") ? args : args + "/";
        const validDirs = ["projects/", "writeups/", "documents/"];
        
        if (currentDir === "/" && validDirs.includes(target)) {
            currentDir = "/" + target;
            return "";
        }

        return `<span class="error">cd: ${escapeHtml(args)}: No such directory</span>`;
    },

    cat: async (args) => {
        if (!args) return `<span class="error">Usage: cat &lt;filename&gt;</span>`;
        const file = args.toLowerCase();
        
        // Handle files in root
        if (currentDir === "/") {
            if (file === "about.txt") return COMMANDS.about();
            if (file === "contact.md") return COMMANDS.contact();
            if (file === "secret.vault") return `<span class="error">File is encrypted. Use 'unlock secret.vault &lt;password&gt;' to access.</span>`;
            if (file === "projects" || file === "writeups" || file === "documents") return `<span class="error">cat: ${escapeHtml(file)}: Is a directory</span>`;
        }

        // Handle files in /projects/
        if (currentDir === "/projects/") {
            const repos = await fetchGitHubRepos();
            const repo = repos.find(r => r.name.toLowerCase() === file || r.name.toLowerCase() + ".txt" === file);
            if (repo) {
                return `
<div class="accent">[ PROJECT: ${repo.name} ]</div>
<br>
<strong>Description:</strong> ${repo.description || "No description available."}
<strong>Stars:</strong> ${repo.stargazers_count} | <strong>Language:</strong> ${repo.language || "N/A"}
<br>
<a href="${repo.html_url}" target="_blank" class="writeup-link">View Repository on GitHub</a>`;
            }
        }

        // Handle files in /documents/
        if (currentDir === "/documents/") {
            const docs = await fetchDocs();
            const doc = docs.find(d => {
                const name = d.name.toLowerCase();
                return name === file || name === file + ".pdf" || name === file + ".png";
            });
            if (doc) {
                window.open(doc.url, '_blank');
                return `<span class="accent">[ OPENING DOCUMENT ]</span> Opening ${escapeHtml(doc.name)} in a new tab...`;
            }
        }

        // Handle files in /writeups/
        try {
            const response = await fetch('writeups/writeups.json');
            const data = await response.json();
            const found = data.find(w => w.id === file || w.id === file + ".txt" || w.id === file + ".html");
            
            if (found) {
                if (found.isExternal) {
                    window.open(found.path, '_blank');
                    return `<span class="accent">[ REDIRECTING ]</span> Opening external report in a new tab...`;
                }
                const contentResponse = await fetch(found.path);
                const text = await contentResponse.text();
                return `<pre class="output-line">${escapeHtml(text)}</pre>`;
            }
        } catch (e) {}

        return `<span class="error">cat: ${escapeHtml(args)}: No such file or directory</span>`;
    },

    unlock: (args) => {
        if (!args || !args.includes("secret.vault")) return `<span class="error">Usage: unlock secret.vault &lt;password&gt;</span>`;
        const parts = args.split(" ");
        const password = parts[1];

        if (password === "hacking") {
            return `
<div class="accent">[ ACCESS GRANTED ]</div>
<br>
Congratulations! You've found the hidden vault. 
"The matrix is everywhere. It is all around us. Even now, in this very room."
<br><br>
You've demonstrated the first rule of security: curiosity.
Keep exploring.`;
        }
        return `<span class="error">Invalid password. Access denied.</span>`;
    },

    history: () => {
        return history.map((cmd, i) => `${i + 1}  ${escapeHtml(cmd)}`).join("<br>");
    },

    sudo: () => `<span class="error">Nice try! You do not have permission to execute this command. Incident has been logged.</span>`,

    error: (cmd) => `<span class="error">Command not found: ${escapeHtml(cmd)}. Type 'help' for available commands.</span>`
};

let cachedRepos = null;
let cachedDocs = null;

async function fetchGitHubRepos() {
    if (cachedRepos) return cachedRepos;
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated`);
        const data = await response.json();
        if (Array.isArray(data)) {
            cachedRepos = data.filter(repo => !repo.fork);
            return cachedRepos;
        }
        return [];
    } catch (e) {
        console.error("Error fetching GitHub repos:", e);
        return [];
    }
}

async function fetchDocs() {
    if (cachedDocs) return cachedDocs;

    try {
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/Documents`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
            cachedDocs = data
                .filter(file => file.type === "file")
                .map(file => ({ name: file.name, url: file.download_url }));
            return cachedDocs;
        }
    } catch (e) {
        console.error("Error fetching documents:", e);
    }

    return [];
}

async function getFilesForDir(dir) {
    if (dir === "/") {
        return ["about.txt", "contact.md", "projects/", "writeups/", "documents/", "secret.vault"];
    }
    if (dir === "/projects/") {
        const repos = await fetchGitHubRepos();
        return repos.map(r => r.name.toLowerCase() + ".txt");
    }
    if (dir === "/documents/") {
        const docs = await fetchDocs();
        return docs.map(d => d.name.toLowerCase());
    }
    if (dir === "/writeups/") {
        try {
            const response = await fetch('writeups/writeups.json');
            const data = await response.json();
            return data.map(w => w.id);
        } catch (e) {
            return [];
        }
    }
    return [];
}