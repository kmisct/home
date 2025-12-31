document.addEventListener('DOMContentLoaded', async () => {
    // データファイルのパス (名前を変えた場合はここも修正)
    const jsonPath = 'data/member.json';

    try {
        const response = await fetch(jsonPath);
        const data = await response.json();

        // 1. 代表エリア (member.html用)
        const repContainer = document.getElementById('js-rep-container');
        if (repContainer && data.representative) {
            renderRepresentative(data.representative, repContainer);
        }

        // 2. 現役メンバーエリア (member.html用)
        const memContainer = document.getElementById('js-members-container');
        if (memContainer && data.members) {
            renderGridMembers(data.members, memContainer);
        }

        // 3. アドバイザーエリア (member.html用)
        const advContainer = document.getElementById('js-advisors-container');
        if (advContainer && data.advisors) {
            renderGridMembers(data.advisors, advContainer);
        }

        // 4. 過去メンバーエリア (past_member.html用)
        const alumniContainer = document.getElementById('js-alumni-container');
        if (alumniContainer && data.alumni) {
            renderGridMembers(data.alumni, alumniContainer);
        }

    } catch (error) {
        console.error('Members data loading failed:', error);
    }
});


// ▼ 代表用（横並びレイアウト）の生成関数
function renderRepresentative(list, container) {
    let html = '';
    list.forEach(item => {
        const imgPath = item.image ? item.image : 'images/home/IMG_0906.jpg';

        html += `
            <div class="rep-layout">
                <div class="member-img">
                    <img src="${imgPath}" alt="${item.name}">
                </div>
                <div class="member-text">
                    <h3 class="member-name">${item.name} <span class="member-en">${item.en}</span></h3>
                    <p class="member-affil">${item.affil}</p>
                    <p class="member-comment">${item.comment}</p>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ▼ メンバー・アドバイザー・過去メンバー用（グリッドレイアウト）の生成関数
function renderGridMembers(list, container) {
    let html = '';
    list.forEach(item => {
        const imgPath = item.image ? item.image : 'images/home/IMG_0906.jpg';

        // 藤原さんのような特殊リンクがある場合の処理
        let nameHtml = item.name;
        if (item.customNameHtml) {
            nameHtml = item.customNameHtml; 
        }

        // 特別なボタンがある場合
        let extraLinkHtml = '';
        if (item.link && item.linkText) {
            extraLinkHtml = `
                <div style="margin-top: 15px;">
                    <a href="${item.link}" class="btn-more" style="font-size: 0.8rem; padding: 8px 20px;">
                        ${item.linkText}
                    </a>
                </div>
            `;
        }

        html += `
            <div class="member-card">
                <div class="member-img">
                    <img src="${imgPath}" alt="${item.name}">
                </div>
                <div class="member-info">
                    <h4 class="member-name">${nameHtml} <span class="member-en">${item.en}</span></h4>
                    <p class="member-affil">${item.affil}</p>
                    <p class="member-comment">${item.comment}</p>
                    ${extraLinkHtml}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}