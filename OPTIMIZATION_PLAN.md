# Tối ưu Tốc độ + SEO Local — DAWN Kindergarten
**Date**: 2026-09-10 | **Status**: Planning

## 🚀 PHASE 1: Performance (Tốc độ)

### 1.1 Gzip Compression (Server-side)
- **Issue**: ⚠️ Không compress CSS/JS
- **Fix**: Add `vercel.json` hoặc `.github/workflows/` để enable gzip
- **Impact**: CSS/JS giảm 60-70%

### 1.2 Minify Assets
- **Current**: style.css (không minify), js/*.js (không minify)
- **Fix**: Add build script: `npm install --save-dev cssnano terser`
- **Files**: 
  - css/style.css → css/style.min.css (v8)
  - js/components.js → js/components.min.js
  - js/enhancements.js → js/enhancements.min.js
- **Impact**: JS giảm ~40%, CSS giảm ~30%

### 1.3 Image Optimization (Already WebP ✅)
- ✅ Đã dùng WebP (276KB about.webp, 48KB activity-1.webp)
- ⚠️ Total: 30MB folder img/
- **Consider**: AVIF format (1 bước advanced, optional)
- **Lazy load**: Add loading="lazy" cho below-fold images

### 1.4 Font Optimization
- Current: Google Fonts (preload 3 fonts)
- **Consider**: Self-host để tránh extra DNS lookup
- **Or**: Reduce font variants (hiện dùng DM Serif Display + Be Vietnam Pro)

### 1.5 Script Optimization
- Current: js/scroll-3d.js, js/enhancements.js, js/zalo-modal.js
- **Defer loading**: Move non-critical JS to defer/async
- **Remove unused**: Kiểm tra js/enhancements.js dùng chưa (nếu không dùng → xóa)

---

## 🗺️ PHASE 2: SEO Local (Địa phương)

### 2.1 Local Business Schema
- **Missing**: ❌ Chưa có LocalBusiness + Organization schema
- **Add**: JSON-LD trong `<head>`
  ```json
  {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Mầm non Bình Minh - DAWN Kindergarten",
    "url": "https://binhminhkindergarten.site",
    "telephone": "+84866685632",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "75/2A Phạm Hồng Thái",
      "addressLocality": "Vũng Tàu",
      "postalCode": "75000",
      "addressCountry": "VN"
    },
    "areaServed": "Vũng Tàu",
    "image": "https://binhminhkindergarten.site/img/hero.webp",
    "priceRange": "$$"
  }
  ```
- **Impact**: Google Maps listing + rich snippet

### 2.2 Google Business Profile
- **Manual setup**: https://business.google.com
- **Fields**:
  - Business name: Mầm non Bình Minh
  - Address: 75/2A Phạm Hồng Thái, Vũng Tàu
  - Phone: 0866 685 632
  - Hours: 7:00 - 17:30 (Mon-Fri)
  - Website: https://binhminhkindergarten.site
  - Category: Child Care Center
- **Photos**: Upload 5-10 ảnh (lớp học, trẻ em, hoạt động)
- **Reviews**: Khuyến khích phụ huynh để lại review

### 2.3 Local Keywords in Content
- **Current title**: "Mầm Non Vũng Tàu - DAWN Kindergarten | Trường mầm non tư thục uy tín"
- **Good**: ✅ Có city name
- **Add in pages**:
  - index.html: "Trường mầm non tư thục **tại Vũng Tàu**" (thêm 2-3 lần)
  - gioi-thieu.html: City context
  - tin-tuc.html: Local news
- **Meta descriptions**: Add city name để rank local search

### 2.4 Local Link Building (Optional)
- Directory listings: Vàng Pages, DDD (Vietnam Yellow Pages)
- Local blogs: Tìm blogs Vũng Tàu → PR bài + backlink
- Parent groups: Facebook groups Vũng Tàu → share content

### 2.5 Hreflang Tags (If multi-location)
- **Current**: Single location (Vũng Tàu)
- **Skip**: Không cần (chỉ khi có nhiều chi nhánh)

---

## 📊 Implementation Priority

| Phase | Task | Effort | Impact | Days |
|---|---|---|---|---|
| 1 | Enable Gzip compression | Easy | High | 0.5 |
| 1 | Minify CSS/JS | Easy | Medium | 1 |
| 1 | Lazy load images | Easy | Low-Medium | 0.5 |
| 2 | Add LocalBusiness schema | Easy | High | 1 |
| 2 | Setup Google Business Profile | Manual | High | 1 |
| 2 | Add local keywords | Easy | Medium | 0.5 |
| 2 | Local link building | Medium | Low-Medium | 3-5 |

---

## 🎯 Expected Results

### Performance (Before → After)
- Page load: 394ms → ~250-300ms (-25%)
- CSS size: ? → -60% (with gzip)
- JS size: ? → -40% (with minify)
- LCP (Largest Contentful Paint): Check PageSpeed

### SEO Local (Impact)
- Google local pack ranking: +1-3 positions
- Local search impressions: +30-50%
- Click-through rate: +15-25%
- Phone calls/inquiries: +20-40%

---

## 📝 Next Steps

1. **Anh xác nhận**: Phase 1 (performance) hay Phase 2 (local) trước?
2. **Em thực hiện**: Code + test
3. **Deploy**: Push → Vercel auto-deploy
4. **Verify**: PageSpeed + Google Search Console

**Anh muốn bắt đầu từ đâu ạ?** 🎯
