// Trợ lý Bé Ngoan — chatbot tư vấn tuyển sinh (rule-based, tiếng Việt, ~5KB)
// Tự chứa CSS + logic, không phụ thuộc components.js. Hiện trên mọi trang có nhúng file này.
// Cách dùng: <script src="js/chatbot.js?v=1"></script> trước </body>
// Mở bằng code: window.DawnChat.open()
(function () {
  'use strict';

  if (window.DawnChat) return; // tránh nạp 2 lần

  var HOTLINE = '0866685632';
  var HOTLINE_FMT = '0866 685 632';

  var T = {
    hello: 'Chào ba mẹ! Em là trợ lý Bé Ngoan. Ba mẹ cần tư vấn gì ạ? 🌱',
    chips: ['Học phí', 'Giờ học', 'Địa chỉ', 'Đăng ký'],
    inputPh: 'Nhập câu hỏi...',
    fallback:
      'Câu này hơi khó, em chưa chắc chắn. Ba mẹ <a href="https://zalo.me/' +
      HOTLINE +
      '" target="_blank" rel="noopener">nhắn Zalo</a> hoặc gọi <a href="tel:' +
      HOTLINE +
      '">' +
      HOTLINE_FMT +
      '</a> để cô tư vấn ngay nhé! Hoặc xem <a href="cau-hoi.html">câu hỏi thường gặp</a>.',
  };

  var A = {
    fee: 'Học phí chi tiết ba mẹ xem tại <a href="hoc-phi.html">trang học phí</a> nhé — minh bạch, đang có ưu đãi nhập học sớm. Để biết mức phí hiện hành, ba mẹ gọi <a href="tel:' + HOTLINE + '">' + HOTLINE_FMT + '</a> ạ. 💰',
    hours: 'Trường đón bé từ 7:00 – 17:30, Thứ 2 – Thứ 7, có bán trú và camera 24/7 ạ. 🕖',
    addr: 'Trường ở 75/2A Phạm Hồng Thái, Phường 7, TP. Vũng Tàu. Ba mẹ xem <a href="lien-he.html">bản đồ đường đi</a> nhé. 📍',
    reg: 'Tuyệt vời! Ba mẹ để lại thông tin tại <a href="dang-ky.html">trang đăng ký</a>, cô gọi lại trong 24h để hẹn tham quan ạ. 📝',
    prog: 'Chương trình theo triết lý Grow with Nature: Montessori, STEAM và tiếng Anh, vận động ngoài trời mỗi ngày. Chi tiết: <a href="chuong-trinh.html">chương trình học</a>. 🧩',
    food: 'Thực đơn theo tuần do chuyên gia dinh dưỡng thiết kế, công khai mỗi tuần. Xem tại <a href="dinh-duong.html">dinh dưỡng</a>. 🍲',
    age: 'Trường nhận bé từ 6 tháng đến 6 tuổi ạ: nhà trẻ (6–24 tháng), mẫu giáo bé (2–3 tuổi), mẫu giáo nhỡ (3–4 tuổi), mẫu giáo lớn (4–6 tuổi). 👶',
    camera: 'Dạ có ạ, trường có camera 24/7 để ba mẹ yên tâm theo dõi bé. Ba mẹ gọi <a href="tel:' + HOTLINE + '">' + HOTLINE_FMT + '</a> để được hướng dẫn xem camera nhé. 📷',
    contact: 'Hotline <a href="tel:' + HOTLINE + '">' + HOTLINE_FMT + '</a> · <a href="https://zalo.me/' + HOTLINE + '" target="_blank" rel="noopener">Zalo</a> · <a href="lien-he.html">trang liên hệ</a>. 📞',
    thanks: 'Dạ không có gì ạ! Mong sớm gặp bé tại Bình Minh! 💛',
    bye: 'Chào ba mẹ, chúc gia đình một ngày vui vẻ! 👋',
  };

  function norm(s) {
    return (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd');
  }

  function answer(q) {
    var t = norm(q);
    if (/(^(hi|hello|hey)\b|chao|xin chao)/.test(t)) return T.hello;
    if (/(hoc phi|phi|gia|tien|dong|fee|price|tuition|cost|much)/.test(t)) return A.fee;
    if (/(camera|giam sat|theo doi)/.test(t)) return A.camera;
    if (/(gio|mo cua|dong cua|time|hour|open|close|thu may|ngay nao|ban tru)/.test(t)) return A.hours;
    if (/(dia chi|o dau|address|where|map|duong|ban do)/.test(t)) return A.addr;
    if (/(dang ky|tham quan|nhap hoc|tuyen sinh|ghi danh|register|tour|enroll|admission|visit)/.test(t)) return A.reg;
    if (/(chuong trinh|montessori|steam|tieng anh|hoc gi|program|curriculum|english|hoc)/.test(t)) return A.prog;
    if (/(dinh duong|thuc don|food|meal|menu|lunch)/.test(t)) return A.food;
    if (/(tuoi|bao nhieu|nhan be|age|old|month|nha tre|mau giao)/.test(t)) return A.age;
    if (/(lien he|sdt|so dien|hotline|zalo|phone|contact|call|goi)/.test(t)) return A.contact;
    if (/(cam on|thank)/.test(t)) return A.thanks;
    if (/(tam biet|bye|chao nhe)/.test(t)) return A.bye;
    return T.fallback;
  }

  // Escape HTML ở tin nhắn người dùng để chống XSS
  function esc(s) {
    return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // CSS tự chứa — dùng biến màu của site, có fallback nếu thiếu
  var css =
    '#dawn-chat{position:fixed;right:16px;bottom:104px;z-index:2500;width:min(378px,calc(100vw - 24px));' +
    'height:min(520px,calc(100dvh - 220px));min-height:380px;background:#F8F7F0;background:var(--ivory,#F8F7F0);' +
    'border-radius:24px;overflow:hidden;display:flex;flex-direction:column;' +
    'box-shadow:0 30px 70px rgba(20,30,20,.4);border:1px solid #E5E2D5;border:1px solid var(--border,#E5E2D5);' +
    'opacity:0;visibility:hidden;transform:translateY(16px) scale(.97);' +
    'transition:opacity .3s ease,transform .3s cubic-bezier(.22,1,.36,1),visibility .3s;}' +
    '#dawn-chat.is-open{opacity:1;visibility:visible;transform:none;}' +
    '#dawn-chat .chat-head{background:#2D4A33;background:var(--forest,#2D4A33);color:#F8F7F0;color:var(--ivory,#F8F7F0);' +
    'padding:14px 16px;display:flex;align-items:center;gap:12px;}' +
    '#dawn-chat .chat-avatar{width:40px;height:40px;border-radius:50%;flex-shrink:0;' +
    'background:#D4E157;background:var(--chartreuse,#D4E157);display:flex;align-items:center;justify-content:center;font-size:22px;}' +
    '#dawn-chat .chat-name{font-weight:700;font-size:15px;}' +
    '#dawn-chat .chat-status{font-size:12px;color:#D4E157;color:var(--chartreuse,#D4E157);display:flex;align-items:center;gap:5px;}' +
    '#dawn-chat .chat-status::before{content:"";width:8px;height:8px;border-radius:50%;background:#4ADE80;}' +
    '#dawn-chat .chat-close{margin-left:auto;width:32px;height:32px;border-radius:50%;' +
    'background:rgba(255,255,255,.12);border:none;color:#fff;font-size:14px;cursor:pointer;}' +
    '#dawn-chat .chat-body{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:10px;}' +
    '#dawn-chat .msg{max-width:82%;padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.6;}' +
    '#dawn-chat .msg a{color:#2D4A33;color:var(--forest,#2D4A33);font-weight:700;}' +
    '#dawn-chat .msg-bot{align-self:flex-start;background:#fff;color:#333; border:1px solid #E5E2D5;border:1px solid var(--border,#E5E2D5);border-bottom-left-radius:6px;}' +
    '#dawn-chat .msg-user{align-self:flex-end;background:#2D4A33;background:var(--forest,#2D4A33);color:#fff;border-bottom-right-radius:6px;}' +
    '#dawn-chat .msg-typing{display:flex;gap:5px;padding:14px 16px;}' +
    '#dawn-chat .msg-typing i{width:7px;height:7px;border-radius:50%;background:#999;animation:dawn-typing 1s infinite;}' +
    '#dawn-chat .msg-typing i:nth-child(2){animation-delay:.15s;}' +
    '#dawn-chat .msg-typing i:nth-child(3){animation-delay:.3s;}' +
    '@keyframes dawn-typing{0%,100%{opacity:.3;}50%{opacity:1;}}' +
    '#dawn-chat .chat-chips{display:flex;flex-wrap:wrap;gap:8px;padding:0 14px 10px;}' +
    '#dawn-chat .chat-chips button{font-size:12px;font-weight:600;padding:7px 14px;border-radius:999px;cursor:pointer;' +
    'background:#fff;color:#2D4A33;color:var(--forest,#2D4A33);border:1px solid #9DBE8C;border:1px solid var(--chartreuse-strong,#9DBE8C);}' +
    '#dawn-chat .chat-form{display:flex;gap:8px;padding:12px 14px 14px;border-top:1px solid #E5E2D5;border-top:1px solid var(--border,#E5E2D5);background:#fff;}' +
    '#dawn-chat .chat-form input{flex:1;border:1px solid #E5E2D5;border:1px solid var(--border,#E5E2D5);border-radius:999px;' +
    'padding:10px 16px;font-size:14px;outline:none;background:#F8F7F0;color:#333;}' +
    '#dawn-chat .chat-form button{width:42px;height:42px;border-radius:50%;border:none;cursor:pointer;flex-shrink:0;' +
    'background:#2D4A33;background:var(--forest,#2D4A33);color:#fff;font-size:17px;}' +
    '#dawn-chat-teaser{position:fixed;right:86px;bottom:44px;z-index:2500;' +
    'background:#fff;color:#333;font-size:13px;font-weight:500;' +
    'padding:10px 16px;border-radius:16px 16px 4px 16px;cursor:pointer;' +
    'box-shadow:0 12px 30px rgba(20,30,20,.25);border:1px solid #E5E2D5;' +
    'max-width:230px;opacity:0;visibility:hidden;transform:translateY(8px);' +
    'transition:opacity .35s,transform .35s,visibility .35s;}' +
    '#dawn-chat-teaser.is-show{opacity:1;visibility:visible;transform:none;}' +
    '#chat-toggle{position:fixed;right:16px;bottom:24px;z-index:2499;width:56px;height:56px;border-radius:50%;' +
    'border:none;cursor:pointer;font-size:24px;background:#D4E157;background:var(--chartreuse,#D4E157);color:#2D4A33;' +
    'box-shadow:0 12px 30px rgba(20,30,20,.3);}' +
    '@media (max-width:767px){#dawn-chat{bottom:216px;right:12px;}#dawn-chat-teaser{bottom:156px;right:76px;}}';
  var style = document.createElement('style');
  style.id = 'dawn-chat-css';
  style.textContent = css;
  document.head.appendChild(style);

  // Panel chat
  var panel = document.createElement('div');
  panel.id = 'dawn-chat';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Trợ lý Bé Ngoan');
  panel.innerHTML =
    '<div class="chat-head">' +
    '<div class="chat-avatar">🌱</div>' +
    '<div><div class="chat-name">Trợ lý Bé Ngoan</div>' +
    '<div class="chat-status">Đang trực tuyến</div></div>' +
    '<button class="chat-close" aria-label="Đóng">✕</button></div>' +
    '<div class="chat-body"></div>' +
    '<div class="chat-chips">' +
    T.chips.map(function (c) {
      return '<button type="button">' + c + '</button>';
    }).join('') +
    '</div>' +
    '<form class="chat-form"><input maxlength="200" placeholder="' +
    T.inputPh +
    '" aria-label="' +
    T.inputPh +
    '">' +
    '<button type="submit" aria-label="Gửi">➤</button></form>';
  document.body.appendChild(panel);

  var body = panel.querySelector('.chat-body');
  var form = panel.querySelector('.chat-form');
  var input = panel.querySelector('input');
  var greeted = false;

  function scroll() {
    body.scrollTop = body.scrollHeight;
  }
  function say(html, who) {
    var d = document.createElement('div');
    d.className = 'msg msg-' + who;
    d.innerHTML = html;
    body.appendChild(d);
    scroll();
  }
  function ask(text) {
    var q = (text || '').trim();
    if (!q) return;
    say(esc(q), 'user');
    var tp = document.createElement('div');
    tp.className = 'msg msg-bot msg-typing';
    tp.innerHTML = '<i></i><i></i><i></i>';
    body.appendChild(tp);
    scroll();
    setTimeout(function () {
      tp.remove();
      say(answer(q), 'bot');
    }, 550);
  }
  function open(focusInput) {
    panel.classList.add('is-open');
    hideTeaser();
    if (!greeted) {
      greeted = true;
      setTimeout(function () {
        say(T.hello, 'bot');
      }, 250);
    }
    // Chỉ focus ô nhập khi người dùng chủ động mở chat (bấm nút/teaser).
    // Tự mở lúc tải trang thì KHÔNG focus để tránh cuộn trang xuống cuối
    // và tránh tự bật bàn phím trên mobile.
    if (focusInput !== false) {
      setTimeout(function () {
        input.focus();
      }, 350);
    }
  }
  function close() {
    panel.classList.remove('is-open');
  }

  panel.querySelector('.chat-close').addEventListener('click', close);
  panel.querySelectorAll('.chat-chips button').forEach(function (b) {
    b.addEventListener('click', function () {
      ask(b.textContent);
    });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    ask(input.value);
    input.value = '';
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  // Nút mở dự phòng — tự ẩn khi đã có nút "Chat tư vấn" trong floating contact
  var fallbackBtn = document.createElement('button');
  fallbackBtn.id = 'chat-toggle';
  fallbackBtn.setAttribute('aria-label', 'Chat với trợ lý');
  fallbackBtn.innerHTML = '💬';
  fallbackBtn.style.display = 'none';
  document.body.appendChild(fallbackBtn);
  fallbackBtn.addEventListener('click', open);
  function syncFallbackBtn() {
    fallbackBtn.style.display = document.getElementById('fc-chat') ? 'none' : '';
  }
  // components.js chèn floating contact ngay khi nạp; kiểm tra lại sau 1s cho chắc
  setTimeout(syncFallbackBtn, 1000);

  // Bong bóng chào 1 lần/phiên — hiện câu chào mà không cần mở khung chat.
  // Bấm vào bong bóng thì mở chat.
  var teaser = document.createElement('div');
  teaser.id = 'dawn-chat-teaser';
  teaser.textContent = T.hello;
  document.body.appendChild(teaser);
  function hideTeaser() {
    teaser.classList.remove('is-show');
  }
  teaser.addEventListener('click', open);
  try {
    if (!sessionStorage.getItem('dawn-chat-teased')) {
      setTimeout(function () {
        if (!panel.classList.contains('is-open')) teaser.classList.add('is-show');
        try {
          sessionStorage.setItem('dawn-chat-teased', '1');
        } catch (e) {}
      }, 1500);
      setTimeout(hideTeaser, 30000);
    }
  } catch (e) {}

  // Khung chat mặc định ĐÓNG để không che dock 4 nút nổi.
  // Ba mẹ mở bằng: nút tròn dự phòng, nút "Chat tư vấn", bong bóng mời chat,
  // hoặc code: window.DawnChat.open()

  window.DawnChat = { open: open, close: close, ask: ask };
})();
