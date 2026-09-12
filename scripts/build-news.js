// scripts/build-news.js
// Gộp tất cả bài viết trong data/news/*.json thành data/news.json (mới nhất lên trước)
// Đồng thời cập nhật sitemap.xml, tiêm H1/canonical vào bai-viet.html và sinh static bài viết bai-viet/<slug>/index.html
// Chạy tự động trên Netlify mỗi lần deploy (xem netlify.toml)
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'data', 'news');
const outFile = path.join(__dirname, '..', 'data', 'news.json');
const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
const baiVietPath = path.join(__dirname, '..', 'bai-viet.html');
const netlifyPath = path.join(__dirname, '..', 'netlify.toml');
const vercelPath = path.join(__dirname, '..', 'vercel.json');

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
function fmtDate(d) {
  const [y,m,day]=String(d).split('-');
  return `${day}/${m}/${y}`;
}
function mdToHtml(md){
  // Thử dùng marked nếu có sẵn, fallback đơn giản
  try{
    const marked=require('marked');
    if(marked && marked.parse) return marked.parse(md||'');
  }catch(e){}
  // Fallback đơn giản: headings, bold, list, table
  let html=escHtml(md||'');
  html=html.replace(/^### (.*)$/gm,'<h3>$1</h3>');
  html=html.replace(/^## (.*)$/gm,'<h2>$1</h2>');
  html=html.replace(/^# (.*)$/gm,'<h1>$1</h1>');
  html=html.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
  html=html.replace(/\n\n/g,'</p><p>');
  html='<p>'+html+'</p>';
  html=html.replace(/<p><h([23])>/g,'<h$1>').replace(/<\/h[23]><\/p>/g,'</h$1>');
  return html;
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

// --- Sitemap: cập nhật lastmod, xóa llms.txt và bare bai-viet.html nếu cần, đảm bảo valid ---
try {
  if (fs.existsSync(sitemapPath)) {
    let xml = fs.readFileSync(sitemapPath, 'utf8');
    // Xóa llms.txt khỏi sitemap (không phải HTML indexable)
    xml = xml.replace(/\s*<url>\s*<loc>https:\/\/binhminhkindergarten\.site\/llms\.txt<\/loc>[\s\S]*?<\/url>/, '');
    // Xóa bare bai-viet.html (không slug) khỏi sitemap để tránh duplicate
    const bareRegex = /\s*<url>\s*<loc>https:\/\/binhminhkindergarten\.site\/bai-viet\.html<\/loc>[\s\S]*?<\/url>/;
    if (bareRegex.test(xml)) {
      xml = xml.replace(bareRegex, '');
      console.log('Đã xóa bare bai-viet.html khỏi sitemap (preferred là URL clean)');
    }
    // Xóa các URL ?slug cũ — preferred là URL clean /bai-viet/<slug>/ (Phase 2)
    const oldQueryRegex = /\s*<url>\s*<loc>https:\/\/binhminhkindergarten\.site\/bai-viet\.html\?slug=[^<]*<\/loc>[\s\S]*?<\/url>/g;
    const removed = (xml.match(oldQueryRegex) || []).length;
    if (removed) {
      xml = xml.replace(oldQueryRegex, '');
      console.log('Đã xóa ' + removed + ' URL ?slug cũ khỏi sitemap (preferred là URL clean)');
    }
    const dateMap = new Map();
    for (const it of items) {
      const iso = toISODate(it.date);
      if (iso && it.slug) dateMap.set(it.slug, iso);
    }
    for (const [slug, iso] of dateMap) {
      const loc = `https://binhminhkindergarten.site/bai-viet/${slug}/`;
      const locEsc = escXml(loc);
      if (xml.includes(locEsc)) {
        const urlRegex = new RegExp(`<url>\\s*<loc>${locEsc.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}</loc>([\\s\\S]*?)</url>`, 'm');
        const match = xml.match(urlRegex);
        if (match) {
          let inner = match[1];
          if (inner.includes('<lastmod>')) {
            inner = inner.replace(/<lastmod>.*?<\/lastmod>/, `<lastmod>${iso}</lastmod>`);
          } else {
            inner = inner.trimEnd();
            if (inner.includes('</priority>')) {
              inner = inner.replace(/<\/priority>/, `</priority>\n    <lastmod>${iso}</lastmod>`);
            } else if (inner.includes('</changefreq>')) {
              inner = inner.replace(/<\/changefreq>/, `</changefreq>\n    <lastmod>${iso}</lastmod>`);
            } else {
              inner += `\n    <lastmod>${iso}</lastmod>`;
            }
          }
          xml = xml.replace(urlRegex, `<url>\n    <loc>${locEsc}</loc>${inner}\n  </url>`);
        }
      } else {
        const newEntry = `  <url>\n    <loc>${locEsc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n    <lastmod>${iso}</lastmod>\n  </url>`;
        xml = xml.replace('</urlset>', newEntry + '\n</urlset>');
        console.log('Thêm sitemap entry mới: ' + loc);
      }
    }
    // Chuẩn hóa whitespace sau các thao tác xóa
    xml = xml.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');
    // Dedup check
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
    const seen = new Set();
    let dup = false;
    for (const l of locs) { if (seen.has(l)) { console.warn('Duplicate sitemap loc: '+l); dup=true; } seen.add(l); }
    // Sắp xếp lại cho gọn: static trước, articles sau (giữ nguyên thứ tự hiện tại là ok)
    // Validate
    if (!xml.includes('<?xml') || !xml.includes('<urlset')) {
      console.error('Sitemap XML không hợp lệ');
      process.exit(1);
    }
    // Đảm bảo không có broken URLs (kiểm tra file tồn tại cho static)
    // Không kiểm tra slug URLs vì chúng là query param, luôn hợp lệ nếu có json
    fs.writeFileSync(sitemapPath, xml, 'utf8');
    console.log('Đã cập nhật sitemap.xml với lastmod cho ' + dateMap.size + ' bài viết, total URLs ' + locs.length + (dup?' (có duplicate!)':''));
  }
} catch (e) {
  console.error('Lỗi cập nhật sitemap:', e.message, e.stack);
}

// --- Bai-viet.html: tiêm H1/title/canonical/OG cho bài mới nhất (để bare có nội dung khi không có JS) ---
try {
  if (fs.existsSync(baiVietPath) && items.length > 0) {
    const latest = items[0];
    const base = 'https://binhminhkindergarten.site';
    const slug = latest.slug;
    const postUrl = `${base}/bai-viet/${encodeURIComponent(slug)}/`;
    const title = latest.title;
    const excerpt = (latest.excerpt || '').slice(0, 155);
    const image = latest.image ? (latest.image.startsWith('http') ? latest.image : `${base}/${latest.image.replace(/^\//,'')}`) : `${base}/img/hero.webp`;
    const isoDate = toISODate(latest.date) || '2026-01-01';
    let html = fs.readFileSync(baiVietPath, 'utf8');
    html = html.replace(/<title>.*?<\/title>/s, `<title>${escHtml(title)} — Mầm non Bình Minh</title>`);
    html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escHtml(excerpt)}">`);
    html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" id="canonical-link" href="${escHtml(postUrl)}">`);
    const canonCount = (html.match(/<link rel="canonical"/g) || []).length;
    if (canonCount > 1) {
      let first = true;
      html = html.replace(/<link rel="canonical"[^>]*>/g, (m) => {
        if (first) { first = false; return m; }
        return '';
      });
    }
    html = html.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" id="og-url" content="${escHtml(postUrl)}">`);
    html = html.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" id="og-title" content="${escHtml(title)} — Mầm non Bình Minh">`);
    html = html.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" id="og-desc" content="${escHtml(excerpt)}">`);
    html = html.replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" id="og-image" content="${escHtml(image)}">`);
    html = html.replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" id="tw-title" content="${escHtml(title)} — Mầm non Bình Minh">`);
    html = html.replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" id="tw-desc" content="${escHtml(excerpt)}">`);
    html = html.replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" id="tw-image" content="${escHtml(image)}">`);
    html = html.replace(/<h1 id="bv-title"[^>]*>.*?<\/h1>/s, `<h1 id="bv-title" class="serif text-[30px] md:text-[52px] leading-[1.1] mt-4 max-w-[820px] text-white reveal in">${escHtml(title)}</h1>`);
    const articleLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: excerpt,
      image: image,
      datePublished: isoDate,
      dateModified: isoDate,
      author: { '@type': 'Organization', name: 'Mầm non Bình Minh' },
      publisher: { '@type': 'Organization', name: 'Mầm non Bình Minh', logo: { '@type': 'ImageObject', url: `${base}/img/logo.webp` } },
      mainEntityOfPage: postUrl
    };
    html = html.replace(/<script type="application\/ld\+json" id="article-jsonld">.*?<\/script>/s, `<script type="application/ld+json" id="article-jsonld">${JSON.stringify(articleLd, null, 2)}</script>`);
    fs.writeFileSync(baiVietPath, html, 'utf8');
    console.log('Đã tiêm H1/canonical/OG vào bai-viet.html cho bài mới nhất: ' + slug);
  }
} catch (e) {
  console.error('Lỗi cập nhật bai-viet.html:', e.message, e.stack);
}

// --- Sinh static bài viết bai-viet/<slug>/index.html cho mỗi bài ---
try {
  const templatePath = baiVietPath;
  if (fs.existsSync(templatePath)) {
    const template = fs.readFileSync(templatePath, 'utf8');
    for (const post of items) {
      const base = 'https://binhminhkindergarten.site';
      const slug = post.slug;
      const postUrl = `${base}/bai-viet/${encodeURIComponent(slug)}/`;
      const title = post.title;
      const excerpt = (post.excerpt || '').slice(0, 155);
      const image = post.image ? (post.image.startsWith('http') ? post.image : `${base}/${post.image.replace(/^\//,'')}`) : `${base}/img/hero.webp`;
      const isoDate = toISODate(post.date) || '2026-01-01';
      const bodyHtml = mdToHtml(post.body || post.excerpt || '');
      const tag = post.tag || '';
      const dateStr = isoDate ? `${isoDate.split('-')[2]}/${isoDate.split('-')[1]}/${isoDate.split('-')[0]}` : '';
      let html = template;
      // Thay title/desc/canonical/OG cho bài này (canonical vẫn là ?slug để giữ preferred URL)
      html = html.replace(/<title>.*?<\/title>/s, `<title>${escHtml(title)} — Mầm non Bình Minh</title>`);
      html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escHtml(excerpt)}">`);
      html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" id="canonical-link" href="${escHtml(postUrl)}">`);
      html = html.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" id="og-url" content="${escHtml(postUrl)}">`);
      html = html.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" id="og-title" content="${escHtml(title)} — Mầm non Bình Minh">`);
      html = html.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" id="og-desc" content="${escHtml(excerpt)}">`);
      html = html.replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" id="og-image" content="${escHtml(image)}">`);
      html = html.replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" id="tw-title" content="${escHtml(title)} — Mầm non Bình Minh">`);
      html = html.replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" id="tw-desc" content="${escHtml(excerpt)}">`);
      html = html.replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" id="tw-image" content="${escHtml(image)}">`);
      html = html.replace(/<h1 id="bv-title"[^>]*>.*?<\/h1>/s, `<h1 id="bv-title" class="serif text-[30px] md:text-[52px] leading-[1.1] mt-4 max-w-[820px] text-white reveal in">${escHtml(title)}</h1>`);
      // Tag/date
      html = html.replace(/<span id="bv-tag"[^>]*>.*?<\/span>/s, `<span id="bv-tag" class="tag" style="background:var(--chartreuse); color:var(--forest);">${escHtml(tag)}</span>`);
      html = html.replace(/<span id="bv-date"[^>]*>.*?<\/span>/s, `<span id="bv-date" class="tracking-[0.08em] font-semibold" style="color:var(--gold);">${escHtml(dateStr)}</span>`);
      // Image
      html = html.replace(/<div id="bv-image-wrap"[^>]*>[\s\S]*?<\/div>/, `<div id="bv-image-wrap" class="mt-8 img-frame" style="border-radius:1.75rem;"><img decoding="async" id="bv-image" src="${escHtml(post.image||'')}" alt="${escHtml(title)}" class="w-full h-auto object-cover"></div>`);
      // Body - thay article bv-body
      html = html.replace(/<article id="bv-body"[^>]*>.*?<\/article>/s, `<article id="bv-body" class="mt-10 prose-article">${bodyHtml}</article>`);
      // Article LD
      const articleLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: excerpt,
        image: image,
        datePublished: isoDate,
        dateModified: isoDate,
        author: { '@type': 'Organization', name: 'Mầm non Bình Minh' },
        publisher: { '@type': 'Organization', name: 'Mầm non Bình Minh', logo: { '@type': 'ImageObject', url: `${base}/img/logo.webp` } },
        mainEntityOfPage: postUrl
      };
      html = html.replace(/<script type="application\/ld\+json" id="article-jsonld">.*?<\/script>/s, `<script type="application/ld+json" id="article-jsonld">${JSON.stringify(articleLd, null, 2)}</script>`);
      // Breadcrumb LD theo từng bài: Trang chủ > Tin tức & Sự kiện > bài viết (URL clean)
      const crumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${base}/` },
          { '@type': 'ListItem', position: 2, name: 'Tin tức & Sự kiện', item: `${base}/tin-tuc.html` },
          { '@type': 'ListItem', position: 3, name: title, item: postUrl }
        ]
      };
      html = html.replace(/<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "BreadcrumbList",[\s\S]*?\}\s*<\/script>/, `<script type="application/ld+json">${JSON.stringify(crumbLd, null, 2)}</script>`);

      // Sử dụng đường dẫn tuyệt đối cho static subfolder để header (components.js) và assets hoạt động từ /bai-viet/<slug>/
      html = html.replace(/href="css\//g, 'href="/css/');
      html = html.replace(/src="img\//g, 'src="/img/');
      html = html.replace(/src="js\//g, 'src="/js/');
      html = html.replace(/href="img\//g, 'href="/img/');
      html = html.replace(/fetch\('data\/news\.json'/g, "fetch('/data/news.json'");
      // Các link nội bộ tương đối trong static HTML (ví dụ href="tin-tuc.html") -> tuyệt đối
      html = html.replace(/href="(?!https?:\/\/|\/|#|mailto:|tel:|data:)([^"]*\.html[^"]*)"/g, 'href="/$1"');

      const outDir = path.join(path.dirname(baiVietPath), 'bai-viet', slug);
      fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, 'index.html');
      fs.writeFileSync(outPath, html, 'utf8');
    }
    console.log('Đã sinh ' + items.length + ' static bài viết tại bai-viet/<slug>/index.html');
  }
} catch (e) {
  console.error('Lỗi sinh static bài viết:', e.message, e.stack);
}

// --- Netlify redirects: map ?slug URL -> static file via 200 rewrite ---
try {
  if (fs.existsSync(netlifyPath)) {
    let toml = fs.readFileSync(netlifyPath, 'utf8');
    // Xóa redirects cũ cho bai-viet nếu có
    toml = toml.replace(/\n\[\[redirects\]\][\s\S]*?(?=\n\[|$)/g, (m)=> m.includes('bai-viet') ? '' : m);
    // Thêm redirects cho từng slug
    let redirects = '';
    for (const post of items) {
      const slug = post.slug;
      redirects += `\n[[redirects]]\n  from = "/bai-viet.html"\n  to = "/bai-viet/${slug}/index.html"\n  status = 200\n  query = {slug = "${slug}"}\n`;
    }
    // Thêm fallback cho clean URL canonical: /bai-viet/<slug> -> ?slug (optional, giữ clean URL cũng hoạt động)
    // Không cần redirect ngược để tránh vòng lặp
    toml = toml.trimEnd() + '\n' + redirects.trimEnd() + '\n';
    fs.writeFileSync(netlifyPath, toml, 'utf8');
    console.log('Đã cập nhật netlify.toml với ' + items.length + ' redirects cho ?slug');
  }
} catch (e) {
  console.error('Lỗi cập nhật netlify.toml:', e.message);
}

// --- Tin-tuc.html: điền sẵn ItemList JSON-LD từ dữ liệu thật (tránh block rỗng) ---
try {
  const tinTucPath = path.join(__dirname, '..', 'tin-tuc.html');
  if (fs.existsSync(tinTucPath) && items.length > 0) {
    const base = 'https://binhminhkindergarten.site';
    const itemList = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Tin tức & Sự kiện Mầm non Bình Minh',
      numberOfItems: items.length,
      itemListElement: items.map((n, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${base}/bai-viet/${encodeURIComponent(n.slug)}/`,
        name: n.title
      }))
    };
    let t = fs.readFileSync(tinTucPath, 'utf8');
    t = t.replace(/<script type="application\/ld\+json" id="news-itemlist">.*?<\/script>/s, `<script type="application/ld+json" id="news-itemlist">${JSON.stringify(itemList, null, 2)}</script>`);
    fs.writeFileSync(tinTucPath, t, 'utf8');
    console.log('Đã điền ItemList vào tin-tuc.html cho ' + items.length + ' bài viết');
  }
} catch (e) {
  console.error('Lỗi cập nhật tin-tuc.html:', e.message);
}

// --- Vercel rewrites ---
try {
  if (fs.existsSync(vercelPath)) {
    let vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    vercel.rewrites = vercel.rewrites || [];
    // Xóa rewrites cũ cho bai-viet
    vercel.rewrites = vercel.rewrites.filter(r => !(r.source && r.source.includes('bai-viet')));
    for (const post of items) {
      vercel.rewrites.push({
        source: "/bai-viet.html",
        has: [{ type: "query", key: "slug", value: post.slug }],
        destination: `/bai-viet/${post.slug}/index.html`
      });
    }
    fs.writeFileSync(vercelPath, JSON.stringify(vercel, null, 2), 'utf8');
    console.log('Đã cập nhật vercel.json rewrites cho ' + items.length + ' slugs');
  }
} catch (e) {
  console.error('Lỗi cập nhật vercel.json:', e.message);
}
