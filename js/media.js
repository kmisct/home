let allMediaData = null;

document.addEventListener('DOMContentLoaded', async () => {
    const jsonPath = 'data/media.json';

    try {
        const response = await fetch(jsonPath);
        allMediaData = await response.json();

        // 初期表示 (Podcast)
        switchMedia('podcast');

    } catch (error) {
        console.error('Media data loading failed:', error);
    }
});

function switchMedia(type) {
    if (!allMediaData) return;

    const leftContainer = document.getElementById('js-media-list-left');
    const rightContainer = document.getElementById('js-media-list-right');
    const titleElement = document.getElementById('js-media-title');
    
    // ボタンの見た目切り替え
    document.querySelectorAll('.media-switch-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${type}`).classList.add('active');

    // データ取得
    let list = [];
    if (type === 'podcast') {
        list = allMediaData.podcast;
        titleElement.textContent = "Podcast & Radio";
    } else {
        list = allMediaData.youtube;
        titleElement.textContent = "YouTube Archive";
    }

    // 左右に振り分け
    const halfIndex = Math.ceil(list.length / 2);
    const leftList = list.slice(0, halfIndex);
    const rightList = list.slice(halfIndex);

    // 表示（どちらも共通のカード生成関数を使います）
    renderMediaCard(leftList, leftContainer, type);
    renderMediaCard(rightList, rightContainer, type);
}


// ▼ 共通カード生成関数
function renderMediaCard(list, container, type) {
    let html = '';
    
    // アイコンの出し分け
    let iconClass = 'fa-arrow-up-right-from-square';
    if (type === 'youtube') iconClass = 'fa-youtube';
    if (type === 'podcast') iconClass = 'fa-microphone';

    list.forEach(item => {
        // 画像が設定されていない場合のデフォルト画像
        const imagePath = item.image ? item.image : 'images/home/IMG_0906.jpg';

        html += `
            <a href="${item.url}" target="_blank" class="media-card-link">
                <div class="media-card-img-wrap">
                    <img src="${imagePath}" alt="${item.title}">
                    <div class="media-card-icon">
                        <i class="fa-brands ${iconClass}"></i>
                    </div>
                </div>
                <div class="media-card-body">
                    <h3>${item.title}</h3>
                    <p>${item.caption}</p>
                </div>
            </a>
        `;
    });
    container.innerHTML = html;
}