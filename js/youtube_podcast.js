const MEDIA_JSON_URL = 'data/youtube_podcast.json';

async function loadMedia() {
    const container = document.getElementById('media-grid');
    if (!container) return;

    try {
        const response = await fetch(MEDIA_JSON_URL);
        const data = await response.json();

        // 日付順（新しい順）
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        // 初期表示（全件）
        renderMedia(data);

        // フィルターボタンの動作
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterType = btn.getAttribute('data-filter');
                if (filterType === 'all') {
                    renderMedia(data);
                } else {
                    // YouTubeもPodcastも type でフィルタリング
                    const filtered = data.filter(item => item.type === filterType);
                    renderMedia(filtered);
                }
            });
        });

    } catch (error) {
        console.error('Media loading error:', error);
    }
}

function renderMedia(items) {
    const container = document.getElementById('media-grid');
    container.innerHTML = '';

    items.forEach(item => {
        let thumbUrl = '';
        let linkUrl = '';
        let iconHtml = '';
        let badgeColor = '#333';
        let badgeText = '';

        // YouTubeの場合の設定
        if (item.type === 'YOUTUBE') {
            thumbUrl = `https://img.youtube.com/vi/${item.id}/mqdefault.jpg`;
            linkUrl = `https://www.youtube.com/watch?v=${item.id}`;
            iconHtml = '<i class="fa-solid fa-play" style="color: white; font-size: 1.2rem; margin-left: 3px;"></i>';
            
            // カテゴリによるバッジ分け
            if (item.category === 'ROUND_TABLE') {
                badgeColor = '#e67e22'; 
                badgeText = 'YouTube / Round Table';
            } else {
                badgeColor = '#ff0000';
                badgeText = 'YouTube';
            }
        } 
        // Podcastの場合の設定
        else if (item.type === 'PODCAST') {
            thumbUrl = item.image; // JSONで指定した画像
            linkUrl = item.url;
            iconHtml = '<i class="fa-solid fa-headphones" style="color: white; font-size: 1.2rem;"></i>';
            badgeColor = '#8e44ad';
            badgeText = 'Podcast';
        }

        const html = `
            <div class="member-card js-fade-up">
                <a href="${linkUrl}" target="_blank" style="text-decoration: none; color: inherit;">
                    <div class="member-img" style="position: relative;">
                        <img src="${thumbUrl}" alt="${item.title}" style="object-fit: cover;">
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                    width: 50px; height: 50px; background: rgba(0,0,0,0.6); border-radius: 50%;
                                    display: flex; align-items: center; justify-content: center;">
                            ${iconHtml}
                        </div>
                    </div>
                    <div class="member-info">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span class="news-badge" style="background-color: ${badgeColor};">${badgeText}</span>
                            <span style="font-size: 0.8rem; color: #888;">${item.date}</span>
                        </div>
                        <h4 style="margin-bottom: 10px; font-size: 1rem;">${item.title}</h4>
                        <p class="member-comment">${item.desc}</p>
                    </div>
                </a>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

document.addEventListener('DOMContentLoaded', loadMedia);