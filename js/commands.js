const GITHUB_USERNAME = "Fredrick-Maina";
const GITHUB_REPO = "Portfolio";

const COMMANDS = {
    help: () => `
    <div class="command-list">
        <div class="cmd-hint">Tip: click a command to run it.</div>
        <button type="button" class="cmd-name cmd-link" data-cmd="help">help</button><div class="cmd-desc">Show available commands</div>
        <button type="button" class="cmd-name cmd-link" data-cmd="about">about</button><div class="cmd-desc">Learn about my background</div>
        <button type="button" class="cmd-name cmd-link" data-cmd="projects">projects</button><div class="cmd-desc">View my latest work</div>
        <button type="button" class="cmd-name cmd-link" data-cmd="skills">skills</button><div class="cmd-desc">View my technical skills</div>
        <button type="button" class="cmd-name cmd-link" data-cmd="techstack">techstack</button><div class="cmd-desc">View my environments & tools</div>
        <button type="button" class="cmd-name cmd-link" data-cmd="writeups">writeups</button><div class="cmd-desc">List all CTF writeups</div>
        <button type="button" class="cmd-name cmd-link" data-cmd="vulnerabilities">vulnerabilities</button><div class="cmd-desc">List all vulnerability reports</div>
        <button type="button" class="cmd-name cmd-link" data-cmd="reports">reports</button><div class="cmd-desc">View my penetration testing reports</div>
        <button type="button" class="cmd-name cmd-link" data-cmd="certs">certs</button><div class="cmd-desc">View professional certifications</div>
        <button type="button" class="cmd-name cmd-link" data-cmd="resume">resume</button><div class="cmd-desc">View or download my resume</div>
        <button type="button" class="cmd-name cmd-link" data-fill="cd ">cd</button><div class="cmd-desc">Change directory (e.g., cd projects)</div>
        <button type="button" class="cmd-name cmd-link" data-cmd="pwd">pwd</button><div class="cmd-desc">Print working directory</div>
        <button type="button" class="cmd-name cmd-link" data-cmd="ls">ls</button><div class="cmd-desc">List files in current directory</div>
        <button type="button" class="cmd-name cmd-link" data-fill="cat ">cat</button><div class="cmd-desc">Read a file (e.g., cat secret.vault)</div>
        <button type="button" class="cmd-name cmd-link" data-cmd="history">history</button><div class="cmd-desc">View command history</div>
        <button type="button" class="cmd-name cmd-link" data-cmd="contact">contact</button><div class="cmd-desc">Ways to reach me</div>
        <button type="button" class="cmd-name cmd-link" data-cmd="whoami">whoami</button><div class="cmd-desc">Display current user info</div>
        <button type="button" class="cmd-name cmd-link" data-cmd="clear">clear</button><div class="cmd-desc">Clear the terminal screen</div>
        <button type="button" class="cmd-name cmd-link" data-cmd="sudo">sudo</button><div class="cmd-desc">Try it and see...</div>
    </div>`,
    
    about: () => `
<div class="profile">
    <img src="images/profile.jpg" class="profile-pic" alt="Fredrick Maina">
    <div>
        <div class="profile-name">Fredrick Maina Wanjohi</div>
        <div class="profile-title">Ethical Hacker | Penetration Tester | CS Student</div>
    </div>
</div>
<div class="stack">
    <p>I am a Computer Science student at Dedan Kimathi University of Technology specializing in Cybersecurity. I have hands-on experience in Ethical Hacking, Penetration Testing, and navigating security labs through TryHackMe, HackTheBox, and the Cisco Networking Academy.</p>
    
    <p>Beyond technical offensive security, my background includes working with the National Census and Electoral process, which instilled a deep respect for handling sensitive data with strict accuracy, integrity, and confidentiality.</p>

    <p>I am highly proficient in Python for scripting/automation, and I am actively developing my expertise in vulnerability assessment, system security, and secure software design. My ultimate focus is on practical, real-world Cybersecurity problem-solving.</p>
</div>`,

    skills: async () => {
        try {
            const response = await fetch('data/skills.json');
            const data = await response.json();
            let list = '<div class="stack"><div class="accent">[ TECHNICAL SKILLS ]</div>';
            data.forEach(skill => {
                list += `<div>${escapeHtml(skill.name)} ${escapeHtml(skill.stars)}</div>`;
            });
            list += '</div>';
            return list;
        } catch (e) {
            return '<span class="error">Failed to load skills data.</span>';
        }
    },

    techstack: async () => {
        try {
            const response = await fetch('data/techstack.json');
            const data = await response.json();
            let list = `
<div class="stack">
    <div class="accent">==================================</div>
    <div class="accent">      CURRENT TECH STACK & TOOLS  </div>
    <div class="accent">==================================</div>
    <br>`;
            for (const [category, tools] of Object.entries(data)) {
                list += `<div><span class="accent">${escapeHtml(category)}:</span> ${escapeHtml(tools)}</div>`;
            }
            list += '</div>';
            return list;
        } catch (e) {
            return '<span class="error">Failed to load tech stack data.</span>';
        }
    },

    resume: () => `
<div class="stack">
    <div><strong>Fredrick Maina - Resume</strong></div>
    <br>
    <div>
        <a href="Documents/resume.pdf" target="_blank" class="writeup-link">[View Resume]</a> 
        <a href="Documents/resume.pdf" download class="writeup-link">[Download]</a>
    </div>
</div>`,

    certs: async () => {
        const docs = await fetchCerts();
        if (docs.length === 0) return "No certifications found in /certs/.";
        return renderDocList(docs, "[ CERTIFICATIONS ]", "View Cert", "certs");
    },

    reports: async () => {
        const docs = await fetchReports();
        if (docs.length === 0) return "No reports found in /reports/.";
        return renderDocList(docs, "[ PENETRATION TESTING REPORTS ]", "View Report", "reports");
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
        try {
            const response = await fetch('writeups/writeups.json');
            const data = await response.json();
            let list = '<div class="stack">';
            data.forEach((w, i) => {
                list += `<div><strong>${i + 1}. ${escapeHtml(w.id)}</strong> - ${escapeHtml(w.title)} <a href="${escapeHtml(w.path)}" target="_blank" class="writeup-link">[View Writeup]</a></div>`;
            });
            list += '</div><br>Use "cd writeups" and "cat &lt;filename&gt;" to read.';
            return list;
        } catch (e) {
            return '<span class="error">Failed to load writeups.</span>';
        }
    },

    vulnerabilities: async () => {
        try {
            const response = await fetch('VULNERABILITIES/vulnerabilities.json');
            const data = await response.json();
            let list = '<div class="stack">';
            data.forEach((v, i) => {
                list += `<div><strong>${i + 1}. ${escapeHtml(v)}</strong></div>`;
            });
            list += '</div><br>Use "cd vulnerabilities" and "cat &lt;filename&gt;" to read.';
            return list;
        } catch (e) {
            return '<span class="error">Failed to load vulnerabilities.</span>';
        }
    },

    contact: () => `
<div class="stack">
    <div>Email: <a href="mailto:fredrickmaina351@gmail.com" class="writeup-link">fredrickmaina351@gmail.com</a></div>
    <div>Phone: <a href="tel:+254796101276" class="writeup-link">+254 796 101 276</a></div>
    <div>GitHub: <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" class="writeup-link">github.com/${GITHUB_USERNAME}</a></div>
    <div>LinkedIn: <a href="https://www.linkedin.com/in/fredrick-maina-wanjohi-0a51561a3" target="_blank" class="writeup-link">linkedin.com/in/fredrick-maina</a></div>
</div>`,

    whoami: () => `guest_user@portfolio_v2`,

    pwd: () => `/home/fred${currentDir}`,

    ls: async () => {
        const files = await getFilesForDir(currentDir);
        // Directories cd on click, files cat on click
        return files.map(f => {
            const cmd = f.endsWith("/") ? `cd ${f}` : `cat ${f}`;
            return `<button type="button" class="cmd-link" data-cmd="${escapeHtml(cmd)}">${escapeHtml(f)}</button>`;
        }).join("<br>");
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
        const validDirs = ["projects/", "writeups/", "certs/", "reports/", "vulnerabilities/"];
        
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
            if (file === "secret.vault") {
                return `
<div class="stack">
    <div class="accent">===================================================</div>
    <div class="accent">   [ RESTRICTED AREA: CYBER SECURITY CHALLENGE ]   </div>
    <div class="accent">===================================================</div>
    <br>
    <div><strong>STATUS:</strong> <span style="color:#ef4444;">LOCKED</span></div>
    <div><strong>HINT:</strong> Decrypt the cipher below to reveal the vault passkey.</div>
    <br>
    <div style="background:#0f172a; padding:10px; border-left:3px solid #38bdf8; font-family:monospace;">
        ROT13 Cipher: <strong>unpxvat</strong>
    </div>
    <br>
    <div>Once solved, type: <span class="accent">unlock secret.vault &lt;passkey&gt;</span></div>
</div>`;
            }
            if (["projects", "writeups", "certs", "reports", "vulnerabilities"].includes(file.replace(/\/$/, ""))) return `<span class="error">cat: ${escapeHtml(file)}: Is a directory</span>`;
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

        // Handle files in /certs/ and /reports/
        if (currentDir === "/certs/" || currentDir === "/reports/") {
            const docs = currentDir === "/certs/" ? await fetchCerts() : await fetchReports();
            const doc = docs.find(d => {
                const name = d.name.toLowerCase();
                return name === file || name === file + ".pdf" || name === file + ".png";
            });
            if (doc) {
                window.open(doc.view_url, '_blank');
                return `<span class="accent">[ OPENING DOCUMENT ]</span> Opening ${escapeHtml(doc.name)} in a new tab...`;
            }
        }

        // Handle files in /writeups/
        if (currentDir === "/writeups/") {
            try {
                const response = await fetch('writeups/writeups.json');
                const data = await response.json();
                const found = data.find(w => {
                    const wId = w.id.toLowerCase();
                    return wId === file || wId === file + ".txt" || wId === file + ".html";
                });
                
                if (found) {
                    window.open(found.path, '_blank');
                    return `<span class="accent">[ OPENING WRITEUP ]</span> Opening <strong>${escapeHtml(found.title)}</strong> report in a new tab...`;
                }
            } catch (e) {}
        }

        // Handle files in /vulnerabilities/
        if (currentDir === "/vulnerabilities/") {
            try {
                const response = await fetch('VULNERABILITIES/vulnerabilities.json');
                const data = await response.json();
                const found = data.find(v => v.toLowerCase() === file || v.toLowerCase() === file + ".md");
                
                if (found) {
                    const contentResponse = await fetch(`VULNERABILITIES/${found}`);
                    const text = await contentResponse.text();
                    // Render markdown to HTML using marked.js if available
                    if (typeof marked !== 'undefined') {
                        return `<div class="markdown-body">${marked.parse(text)}</div>`;
                    }
                    return `<pre class="output-line">${escapeHtml(text)}</pre>`;
                }
            } catch (e) {}
        }

        return `<span class="error">cat: ${escapeHtml(args)}: No such file or directory</span>`;
    },

    unlock: (args) => {
        if (!args || !args.includes("secret.vault")) return `<span class="error">Usage: unlock secret.vault &lt;password&gt;</span>`;
        const parts = args.split(" ");
        const password = parts[1];

        if (password === "hacking") {
            return `
<div class="stack">
    <div class="accent">===================================================</div>
    <div class="accent">    [ ACCESS GRANTED - SECRET VAULT UNLOCKED ]     </div>
    <div class="accent">===================================================</div>
    <br>
    <p>🎉 <strong>Congratulations!</strong> You solved the ROT13 challenge key.</p>
    <p><em>"The matrix is everywhere. It is all around us. Even now, in this very room."</em></p>
    <br>
    <div><strong>EASTER EGG BADGE:</strong> 🏆 <code>CYBER_EXPLORER_LEVEL_1</code></div>
    <div>You've demonstrated key security mindset traits: <strong>curiosity & cryptanalysis</strong>.</div>
    <br>
    <div>Keep hunting and exploring!</div>
</div>`;
        }
        return `<span class="error">Access Denied: Incorrect vault key. Decode the ROT13 cipher in secret.vault.</span>`;
    },

    history: () => {
        return history.map((cmd, i) => `${i + 1}  ${escapeHtml(cmd)}`).join("<br>");
    },

    sudo: () => `<span class="error">Nice try! You do not have permission to execute this command. Incident has been logged.</span>`,

    error: (cmd) => `<span class="error">Command not found: ${escapeHtml(cmd)}. Type 'help' for available commands.</span>`
};

let cachedRepos = null;
const cachedManifests = {};

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

async function fetchGitHubRepos() {
    if (cachedRepos) return cachedRepos;

    const localCache = localStorage.getItem('github_repos');
    if (localCache) {
        try {
            const { data, timestamp } = JSON.parse(localCache);
            if (Date.now() - timestamp < CACHE_DURATION) {
                cachedRepos = data;
                return cachedRepos;
            }
        } catch (e) {}
    }

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated`, {
            headers: { "Accept": "application/vnd.github.v3+json" }
        });
        const data = await response.json();
        if (Array.isArray(data)) {
            cachedRepos = data.filter(repo => !repo.fork);
            localStorage.setItem('github_repos', JSON.stringify({ data: cachedRepos, timestamp: Date.now() }));
            return cachedRepos;
        } else if (data.message && data.message.includes("API rate limit")) {
            console.error("GitHub API Rate Limit Exceeded");
        }
    } catch (e) {
        console.error("Error fetching GitHub repos:", e);
    }

    // Fallback to local static JSON if API fails
    try {
        const fallbackResponse = await fetch('projects/projects.json');
        const fallbackData = await fallbackResponse.json();
        if (Array.isArray(fallbackData)) {
            cachedRepos = fallbackData.filter(repo => !repo.fork);
            return cachedRepos;
        }
    } catch (e) {
        console.error("Failed to load projects/projects.json fallback", e);
    }
    
    return [];
}

// Load a JSON list of documents, cached in memory and in localStorage for an hour
async function fetchManifest(url, cacheKey) {
    if (cachedManifests[url]) return cachedManifests[url];

    try {
        const localCache = localStorage.getItem(cacheKey);
        if (localCache) {
            const { data, timestamp } = JSON.parse(localCache);
            if (Date.now() - timestamp < CACHE_DURATION) {
                cachedManifests[url] = data;
                return data;
            }
        }
    } catch (e) {}

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (Array.isArray(data)) {
            cachedManifests[url] = data;
            try { localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() })); } catch (e) {}
            return data;
        }
    } catch (e) {
        console.error(`Error fetching ${url}:`, e);
    }

    return [];
}

const fetchCerts = () => fetchManifest('Documents/documents.json', 'certs_cache');
const fetchReports = () => fetchManifest('Documents/reports/reports.json', 'reports_cache');

function renderDocList(docs, heading, viewLabel, dirName) {
    let list = `<div class="stack"><div class="accent">${heading}</div>`;
    docs.forEach((doc, i) => {
        const displayName = doc.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        list += `<div><strong>${i + 1}. ${escapeHtml(displayName)}</strong> <a href="${escapeHtml(doc.view_url)}" target="_blank" class="writeup-link">[${viewLabel}]</a> <a href="${escapeHtml(doc.download_url)}" download class="writeup-link">[Download]</a></div>`;
    });
    list += `</div><br>Use "cd ${dirName}" to view files in the terminal.`;
    return list;
}

async function getFilesForDir(dir) {
    if (dir === "/") {
        return ["about.txt", "contact.md", "projects/", "writeups/", "certs/", "reports/", "vulnerabilities/", "secret.vault"];
    }
    if (dir === "/projects/") {
        const repos = await fetchGitHubRepos();
        return repos.map(r => r.name.toLowerCase() + ".txt");
    }
    if (dir === "/certs/") {
        const docs = await fetchCerts();
        return docs.map(d => d.name.toLowerCase());
    }
    if (dir === "/reports/") {
        const docs = await fetchReports();
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
    if (dir === "/vulnerabilities/") {
        try {
            const response = await fetch('VULNERABILITIES/vulnerabilities.json');
            const data = await response.json();
            return data;
        } catch (e) {
            return [];
        }
    }
    return [];
}
