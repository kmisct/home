const MEDIA_JSON_URL = 'data/youtube_podcast.json';

// グローバル変数としてデータを保持（モーダル表示で使うため）
let allMediaData = [];

async function loadMedia() {
    const container = document.getElementById('media-timeline');
    if (!container) return;

    try {
        const response = await fetch(MEDIA_JSON_URL);
        const data = await response.json();
        
        // データを保持
        allMediaData = data;

        // 日付順（新しい順）
        allMediaData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // 初期表示
        renderTimeline(allMediaData);
        setupModal(); // モーダルの準備

        // フィルター動作
        setupFilters();

    } catch (error) {
        console.error('Media loading error:', error);
    }
}

function renderTimeline(items) {
    const container = document.getElementById('media-timeline');
    container.innerHTML = '';

    items.forEach((item, index) => {
        let thumbUrl = '';
        let badgeColor = '#333';
        let badgeText = item.type;

        // タイプごとの設定
        if (item.type === 'YOUTUBE') {
            thumbUrl = `https://img.youtube.com/vi/${item.id}/mqdefault.jpg`;
            badgeColor = '#ff0000';
            if (item.category === 'ROUND_TABLE') {
                badgeColor = '#e67e22';
                badgeText = 'Round Table';
            }
        } else if (item.type === 'PODCAST') {
            thumbUrl = item.image; 
            badgeColor = '#8e44ad';
        }

        // HTML生成（クリック時に openMediaModal を呼ぶ）
        // data-index を使って、クリックされたのが何番目のデータか特定します
        const html = `
            <div class="timeline-item js-fade-up" onclick="openMediaModal(${index})">
                <div class="timeline-card">
                    <div class="member-img" style="height: 180px; margin-bottom: 15px;">
                        <img src="${thumbUrl}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
                    </div>
                    <div class="member-info">
                        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                            <span class="news-badge" style="background-color: ${badgeColor};">${badgeText}</span>
                            <span style="font-size:0.8rem; color:#888;">${item.date}</span>
                        </div>
                        <h4 style="font-size:1rem; margin-bottom:5px;">${item.title}</h4>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// モーダルを開く関数
function openMediaModal(index) {
    // 表示中のリストの中からデータを取得する必要があるため、
    // ここでは簡易的に allMediaData から取得していますが、
    // 本来はフィルタリング後のリストから取るのが正確です。
    // 今回は簡易版として実装します。
    
    // 現在表示されている要素からIDを探すなどの工夫が必要ですが、
    // シンプルに「データそのもの」を引数に渡す方式に変えます。
    // ※HTML生成部分の onclick を修正するのが面倒なので、
    // 配列の再検索を行います。
    
    const targetItem = allMediaData[index]; // フィルタ時はここがずれる可能性あり！注意
    // ★修正: render時に「元のデータのID」などを埋め込むのがベストですが、
    // 今回はシンプルに「クリックされた要素のデータ」を表示させます。
    
    // 正しい実装:
    // renderTimeline で items を使うので、その items[index] を使いたい。
    // グローバル変数 currentItems を用意します。
}

// フィルタリング対応のための変数
let currentItems = [];

function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterType = btn.getAttribute('data-filter');
            if (filterType === 'all') {
                currentItems = allMediaData;
            } else {
                currentItems = allMediaData.filter(item => item.type === filterType);
            }
            renderTimeline(currentItems);
        });
    });
    // 初期状態
    currentItems = allMediaData;
}

// 上書き: 正しいモーダル表示関数
window.openMediaModal = function(index) {
    const item = currentItems[index]; // 現在表示中のリストから取得
    const modalContent = document.getElementById('modal-content');
    const overlay = document.getElementById('modal-overlay');

    let linkUrl = item.type === 'YOUTUBE' ? `https://www.youtube.com/watch?v=${item.id}` : item.url;
    let btnText = item.type === 'YOUTUBE' ? 'YouTubeで見る' : 'Podcastを聴く';
    let thumbUrl = item.type === 'YOUTUBE' ? `https://img.youtube.com/vi/${item.id}/hqdefault.jpg` : item.image;

    const html = `
        <div class="modal-inner">
            <div class="modal-image">
                <img src="${thumbUrl}" alt="${item.title}" style="width:100%; border-radius:8px;">
            </div>
            <div class="modal-text">
                <span class="modal-date" style="display:block; margin-bottom:10px; color:#888;">${item.date}</span>
                <h3 class="modal-title" style="margin-bottom:20px;">${item.title}</h3>
                <p class="modal-desc" style="margin-bottom:30px;">${item.desc}</p>
                <a href="${linkUrl}" target="_blank" class="modal-btn">${btnText}</a>
            </div>
        </div>
    `;
    modalContent.innerHTML = html;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};

function setupModal() {
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close-btn');

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', loadMedia);