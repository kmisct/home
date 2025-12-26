const EVENTS_JSON_URL = 'data/events.json';

async function loadEventsArchive() {
    const container = document.getElementById('events-archive-container');
    if (!container) return;

    try {
        const response = await fetch(EVENTS_JSON_URL);
        const data = await response.json();

        // 1. データを年ごとにグループ化する
        const eventsByYear = {};
        
        // 日付順に並べ替え（新しい順）
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        data.forEach(item => {
            // "2025.12.24" の最初の4文字（年）を取得
            const year = item.date.substring(0, 4);
            if (!eventsByYear[year]) {
                eventsByYear[year] = [];
            }
            eventsByYear[year].push(item);
        });

        // 2. 年ごとにHTMLを生成（新しい年が上）
        const years = Object.keys(eventsByYear).sort((a, b) => b - a);

        years.forEach((year, index) => {
            const events = eventsByYear[year];
            
            // 最新の年は最初から開いておく（index === 0）
            const isOpen = index === 0 ? 'active' : '';
            const maxHeight = index === 0 ? 'style="max-height: 1000px;"' : '';

            // リストの中身（HTML）を作る
            const listItems = events.map(item => {
                // カテゴリバッジの色（CAFEだけオレンジにする例）
                const badgeStyle = item.category === 'CAFE' ? 'style="background-color: #e67e22;"' : '';
                
                return `
                    <li>
                        <span class="archive-date">${item.date.substring(5)}</span> <span class="news-badge" ${badgeStyle}>${item.category}</span>
                        <span class="archive-title">${item.title}</span>
                    </li>
                `;
            }).join('');

            // アコーディオン全体のHTML
            const html = `
                <div class="archive-year-group">
                    <button class="accordion-btn ${isOpen}">
                        ${year}年
                        <span class="icon"><i class="fa-solid fa-chevron-down"></i></span>
                    </button>
                    <div class="accordion-panel" ${maxHeight}>
                        <ul class="archive-list">
                            ${listItems}
                        </ul>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });

        // 3. クリックイベントを設定
        setupAccordion();

    } catch (error) {
        console.error('Events loading error:', error);
    }
}

function setupAccordion() {
    const acc = document.getElementsByClassName("accordion-btn");
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', loadEventsArchive);