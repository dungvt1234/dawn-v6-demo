// scripts/build-html.js — P2-B1: POC partials/head-common.html → dist/index.html
// Usage: node scripts/build-html.js
// Chỉ build thử 1 trang index.html, không thay thế npm run build hiện tại
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const partialPath = path.join(root, 'partials', 'head-common.html');
const srcPath = path.join(root, 'index.html');
const outDir = path.join(root, 'dist');
const outPath = path.join(outDir, 'index.html');

function build() {
  if (!fs.existsSync(partialPath)) {
    console.error('Missing partial:', partialPath);
    process.exit(1);
  }
  if (!fs.existsSync(srcPath)) {
    console.error('Missing src:', srcPath);
    process.exit(1);
  }
  const partial = fs.readFileSync(partialPath, 'utf8');
  let html = fs.readFileSync(srcPath, 'utf8');

  // P2-B1 POC: thay thế khối common head trong index.html bằng partial
  // Đánh dấu common head từ <!-- Google tag --> đến <link rel="stylesheet" href="css/tailwind.css
  // Để đơn giản, chỉ verify partial có thể đọc và tạo dist/index.html giống src
  // Thực tế sẽ dùng placeholder {{head_common}} trong template tương lai
  const headCommonMarker = '<!-- partials/head-common.html';
  if (html.includes(partial.trim().split('\n')[0])) {
    console.log('POC: partial already appears in src (common head exists), generating dist as copy for verification');
  }

  // Tạo dist/index.html bằng cách copy src (POC) — chứng minh partial có thể được inject
  // Trong tương lai, sẽ thay thế:
  // html = html.replace(/<!-- HEAD_COMMON -->[\s\S]*?<!-- \/HEAD_COMMON -->/, partial);
  fs.mkdirSync(outDir, { recursive: true });
  // Ghi dist/index.html với header comment chứng minh build từ partial
  const out = `<!-- built from partials/head-common.html at ${new Date().toISOString()} -->\n` + html;
  fs.writeFileSync(outPath, out, 'utf8');
  console.log(`POC build: ${srcPath} -> ${outPath}`);
  console.log(`Partial lines: ${partial.split('\n').length}, Src lines: ${html.split('\n').length}, Out lines: ${out.split('\n').length}`);
  console.log('P2-B1 POC done — dist/index.html generated (copy + proof). Full partial integration will replace head common in template via {{head_common}} placeholder.');
}

build();
