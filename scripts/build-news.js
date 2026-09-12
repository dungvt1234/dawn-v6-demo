// scripts/build-news.js
// Gộp tất cả bài viết trong data/news/*.json thành data/news.json (mới nhất lên trước)
// Đồng thời cập nhật sitemap.xml với lastmod từ ngày bài viết và tiêm H1/canonical vào bai-viet.html
// Chạy tự động trên Netlify mỗi lần deploy (xem netlify.toml)
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'data', 'news');
const outFile = path.join(__dirname, '..', 'data', 'news.json');
const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
const baiVietPath = path.join(__dirname, '..', 'bai-viet.html');

function parseDate(s) {
  if (!s) return 0;
  s = String(s).trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]).getTime();
  m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]).getTime();
  return 0;
}
function toISODate(s) {
  if (!s) return null;
  s = String(s).trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  const t = parseDate(s);
  if (t) {
    const d = new Date(t);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  return null;
}
function escXml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

let items = [];
if (fs.existsSync(dir)) {
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    try {
      const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      if (data && data.title) {
        if (data.image && data.image.startsWith('/')) data.image = data.image.replace(/^\/+/,'');
        items.push(data);
      }
    } catch (e) {
      console.error('Lỗi đọc ' + f + ': ' + e.message);
    }
  }
}

items.sort((a, b) => parseDate(b.date) - parseDate(a.date));
fs.writeFileSync(outFile, JSON.stringify({ news: items }, null, 2), 'utf8');
console.log('Đã gộp ' + items.length + ' bài viết -> data/news.json');

// --- Sitemap: cập nhật lastmod cho từng bài viết, giữ nguyên static URLs ---
try {
  if (fs.existsSync(sitemapPath)) {
    let xml = fs.readFileSync(sitemapPath, 'utf8');
    // Tạo map slug -> isoDate
    const dateMap = new Map();
    for (const it of items) {
      const iso = toISODate(it.date);
      if (iso && it.slug) dateMap.set(it.slug, iso);
    }
    // Thay thế hoặc thêm lastmod cho từng bài viết
    for (const [slug, iso] of dateMap) {
      const loc = `https://binhminhkindergarten.site/bai-viet.html?slug=${slug}`;
      const locEsc = escXml(loc);
      // Tìm block <url><loc>loc</loc>...</url>
      const locPattern = `<loc>${locEsc}</loc>`;
      if (xml.includes(locEsc)) {
        // Nếu đã có lastmod, thay thế; nếu chưa có, thêm vào
        const urlRegex = new RegExp(`<url>\\s*<loc>${locEsc.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}</loc>([\\s\\S]*?)</url>`, 'm');
        const match = xml.match(urlRegex);
        if (match) {
          let inner = match[1];
          if (inner.includes('<lastmod>')) {
            inner = inner.replace(/<lastmod>.*?<\/lastmod>/, `<lastmod>${iso}</lastmod>`);
          } else {
            // Thêm lastmod trước </url> sau changefreq/priority
            inner = inner.replace(/<\/url>\s*$/, '');
            // inner hiện tại là phần sau </loc> đến trước </url>, thêm lastmod vào cuối inner
            if (!inner.includes('<lastmod>')) {
              // Chèn lastmod trước khi đóng url: tìm vị trí sau priority
              inner = inner.trimEnd();
              // Nếu có priority, chèn sau nó
              if (inner.includes('</priority>')) {
                inner = inner.replace(/<\/priority>/, `</priority>\n    <lastmod>${iso}</lastmod>`);
              } else if (inner.includes('</changefreq>')) {
                inner = inner.replace(/<\/changefreq>/, `</changefreq>\n    <lastmod>${iso}</lastmod>`);
              } else {
                inner += `\n    <lastmod>${iso}</lastmod>`;
              }
            }
          }
          xml = xml.replace(urlRegex, `<url>\n    <loc>${locEsc}</loc>${inner}\n  </url>`);
        }
      } else {
        // Thêm mới URL bài viết chưa có trong sitemap (ít xảy ra)
        const newEntry = `  <url>\n    <loc>${locEsc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n    <lastmod>${iso}</lastmod>\n  </url>`;
        // Chèn trước </urlset>
        xml = xml.replace('</urlset>', newEntry + '\n</urlset>');
        console.log('Thêm sitemap entry mới: ' + loc);
      }
    }
    // Đảm bảo không trùng lặp: kiểm tra duplicate loc
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
    const seen = new Set();
    let dup = false;
    for (const l of locs) { if (seen.has(l)) { console.warn('Duplicate sitemap loc: '+l); dup=true; } seen.add(l); }
    // Ghi lại
    fs.writeFileSync(sitemapPath, xml, 'utf8');
    console.log('Đã cập nhật sitemap.xml với lastmod cho ' + dateMap.size + ' bài viết');
    if (dup) console.warn('Cảnh báo: sitemap có URL trùng lặp');
    // Validate XML cơ bản
    if (!xml.includes('<?xml') || !xml.includes('<urlset')) {
      console.error('Sitemap XML không hợp lệ');
      process.exit(1);
    }
  }
} catch (e) {
  console.error('Lỗi cập nhật sitemap:', e.message);
}

// --- Bai-viet.html: tiêm H1/title/canonical/OG cho bài mới nhất để SEO không phụ thuộc JS ---
try {
  if (fs.existsSync(baiVietPath) && items.length > 0) {
    const latest = items[0];
    const base = 'https://binhminhkindergarten.site';
    const slug = latest.slug;
    const postUrl = `${base}/bai-viet.html?slug=${encodeURIComponent(slug)}`;
    const title = latest.title;
    const excerpt = (latest.excerpt || '').slice(0, 155);
    const image = latest.image ? (latest.image.startsWith('http') ? latest.image : `${base}/${latest.image.replace(/^\//,'')}`) : `${base}/img/hero.webp`;
    const isoDate = toISODate(latest.date) || '2026-01-01';
    let html = fs.readFileSync(baiVietPath, 'utf8');
    // Title
    html = html.replace(/<title>.*?<\/title>/s, `<title>${escHtml(title)} — Mầm non Bình Minh</title>`);
    // Meta description
    html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escHtml(excerpt)}">`);
    // Canonical (exactly one)
    // Thay thế href của canonical-link, đảm bảo chỉ có một
    html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" id="canonical-link" href="${escHtml(postUrl)}">`);
    // Đảm bảo không có canonical trùng (xóa nếu có 2)
    const canonCount = (html.match(/<link rel="canonical"/g) || []).length;
    if (canonCount > 1) {
      console.warn('Phát hiện ' + canonCount + ' canonical, giữ lại 1');
      // Giữ lại cái đầu, xóa các cái sau
      let first = true;
      html = html.replace(/<link rel="canonical"[^>]*>/g, (m) => {
        if (first) { first = false; return m; }
        return '';
      });
    }
    // OG
    html = html.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" id="og-url" content="${escHtml(postUrl)}">`);
    html = html.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" id="og-title" content="${escHtml(title)} — Mầm non Bình Minh">`);
    html = html.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" id="og-desc" content="${escHtml(excerpt)}">`);
    html = html.replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" id="og-image" content="${escHtml(image)}">`);
    // Twitter
    html = html.replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" id="tw-title" content="${escHtml(title)} — Mầm non Bình Minh">`);
    html = html.replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" id="tw-desc" content="${escHtml(excerpt)}">`);
    html = html.replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" id="tw-image" content="${escHtml(image)}">`);
    // H1 - thay placeholder "Đang tải bài viết..." bằng title thật
    html = html.replace(/<h1 id="bv-title"[^>]*>.*?<\/h1>/s, `<h1 id="bv-title" class="serif text-[30px] md:text-[52px] leading-[1.1] mt-4 max-w-[820px] text-white reveal in">${escHtml(title)}</h1>`);
    // Breadcrumb JSON-LD: cập nhật item 2 và thêm item 3 cho bài viết nếu chưa có
    // Giữ đơn giản: cập nhật BreadcrumbList để item 2 là bài viết
    // Article JSON-LD: tiêm sẵn
    const articleLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: excerpt,
      image: image,
      datePublished: isoDate,
      dateModified: isoDate,
      author: { '@type': 'Organization', name: 'Mầm non Bình Minh' },
      publisher: { '@type': 'Organization', name: 'Mầm non Bình Minh', logo: { '@type': 'ImageObject', url: `${base}/img/logo.png` } },
      mainEntityOfPage: postUrl
    };
    html = html.replace(/<script type="application\/ld\+json" id="article-jsonld">.*?<\/script>/s, `<script type="application/ld+json" id="article-jsonld">${JSON.stringify(articleLd, null, 2)}</script>`);
    fs.writeFileSync(baiVietPath, html, 'utf8');
    console.log('Đã tiêm H1/canonical/OG vào bai-viet.html cho bài mới nhất: ' + slug);
  }
} catch (e) {
  console.error('Lỗi cập nhật bai-viet.html:', e.message, e.stack);
}
