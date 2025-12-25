// 共通パーツを読み込む関数
async function loadPart(id, url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const text = await response.text();
            document.getElementById(id).innerHTML = text;
        } else {
            console.error(`Failed to load ${url}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
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
            navList.classList.toggle('is-open');
        });
    }
});