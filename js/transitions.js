// Hiệu ứng chuyển trang mượt cho web đa trang (MPA)
// - Trình duyệt mới: dùng Cross-document View Transitions (chỉ cần CSS, không chặn click)
// - Trình duyệt cũ: fade-in khi mở trang + fade-out khi bấm link nội bộ rồi mới chuyển
// Tôn trọng prefers-reduced-motion. Cách dùng: <script src="js/transitions.js?v=1"></script>
(function () {
  'use strict';

  var LEAVE_MS = 220;

  var css =
    '@view-transition{navigation:auto;}' +
    'body{animation:dawn-page-in .45s ease both;}' +
    '@keyframes dawn-page-in{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}' +
    'body.dawn-leave{animation:none;opacity:0;transform:translateY(6px);' +
    'transition:opacity .22s ease,transform .22s ease;}' +
    '@media (prefers-reduced-motion:reduce){' +
    'body{animation:none;}' +
    'body.dawn-leave{transition:none;}' +
    '}';

  var style = document.createElement('style');
  style.id = 'dawn-transitions-css';
  style.textContent = css;
  document.head.appendChild(style);

  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Trình duyệt hỗ trợ View Transitions: để browser tự xử lý, không chặn click
  if (!reduceMotion && 'startViewTransition' in document) return;

  function isInternalLink(a) {
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#') return false;
    if (a.target === '_blank' || a.hasAttribute('download')) return false;
    if (/^(mailto:|tel:|sms:|javascript:|data:|blob:)/i.test(href)) return false;
    var url;
    try {
      url = new URL(href, location.href);
    } catch (e) {
      return false;
    }
    if (url.origin !== location.origin) return false;
    // Cùng trang chỉ khác hash: để browser cuộn mặc định
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return false;
    return true;
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || !isInternalLink(a)) return;
    var href = a.href;
    if (reduceMotion) return; // chuyển ngay, không hiệu ứng
    e.preventDefault();
    document.body.classList.add('dawn-leave');
    setTimeout(function () {
      location.href = href;
    }, LEAVE_MS);
  });
})();
