document.addEventListener("DOMContentLoaded", function() {
    const headerPlaceholder = document.getElementById("header-placeholder");
    const footerPlaceholder = document.getElementById("footer-placeholder");
    
    // パス調整（下層ページ用）
    const rootPath = window.rootPath || ''; 

    // ヘッダーのHTML
    // ★ここに <div class="menu-toggle"></div> が入っていることを確認
    const headerHTML = `
    <header class="page-header js-fade-down">
        <a href="${rootPath}index.html" class="logo">KMI SCT</a>
        <div class="menu-toggle"><i class="fa-solid fa-bars"></i></div>
        <nav>
            <ul class="nav-list">
                <li><a href="${rootPath}news.html">NEWS</a></li>
                <li><a href="${rootPath}events.html">EVENTS</a></li>
                <li><a href="${rootPath}members.html">MEMBERS</a></li>
                <li><a href="${rootPath}contents.html">CONTENTS</a></li>
                <li><a href="${rootPath}about.html">ABOUT</a></li>
                <li><a href="${rootPath}contact.html">CONTACT</a></li>
            </ul>
        </nav>
    </header>
    `;

    // フッターのHTML（内容は既存のfooterに準拠）
    const footerHTML = `
    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-left">
                    <a href="${rootPath}index.html" class="footer-logo" style="text-decoration: none;">KMI SCT</a>
                    <p class="footer-desc">
                        名古屋大学 素粒子宇宙起源研究所 (KMI)<br>
                        Science Communication Team
                    </p>
                    <div class="social-links">
                        <a href="https://twitter.com/KMI_NagoyaU" target="_blank"><i class="fa-brands fa-x-twitter"></i></a>
                        <a href="https://www.instagram.com/kmi_nagoyau/" target="_blank"><i class="fa-brands fa-instagram"></i></a>
                        <a href="https://www.youtube.com/channel/UC... " target="_blank"><i class="fa-brands fa-youtube"></i></a>
                    </div>
                </div>
                <nav class="footer-nav">
                    <ul>
                        <li><a href="${rootPath}news.html">NEWS</a></li>
                        <li><a href="${rootPath}events.html">EVENTS</a></li>
                        <li><a href="${rootPath}members.html">MEMBERS</a></li>
                        <li><a href="${rootPath}contents.html">CONTENTS</a></li>
                        <li><a href="${rootPath}about.html">ABOUT</a></li>
                        <li><a href="${rootPath}contact.html">CONTACT</a></li>
                    </ul>
                </nav>
            </div>
            
            <div class="footer-kmi-link">
                <a href="https://www.kmi.nagoya-u.ac.jp/" target="_blank" class="kmi-link-container">
                    <img src="${rootPath}images/logo/kmi_logo.png" alt="KMI Logo" class="kmi-footer-logo-img">
                    <span class="kmi-footer-text">Kobayashi-Maskawa Institute<br>for the Origin of Particles and the Universe</span>
                </a>
            </div>

            <div class="footer-legal">
                <a href="${rootPath}privacy.html">Privacy Policy</a>
            </div>
            <div class="copyright">
                &copy; 2024 KMI Science Communication Team.
            </div>
        </div>
    </footer>
    `;

    if(headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;
        
        // ★ハンバーガーメニューの動作スクリプトを追加
        initMobileMenu();
    }
    
    if(footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;
});

// ▼▼▼ ハンバーガーメニュー制御関数 ▼▼▼
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            // メニューの出し入れ
            navList.classList.toggle('active');
            
            // アイコンの切り替え (三本線 <-> バツ印)
            const icon = menuToggle.querySelector('i');
            if (navList.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // リンクをクリックしたらメニューを閉じる
        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }
}