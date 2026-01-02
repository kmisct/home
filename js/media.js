let allMediaData = null;

document.addEventListener('DOMContentLoaded', async () => {
    const jsonPath = 'data/media.json';
    try {
        const response = await fetch(jsonPath);
        allMediaData = await response.json();
        // 初期表示
        switchMedia('spotify');
    } catch (error) {
        console.error('Media data loading failed:', error);
    }
});

function switchMedia(type) {
    if (!allMediaData) return;

    const leftContainer = document.getElementById('js-media-list-left');
    const rightContainer = document.getElementById('js-media-list-right');
    const titleElement = document.getElementById('js-media-title');
    
    // スイッチの見た目切り替え
    document.querySelectorAll('.media-switch-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${type}`).classList.add('active');

    // データの切り替え
    let list = [];
    if (type === 'spotify') {
        list = allMediaData.spotify;
        titleElement.textContent = "Podcast Archive";
    } else {
        list = allMediaData.youtube;
        titleElement.textContent = "YouTube Archive";
    }

    // 左右に振り分け
    const halfIndex = Math.ceil(list.length / 2);
    const leftList = list.slice(0, halfIndex);
    const rightList = list.slice(halfIndex);

    // リストの描画
    renderMediaCard(leftList, leftContainer, type, 0);
    renderMediaCard(rightList, rightContainer, type, halfIndex);
}


// ▼ カード生成（ここを修正しました）
function renderMediaCard(list, container, type, startIndex) {
    let html = '';
    
    // アイコン（カード上の装飾用）
    // ★ここが修正ポイント！
    let iconClass = 'fa-spotify'; // デフォルト（spotify用）をSpotifyに
    if (type === 'youtube') iconClass = 'fa-youtube';
    if (type === 'spotify') iconClass = 'fa-spotify'; // 明示的に指定

    list.forEach((item, index) => {
        // 通し番号（背番号）を計算
        const globalIndex = startIndex + index;
        
        const imagePath = item.image ? item.image : 'images/home/IMG_0906.jpg';

        html += `
            <div class="media-card-link" onclick="openMediaModal('${type}', ${globalIndex})">
                <div class="media-card-img-wrap">
                    <img src="${imagePath}" alt="${item.title}">
                    <div class="media-card-icon">
                        <i class="fa-brands ${iconClass}"></i>
                    </div>
                </div>
                <div class="media-card-body">
                    <h3>${item.title}</h3>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ▼ モーダルを開く
function openMediaModal(type, index) {
    const item = allMediaData[type][index];
    if (!item) return;

    const modal = document.getElementById('media-modal');
    
    // 画像とテキストをセット
    document.getElementById('modal-img').src = item.image ? item.image : 'images/home/IMG_0906.jpg';
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-caption').textContent = item.caption;

    // リンクボタンを生成
    const linksArea = document.getElementById('modal-links-area');
    linksArea.innerHTML = ''; 

    if (item.links && item.links.length > 0) {
        item.links.forEach(link => {
            let btnClass = 'btn-default';
            const nameLower = link.name.toLowerCase();
            if (nameLower.includes('spotify')) btnClass = 'btn-spotify';
            if (nameLower.includes('apple')) btnClass = 'btn-apple';
            if (nameLower.includes('youtube')) btnClass = 'btn-youtube';
            if (nameLower.includes('note')) btnClass = 'btn-note';

            const icon = link.icon ? link.icon : 'fa-arrow-up-right-from-square';

            const btnHtml = `
                <a href="${link.url}" target="_blank" class="modal-link-btn ${btnClass}">
                    <i class="fa-brands ${icon}"></i> ${link.name}
                </a>
            `;
            linksArea.insertAdjacentHTML('beforeend', btnHtml);
        });
    } else {
        linksArea.innerHTML = '<p style="text-align:center; color:#999; font-size:0.9rem;">リンクはありません</p>';
    }

    modal.classList.add('active');
}

// ▼ モーダルを閉じる
function closeMediaModal() {
    document.getElementById('media-modal').classList.remove('active');
}

// 背景クリックで閉じる
document.getElementById('media-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeMediaModal();
    }
});