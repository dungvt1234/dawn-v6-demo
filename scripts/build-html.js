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

function buildArticle() {
  const templatePath = path.join(root, 'templates', 'article.html');
  if (!fs.existsSync(templatePath)) {
    console.error('Missing template:', templatePath);
    process.exit(1);
  }
  const template = fs.readFileSync(templatePath, 'utf8');
  const dataDir = path.join(root, 'data', 'news');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    console.error('No news data');
    process.exit(1);
  }
  // Pick latest by date (same logic as build-news.js)
  function parseDate(s) {
    if (!s) return 0;
    s = String(s).trim();
    let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]).getTime();
    m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (m) return new Date(+m[3], +m[2] - 1, +m[1]).getTime();
    return 0;
  }
  function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function mdInline(s){
    let html = escHtml(s);
    html = html.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img decoding="async" loading="lazy" src="$2" alt="$1">');
    html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/(^|[^*\w])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    html = html.replace(/(^|[\s(>])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2">$2</a>');
    return html;
  }
  function mdToHtml(md){
    try{ const marked=require('marked'); if(marked && marked.parse) return marked.parse(md||''); }catch(e){}
    const lines = String(md||'').split('\n');
    let out = ''; let para=[]; let listTag=null; let tableRows=null; let quote=[];
    const flushPara=()=>{ if(para.length){ out+='<p>'+para.join('\n')+'</p>'; para=[]; } };
    const flushList=()=>{ if(listTag){ out+='</'+listTag+'>'; listTag=null; } };
    const flushQuote=()=>{ if(quote.length){ out+='<blockquote>'+quote.join('<br>')+'</blockquote>'; quote=[]; } };
    const flushTable=()=>{
      if(!tableRows) return;
      const splitRow=(r)=>r.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
      const isSep=(cells)=>cells.length && cells.every(c=>/^:?-+:?$/.test(c));
      let rows=tableRows.map(splitRow);
      if(rows.length>1 && isSep(rows[1])) rows.splice(1,1);
      let t='<div class="table-wrap"><table>';
      rows.forEach((cells,i)=>{ const tag=i===0?'th':'td'; t+='<tr>'+cells.map(c=>'<'+tag+'>'+mdInline(c)+'</'+tag+'>').join('')+'</tr>'; });
      out+=t+'</table></div>'; tableRows=null;
    };
    const flushAll=()=>{ flushPara(); flushList(); flushTable(); flushQuote(); };
    for(const raw of lines){
      const line=raw.trim();
      if(!line){ flushAll(); continue; }
      if(/^<[a-zA-Z!/][^]*>$/.test(line)){ flushAll(); out+=line; continue; }
      if(/^\|.*\|$/.test(line)){ flushPara(); flushList(); flushQuote(); (tableRows=tableRows||[]).push(line); continue; }
      flushTable();
      let m=line.match(/^(#{1,3})\s+(.*)$/);
      if(m){ flushAll(); out+='<h'+m[1].length+'>'+mdInline(m[2])+'</h'+m[1].length+'>'; continue; }
      if(/^(-{3,}|\*{3,})$/.test(line)){ flushAll(); out+='<hr>'; continue; }
      if(/^>/.test(line)){ flushPara(); flushList(); quote.push(mdInline(line.replace(/^>\s?/,''))); continue; }
      flushQuote();
      m=line.match(/^(?:[-*•])\s+(.*)$/);
      if(m){ flushPara(); if(listTag!=='ul'){ flushList(); out+='<ul>'; listTag='ul'; } out+='<li>'+mdInline(m[1])+'</li>'; continue; }
      m=line.match(/^\d+[.)]\s+(.*)$/);
      if(m){ flushPara(); if(listTag!=='ol'){ flushList(); out+='<ol>'; listTag='ol'; } out+='<li>'+mdInline(m[1])+'</li>'; continue; }
      flushList(); para.push(mdInline(line));
    }
    flushAll(); return out;
  }
  function toISODate(s){
    if(!s) return null;
    s=String(s).trim();
    let m=s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if(m) return `${m[1]}-${m[2]}-${m[3]}`;
    m=s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if(m) return `${m[3]}-${m[2]}-${m[1]}`;
    const t=parseDate(s);
    if(t){ const d=new Date(t); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
    return null;
  }

  // Pick latest
  let items=[];
  for(const f of files){
    try{
      const data=JSON.parse(fs.readFileSync(path.join(dataDir,f),'utf8'));
      if(data && data.title) items.push(data);
    }catch(e){}
  }
  items.sort((a,b)=>parseDate(b.date)-parseDate(a.date));
  const post = items[0];
  if(!post){ console.error('No post'); process.exit(1); }
  const base='https://binhminhkindergarten.site';
  const slug=post.slug;
  const postUrl=`${base}/bai-viet/${encodeURIComponent(slug)}/`;
  const title=post.title;
  const excerpt=(post.excerpt||'').slice(0,155);
  const image=post.image ? (post.image.startsWith('http')?post.image:`${base}/${post.image.replace(/^\//,'')}`) : `${base}/img/hero.webp`;
  const isoDate=toISODate(post.date)||'2026-01-01';
  const bodyHtml=mdToHtml(post.body||post.excerpt||'');
  const tag=post.tag||'';
  const dateStr=isoDate?`${isoDate.split('-')[2]}/${isoDate.split('-')[1]}/${isoDate.split('-')[0]}`:'';
  const imageBlock=`<div id="bv-image-wrap" class="mt-8 img-frame" style="border-radius:1.75rem;"><img decoding="async" id="bv-image" src="${escHtml(post.image||'')}" alt="${escHtml(title)}" class="w-full h-auto object-cover"></div>`;
  const articleLd={ '@context':'https://schema.org','@type':'Article',headline:title,description:excerpt,image:image,datePublished:isoDate,dateModified:isoDate,author:{'@type':'Organization',name:'Mầm non Bình Minh'},publisher:{'@type':'Organization',name:'Mầm non Bình Minh',logo:{'@type':'ImageObject',url:`${base}/img/logo.webp`}},mainEntityOfPage:postUrl };
  const crumbLd={ '@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Trang chủ',item:`${base}/`},{'@type':'ListItem',position:2,name:'Tin tức & Sự kiện',item:`${base}/tin-tuc.html`},{'@type':'ListItem',position:3,name:title,item:postUrl}] };
  let html=template;
  html=html.replace(/{{title}}/g, escHtml(title));
  html=html.replace(/{{description}}/g, escHtml(excerpt));
  html=html.replace(/{{canonical}}/g, escHtml(postUrl));
  html=html.replace(/{{ogUrl}}/g, escHtml(postUrl));
  html=html.replace(/{{ogTitle}}/g, escHtml(title+' — Mầm non Bình Minh'));
  html=html.replace(/{{ogDescription}}/g, escHtml(excerpt));
  html=html.replace(/{{ogImage}}/g, escHtml(image));
  html=html.replace(/{{twitterTitle}}/g, escHtml(title+' — Mầm non Bình Minh'));
  html=html.replace(/{{twitterDescription}}/g, escHtml(excerpt));
  html=html.replace(/{{twitterImage}}/g, escHtml(image));
  html=html.replace(/{{articleTitle}}/g, escHtml(title));
  html=html.replace(/{{tag}}/g, escHtml(tag));
  html=html.replace(/{{date}}/g, escHtml(dateStr));
  html=html.replace(/{{imageBlock}}/g, imageBlock);
  html=html.replace(/{{bodyHtml}}/g, bodyHtml);
  html=html.replace(/{{articleJsonLd}}/g, `<script type="application/ld+json" id="article-jsonld">${JSON.stringify(articleLd,null,2)}</script>`);
  html=html.replace(/{{breadcrumbJsonLd}}/g, `<script type="application/ld+json">${JSON.stringify(crumbLd,null,2)}</script>`);

  // Validation: no placeholder left
  if (/\{\{.*?\}\}/.test(html)) {
    console.error('POC FAIL: placeholder remains', html.match(/\{\{.*?\}\}/g));
    process.exit(1);
  }

  // Absolutize for nested output (same as build-news.js)
  html=html.replace(/href="css\//g,'href="/css/');
  html=html.replace(/src="img\//g,'src="/img/');
  html=html.replace(/src="js\//g,'src="/js/');
  html=html.replace(/href="img\//g,'href="/img/');
  html=html.replace(/fetch\('data\/news\.json'/g, "fetch('/data/news.json'");
  html=html.replace(/href="(?!https?:\/\/|\/|#|mailto:|tel:|data:)([^"]*\.html[^"]*)"/g,'href="/$1"');

  const outDir2 = path.join(root, 'dist', 'bai-viet', slug);
  fs.mkdirSync(outDir2, {recursive:true});
  const outPath2 = path.join(outDir2, 'index.html');
  fs.writeFileSync(outPath2, html, 'utf8');
  console.log(`POC article: ${slug} -> ${outPath2}`);
  console.log(`Title: ${title}`);
  console.log(`Body length: ${bodyHtml.length}, Tag: ${tag}, Date: ${dateStr}`);
  console.log('P2-B3 POC done — dist/bai-viet/<slug>/index.html generated from templates/article.html');
}

if (process.argv.includes('--article')) {
  buildArticle();
} else {
  build();
}
