// Mầm non Bình Minh — hiệu ứng chiều sâu 3D & reveal khi cuộn
// - .tilt-card   : thẻ chương trình học nghiêng (3D) → đứng thẳng khi vào giữa màn hình
// - .tcareveal   : ý kiến phụ huynh hiện lần lượt khi cuộn xuống (không cần vuốt ngang)
(function () {
  "use strict";
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (REDUCED) return;
  if (!('IntersectionObserver' in window)) return;

  /* ===== 1. CARDS NGHIÊNG 3D (chương trình học) ===== */
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.tilt-card'));
  if (tiles.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var el = en.target;
        var r = en.intersectionRatio;
        // Tạo độ nghiêng theo chiều cuộn: khi mới vào, nghiêng mạnh; càng vào sâu càng thẳng.
        var p = Math.min(1, r * 2.2); // 0 → 1 khi đi qua viewport
        var rotate = (1 - p) * 22;     // 22° → 0°
        var tx = (1 - p) * 40;
        var ty = (1 - p) * 30;
        el.style.transform =
          'perspective(1200px) rotateX(' + rotate.toFixed(2) + 'deg) ' +
          'translateY(' + ty.toFixed(2) + 'px) translateZ(' + (-(1 - p) * 60).toFixed(2) + 'px)';
        el.style.opacity = String(0.25 + 0.75 * p);
        el.style.transformStyle = 'preserve-3d';
        if (r >= 0.55) {
          el.style.transform = 'perspective(1200px) rotateX(0deg) translateY(0) translateZ(0)';
          el.style.opacity = '1';
          io.unobserve(el);
        }
      });
    }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] });

    tiles.forEach(function (t) {
      t.style.willChange = 'transform, opacity';
      io.observe(t);
    });
  }

  /* ===== 2. TESTIMONIAL: hiện lần lượt khi cuộn (xếp dọc) ===== */
  var revs = Array.prototype.slice.call(document.querySelectorAll('.tcareveal'));
  if (revs.length) {
    revs.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'perspective(900px) rotateX(18deg) translateY(40px) scale(.96)';
      el.style.transformStyle = 'preserve-3d';
      el.style.transition = 'opacity .7s ease, transform .7s cubic-bezier(.22,.61,.36,1)';
      el.style.transitionDelay = (i * 120) + 'ms';
    });
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          el.style.opacity = '1';
          el.style.transform = 'perspective(900px) rotateX(0deg) translateY(0) scale(1)';
          io2.unobserve(el);
        }
      });
    }, { threshold: 0.25 });
    revs.forEach(function (el) { io2.observe(el); });
  }
})();
