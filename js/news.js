const NEWS_JSON_URL = 'data/news.json';
const ITEMS_PER_PAGE_NEWS = 20; // ニュースページの表示件数
const ITEMS_PER_PAGE_HOME = 5;  // ホームの表示件数

// メイン処理
async function loadNews() {
    try {
        const response = await fetch(NEWS_JSON_URL);
        const data = await response.json();

        // ホーム画面（最新5件）
        if (document.getElementById('news-list-home')) {
            renderNewsList(data, 'news-list-home', 1, ITEMS_PER_PAGE_HOME);
        } 
        // ニュース一覧画面（20件＋ページ送り）
        else if (document.getElementById('news-list-page')) {
            setupPagination(data);
        }

    } catch (error) {
        console.error('News loading error:', error);
    }
}

// リスト（<li>）を生成して表示する関数
function renderNewsList(data, targetId, page, perPage) {
    const container = document.getElementById(targetId);
    container.innerHTML = ''; // クリア

    // 表示する範囲を計算
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pageData = data.slice(start, end);

    if (pageData.length === 0) {
        container.innerHTML = '<li><span class="update-text">お知らせはありません。</span></li>';
        return;
    }

    // HTML生成
    pageData.forEach(item => {
        // カテゴリがある場合のみ、バッジ用spanタグを生成
        const categoryBadge = item.category ? `<span class="news-badge">${item.category}</span>` : '';

        // ★リンク生成ロジック
        let titleHtml = item.title; // デフォルトは文字のみ

        // URLがあり、かつ "#" ではない場合にリンク化
        if (item.url && item.url.trim() !== "" && item.url !== "#") {
            // httpから始まるなら別タブ(_blank)、それ以外は同タブ(_self)
            const isExternal = item.url.startsWith('http');
            const target = isExternal ? '_blank' : '_self';
            
            // クラス news-link を付与してデザインを適用
            titleHtml = `<a href="${item.url}" class="news-link" target="${target}">${item.title}</a>`;
        } else {
            // リンクがない場合もレイアウト崩れ防止のため span で囲む
            titleHtml = `<span class="news-no-link">${item.title}</span>`;
        }

        const html = `
            <li>
                <span class="update-date">${item.date}</span>
                <span class="update-text" style="display: flex; align-items: center; flex-wrap: wrap;">
                    ${categoryBadge}
                    <div style="margin-left: 10px; flex: 1;">
                        ${titleHtml}
                    </div>
                </span>
            </li>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// ページネーション機能
function setupPagination(data) {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE_NEWS);
    let currentPage = 1;

    // 初回表示
    renderNewsList(data, 'news-list-page', currentPage, ITEMS_PER_PAGE_NEWS);
    renderPaginationButtons(totalPages, currentPage);

    function renderPaginationButtons(total, current) {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;
        
        paginationContainer.innerHTML = '';
        if (total <= 1) return;

        // 前へ
        if (current > 1) {
            paginationContainer.appendChild(createButton('< 前へ', () => changePage(current - 1)));
        }

        // ページ番号
        for (let i = 1; i <= total; i++) {
            const btn = createButton(i, () => changePage(i));
            if (i === current) btn.classList.add('active');
            paginationContainer.appendChild(btn);
        }

        // 次へ
        if (current < total) {
            paginationContainer.appendChild(createButton('次へ >', () => changePage(current + 1)));
        }
    }

    function changePage(newPage) {
        currentPage = newPage;
        renderNewsList(data, 'news-list-page', currentPage, ITEMS_PER_PAGE_NEWS);
        renderPaginationButtons(totalPages, currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.className = 'pagination-btn';
        btn.addEventListener('click', onClick);
        return btn;
    }
}

document.addEventListener('DOMContentLoaded', loadNews);