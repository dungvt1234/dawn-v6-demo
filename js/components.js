// Shared header/footer for MẦM NON BÌNH MINH v6 — design v4 editorial style
// Usage: <div data-include="header"></div> ... <div data-include="footer"></div>
(function () {
  const PAGE = location.pathname.split('/').pop() || 'index.html';

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
    { href: 'chuong-trinh.html', label: 'CHƯƠNG TRÌNH', key: 'program' },
    { href: 'tin-tuc.html', label: 'TIN TỨC', key: 'news' },
    {
      href: '#', label: 'THÔNG TIN', key: 'info',
      children: [
        { href: 'tuyen-sinh.html', label: 'Quy trình tuyển sinh', key: 'info' },
        { href: 'hoc-phi.html', label: 'Học phí & ưu đãi', key: 'info' },
        { href: 'gallery.html', label: 'Thư viện ảnh', key: 'info' }
      ]
    },
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
    const base = `<a href="${n.href}" class="text-base font-semibold py-2 border-b border-forest/5 focus-ring${activeKey === n.key ? ' text-plum' : ' text-charcoal'}" style="${activeKey === n.key ? 'color:var(--plum);' : 'color:var(--charcoal);'}">${n.label}</a>`;
    if (n.children) {
      return base + n.children.map(c => `<a href="${c.href}" class="text-sm font-medium pl-6 py-2 border-b border-forest/5 focus-ring ${PAGE === c.href ? 'text-plum' : 'text-charcoal/70'}" style="${PAGE === c.href ? 'color:var(--plum);' : 'color:var(--charcoal);'}">→ ${c.label}</a>`).join('\n ');
    }
    return base;
  }).join('\n ');

  const headerHTML = `
<div id="header-wrap" class="fixed top-0 left-0 right-0 z-50">
 <div class="topbar hidden md:flex items-center justify-between gap-6 px-6 md:px-12 h-10 text-[12px] tracking-[0.04em] text-ivory/85" style="background:var(--plum);">
  <div class="flex items-center gap-6">
   <a href="tel:19006868" class="flex items-center gap-1.5 hover:text-gold transition-colors focus-ring"><i data-lucide="phone" class="w-3.5 h-3.5"></i>1900 6868</a>
   <a href="mailto:hello@dawnkindergarten.vn" class="flex items-center gap-1.5 hover:text-gold transition-colors focus-ring"><i data-lucide="mail" class="w-3.5 h-3.5"></i>hello@dawnkindergarten.vn</a>
  </div>
  <div class="flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i>123 Đường Ánh Dương, Q. Bình Thạnh, TP.HCM</div>
 </div>
 <header id="site-header" class="transition-all duration-500 h-[90px] flex items-center" style="background:var(--ivory);">
 <div class="max-w-container w-full mx-auto px-6 md:px-12 flex items-center justify-between">
  <a href="index.html" class="focus-ring flex items-center gap-3 group">
   <img src="img/logo-icon.png" alt="Mầm non Bình Minh" class="h-11 w-auto transition-transform duration-500 group-hover:scale-105" style="height:44px; width:auto;">
   <div class="flex flex-col leading-tight items-center">
    <span class="font-serif text-base md:text-lg tracking-[0.04em] text-plum font-bold whitespace-nowrap text-center">DAWN KINDERGARTEN</span>
    <span class="text-[9px] md:text-[10px] tracking-[0.24em] text-forest font-bold uppercase mt-0.5 whitespace-nowrap text-center">Mầm Non Bình Minh</span>
   </div>
  </a>
  <nav class="hidden lg:flex items-center gap-7 lg:ml-10">
   ${navLinks}
  </nav>
  <div class="hidden lg:block">
   <a href="dang-ky.html" class="focus-ring inline-flex items-center gap-2.5 bg-chartreuse hover:bg-gold text-forest font-bold text-xs uppercase tracking-[0.08em] px-7 py-3.5 rounded-pill transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
    Đăng Ký Tham Quan <i data-lucide="arrow-right" class="w-4 h-4"></i>
   </a>
  </div>
  <button id="menu-btn" class="lg:hidden p-2 text-forest focus:outline-none focus-ring" aria-label="Mở menu">
   <i data-lucide="menu" class="w-7 h-7"></i>
  </button>
 </div>
 <div id="mobile-menu" class="hidden absolute top-[90px] left-0 right-0 bg-ivory border-b border-forest/10 p-6 flex-col gap-4 shadow-2xl lg:hidden">
  ${mobileLinks}
  <a href="dang-ky.html" class="mt-2 w-full text-center bg-chartreuse text-forest font-bold text-sm uppercase tracking-wider py-4 rounded-pill">Đăng Ký Tham Quan →</a>
 </div>
 </header>
</div>`;

  const footerHTML = `
<footer id="contact" class="bg-plum text-ivory pt-24 pb-12 px-6 md:px-12 mt-12">
 <div class="max-w-container mx-auto">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
   <div class="lg:col-span-2">
    <div class="flex items-center gap-3 mb-6">
     <img src="img/logo-icon-light.png" alt="Mầm non Bình Minh" class="h-16 w-auto" style="height:64px; width:auto;">
     <div class="flex flex-col leading-tight items-center">
      <span class="font-serif text-xl tracking-[0.04em] text-ivory font-bold whitespace-nowrap text-center">DAWN KINDERGARTEN</span>
      <span class="text-[11px] tracking-[0.28em] text-gold font-semibold uppercase mt-1 whitespace-nowrap text-center">Mầm Non Bình Minh</span>
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
     <li class="flex items-start gap-2.5"><i data-lucide="map-pin" class="w-4 h-4 text-gold shrink-0 mt-0.5"></i><span>123 Đường Ánh Dương, Q. Bình Thạnh, TP.HCM</span></li>
     <li class="flex items-center gap-2.5"><i data-lucide="phone" class="w-4 h-4 text-gold shrink-0"></i><span>1900 6868</span></li>
     <li class="flex items-center gap-2.5"><i data-lucide="mail" class="w-4 h-4 text-gold shrink-0"></i><span>hello@dawnkindergarten.vn</span></li>
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

  function inject() {
    document.querySelectorAll('[data-include="header"]').forEach(el => { el.outerHTML = headerHTML; });
    document.querySelectorAll('[data-include="footer"]').forEach(el => { el.outerHTML = footerHTML; });

    // Re-init Lucide icons after injection (if available)
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      try { lucide.createIcons(); } catch (e) {}
    }
  }

  // Script is loaded at end of <body> — header/footer placeholders already parsed,
  // so inject synchronously (before any inline scripts run).
  inject();
})();
