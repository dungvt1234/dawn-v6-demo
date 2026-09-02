// Shared header/footer for MẦM NON BÌNH MINH v6 — design v4 editorial style
// Usage: <div data-include="header"></div> ... <div data-include="footer"></div>
(function () {
  const PAGE = location.pathname.split('/').pop() || 'index.html';
  const DEMO_URL = 'https://school-os-eta.vercel.app';

  const NAV = [
    { href: 'index.html', label: 'TRANG CHỦ', key: 'index' },
    {
      href: 'gioi-thieu.html', label: 'GIỚI THIỆU', key: 'about',
      children: [
        { href: 'gioi-thieu.html', label: 'Về chúng tôi', key: 'about' },
        { href: 'chuong-trinh.html', label: 'Chương trình học', key: 'program' },
        { href: 'moi-truong.html', label: 'Cơ sở vật chất', key: 'about' },
        { href: 'doi-ngu.html', label: 'Đội ngũ giáo viên', key: 'about' }
      ]
    },
    {
      href: '#', label: 'THÔNG TIN', key: 'info',
      children: [
        { href: 'tuyen-sinh.html', label: 'Quy trình tuyển sinh', key: 'info' },
        { href: 'hoc-phi.html', label: 'Học phí & ưu đãi', key: 'info' },
        { href: 'gallery.html', label: 'Thư viện ảnh', key: 'info' }
      ]
    },
    { href: 'chuong-trinh.html', label: 'CHƯƠNG TRÌNH HỌC', key: 'program' },
    { href: 'tin-tuc.html', label: 'TIN TỨC & SỰ KIỆN', key: 'news' },
    { href: 'lien-he.html', label: 'LIÊN HỆ', key: 'contact' }
  ];
  const activeKey = {
    'index.html': 'index',
    'gioi-thieu.html': 'about',
    'doi-ngu.html': 'about',
    'chuong-trinh.html': 'program',
    'sinh-hoat.html': 'program',
    'hoc-phi.html': 'info',
    'tuyen-sinh.html': 'info',
    'cau-hoi.html': 'program',
    'moi-truong.html': 'about',
    'hoat-dong.html': 'about',
    'dinh-duong.html': 'about',
    'tin-tuc.html': 'news',
    'gallery.html': 'info',
    'lien-he.html': 'contact',
    'dang-ky.html': 'contact'
  }[PAGE] || 'index';

  const navLinks = NAV.map(n => {
    if (n.children) {
      return `
 <div class="relative group">
  <a href="${n.href}" class="inline-flex items-center gap-1.5 text-[13px] font-medium tracking-[0.06em] uppercase transition-colors focus-ring${activeKey === n.key ? ' text-plum font-bold' : ' text-charcoal/70 hover:text-plum'}" style="${activeKey === n.key ? 'color:var(--plum);' : ''}">
   ${n.label} <i data-lucide="chevron-down" class="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180"></i>
  </a>
  <div class="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
   <div class="bg-white rounded-2xl shadow-2xl border border-forest/10 py-2 min-w-[240px]">
    ${n.children.map(c => `<a href="${c.href}" class="block px-5 py-3 text-[13px] font-medium tracking-[0.03em] transition-colors focus-ring ${PAGE === c.href ? 'text-plum font-bold bg-forest/5' : 'text-charcoal/70 hover:text-plum hover:bg-forest/5'}" style="${PAGE === c.href ? 'color:var(--plum);' : ''}">${c.label}</a>`).join('\n    ')}
   </div>
  </div>
 </div>`;
    }
    return `<a href="${n.href}" class="text-[13px] font-medium tracking-[0.06em] uppercase transition-colors focus-ring${activeKey === n.key ? ' text-plum font-bold' : ' text-charcoal/70 hover:text-plum'}" style="${activeKey === n.key ? 'color:var(--plum);' : ''}">${n.label}</a>`;
  }).join('\n ');

  const mobileLinks = NAV.map(n => {
    if (n.children) {
      const hasActiveChild = n.children.some(c => PAGE === c.href);
      const isActive = activeKey === n.key || hasActiveChild;
      return `
 <div class="border-b border-forest/5">
  <button type="button" class="mobile-nav-toggle w-full flex items-center justify-between gap-2 py-3 text-left focus-ring" aria-expanded="${hasActiveChild ? 'true' : 'false'}" aria-controls="mobile-sub-${n.key}">
   <span class="text-base font-semibold${isActive ? ' text-plum' : ' text-charcoal'}" style="${isActive ? 'color:var(--plum);' : 'color:var(--charcoal);'}">${n.label}</span>
   <i data-lucide="chevron-down" class="w-4 h-4 shrink-0 transition-transform duration-300${hasActiveChild ? ' rotate-180' : ''}" style="color:var(--muted);"></i>
  </button>
  <div id="mobile-sub-${n.key}" class="${hasActiveChild ? '' : 'hidden'} pl-4 pb-3 flex flex-col gap-1">
   ${n.children.map(c => `<a href="${c.href}" class="text-sm font-medium py-2 px-3 rounded-lg focus-ring ${PAGE === c.href ? 'text-plum bg-forest/5 font-bold' : 'text-charcoal/70'}" style="${PAGE === c.href ? 'color:var(--plum);' : 'color:var(--charcoal);'}">${c.label}</a>`).join('\n   ')}
  </div>
 </div>`;
    }
    return `<a href="${n.href}" class="block text-base font-semibold py-3 border-b border-forest/5 focus-ring${activeKey === n.key ? ' text-plum' : ' text-charcoal'}" style="${activeKey === n.key ? 'color:var(--plum);' : 'color:var(--charcoal);'}">${n.label}</a>`;
  }).join('\n ');

  const headerHTML = `
<header id="site-header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-[90px] flex items-center" style="background:var(--ivory);">
 <div class="max-w-container w-full mx-auto px-6 md:px-12 flex items-center justify-between">
  <a href="index.html" class="focus-ring flex items-center gap-3 group">
   <img src="img/logo-icon.webp" alt="Mầm non Bình Minh" class="h-11 w-auto transition-transform duration-500 group-hover:scale-105" style="height:44px; width:auto;">
   <div class="flex flex-col leading-tight items-center">
    <span class="font-serif text-base md:text-lg tracking-[0.04em] text-plum font-bold whitespace-nowrap text-center">DAWN KINDERGARTEN</span>
    <span class="text-[9px] md:text-[10px] tracking-[0.24em] text-forest font-bold uppercase mt-0.5 whitespace-nowrap text-center">Mầm Non Bình Minh</span>
   </div>
  </a>
  <nav class="hidden lg:flex items-center gap-7 lg:ml-10">
   ${navLinks}
  </nav>
  <a href="${DEMO_URL}" target="_blank" rel="noopener" class="hidden lg:inline-flex items-center gap-2 ml-6 px-5 py-2.5 rounded-full text-[12px] font-bold tracking-[0.08em] uppercase transition-all duration-300 hover:-translate-y-0.5 focus-ring" style="background:var(--chartreuse); color:var(--forest); box-shadow:0 4px 14px rgba(0,0,0,.12);">🖥️ Dùng thử phần mềm</a>
  <button id="menu-btn" class="lg:hidden p-2 text-forest focus:outline-none focus-ring" aria-label="Mở menu">
   <i data-lucide="menu" class="w-7 h-7"></i>
  </button>
 </div>
</header>
<div id="mobile-menu" class="hidden fixed top-[90px] left-0 right-0 bottom-0 bg-ivory border-b border-forest/10 p-6 flex-col gap-4 shadow-2xl lg:hidden overflow-y-auto overscroll-contain z-[100]" style="-webkit-overflow-scrolling:touch;">
  ${mobileLinks}
  <a href="${DEMO_URL}" target="_blank" rel="noopener" class="mt-4 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-[13px] font-bold tracking-[0.08em] uppercase transition-all duration-300 focus-ring" style="background:var(--chartreuse); color:var(--forest);">🖥️ Dùng thử phần mềm quản lý</a>
 </div>`;

  const footerHTML = `
<footer id="contact" class="bg-plum text-ivory pt-24 pb-12 px-6 md:px-12 mt-12">
 <div class="max-w-container mx-auto">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
   <div class="lg:col-span-2">
    <div class="flex flex-col sm:flex-row items-center gap-3 mb-6">
     <img src="img/logo-icon-light.webp" alt="Mầm non Bình Minh" class="h-12 sm:h-16 w-auto shrink-0">
     <div class="flex flex-col leading-tight items-center min-w-0">
      <span class="font-serif text-sm sm:text-xl tracking-[0.04em] text-ivory font-bold whitespace-nowrap text-center">DAWN KINDERGARTEN</span>
      <span class="text-[9px] sm:text-[11px] tracking-[0.28em] text-gold font-semibold uppercase mt-1 whitespace-nowrap text-center">Mầm Non Bình Minh</span>
     </div>
    </div>
    <p class="text-ivory/70 text-sm leading-relaxed max-w-sm">
     Nơi khởi đầu cho những bước chân đầu đời — nuôi dưỡng tâm hồn, trí tuệ và thể chất cho mầm non tương lai trong môi trường ngập tràn yêu thương.
    </p>
    <p class="mt-4 text-[11px] tracking-[0.14em] uppercase text-gold/90 font-semibold">Yêu thương · Tôn trọng · An toàn · Phát triển</p>
   </div>
   <div>
    <h4 class="text-xs font-bold tracking-[0.12em] uppercase text-gold mb-5">Khám Phá</h4>
    <ul class="space-y-3.5 text-sm text-ivory/80">
     <li><a href="gioi-thieu.html" class="focus-ring hover:text-gold transition-colors">Về Chúng Tôi</a></li>
     <li><a href="chuong-trinh.html" class="focus-ring hover:text-gold transition-colors">Chương Trình Học</a></li>
     <li><a href="moi-truong.html" class="focus-ring hover:text-gold transition-colors">Cơ Sở Vật Chất</a></li>
     <li><a href="doi-ngu.html" class="focus-ring hover:text-gold transition-colors">Đội Ngũ Giáo Viên</a></li>
    </ul>
   </div>
   <div>
    <h4 class="text-xs font-bold tracking-[0.12em] uppercase text-gold mb-5">Thông Tin</h4>
    <ul class="space-y-3.5 text-sm text-ivory/80">
     <li><a href="tuyen-sinh.html" class="focus-ring hover:text-gold transition-colors">Quy Trình Tuyển Sinh</a></li>
     <li><a href="hoc-phi.html" class="focus-ring hover:text-gold transition-colors">Học Phí &amp; Ưu Đãi</a></li>
     <li><a href="tin-tuc.html" class="focus-ring hover:text-gold transition-colors">Tin Tức &amp; Sự Kiện</a></li>
     <li><a href="gallery.html" class="focus-ring hover:text-gold transition-colors">Thư Viện Ảnh</a></li>
    </ul>
   </div>
   <div>
    <h4 class="text-xs font-bold tracking-[0.12em] uppercase text-gold mb-5">Liên Hệ</h4>
    <ul class="space-y-3.5 text-sm text-ivory/80">
     <li class="flex items-start gap-2.5"><i data-lucide="map-pin" class="w-4 h-4 text-gold shrink-0 mt-0.5"></i><span>72/2A Đường Phạm Hồng Thái, Phường 7, TP. Vũng Tàu</span></li>
     <li class="flex items-center gap-2.5"><i data-lucide="phone" class="w-4 h-4 text-gold shrink-0"></i><span>0866 685 632</span></li>
    </ul>
   </div>
  </div>
  <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory/50 gap-4">
   <p>© 2026 Mầm non Bình Minh. All rights reserved.</p>
   <div class="flex gap-6">
    <a href="#" class="focus-ring hover:text-gold transition-colors">Bảo Mật Thông Tin</a>
    <a href="#" class="focus-ring hover:text-gold transition-colors">Điều Khoản Sử Dụng</a>
   </div>
  </div>
 </div>
</footer>`;

  const floatContactHTML = `
<div id="floating-contact" class="fixed bottom-6 right-5 md:bottom-8 md:right-8 z-[60] flex flex-col items-end">
 <div id="fc-links" class="flex flex-col items-end gap-3 mb-3 opacity-0 invisible translate-y-3 transition-all duration-300 ease-out">
  <a href="${DEMO_URL}" target="_blank" rel="noopener" class="fc-btn flex items-center gap-2.5 bg-white rounded-full pl-2 pr-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 focus-ring">
   <span class="fc-icon w-9 h-9 rounded-full flex items-center justify-center text-forest font-bold text-lg" style="background:var(--chartreuse);">🖥️</span>
   <span class="text-[13px] font-semibold text-charcoal">Dùng thử phần mềm</span>
  </a>
  <a href="https://zalo.me/0866685632" target="_blank" rel="noopener" class="fc-btn flex items-center gap-2.5 bg-white rounded-full pl-2 pr-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 focus-ring">
   <span class="fc-icon w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-lg" style="background:#0068FF;">Z</span>
   <span class="text-[13px] font-semibold text-charcoal">Zalo</span>
  </a>
  <a href="https://m.me/100093002850389" target="_blank" rel="noopener" class="fc-btn flex items-center gap-2.5 bg-white rounded-full pl-2 pr-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 focus-ring">
   <span class="fc-icon w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base" style="background:#0084FF;">M</span>
   <span class="text-[13px] font-semibold text-charcoal">Messenger</span>
  </a>
  <a href="tel:0866685632" class="fc-btn flex items-center gap-2.5 bg-white rounded-full pl-2 pr-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 focus-ring">
   <span class="fc-icon w-9 h-9 rounded-full flex items-center justify-center text-white" style="background:var(--forest);"><i data-lucide="phone" class="w-4.5 h-4.5"></i></span>
   <span class="text-[13px] font-semibold text-charcoal">0866 685 632</span>
  </a>
 </div>
 <button id="fc-toggle" aria-label="Liên hệ nhanh" aria-expanded="false" class="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 focus-ring" style="background:var(--chartreuse); color:var(--forest);">
  <i data-lucide="message-circle" class="w-7 h-7 md:w-8 md:h-8"></i>
 </button>
</div>`;

  const floatCSS = `
<style id="floating-contact-css">
#floating-contact .fc-icon{ box-shadow:0 2px 6px rgba(0,0,0,.18); }
#fc-toggle::after{ content:""; position:absolute; inset:0; border-radius:9999px; border:2px solid var(--chartreuse); animation:fc-pulse 2.2s ease-out infinite; }
#fc-toggle{ position:relative; }
@keyframes fc-pulse{
 0%{ transform:scale(1); opacity:.85; }
 70%{ transform:scale(1.45); opacity:0; }
 100%{ transform:scale(1.45); opacity:0; }
}
#floating-contact.open #fc-links{ opacity:1; visibility:visible; transform:translateY(0); }
#floating-contact.open #fc-links .fc-btn{ animation:fc-pop .3s cubic-bezier(.22,.61,.36,1) backwards; }
#floating-contact.open #fc-links .fc-btn:nth-child(1){ animation-delay:.05s; }
#floating-contact.open #fc-links .fc-btn:nth-child(2){ animation-delay:.12s; }
#floating-contact.open #fc-links .fc-btn:nth-child(3){ animation-delay:.19s; }
@keyframes fc-pop{
 from{ opacity:0; transform:translateY(14px) scale(.92); }
 to{ opacity:1; transform:translateY(0) scale(1); }
}
#floating-contact.open #fc-toggle svg{ transform:rotate(90deg); transition:transform .3s ease; }
</style>`;


  function inject() {
    document.querySelectorAll('[data-include="header"]').forEach(el => { el.outerHTML = headerHTML; });
    document.querySelectorAll('[data-include="footer"]').forEach(el => { el.outerHTML = footerHTML; });

    // Floating contact button (all pages)
    document.body.insertAdjacentHTML('beforeend', floatCSS + floatContactHTML);

    // Re-init Lucide icons after injection (if available)
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      try { lucide.createIcons(); } catch (e) {}
    }

  }

  // Script is loaded at end of <body> — header/footer placeholders already parsed,
  // so inject synchronously (before any inline scripts run).
  inject();

  // Auto-close mobile menu when a link is tapped
  var mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
      }
    });
  }

  // Gentle slide-down + stagger animation for mobile menu
  var menuMarginCss = '<style id="mobile-menu-motion">' +
    '#mobile-menu{ animation:menuIn .32s cubic-bezier(.22,.61,.36,1) both; transform-origin:top; }' +
    '@keyframes menuIn{ from{ opacity:0; transform:translateY(-8px); } to{ opacity:1; transform:translateY(0); } }' +
    '#mobile-menu > a, #mobile-menu > div{ animation:menuItem .34s cubic-bezier(.22,.61,.36,1) both; }' +
    '#mobile-menu > a:nth-child(1), #mobile-menu > div:nth-child(1){ animation-delay:.04s; }' +
    '#mobile-menu > a:nth-child(2), #mobile-menu > div:nth-child(2){ animation-delay:.09s; }' +
    '#mobile-menu > a:nth-child(3), #mobile-menu > div:nth-child(3){ animation-delay:.14s; }' +
    '#mobile-menu > a:nth-child(4), #mobile-menu > div:nth-child(4){ animation-delay:.19s; }' +
    '@keyframes menuItem{ from{ opacity:0; transform:translateX(-10px); } to{ opacity:1; transform:translateX(0); } }' +
    '</style>';
  document.head.insertAdjacentHTML('beforeend', menuMarginCss);

  // Mobile menu toggle button (open/close + aria)
  var menuBtn = document.getElementById('menu-btn');
  var mobileMenuEl = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenuEl) {
    function setMobileMenu(open) {
      mobileMenuEl.classList.toggle('hidden', !open);
      mobileMenuEl.classList.toggle('flex', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    }
    menuBtn.addEventListener('click', function () {
      setMobileMenu(mobileMenuEl.classList.contains('hidden'));
    });
    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mobileMenuEl.classList.contains('hidden')) setMobileMenu(false);
    });
  }

  // Mobile accordion submenus: click parent to open/close dropdown
  document.querySelectorAll('.mobile-nav-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.getElementById(btn.getAttribute('aria-controls'));
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      var icon = btn.querySelector('[data-lucide="chevron-down"]');
      if (icon) icon.classList.toggle('rotate-180');
      if (target) target.classList.toggle('hidden');
    });
  });

  // Floating contact toggle (direct binding — script strings injected via
  // insertAdjacentHTML are not reliably executed)
  var fcRoot = document.getElementById('floating-contact');
  var fcToggle = document.getElementById('fc-toggle');
  if (fcRoot && fcToggle) {
    fcToggle.addEventListener('click', function () {
      var open = fcRoot.classList.toggle('open');
      fcToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      var icon = fcToggle.querySelector('svg');
      if (icon) {
        if (open) {
          icon.setAttribute('data-lucide', 'x');
          icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
        } else {
          icon.setAttribute('data-lucide', 'message-circle');
          icon.innerHTML = '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>';
        }
      }
    });
    document.addEventListener('click', function (e) {
      if (!fcRoot.contains(e.target)) fcRoot.classList.remove('open');
    });
  }
})();
