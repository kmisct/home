// 共通パーツを読み込む関数
async function loadPart(id, url) {
    // 階層の調整（articleフォルダなら ../ をつける）
    const rootPath = window.rootPath || ''; 
    const fetchUrl = rootPath + url;

    try {
        const response = await fetch(fetchUrl);
        if (response.ok) {
            const text = await response.text();
            const element = document.getElementById(id);
            element.innerHTML = text;

            // ▼▼▼ ロゴをホームへのリンクにする機能 ▼▼▼
            if (id === 'header-placeholder') {
                const logo = element.querySelector('.logo');
                if (logo) {
                    logo.style.cursor = 'pointer'; // マウスカーソルを手の形に
                    logo.addEventListener('click', () => {
                        window.location.href = rootPath + 'index.html';
                    });
                }
            }

            // 読み込んだHTML内のリンク(href, src)を自動修正する
            if (rootPath !== '') {
                // リンク (aタグ)
                element.querySelectorAll('a').forEach(el => {
                    const href = el.getAttribute('href');
                    // 外部サイト(http)やページ内リンク(#)以外なら ../ をつける
                    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('//')) {
                        el.setAttribute('href', rootPath + href);
                    }
                });
                // 画像 (imgタグ)
                element.querySelectorAll('img').forEach(el => {
                    const src = el.getAttribute('src');
                    if (src && !src.startsWith('http') && !src.startsWith('//')) {
                        el.setAttribute('src', rootPath + src);
                    }
                });
            }

        } else {
            console.error(`Failed to load ${fetchUrl}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error loading ${fetchUrl}:`, error);
    }
}

// ページ読み込み完了後に実行
document.addEventListener("DOMContentLoaded", async () => {
    
    // 1. ヘッダーとフッターを並列で読み込む
    await Promise.all([
        loadPart("header-placeholder", "parts/header.html"),
        loadPart("footer-placeholder", "parts/footer.html")
    ]);

    // 2. 読み込みが終わった後に、アニメーションやメニューの動作を設定する
    
    // フェードインアニメーション
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-active');
            }
        });
    }, { rootMargin: '0px 0px -15% 0px' });
    
    // 監視対象の要素を取得（読み込んだヘッダー内のクラスも含む）
    const fadeElements = document.querySelectorAll('.js-fade-up, .js-fade-down');
    fadeElements.forEach(el => observer.observe(el));

    // スマホメニューの開閉
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            // CSSに合わせてクラス名を切り替え
            // もしCSSが .is-open なら 'is-open' のままでOK
            // もしCSSが .active なら 'active' に書き換えてください
            navList.classList.toggle('is-open'); 
        });
    }
});