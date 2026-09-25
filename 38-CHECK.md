# 38-CHECK — Checklist đăng bài mới (Mầm non Bình Minh / DAWN Kindergarten)

Chạy đủ 38 mục mỗi lần thêm hoặc sửa bài viết. Bài nào rớt mục chặn (🔴) thì không đăng.

## A. Fact — không bịa (1–8)

1. 🔴 Số liệu đúng bản chốt: 100+ học sinh, 10+ giáo viên, 10+ chương trình, 700m², nhận bé 6 tháng–5 tuổi.
2. 🔴 Tên chuẩn "Mầm non Bình Minh (DAWN Kindergarten)" + 75/2A Phạm Hồng Thái, P.7 + hotline 0866 685 632 trên mọi bài.
3. 🔴 Chỉ dùng fact đã công bố (web / FAQ / trường xác nhận). Bài cần fact thật (S2, A2, N1, M1/M3, sự kiện) — thiếu fact thì KHÔNG viết.
4. Không ghi học phí cụ thể khi chưa có bảng phí chính thức; giá thị trường phải ghi rõ là khoảng tham khảo.
5. Không viết bài "top trường tốt nhất", trang độ tuổi riêng, bài song ngữ trùng hub Tiếng Anh.
6. 🔴 Ảnh thật của trường hoặc gallery có sẵn; ảnh mới phải được đồng ý; không lấy ảnh mạng.
7. Review/câu chuyện phụ huynh phải có danh tính + đồng ý văn bản mới đăng.
8. Ngày tháng, lịch nghỉ, sự kiện phải thật (ngày + ảnh thật, không bịa sự kiện).

## B. Nội dung & GEO (9–16)

9. Mở bài trả lời trực tiếp câu hỏi chính trong 40–60 từ.
10. Có bảng so sánh / list bước / số liệu cụ thể khi phù hợp (để AI trích dẫn).
11. Cấu trúc H2/H3 rõ, đoạn ngắn, mỗi ý một đoạn.
12. Giọng văn ba mẹ hiểu ngay, không thuật ngữ khô; emoji vừa phải theo style nhà.
13. Bài trụ cột (spoke) tối thiểu ~600 từ — không bài mỏng.
14. Đúng 1 tag (Chương trình / Tư vấn / Sự kiện / Dinh dưỡng / Hoạt động / Văn nghệ / Thông báo).
15. Excerpt ≤ 155 ký tự, chứa từ khóa chính, không trùng nguyên title.
16. Title chứa intent (+ "Vũng Tàu" khi phù hợp), không clickbait.

## C. Internal linking (17–21)

17. Có 1 link về hub cha với anchor tự nhiên, không lặp exact-match giữa các bài.
18. Có 1 link CTA cuối bài về `dang-ky.html` hoặc `tuyen-sinh.html`.
19. Bài mới có ≥ 1 inbound (hub "Bài viết liên quan" / listing) và ≥ 1 outbound về hub — không cụm cô lập.
20. 🔴 Link nội bộ dùng đường dẫn tương đối từ root (`/...`), ảnh dùng `img/...` — không gắn domain cứng.
21. Kiểm tra hub cha có khối link tay không — nếu có thì thêm bài mới vào.

## D. Ảnh (22–26)

22. File tồn tại trong `img/`, tên không dấu, ưu tiên `.webp`.
23. Alt mô tả đúng nội dung ảnh, không nhồi từ khóa.
24. Ảnh hero không vỡ khung `img-frame` trên mobile và desktop.
25. Ảnh lazy + decoding async (trừ ảnh LCP nếu cần ưu tiên).
26. Dung lượng hợp lý (< 300KB/ảnh; nén webp trước khi up).

## E. JSON + build (27–33)

27. File `data/news/<slug>.json` đủ trường: title / slug / tag / date ISO (YYYY-MM-DD) / image / excerpt / body.
28. Slug duy nhất, không dấu, trùng tên file; date mới nhất lên đầu.
29. 🔴 Chạy `node scripts/build-news.js` xem FULL log (không cắt ngọn output — từng làm build chết giữa chừng).
30. `data/news.json` đủ số bài; `sitemap.xml` có entry mới + `<lastmod>` đúng ngày.
31. 🔴 Trang tĩnh `bai-viet/<slug>/` render đúng: không markdown thô (`|`, `**`), không thẻ `</h$1>`, bảng/list chuẩn.
32. Canonical + OG + JSON-LD (Article, Breadcrumb) đúng URL clean `/bai-viet/<slug>/`.
33. `tin-tuc.html` ItemList đủ số bài; `netlify.toml` + `vercel.json` có slug mới.

## F. Verify live sau push (34–38)

34. 🔴 Mở URL clean: ảnh hero + 2 card "Bài viết khác" hiện (runtime không 404 — lỗi từng xảy ra).
35. 🔴 F12 Console không lỗi đỏ (JS/CSS 404, AOS/Lucide lỗi).
36. Check mobile 375px: không tràn chữ, bảng cuộn ngang được, menu mở được.
37. URL `?slug=` cũ rewrite đúng về URL clean.
38. Ghi log backlog (bài + ngày đăng); submit lại sitemap trong Search Console nếu cần; cập nhật `llms.txt` nếu có hub/bài trụ cột mới.
