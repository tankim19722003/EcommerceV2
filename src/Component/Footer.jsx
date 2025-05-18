import visa from "../assets/visa.png";
import mastercard from "../assets/mastercard.webp";
import sacombank from "../assets/sacombank.png";
import qr from "../assets/qr.jpg";
import appstore from "../assets/appstore.webp";
import googleplay from "../assets/googleplay.jpg";
import appgallery from "../assets/appgallery.png";
export default function Footer() {
  return (
    <footer className="bg-gray-100 py-10">
      <div className="container mx-auto grid grid-cols-5 gap-8 px-6">
        <div>
          <h3 className="font-bold mb-4">DỊCH VỤ KHÁCH HÀNG</h3>
          <ul className="space-y-2 text-sm">
            <li>Trung Tâm Trợ Giúp Shopee</li>
            <li>Shopee Blog</li>
            <li>Shopee Mall</li>
            <li>Hướng Dẫn Mua Hàng/Đặt Hàng</li>
            <li>Hướng Dẫn Bán Hàng</li>
            <li>Ví ShopeePay</li>
            <li>Shopee Xu</li>
            <li>Đơn Hàng</li>
            <li>Trả Hàng/Hoàn Tiền</li>
            <li>Liên Hệ Shopee</li>
            <li>Chính Sách Bảo Hành</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">SHOPEE VIỆT NAM</h3>
          <ul className="space-y-2 text-sm">
            <li>Về Shopee</li>
            <li>Tuyển Dụng</li>
            <li>Điều Khoản Shopee</li>
            <li>Chính Sách Bảo Mật</li>
            <li>Shopee Mall</li>
            <li>Kênh Người Bán</li>
            <li>Flash Sale</li>
            <li>Tiếp Thị Liên Kết</li>
            <li>Liên Hệ Truyền Thông</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">THANH TOÁN</h3>
          <div className="grid grid-cols-3 gap-2">
            <img src={visa} alt="Visa" className="w-12 h-8" />
            <img src={mastercard} alt="MasterCard" className="w-12 h-8" />
            <img src={sacombank} alt="Sacombank" className="w-12 h-8" />
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-4">THEO DÕI SHOPEE</h3>
          <ul className="space-y-2 text-sm">
            <li>Facebook</li>
            <li>Instagram</li>
            <li>LinkedIn</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">TẢI ỨNG DỤNG SHOPEE</h3>
          <div className="flex space-x-4 flex-wrap gap-4">
              <img src={qr} alt="QR Code" className="w-16 h-16" />
              <img src={appstore} alt="App Store" className="w-16" />
              <img src={googleplay} alt="Google Play" className="w-16" />
              <img src={appgallery} alt="App Gallery" className="w-16" />
          </div>
        </div>
      </div>

      <div className="border-t mt-10 pt-4 text-center text-sm text-gray-500">
        © 2025 Ecommerce. Tất cả các quyền được bảo lưu.
      </div>
    </footer>
  );
}
