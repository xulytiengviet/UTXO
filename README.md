# UTXO · Không gian mật mã 3D

**Long Ngo thiết kế · MIT · 2026**

Phòng thực hành tiếng Việt dựa trên HTML và bài giảng do Long Ngo cung cấp, được biên tập lại để phân biệt mô hình UTXO, mật mã và bảo mật hệ thống.

## Chạy

Mở `index.html` trực tiếp bằng trình duyệt hiện đại. Không cần npm, máy chủ, GPU WebGL hoặc CDN. Các điểm được lưu bằng tọa độ 3D, xoay và chiếu phối cảnh lên Canvas 2D; đây không phải bộ dựng WebGL hay mô phỏng vật lý.

- Kéo để xoay; cuộn để phóng to; rê điểm để xem tên; nhấp để mở hồ sơ.
- Có thể chọn điểm bằng các nút với bàn phím, lọc nhóm và chọn tuyến.
- Điều khiển xoay, chuyển động hạt, nhãn và góc nhìn độc lập.
- Tôn trọng prefers-reduced-motion khi khởi tạo.
- Tab thí nghiệm: UTXO nguyên satoshi, tiêu trùng, ECDSA đồ chơi, Script từng lệnh.
- Tab bài giảng: 6 chương, bảng đính chính và nguồn tham khảo.

## Phạm vi khoa học

Tọa độ và tuyến là phân loại khái niệm do tác giả gán, không định lượng rủi ro. ECDSA đồ chơi dùng E(F17), G=(5,1), n=19 và khóa cố định d=7; có phép cộng điểm, ký và khôi phục bằng đại số thật. Script dùng ký hiệu và giả định CHECKSIG, không thực thi Bitcoin Script thật. Mô hình UTXO giả định chữ ký đúng và giao dịch đã được đưa vào lịch sử đang chọn, bỏ qua các quy tắc ngoài phạm vi bài tập.

Không kết nối ví, không nhập khóa thật, không truy vấn blockchain và không phát giao dịch. Không sử dụng mã mật mã đồ chơi trong ứng dụng tài chính.

## Kiểm tra

`node test.cjs`

Kiểm tra bảo toàn giá trị, bỏ tiền thừa, đầu vào lỗi, bậc nhóm, khôi phục và xác minh chữ ký đồ chơi, cập nhật trạng thái, từ chối tiêu trùng và reset. JavaScript đã kiểm tra cú pháp. Chưa kiểm thử trình duyệt trực quan tự động trong môi trường tạo bản này.

## GitHub Pages

Workflow `.github/workflows/pages.yml` kiểm tra rồi triển khai. Nếu Pages chưa được bật, vào Settings → Pages → Source → GitHub Actions, rồi chạy lại workflow. Chỉ coi website đã hoạt động sau khi bước deploy thành công.

## Nguồn

- https://developer.bitcoin.org/devguide/transactions.html
- https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki
- https://github.com/bitcoin/bips/blob/master/bip-0341.mediawiki
- https://www.rfc-editor.org/rfc/rfc6979
- https://www.secg.org/sec2-v2.pdf
- https://bitcoin.org/bitcoin.pdf

## Ghi nhận

Ý tưởng, bài giảng và mẫu HTML đầu vào: Long Ngo. Phiên bản này thay bộ dựng phụ thuộc CDN bằng phép chiếu 3D tự chứa và bổ sung thí nghiệm, giải thích, đính chính khoa học. Giấy phép MIT xem LICENSE.
