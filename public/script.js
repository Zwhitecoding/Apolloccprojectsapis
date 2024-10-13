let menuVisible = false;

document.addEventListener("DOMContentLoaded", () => {
    fetch('/api')
        .then(response => response.json())
        .then(data => {
            const apiList = document.getElementById('api-list');
            const categories = {};

            data.forEach(api => {
                if (!categories[api.category]) {
                    categories[api.category] = [];
                }
                categories[api.category].push(api);
            });

            const sortedCategories = Object.keys(categories).sort();

            sortedCategories.forEach(category => {
                const categoryButton = document.createElement('button');
                categoryButton.className = "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105";
                categoryButton.textContent = category;
                categoryButton.onclick = () => toggleCategory(categoryButton);
                apiList.appendChild(categoryButton);

                const categoryDiv = document.createElement('div');
                categoryDiv.id = category;
                categoryDiv.className = 'hidden px-4 py-2';

                categories[category].forEach(api => {
                    const fullUsage = `${api.usages}${api.query || ''}`;
                    const apiDiv = document.createElement('div');
                    apiDiv.innerHTML = `
                        <strong>${api.name}</strong>
                        <p>${api.desc}</p>
                        <p>Method: ${api.method.toUpperCase()}</p>
                        <p>Usage: <a href="${fullUsage}">${fullUsage}</a></p>
                        <button onclick="tryApi('${fullUsage}')" class="mt-2 px-4 py-2 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105">Try</button>
                    `;
                    categoryDiv.appendChild(apiDiv);
                });

                apiList.appendChild(categoryDiv);
            });
        });

    fetch('/requests')
        .then(response => response.json())
        .then(data => {
            document.getElementById('request-count').textContent = `Request API: ${data.request}`;
        });

    setInterval(updateTime, 1000);
    document.getElementById('user-agent').textContent = `User Agent: ${navigator.userAgent}`;

    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('ip').textContent = `IP Address: ${data.ip}`;
        });

    document.getElementById('device-info').classList.add('fade-in');
});

function toggleCategory(button) {
    const allButtons = document.querySelectorAll('#api-list > button');
    allButtons.forEach(btn => btn.classList.remove('highlighted'));

    const categoryDiv = document.getElementById(button.textContent);
    button.classList.toggle('highlighted');
    categoryDiv.classList.toggle('hidden');
    categoryDiv.classList.add('pop-up');
}

function tryApi(fullUsage) {
    window.location.href = fullUsage;
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    const toggleButton = document.getElementById('toggle-button');

    if (menuVisible) {
        menu.classList.remove('slide-in');
        menu.classList.add('slide-out');
        toggleButton.classList.remove('toggle-icon-vertical');
        toggleButton.classList.add('toggle-icon-horizontal');
        setTimeout(() => {
            menu.classList.add('hidden');
            toggleButton.style.zIndex = 1001;
        }, 500);
    } else {
        menu.classList.remove('hidden');
        menu.classList.remove('slide-out');
        menu.classList.add('slide-in');
        toggleButton.classList.remove('toggle-icon-horizontal');
        toggleButton.classList.add('toggle-icon-vertical');
        toggleButton.style.zIndex = 1001;
    }

    menuVisible = !menuVisible;
}

function updateTime() {
    const now = new Date();
    document.getElementById('current-time').textContent = `Current Time: ${now.toLocaleTimeString()}`;
}