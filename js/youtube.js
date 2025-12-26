// ★ここに調べたチャンネルIDを入れてください
const CHANNEL_ID = 'UCrEhyG4Bm4SZxjpHETyW7dA'; 

// RSSをJSONに変換してくれるサービスを使って最新動画を取得
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

async function loadLatestVideo() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            // 最新の動画データを取り出す
            const latestVideo = data.items[0];
            
            // 動画IDを抽出（URLから ID 部分を取り出す）
            // link: "https://www.youtube.com/watch?v=VIDEO_ID"
            const videoId = latestVideo.link.split('v=')[1];

            // iframeのsrcを書き換える
            const iframe = document.getElementById('latest-video-iframe');
            if (iframe && videoId) {
                iframe.src = `https://www.youtube.com/embed/${videoId}`;
            }
        }
    } catch (error) {
        console.error('YouTube loading error:', error);
    }
}

// 読み込み完了時に実行
document.addEventListener('DOMContentLoaded', loadLatestVideo);