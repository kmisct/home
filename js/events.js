const EVENTS_JSON_URL = 'data/events.json';

async function loadEventsArchive() {
    const container = document.getElementById('events-archive-container');
    if (!container) return;

    try {
        const response = await fetch(EVENTS_JSON_URL);
        const data = await response.json();

        // 1. データを年ごとにグループ化
        const eventsByYear = {};
        
        // 日付順（新しい順）
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

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

            // ★修正：最新の年（index 0）だけアクティブにする
            const isOpen = index === 0 ? 'active' : '';
            const iconRotation = index === 0 ? 'transform: rotate(180deg);' : '';

            const listItems = events.map(item => {
                const badgeStyle = item.category === 'CAFE' ? 'style="background-color: #e67e22;"' : '';
                return `
                    <li>
                        <span class="archive-date">${item.date.substring(5)}</span>
                        <span class="news-badge" ${badgeStyle}>${item.category}</span>
                        <span class="archive-title">${item.title}</span>
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
    
    // イベント設定
    acc.forEach(btn => {
        btn.addEventListener("click", function() {
            this.classList.toggle("active");
            
            // アイコン回転
            const icon = this.querySelector('.icon');
            if (this.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }

            // パネル開閉
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });

    // ★修正：最初から active になっているパネル（最新の年）だけ強制的に開く
    const activeBtn = container.querySelector('.accordion-btn.active');
    if (activeBtn) {
        const panel = activeBtn.nextElementSibling;
        panel.style.maxHeight = panel.scrollHeight + "px";
    }
}

document.addEventListener('DOMContentLoaded', loadEventsArchive);