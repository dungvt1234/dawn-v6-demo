// scripts/build-html.js — P2-B1/B2: POC partials/head-common.html + header/footer → dist/index.html
// Usage: node scripts/build-html.js
// Chỉ build thử 1 trang index.html, không thay thế npm run build hiện tại
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const headPartialPath = path.join(root, 'partials', 'head-common.html');
const headerPartialPath = path.join(root, 'partials', 'header.html');
const footerPartialPath = path.join(root, 'partials', 'footer.html');
const srcPath = path.join(root, 'index.html');
const outDir = path.join(root, 'dist');
const outPath = path.join(outDir, 'index.html');

function build() {
  // P2-B1: head-common partial exists check
  if (!fs.existsSync(headPartialPath)) {
    console.error('Missing head partial:', headPartialPath);
    process.exit(1);
  }
  if (!fs.existsSync(srcPath)) {
    console.error('Missing src:', srcPath);
    process.exit(1);
  }
  const headPartial = fs.readFileSync(headPartialPath, 'utf8');
  let html = fs.readFileSync(srcPath, 'utf8');

  // P2-B2: header/footer partials
  let headerPartial = null;
  let footerPartial = null;
  if (fs.existsSync(headerPartialPath)) {
    headerPartial = fs.readFileSync(headerPartialPath, 'utf8');
    console.log(`Header partial: ${headerPartialPath} (${headerPartial.split('\n').length} lines)`);
  }
  if (fs.existsSync(footerPartialPath)) {
    footerPartial = fs.readFileSync(footerPartialPath, 'utf8');
    console.log(`Footer partial: ${footerPartialPath} (${footerPartial.split('\n').length} lines)`);
  }

  // POC: verify partials readable
  if (html.includes(headPartial.trim().split('\n')[0])) {
    console.log('POC: head-common partial already appears in src (common head exists)');
  }

  // P2-B2 POC: inject header/footer partials into dist/index.html
  // Thay thế <div data-include="header">...</div> và <div data-include="footer"></div>
  let outHtml = html;
  if (headerPartial) {
    // header placeholder includes fallback nav, replace entire div
    outHtml = outHtml.replace(/<div data-include="header">[\s\S]*?<\/div>/, headerPartial.trim());
    console.log('Injected header partial into dist');
  }
  if (footerPartial) {
    outHtml = outHtml.replace(/<div data-include="footer"><\/div>/, footerPartial.trim());
    console.log('Injected footer partial into dist');
  }

  fs.mkdirSync(outDir, { recursive: true });
  const out = `<!-- built from partials/head-common.html + header/footer at ${new Date().toISOString()} -->\n` + outHtml;
  fs.writeFileSync(outPath, out, 'utf8');
  console.log(`POC build: ${srcPath} -> ${outPath}`);
  console.log(`Head partial lines: ${headPartial.split('\n').length}, Src lines: ${html.split('\n').length}, Out lines: ${out.split('\n').length}`);
  console.log('P2-B1/B2 POC done — dist/index.html generated with header/footer injection. Full integration will use {{head_common}}/{{header}}/{{footer}} placeholders.');
}

build();
