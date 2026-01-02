let allMediaData = null;

document.addEventListener('DOMContentLoaded', async () => {
    const jsonPath = 'data/media.json';
    try {
        const response = await fetch(jsonPath);
        allMediaData = await response.json();
        
        // ★初期表示を 'round1' に変更しました
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
    
    // スイッチボタンの見た目切り替え
    document.querySelectorAll('.media-switch-btn').forEach(btn => btn.classList.remove('active'));
    // ボタンIDも html に合わせて btn-round1 / btn-round2 を探します
    const activeBtn = document.getElementById(`btn-${type}`);
    if (activeBtn) activeBtn.classList.add('active');

    // データの切り替え（JSONのキー "round1", "round2" を読みに行きます）
    let list = [];
    if (type === 'round1') {
        list = allMediaData.round1; 
        titleElement.textContent = "Round 1";
    } else {
        list = allMediaData.round2; 
        titleElement.textContent = "Round 2";
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
    
    // カードの右下アイコン
    // ご希望通り Spotify アイコンに統一しています
    let iconClass = 'fa-spotify'; 

    list.forEach((item, index) => {
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
    // type (round1 or round2) と index でデータを探す
    const item = allMediaData[type][index];
    if (!item) return;

    const modal = document.getElementById('media-modal');
    
    // 画像とテキストをセット
    document.getElementById('modal-img').src = item.image ? item.image : 'images/home/IMG_0906.jpg';
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-caption').textContent = item.caption; // ここに説明文が入ります

    // リンクボタンを生成
    const linksArea = document.getElementById('modal-links-area');
    linksArea.innerHTML = ''; // クリア

    if (item.links && item.links.length > 0) {
        item.links.forEach(link => {
            let btnClass = 'btn-default';
            const nameLower = link.name.toLowerCase();
            
            // リンクごとの色分け
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

    // モーダル表示
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