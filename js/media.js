let allMediaData = null;

document.addEventListener('DOMContentLoaded', async () => {
    const jsonPath = 'data/media.json';
    try {
        const response = await fetch(jsonPath);
        allMediaData = await response.json();
        
        // 初期表示
        switchMedia('round1');
    } catch (error) {
        console.error('Media data loading failed:', error);
    }
});

function switchMedia(type) {
    if (!allMediaData) return;

    const leftContainer = document.getElementById('js-media-list-left');
    const rightContainer = document.getElementById('js-media-list-right');
    const titleElement = document.getElementById('js-media-title');
    const descElement = document.getElementById('js-media-desc');
    
    // スイッチボタンの見た目切り替え
    document.querySelectorAll('.media-switch-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${type}`);
    if (activeBtn) activeBtn.classList.add('active');

    // データの切り替え
    let list = [];
    if (type === 'round1') {
        list = allMediaData.round1; 
        titleElement.textContent = "Round 1";
    } else {
        list = allMediaData.round2; 
        titleElement.textContent = "Round 2";
    }

    // 説明文の切り替え
    if (allMediaData.descriptions && allMediaData.descriptions[type]) {
        descElement.innerHTML = allMediaData.descriptions[type];
    } else {
        descElement.innerHTML = "";
    }

    // 左右に振り分け
    const halfIndex = Math.ceil(list.length / 2);
    const leftList = list.slice(0, halfIndex);
    const rightList = list.slice(halfIndex);

    // リストの描画
    renderMediaCard(leftList, leftContainer, type, 0);
    renderMediaCard(rightList, rightContainer, type, halfIndex);
}


// ▼ カード生成
function renderMediaCard(list, container, type, startIndex) {
    let html = '';

    list.forEach((item, index) => {
        const globalIndex = startIndex + index;
        const imagePath = item.image ? item.image : 'images/home/IMG_0906.jpg';

        html += `
            <div class="media-card-link" onclick="openMediaModal('${type}', ${globalIndex})">
                <div class="media-card-img-wrap">
                    <img src="${imagePath}" alt="${item.title}">
                </div>
                <div class="media-card-body">
                    <h3>${item.title}</h3>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ▼ モーダルを開く（画像出し分け ＆ Noteアイコン対応版）
function openMediaModal(type, index) {
    const item = allMediaData[type][index];
    if (!item) return;

    const modal = document.getElementById('media-modal');
    
    // ▼▼▼ 画像の出し分けロジック（ここが新しい部分！） ▼▼▼
    // item.modalImage があればそれを使い、なければ item.image を使い、それもなければデフォルト画像を使う
    let displayImage = 'images/home/IMG_0906.jpg'; // 万が一のデフォルト
    
    if (item.modalImage) {
        displayImage = item.modalImage; // モーダル専用画像があれば優先
    } else if (item.image) {
        displayImage = item.image;      // なければリスト用画像を流用
    }
    
    document.getElementById('modal-img').src = displayImage;
    // ▲▲▲ 出し分けここまで ▲▲▲

    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-caption').textContent = item.caption; 

    // リンクボタンを生成
    const linksArea = document.querySelector('.media-modal-links-simple');
    linksArea.innerHTML = ''; 

    if (item.links && item.links.length > 0) {
        item.links.forEach(link => {
            let btnClass = 'btn-default';
            let iconHtml = ''; 
            
            const nameLower = link.name.toLowerCase();
            
            if (nameLower.includes('spotify')) {
                btnClass = 'btn-spotify';
                iconHtml = '<i class="fa-brands fa-spotify"></i>';
            } else if (nameLower.includes('apple')) {
                btnClass = 'btn-apple';
                iconHtml = '<i class="fa-solid fa-podcast"></i>';
            } else if (nameLower.includes('youtube')) {
                btnClass = 'btn-youtube';
                iconHtml = '<i class="fa-brands fa-youtube"></i>';
            } else if (nameLower.includes('note')) {
                btnClass = 'btn-note';
                iconHtml = ''; // Noteはアイコンなし
            } else {
                iconHtml = '<i class="fa-solid fa-arrow-up-right-from-square"></i>';
            }

            const btnHtml = `
                <a href="${link.url}" target="_blank" class="modal-link-btn-simple ${btnClass}">
                    ${iconHtml} ${link.name}
                </a>
            `;
            linksArea.insertAdjacentHTML('beforeend', btnHtml);
        });
    }

    modal.classList.add('active');
}

// ▼ モーダルを閉じる
function closeMediaModal() {
    const modal = document.getElementById('media-modal');
    if(modal) {
        modal.classList.remove('active');
    }
}
// グローバルスコープにも確保
window.closeMediaModal = closeMediaModal;

// 背景クリックで閉じる
document.getElementById('media-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeMediaModal();
    }
});