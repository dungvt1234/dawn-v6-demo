// Zalo Modal — hiện popup mời nhắn Zalo khi khách gửi form
// Dùng chung cho lien-he.html và dang-ky.html
(function () {
  const ZALO_PHONE = '0866685632';
  const ZALO_LINK = 'https://zalo.me/' + ZALO_PHONE;

  function buildModal() {
    const modal = document.createElement('div');
    modal.id = 'zalo-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:2000;display:none;align-items:center;justify-content:center;background:rgba(18,24,18,.65);padding:20px;';
    modal.innerHTML =
      '<div style="background:#fff;border-radius:28px;max-width:420px;width:100%;padding:36px 28px 32px;text-align:center;position:relative;box-shadow:0 30px 60px rgba(0,0,0,.35);">' +
        '<button id="zalo-modal-close" aria-label="Đóng" style="position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;background:#f1f0ea;border:none;color:#666;font-size:16px;cursor:pointer;line-height:1;">✕</button>' +
        '<div style="width:72px;height:72px;border-radius:50%;background:#0068FF;display:flex;align-items:center;justify-content:center;margin:0 auto;">' +
          '<span style="color:#fff;font-size:32px;font-weight:700;">Z</span>' +
        '</div>' +
        '<h3 style="font-family:\'DM Serif Display\',serif;font-size:24px;color:#28192E;margin:20px 0 8px;">Cảm ơn anh/chị!</h3>' +
        '<p style="font-size:15px;line-height:1.7;color:#555;margin:0;">Để được tư vấn và xác nhận nhanh nhất, anh/chị vui lòng nhắn tin qua <strong style="color:#0068FF;">Zalo</strong> cho Mầm non Bình Minh nhé!</p>' +
        '<a href="' + ZALO_LINK + '" target="_blank" rel="noopener" id="zalo-modal-open" style="display:flex;align-items:center;justify-content:center;gap:10px;margin:24px auto 0;background:#0068FF;color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 28px;border-radius:999px;max-width:280px;">' +
          '<span style="width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.25);display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">Z</span>' +
          'NHẮN TIN ZALO NGAY →' +
        '</a>' +
        '<p style="font-size:13px;color:#888;margin:18px 0 0;">Hoặc gọi hotline: <a href="tel:' + ZALO_PHONE + '" style="color:#223D22;font-weight:600;text-decoration:none;">' + ZALO_PHONE.slice(0,4) + ' ' + ZALO_PHONE.slice(4,7) + ' ' + ZALO_PHONE.slice(7) + '</a></p>' +
      '</div>';
    document.body.appendChild(modal);

    document.getElementById('zalo-modal-close').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  function open() {
    var modal = document.getElementById('zalo-modal');
    if (modal) modal.style.display = 'flex';
  }
  function close() {
    var modal = document.getElementById('zalo-modal');
    if (modal) modal.style.display = 'none';
  }

  // Bind: mọi form có class js-zalo-form
  function bindForms() {
    document.querySelectorAll('form.js-zalo-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        // Reset form sau khi hiện popup
        form.reset();
        open();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { buildModal(); bindForms(); });
  } else {
    buildModal();
    bindForms();
  }
})();
