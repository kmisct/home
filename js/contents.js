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
            // カテゴリが存在するかチェックしてから処理
            if (item.category && containers[item.category]) {
                const container = containers[item.category];
                const html = createContentCard(item);
                container.insertAdjacentHTML('beforeend', html);
            }
        });

    } catch (error) {
        console.error('Contents loading error:', error);
    }
}

// ★新規追加：カテゴリからCSSクラス名を決める関数
function getCategoryClass(category) {
    if (!category) return '';
    return category.toLowerCase(); // "YOUTUBE" -> "youtube"
}

// カードのHTMLを作る関数
function createContentCard(item) {
    // 画像がない場合のダミー
    const imagePath = item.image ? item.image : 'images/home/IMG_0906.jpg';

    // リンク判定
    let linkAttr = 'href="#"';
    let targetAttr = '';
    
    if (item.url && item.url !== "" && item.url !== "#") {
        linkAttr = `href="${item.url}"`;
        if (item.url.startsWith('http')) {
            targetAttr = 'target="_blank"';
        }
    }

    // ★修正：色指定ロジックを削除し、クラス名を取得
    const categoryClass = getCategoryClass(item.category);

    // ★修正：style="..." を削除し、CSSクラスで管理
    return `
        <div class="member-card is-content js-fade-up">
            <a ${linkAttr} ${targetAttr}>
                <div class="member-img">
                    <img src="${imagePath}" alt="${item.title}">
                </div>
                <div class="member-info">
                    <span class="news-badge ${categoryClass}" style="margin-bottom: 10px;">
                        ${item.category}
                    </span>
                    <h4>${item.title}</h4>
                    <p class="member-comment">
                        ${item.desc}
                    </p>
                </div>
            </a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', loadContents);