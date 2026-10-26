# Căn phòng của Thái — portfolio online

Web tĩnh (HTML/CSS/JS thuần, không cần build), dữ liệu trên Supabase, deploy bằng Netlify.

## Cấu trúc thư mục

```
index.html              trang duy nhất; mỗi khu vực là một <section data-room="...">
config.js               URL + anon key Supabase (của riêng bạn)
manifest.webmanifest    cài lên màn hình chính, luôn xoay ngang (Android)
supabase-bao-mat.sql    luật bảo mật: ai cũng xem, chỉ chủ kệ được sửa

core/                   dùng chung cho cả căn phòng
  supabase.js           kết nối Supabase, đường dẫn ảnh, đăng nhập chủ kệ
  icons.js              bộ icon ic('ten')
  ui.js                 thông báo, hộp thoại, lớp phủ, ánh sáng theo giờ, âm thanh,
                        nén/cắt ảnh, nhắc xoay ngang, nút đăng nhập
  router.js             điều hướng #/ten-khu-vuc
  start.js              khởi động (nạp sau cùng)
  base.css              giao diện dùng chung

room/                   CĂN PHÒNG, trang chủ (#/phong)
  room.js               vẽ phòng, các món đồ, phóng vào từng khu vực; đổi tên ở ROOM_NAME
  room.css              màu tường / sàn / trời theo giờ

shelf/                  khu vực KỆ SÁCH KỶ NIỆM  (#/ke-sach)
  shelf-db.js           bảng books, pages, kho ảnh photos
  nooks.js              các book nook 3D
  shelf.js              gáy sách, nhìn gần/xa, mở sách, lật trang, thêm trang, vé
  shelf.css             giao diện kệ sách
```

## Thêm một khu vực mới (ví dụ tủ đồ)

Trong `room/room.js`, món đồ đã có sẵn trong `OBJS`; khi khu vực làm xong thì đặt `open:true` cho nó.


1. Tạo thư mục `wardrobe/` với `wardrobe.js`, `wardrobe.css`.
2. Thêm `<section class="room" data-room="tu-do" hidden>…</section>` vào `index.html`,
   nạp CSS/JS của nó trước `core/start.js`.
3. Trong `wardrobe.js` gọi `room('tu-do',{title:'Tủ đồ',enter(){…}})`. Mở bằng `#/tu-do`.
