export function isValidEmail(email) {
  if (!email) return false;
  // Regex này kiểm tra cấu trúc cơ bản của một email.
  // Nó không phải là hoàn hảo nhưng đủ dùng cho hầu hết các trường hợp.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Kiểm tra định dạng số điện thoại Việt Nam.
 * Hỗ trợ các đầu số phổ biến của Viettel, MobiFone, VinaPhone, Vietnamobile, Gmobile.
 * Bao gồm cả định dạng có +84 hoặc 0 ở đầu.
 * @param {string} phoneNumber - Số điện thoại cần kiểm tra.
 * @returns {boolean} - True nếu số điện thoại hợp lệ, false nếu không.
 */
export function isValidVietnamesePhoneNumber(phoneNumber) {
  if (!phoneNumber) return false;
  // Loại bỏ khoảng trắng và dấu ngoặc đơn (nếu có) để chuẩn hóa
  const cleanedPhoneNumber = phoneNumber.replace(/[\s()-]/g, "");

  // Regex cho số điện thoại Việt Nam
  // Bắt đầu bằng +84 hoặc 0
  // Tiếp theo là các đầu số di động phổ biến (ví dụ: 3, 5, 7, 8, 9 cho các mạng sau khi chuyển đổi 11 số)
  // Hoặc các đầu số cố định (ít phổ biến hơn cho validation phía client nhưng vẫn có thể thêm vào nếu cần)
  // Tổng cộng 9 hoặc 10 chữ số sau mã quốc gia/số 0 đầu tiên.
  const phoneRegex = /^(?:\+84|0)(?:[35789]\d{8}|2\d{9})$/;
  // Giải thích regex:
  // ^                   : Bắt đầu chuỗi
  // (?:\+84|0)        : Bắt đầu bằng "+84" hoặc "0" (nhóm không bắt giữ)
  // (?:               : Bắt đầu nhóm không bắt giữ cho các loại đầu số
  //   [35789]\d{8}    : Các đầu số di động mới (03x, 05x, 07x, 08x, 09x) theo sau bởi 8 chữ số
  //   |               : Hoặc
  //   2\d{9}          : Các đầu số cố định (ví dụ 024, 028) theo sau bởi 9 chữ số (tổng 10 số sau số 0)
  // )                   : Kết thúc nhóm không bắt giữ
  // $                   : Kết thúc chuỗi
  return phoneRegex.test(cleanedPhoneNumber);
}
