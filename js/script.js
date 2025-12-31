/* =========================================
   スクロールアニメーション & メニュー動作
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {

    // 1. ふわっと浮き上がるアニメーション (js-fade-up)
    // --------------------------------------------------
    const fadeElements = document.querySelectorAll('.js-fade-up');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 画面に入ったら 'is-active' クラスをつける
                entry.target.classList.add('is-active');
            }
        });
    }, {
        rootMargin: '0px 0px -100px 0px' // 少し手前で表示させる調整
    });

    fadeElements.forEach(el => observer.observe(el));


    // 2. スマホメニューの開閉 (もしヘッダーにあれば)
    // --------------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            // アイコンを×印にするなどのクラス切り替えもここで可能
        });
    }

});