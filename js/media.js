let allMediaData = null; // データをここに保存しておく

document.addEventListener('DOMContentLoaded', async () => {
    const jsonPath = 'data/media.json';

    try {
        const response = await fetch(jsonPath);
        allMediaData = await response.json();

        // 最初はPodcastを表示（ここを 'youtube' にすればYouTubeが初期表示）
        switchMedia('podcast');

    } catch (error) {
        console.error('Media data loading failed:', error);
    }
});

// ▼ 切り替え関数（HTMLのボタンから呼ばれます）
function switchMedia(type) {
    if (!allMediaData) return;

    const leftContainer = document.getElementById('js-media-list-left');
    const rightContainer = document.getElementById('js-media-list-right');
    const titleElement = document.getElementById('js-media-title');
    
    // 1. ボタンの見た目を切り替え
    document.querySelectorAll('.media-switch-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${type}`).classList.add('active');

    // 2. データを取得して左右に振り分け
    let list = [];
    if (type === 'podcast') {
        list = allMediaData.podcast;
        titleElement.textContent = "Podcast & Radio";
    } else {
        list = allMediaData.youtube;
        titleElement.textContent = "YouTube Archive";
    }

    // リストを半分で分割
    const halfIndex = Math.ceil(list.length / 2);
    const leftList = list.slice(0, halfIndex);
    const rightList = list.slice(halfIndex);

    // 3. 画面に表示
    if (type === 'podcast') {
        renderPodcast(leftList, leftContainer);
        renderPodcast(rightList, rightContainer);
    } else {
        renderYoutube(leftList, leftContainer);
        renderYoutube(rightList, rightContainer);
    }
}


// ▼ YouTubeカード生成
function renderYoutube(list, container) {
    let html = '';
    list.forEach(item => {
        html += `
            <div class="media-item" style="margin-bottom: 40px;">
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/${item.videoId}" 
                        title="YouTube video player" frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
                <h3 style="font-size: 1rem; margin: 10px 0 5px; font-weight: bold;">${item.title}</h3>
                <p class="video-caption" style="text-align: left; margin-top: 0;">
                    ${item.date} <br> ${item.caption}
                </p>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ▼ Podcastカード生成
function renderPodcast(list, container) {
    let html = '';
    list.forEach(item => {
        html += `
            <a href="${item.url}" target="_blank" class="article-item">
                <div style="flex: 1;">
                    <div style="display:flex; align-items:center; margin-bottom:5px;">
                        <span class="article-tag" style="background:${item.tag === 'Spotify' ? '#1DB954' : '#999'}">${item.tag}</span>
                        <span style="font-size: 0.8rem; color: #888;">${item.date}</span>
                    </div>
                    <span class="article-title">${item.title}</span>
                </div>
                <i class="fa-solid fa-circle-play" style="font-size: 1.5rem; color: #ccc; margin-left: 15px;"></i>
            </a>
        `;
    });
    container.innerHTML = html;
}