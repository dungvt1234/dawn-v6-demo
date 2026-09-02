// Mầm non Bình Minh v6 — upgrade motions (counter, scroll progress, testimonial carousel, gentle bobbing)
(function () {
  "use strict";

  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 2. Animated counters for stats ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && !REDUCED && 'IntersectionObserver' in window) {
    var animateCount = function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var dur = 1400;
      var start = null;
      function frame(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(frame);
        else el.textContent = target;
      }
      requestAnimationFrame(frame);
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  } else {
    counters.forEach(function (c) {
      c.textContent = c.getAttribute('data-count');
    });
  }

  /* ---------- 3. Scroll progress bar ---------- */
  var bar = document.createElement('div');
  bar.id = 'scroll-progress';
  bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0;background:var(--chartreuse);z-index:9999;pointer-events:none;transition:width .08s linear;';
  document.body.appendChild(bar);
  function onScrollProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var w = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = w + '%';
  }
  window.addEventListener('scroll', onScrollProgress, { passive: true });
  window.addEventListener('resize', onScrollProgress);
  onScrollProgress();

  /* ---------- 6. Gentle bobbing for value icons ---------- */
  var bobCSS = '';
  if (!REDUCED) {
    bobCSS = '<style id="bob-css">' +
      '.core-value-icon{ animation:bob 4.2s ease-in-out infinite; }' +
      '@keyframes bob{ 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-4px); } }' +
      '</style>';
    document.body.insertAdjacentHTML('beforeend', bobCSS);
    document.querySelectorAll('.group .p-3[class*="rounded-2xl"]').forEach(function (wrap) {
      var icon = wrap.querySelector('svg');
      if (icon) {
        wrap.classList.add('core-value-icon');
        icon.setAttribute('data-lucide', icon.getAttribute('data-lucide') || '');
      }
    });
  }

  /* ---------- 6. Testimonial carousel ---------- */
  var vp = document.querySelector('.tcarousel-viewport');
  if (vp) {
    var slides = Array.prototype.slice.call(vp.querySelectorAll('.tcarousel-slide'));
    var dotsWrap = document.querySelector('.tcarousel-dots');
    var index = 0;
    var timer = null;

    slides.forEach(function (s, i) {
      s.classList.add('tcarousel-slide-i');
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'tcarousel-dot';
      dot.setAttribute('aria-label', 'Lời chứng thực ' + (i + 1));
      dot.addEventListener('click', function () { go(i); restart(); });
      dotsWrap.appendChild(dot);
    });

    var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll('.tcarousel-dot'));

    var css = '<style id="tcarousel-css">' +
      '.tcarousel{ position:relative; }' +
      '.tcarousel-viewport{ overflow:hidden; position:relative; }' +
      '.tcarousel-slide{ margin:0; transition:opacity .6s ease, transform .6s cubic-bezier(.22,.61,.36,1); cursor:default; color:#223D22; }' +
      '.tcarousel-slide-i{ position:relative; }' +
      '.tcarousel-author{ font-family:var(--sans,inherit); font-style:normal; font-weight:500; font-size:.95rem; letter-spacing:.02em; color:#5A635A; margin-top:22px; }' +
      '.tcarousel-dots{ display:flex; justify-content:center; gap:10px; margin-top:30px; }' +
      '.tcarousel-dot{ width:9px; height:9px; border-radius:9999px; border:none; cursor:pointer; background:#C9D3B5; padding:0; transition:all .3s ease; }' +
      '.tcarousel-dot.is-on{ width:26px; background:var(--chartreuse-strong,#6B7A1E); }' +
      '</style>';
    document.body.insertAdjacentHTML('beforeend', css);

    var active = function () {
      slides.forEach(function (s, i) { s.style.opacity = i === index ? '1' : '0'; s.style.transform = i === index ? 'translateY(0)' : 'translateY(12px)'; s.setAttribute('aria-hidden', i === index ? 'false' : 'true'); });
      dots.forEach(function (d, i) { d.classList.toggle('is-on', i === index); });
    };
    function go(i) { index = (i + slides.length) % slides.length; active(); }
    function restart() { if (REDUCED) return; if (timer) clearInterval(timer); timer = setInterval(function () { go(index + 1); }, 6500); }

    active();
    restart();
    vp.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
    vp.addEventListener('mouseleave', restart);
  }
})();