fetch("writeups.json")
    .then(response => response.json())
    .then(data => {

        const container = document.getElementById("writeups");

        data.forEach(item => {

            container.innerHTML += `
                <div class="writeup-card">

                    <h2>${item.title}</h2>

                    <p>
                    ${item.platform}
                    |
                    ${item.category}
                    </p>

                    <a href="${item.path}">
                        ACCESS FILE
                    </a>

                </div>
            `;
        });

    });
