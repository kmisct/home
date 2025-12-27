const EVENTS_JSON_URL = 'data/events.json';

async function loadEvents() {
    try {
        const response = await fetch(EVENTS_JSON_URL);
        const data = await response.json();

        // 日付順（新しい順）のソート
        data.sort((a, b) => {
            const dateA = new Date(a.date.substring(0, 10)); 
            const dateB = new Date(b.date.substring(0, 10));
            return dateB - dateA;
        });

        // ■ホーム画面：最新3件をカード表示
        const latestContainer = document.getElementById('latest-events-grid');
        if (latestContainer) {
            renderLatestEvents(data, latestContainer);
        }

        // ■イベントページ：アーカイブリスト表示
        const archiveContainer = document.getElementById('events-archive-container');
        if (archiveContainer) {
            renderArchiveList(data, archiveContainer);
        }

    } catch (error) {
        console.error('Events loading error:', error);
    }
}

// ---------------------------------------------------
// 1. ホーム画面用：カード表示（最新3件）
// ---------------------------------------------------
function renderLatestEvents(data, container) {
    container.innerHTML = '';
    
    // 最新3件だけ取得
    const latestData = data.slice(0, 3);

    latestData.forEach(item => {
        // カテゴリごとの色
        let badgeColor = '#0056b3'; 
        if (item.category === 'CAFE') badgeColor = '#e67e22'; 
        else if (item.category === 'BOOTH') badgeColor = '#27ae60'; 

        // 画像がない場合のダミー画像（必要なら変更してください）
        const imagePath = item.image ? item.image : 'images/home/IMG_0906.jpg';

        // リンク設定（ボックス全体をクリック可能にする）
        let linkStart = `<div class="latest-card">`;
        let linkEnd = `</div>`;
        
        if (item.url && item.url.trim() !== "" && item.url !== "#") {
            const isExternal = item.url.startsWith('http');
            const target = isExternal ? '_blank' : '_self';
            linkStart = `<a href="${item.url}" class="latest-card" target="${target}" style="text-decoration: none; color: inherit;">`;
            linkEnd = `</a>`;
        }

        // HTML生成
        const html = `
            ${linkStart}
                <div class="latest-card-img-wrapper">
                    <img src="${imagePath}" alt="${item.title}" class="latest-card-img">
                    <span class="latest-card-badge" style="background-color: ${badgeColor};">${item.category}</span>
                </div>
                <div class="latest-card-body">
                    <time class="latest-card-date">${item.date}</time>
                    <h3 class="latest-card-title">${item.title}</h3>
                </div>
            ${linkEnd}
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// ---------------------------------------------------
// 2. イベントページ用：アーカイブリスト表示（アコーディオン）
// ---------------------------------------------------
function renderArchiveList(data, container) {
    const eventsByYear = {};
    
    data.forEach(item => {
        const year = item.date.substring(0, 4);
        if (!eventsByYear[year]) eventsByYear[year] = [];
        eventsByYear[year].push(item);
    });

    const years = Object.keys(eventsByYear).sort((a, b) => b - a);
    container.innerHTML = '';

    years.forEach((year, index) => {
        const events = eventsByYear[year];
        const isOpen = index === 0 ? 'active' : '';
        const iconRotation = index === 0 ? 'transform: rotate(180deg);' : '';

        const listItems = events.map(item => {
            let badgeColor = '#0056b3'; 
            if (item.category === 'TALK' || item.category === 'CAFE') badgeColor = '#e67e22'; 
            else if (item.category === 'BOOTH') badgeColor = '#27ae60'; 

            const displayDate = item.date.substring(5);
            
            // アーカイブのリンク処理
            let titleHtml = item.title;
            if (item.url && item.url !== "" && item.url !== "#") {
                titleHtml = `<a href="${item.url}" class="archive-link" target="_blank">${item.title}</a>`;
            }

            return `
                <li>
                    <span class="archive-date">${displayDate}</span>
                    <span class="news-badge" style="background-color: ${badgeColor};">${item.category}</span>
                    <span class="archive-title">${titleHtml}</span>
                </li>
            `;
        }).join('');

        const html = `
            <div class="archive-year-group">
                <button class="accordion-btn ${isOpen}">
                    ${year}年
                    <span class="icon" style="${iconRotation}"><i class="fa-solid fa-chevron-down"></i></span>
                </button>
                <div class="accordion-panel">
                    <ul class="archive-list">
                        ${listItems}
                    </ul>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });

    setupAccordion(container);
}

function setupAccordion(container) {
    const acc = container.querySelectorAll(".accordion-btn");
    acc.forEach(btn => {
        btn.addEventListener("click", function() {
            this.classList.toggle("active");
            const icon = this.querySelector('.icon');
            icon.style.transform = this.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
            const panel = this.nextElementSibling;
            panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
        });
    });
    const activeBtn = container.querySelector('.accordion-btn.active');
    if (activeBtn) {
        activeBtn.nextElementSibling.style.maxHeight = activeBtn.nextElementSibling.scrollHeight + "px";
    }
}

document.addEventListener('DOMContentLoaded', loadEvents);