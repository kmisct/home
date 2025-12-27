const CONTENTS_JSON_URL = 'data/contents.json';

async function loadContents() {
    try {
        const response = await fetch(CONTENTS_JSON_URL);
        const data = await response.json();

        // カテゴリごとのコンテナを取得
        const containers = {
            'YOUTUBE': document.getElementById('content-grid-youtube'),
            'PODCAST': document.getElementById('content-grid-podcast'),
            'DARKCANDY': document.getElementById('content-grid-darkcandy'),
            'POCKET': document.getElementById('content-grid-pocket')
        };

        // データをカテゴリごとに振り分け
        data.forEach(item => {
            const container = containers[item.category];
            if (container) {
                const html = createContentCard(item);
                container.insertAdjacentHTML('beforeend', html);
            }
        });

    } catch (error) {
        console.error('Contents loading error:', error);
    }
}

// カードのHTMLを作る関数（member-cardのデザインを流用）
function createContentCard(item) {
    // 画像がない場合のダミー
    const imagePath = item.image ? item.image : 'images/home/IMG_0906.jpg';

    // リンク判定（外部なら_blank）
    let linkAttr = 'href="#"';
    let targetAttr = '';
    
    if (item.url && item.url !== "" && item.url !== "#") {
        linkAttr = `href="${item.url}"`;
        if (item.url.startsWith('http')) {
            targetAttr = 'target="_blank"';
        }
    }

    // カテゴリごとのバッジ色設定
    let badgeColor = '#333';
    if (item.category === 'YOUTUBE') badgeColor = '#ff0000';
    else if (item.category === 'PODCAST') badgeColor = '#8e44ad';
    else if (item.category === 'DARKCANDY') badgeColor = '#2c3e50';
    else if (item.category === 'POCKET') badgeColor = '#27ae60';

    return `
        <div class="member-card js-fade-up">
            <a ${linkAttr} ${targetAttr} style="text-decoration: none; color: inherit; display: block;">
                <div class="member-img">
                    <img src="${imagePath}" alt="${item.title}">
                </div>
                <div class="member-info">
                    <span class="news-badge" style="background-color: ${badgeColor}; margin-bottom: 10px;">
                        ${item.category}
                    </span>
                    <h4 style="margin-bottom: 10px;">${item.title}</h4>
                    <p class="member-comment">
                        ${item.desc}
                    </p>
                </div>
            </a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', loadContents);