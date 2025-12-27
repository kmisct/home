const EVENTS_JSON_URL = 'data/events.json';

async function loadEventsArchive() {
    const container = document.getElementById('events-archive-container');
    if (!container) return;

    try {
        const response = await fetch(EVENTS_JSON_URL);
        const data = await response.json();

        // 1. データを年ごとにグループ化
        const eventsByYear = {};
        
        // 日付順（新しい順）のソート（期間表記対応）
        data.sort((a, b) => {
            const dateA = new Date(a.date.substring(0, 10)); 
            const dateB = new Date(b.date.substring(0, 10));
            return dateB - dateA;
        });

        data.forEach(item => {
            const year = item.date.substring(0, 4);
            if (!eventsByYear[year]) {
                eventsByYear[year] = [];
            }
            eventsByYear[year].push(item);
        });

        // 2. HTML生成（新しい年が上）
        const years = Object.keys(eventsByYear).sort((a, b) => b - a);

        container.innerHTML = ''; // クリア

        years.forEach((year, index) => {
            const events = eventsByYear[year];

            // 最新の年（index 0）だけアクティブにする
            const isOpen = index === 0 ? 'active' : '';
            const iconRotation = index === 0 ? 'transform: rotate(180deg);' : '';

            const listItems = events.map(item => {
                // カテゴリごとの色分け
                let badgeColor = '#0056b3'; 
                if (item.category === 'CAFE') {
                    badgeColor = '#e67e22'; 
                } else if (item.category === 'BOOTH') {
                    badgeColor = '#27ae60'; 
                }

                // 日付の表示調整（"2025." をカット）
                const displayDate = item.date.substring(5);

                // ★修正点：URLがあればリンク化する処理
                let titleHtml = item.title;
                if (item.url && item.url !== "") {
                    // リンクがある場合はaタグで囲む（target="_blank"はお好みで外してもOK）
                    titleHtml = `<a href="${item.url}" class="archive-link" target="_blank">${item.title} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.8em; margin-left: 5px; opacity: 0.6;"></i></a>`;
                }

                return `
                    <li>
                        <span class="archive-date">${displayDate}</span>
                        <span class="news-badge" style="background-color: ${badgeColor};">${item.category}</span>
                        <span class="archive-title">${titleHtml}</span>
                    </li>
                `;
            }).join('');

            // パネルのHTML
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

        // 3. クリックイベント設定 & 初期オープン処理
        setupAccordion(container);

    } catch (error) {
        console.error('Events loading error:', error);
    }
}

function setupAccordion(container) {
    const acc = container.querySelectorAll(".accordion-btn");
    
    acc.forEach(btn => {
        btn.addEventListener("click", function() {
            this.classList.toggle("active");
            
            const icon = this.querySelector('.icon');
            if (this.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }

            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });

    const activeBtn = container.querySelector('.accordion-btn.active');
    if (activeBtn) {
        const panel = activeBtn.nextElementSibling;
        panel.style.maxHeight = panel.scrollHeight + "px";
    }
}

document.addEventListener('DOMContentLoaded', loadEventsArchive);