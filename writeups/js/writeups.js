fetch("writeups.json")
    .then(response => response.json())
    .then(data => {

        const container = document.getElementById("writeups");

        data.forEach(item => {

            // Paths in writeups.json are relative to the site root, this page lives in /writeups/
            const href = item.isExternal ? item.path : item.path.replace(/^writeups\//, "");
            const meta = item.isExternal ? "External (WordPress)" : (item.date || "");

            container.innerHTML += `
                <div class="writeup-card">

                    <h2>${item.title}</h2>

                    <p>
                    ${item.id}
                    |
                    ${meta}
                    </p>

                    <a href="${href}"${item.isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''}>
                        ACCESS FILE
                    </a>

                </div>
            `;
        });

    });
