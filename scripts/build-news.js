// scripts/build-news.js
// Gộp tất cả bài viết trong data/news/*.json thành data/news.json (mới nhất lên trước)
// Chạy tự động trên Netlify mỗi lần deploy (xem netlify.toml)
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'data', 'news');
const outFile = path.join(__dirname, '..', 'data', 'news.json');

// Hỗ trợ cả 2 định dạng ngày: "2026-08-24" (ISO) và "25/08/2026" (DD/MM/YYYY)
function parseDate(s) {
  if (!s) return 0;
  s = String(s).trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]).getTime();
  m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]).getTime();
  return 0;
}

let items = [];
if (fs.existsSync(dir)) {
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    try {
      const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      if (data && data.title) items.push(data);
    } catch (e) {
      console.error('Lỗi đọc ' + f + ': ' + e.message);
    }
  }
}

items.sort((a, b) => parseDate(b.date) - parseDate(a.date));
fs.writeFileSync(outFile, JSON.stringify({ news: items }, null, 2));
console.log('Đã gộp ' + items.length + ' bài viết -> data/news.json');
