const NEWS_JSON_URL = 'data/news.json';
const ITEMS_PER_PAGE_NEWS = 20; // ニュースページの表示件数
const ITEMS_PER_PAGE_HOME = 5;  // ホームの表示件数

// データを取得して表示するメイン関数
async function loadNews() {
    try {
        const response = await fetch(NEWS_JSON_URL);
        const data = await response.json();

        // 今いるページによって処理を分ける
        if (document.getElementById('news-list-home')) {
            renderNews(data, 'news-list-home', 1, ITEMS_PER_PAGE_HOME, false);
        } else if (document.getElementById('news-list-page')) {
            setupPagination(data);
        }

    } catch (error) {
        console.error('News loading error:', error);
    }
}

// ニュース記事のHTMLを生成して埋め込む関数
function renderNews(data, targetId, page, perPage, showPagination) {
    const container = document.getElementById(targetId);
    container.innerHTML = ''; // 一旦クリア

    // データの切り出し（ページネーション計算）
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pageData = data.slice(start, end);

    // 記事がない場合
    if (pageData.length === 0) {
        container.innerHTML = '<p class="text-center">お知らせはありません。</p>';
        return;
    }

    // HTML生成
    pageData.forEach(item => {
        const html = `
            <article class="news-card js-fade-up">
                <a href="${item.url}">
                    <div class="news-img">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="news-body">
                        <span class="news-cat">${item.category}</span>
                        <time>${item.date}</time>
                        <h3>${item.title}</h3>
                    </div>
                </a>
            </article>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });

    // アニメーションの再適用（動的に追加した要素のため）
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-active');
        });
    });
    container.querySelectorAll('.js-fade-up').forEach(el => observer.observe(el));
}

// ページネーションの設定関数
function setupPagination(data) {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE_NEWS);
    let currentPage = 1;

    // 初回表示
    renderNews(data, 'news-list-page', currentPage, ITEMS_PER_PAGE_NEWS, true);
    renderPaginationButtons(totalPages, currentPage);

    // ボタン描画関数
    function renderPaginationButtons(total, current) {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';

        if (total <= 1) return; // 1ページしかなければボタン不要

        // 「前へ」ボタン
        if (current > 1) {
            const prevBtn = createButton('< 前へ', () => changePage(current - 1));
            paginationContainer.appendChild(prevBtn);
        }

        // ページ番号ボタン
        for (let i = 1; i <= total; i++) {
            const pageBtn = createButton(i, () => changePage(i));
            if (i === current) pageBtn.classList.add('active');
            paginationContainer.appendChild(pageBtn);
        }

        // 「次へ」ボタン
        if (current < total) {
            const nextBtn = createButton('次へ >', () => changePage(current + 1));
            paginationContainer.appendChild(nextBtn);
        }
    }

    // ページ切り替え処理
    function changePage(newPage) {
        currentPage = newPage;
        renderNews(data, 'news-list-page', currentPage, ITEMS_PER_PAGE_NEWS, true);
        renderPaginationButtons(totalPages, currentPage);
        // ページトップへスクロール
        const target = document.querySelector('.content-section');
        if(target) target.scrollIntoView({behavior: 'smooth'});
    }

    // ボタン生成ヘルパー
    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.className = 'pagination-btn';
        btn.addEventListener('click', onClick);
        return btn;
    }
}

// 実行
document.addEventListener('DOMContentLoaded', loadNews);