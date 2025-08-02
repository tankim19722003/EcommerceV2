import React, { useState, useEffect } from "react";
import Footer from "../Component/Share/Footer";
import { useLocation } from "react-router-dom";
import { api } from "../config/interceptor-config";
import ShippingTypeModal from "../Component/Modal/ShippingTypeModal";
import Modal from "../Component/Modal/Modal";
import VoucherModal from "../Component/Modal/VoucherModal";
import Swal from "sweetalert2";

const PaymentPage = () => {
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
  const selectedIds = location.state?.selectedIds || [22]; // For testing

  console.log(cartItems);
  /* ----- State for address and modals ----- */
  const [addresses, setAddresses] = useState([]);
  const [selectedAddrIdx, setSelectedAddrIdx] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChoosingAddress, setIsChoosingAddress] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("COD");
  const [isChoosingShipping, setIsChoosingShipping] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [isChoosingVoucher, setIsChoosingVoucher] = useState(false);
  const [selectedVoucherIdx, setSelectedVoucherIdx] = useState(-1);
  const [baseTotal, setBaseTotal] = useState(0);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const [selectedShippingType, setSelectedShippingType] = useState(() => {
    return getFirstProductShippingType();
  });

  function getFirstProductShippingType() {
    return (
      cartItems
        .flatMap((shop) => shop.cart_item_response)
        .find((item) => selectedIds.includes(item.cart_item_id))
        .productShippingTypes || []
    );
  }
  console.log("Selected Shipping Type:", selectedShippingType);

  /* ----- Fetch addresses on mount ----- */
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          "http://localhost:8080/api/v1/user_village/get_all_address"
        );
        if (res.status !== 200) throw new Error("Không lấy được địa chỉ!");
        const arr = res.data.addressResponses ?? [];
        if (arr.length === 0) throw new Error("Chưa có địa chỉ nào!");

        setAddresses(arr);
        setSelectedAddrIdx(0);
        const a = arr[0];
        setDeliveryInfo({
          name: a.receiver_name,
          phone: a.phone_number,
          address: `${a.specific_address}, ${a.village_name}, ${a.district_name}, ${a.province_name}`,
          note: "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  /* ----- Fetch vouchers on mount ----- */
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await api.get(
          "http://localhost:8080/api/v1/voucher/get_all"
        );
        if (res.status !== 200) throw new Error("Không lấy được voucher!");
        setVouchers(res.data || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchVouchers();
  }, []);

  /* ----- Calculate cart by shop ----- */
  const productsByShop = cartItems.reduce((acc, shop) => {
    const shopName = shop.shop_info_response.shop_name;
    const shopId =
      shop.shop_info_response.shop_id || shop.shop_info_response.id;

    const filtered = shop.cart_item_response
      .filter((i) => selectedIds.includes(i.cart_item_id))
      .map((i) => ({
        cart_item_id: i.cart_item_id, // Include cart_item_id
        id: i.product_id,
        name: i.product_name,
        shop: shopName,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity,
        image:
          i.product_category_image?.avatar_url ||
          "https://via.placeholder.com/50",
        product_category_id: i.product_category_id,
        product_sub_category_id: i.subcategory_id || null,
      }));
    if (filtered.length) {
      acc[shopName] = {
        products: filtered,
        shopId,
        product_shipping_type_id: selectedShippingType.id,
      };
    }
    return acc;
  }, {});

  useEffect(() => {
    const total = Object.values(productsByShop).reduce(
      (sum, s) =>
        sum +
        (s.products ? s.products.reduce((ss, i) => ss + i.subtotal, 0) : 0) +
        (selectedShippingType?.price || 0),
      0
    );
    setBaseTotal(total);
  }, [productsByShop, selectedShippingType]);

  function onSelectVoucher(idx) {
    setSelectedVoucherIdx(idx);
    const voucher = vouchers[idx];
    if (!voucher) {
      setBaseTotal(
        Object.values(productsByShop).reduce(
          (sum, s) =>
            sum +
            (s.products
              ? s.products.reduce((ss, i) => ss + i.subtotal, 0)
              : 0) +
            (selectedShippingType?.price || 0),
          0
        )
      );
      return;
    }

    const now = new Date();
    const start = new Date(voucher.start_date);
    const end = new Date(voucher.end_date);
    const isValid = now >= start && now <= end;

    if (!isValid || baseTotal < voucher.minimum_order_value) {
      setBaseTotal(
        Object.values(productsByShop).reduce(
          (sum, s) =>
            sum +
            (s.products
              ? s.products.reduce((ss, i) => ss + i.subtotal, 0)
              : 0) +
            (selectedShippingType?.price || 0),
          0
        )
      );
      return;
    }

    const discount = (voucher.discount_percent / 100) * baseTotal;
    setBaseTotal(Math.max(baseTotal - discount, 0));
  }

  const isVoucherValid = (voucher) => {
    const now = new Date();
    const start = new Date(voucher.start_date);
    const end = new Date(voucher.end_date);
    return now >= start && now <= end;
  };

  const selectedVoucher =
    selectedVoucherIdx >= 0 ? vouchers[selectedVoucherIdx] : null;

  const discountAmount =
    selectedVoucher &&
    isVoucherValid(selectedVoucher) &&
    baseTotal >= selectedVoucher.minimum_order_value
      ? (selectedVoucher.discount_percent / 100) * baseTotal
      : 0;

  const createOrder = async () => {
    // Test vnpay

    let txnRef = "";
    let paymentUrl = "";
    if (selectedPaymentMethod === "VNPay") {
      paymentUrl = await getPaymentUrl();
      const url = new URL(paymentUrl);
      txnRef = url.searchParams.get("vnp_TxnRef");
    }

    setOrderLoading(true);
    setOrderError(null);

    try {
      await api.post(
        "http://localhost:8080/api/v1/order",
        getOrderBody(txnRef)
      );

      Swal.fire({
        icon: "success",
        title: "Đặt hàng thành công!",
        showConfirmButton: false,
        timer: 2000,
      });
      if (paymentUrl !== "") window.location.href = paymentUrl;
    } catch (error) {
      const backendMessage =
        error.response.data.error || "Đã xảy ra lỗi từ server";
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: backendMessage,
      });
    } finally {
      setOrderLoading(false);
    }
  };

  const getPaymentUrl = async () => {
    try {
      const response = await api.post(
        "http://localhost:8080/api/v1/order/create_payment_url",
        {
          amount: baseTotal - discountAmount,
          language: "vn",
        }
      );

      return response.data.data; // Assuming the URL is in data field
    } catch (error) {
      console.error("Error creating payment URL:", error);
    }
  };

  const getOrderBody = (txnRef) => {
    const userAddressId = addresses[selectedAddrIdx]?.address_id;
    if (!userAddressId) throw new Error("Không tìm thấy địa chỉ giao hàng");

    for (const [shopName, shopData] of Object.entries(productsByShop)) {
      if (!shopData?.products || !shopData?.shopId) {
        console.warn(`Invalid shop data for ${shopName}`);
        continue;
      }
      const { products, shopId } = shopData;

      const orderBody = {
        shop_id: shopId,
        user_address_id: userAddressId,
        txn_ref: txnRef,
        product_shipping_type_id: selectedShippingType?.id || 1,
        quantity: products.reduce((sum, p) => sum + p.quantity, 0),
        voucherId: selectedVoucher?.id || null,
        note: deliveryInfo.note || "Hàng dễ vỡ xin nhẹ tay",
        order_detail_dtos: products.map((p) => ({
          cart_item_id: p.cart_item_id,
          product_id: p.id,
          quantity: p.quantity,
          product_category_id: p.product_category_id,
          product_sub_category_id: p.product_sub_category_id,
        })),
      };

      return orderBody;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-4 flex justify-between items-center shadow-xl mb-6">
        <div className="flex space-x-4 sm:space-x-6 text-sm sm:text-base">
          <span className="cursor-pointer hover:underline">Trang chủ</span>
          <span className="cursor-pointer hover:underline">Kết nối</span>
          <span className="cursor-pointer hover:underline">Hỗ trợ</span>
        </div>
        <span className="font-semibold text-sm sm:text-base text-yellow-200">
          ngctkim
        </span>
      </header>

      <div className="border border-gray-200 p-4 sm:p-6 flex-grow rounded bg-white max-w-6xl mx-auto min-w-[1200px]">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold text-red-600">
            Địa Chỉ Nhận Hàng
          </h2>
          {loading ? (
            <p>Đang tải...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <p>
                  {deliveryInfo.name} ({deliveryInfo.phone})
                </p>
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => setIsChoosingAddress(true)}
                >
                  Thay Đổi
                </span>
              </div>
              <p>{deliveryInfo.address}</p>
              <div className="mt-2">
                <input
                  type="text"
                  value={deliveryInfo.note}
                  onChange={(e) =>
                    setDeliveryInfo({ ...deliveryInfo, note: e.target.value })
                  }
                  placeholder="Lưu ý cho Người bán..."
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>
          {Object.keys(productsByShop).length === 0 ? (
            <p>Chưa có sản phẩm</p>
          ) : (
            Object.entries(productsByShop).map(([shopName, { products }]) => (
              <div key={shopName} className="mb-6">
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  {shopName}
                </h3>
                {products && Array.isArray(products) ? (
                  products.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center py-2 border-b border-gray-200"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.shop}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">₫{p.price.toLocaleString()}</p>
                        <p className="text-sm">x {p.quantity}</p>
                        <p className="text-sm font-semibold">
                          ₫{p.subtotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-red-500">
                    Lỗi: Không có sản phẩm cho shop này
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span>Phí vận chuyển</span>
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => setIsChoosingShipping(true)}
            >
              Thay Đổi
            </span>
          </div>
          {Object.entries(productsByShop).length > 0 ? (
            Object.entries(productsByShop).map(([shopName]) => (
              <div key={shopName} className="flex justify-between py-2">
                <span>
                  ({shopName}){" "}
                  {selectedShippingType?.shippingType?.name || "Tiêu chuẩn"}
                </span>
                <span>
                  ₫{(selectedShippingType?.price || 0).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p>Không có phí vận chuyển</p>
          )}
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span>Tổng trước giảm giá</span>
            <span>₫{baseTotal.toLocaleString()}</span>
          </div>
          {selectedVoucher && (
            <>
              {baseTotal < selectedVoucher.minimum_order_value ? (
                <div className="flex justify-between py-2 text-red-600">
                  <span>
                    Voucher không áp dụng (Đơn tối thiểu: ₫
                    {selectedVoucher.minimum_order_value.toLocaleString()})
                  </span>
                  <span>₫0</span>
                </div>
              ) : !isVoucherValid(selectedVoucher) ? (
                <div className="flex justify-between py-2 text-red-600">
                  <span>
                    Voucher đã hết hạn (HSD:{" "}
                    {new Date(selectedVoucher.end_date).toLocaleDateString()})
                  </span>
                  <span>₫0</span>
                </div>
              ) : selectedVoucher.discount_percent === 0 ? (
                <div className="flex justify-between py-2 text-red-600">
                  <span>Voucher không có giá trị giảm giá</span>
                  <span>₫0</span>
                </div>
              ) : (
                <div className="flex justify-between py-2 text-green-600">
                  <span>
                    Giảm giá (
                    {selectedVoucher.description || selectedVoucher.code})
                  </span>
                  <span>-₫{discountAmount.toLocaleString()}</span>
                </div>
              )}
            </>
          )}
          <div className="flex justify-between py-2 font-semibold">
            <span>Tổng thanh toán</span>
            <span className="text-red-600">
              ₫{(baseTotal - discountAmount).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-orange-500">Shop Mind Voucher</span>
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => setIsChoosingVoucher(true)}
            >
              Chọn Voucher
            </span>
          </div>
          {vouchers.length === 0 && (
            <p className="text-gray-500">Không có voucher nào khả dụng.</p>
          )}
          {selectedVoucher && (
            <p className="text-sm text-gray-600">
              Đã chọn: {selectedVoucher.description || selectedVoucher.code} (
              {selectedVoucher.discount_percent}% giảm, tối thiểu ₫
              {selectedVoucher.minimum_order_value.toLocaleString()}, HSD:{" "}
              {new Date(selectedVoucher.end_date).toLocaleDateString()})
            </p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>
          <div className="space-y-3">
            {["COD", "VNPay"].map((method) => (
              <label
                key={method}
                className="flex items-center p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  className="mr-3"
                  checked={selectedPaymentMethod === method}
                  onChange={() => setSelectedPaymentMethod(method)}
                />
                <span className="text-sm">{method}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            className={`w-full py-3 rounded-lg font-semibold ${
              orderLoading || Object.keys(productsByShop).length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
            onClick={createOrder}
            disabled={orderLoading || Object.keys(productsByShop).length === 0}
          >
            {orderLoading ? "Đang xử lý..." : "Đặt hàng"}
          </button>
          {orderError && <p className="text-red-500 mt-2">{orderError}</p>}
          <p className="text-xs text-gray-500 mt-2">
            Bằng việc *Đặt hàng*, bạn đồng ý với Điều khoản Shopee
          </p>
        </div>
      </div>

      <Modal
        isOpen={isChoosingAddress}
        onClose={() => setIsChoosingAddress(false)}
      >
        <h2 className="text-lg font-semibold text-red-600 mb-4">
          Chọn địa chỉ giao hàng
        </h2>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {addresses.map((a, idx) => (
            <label
              key={idx}
              className={`flex items-start p-3 border rounded cursor-pointer ${
                idx === selectedAddrIdx ? "border-blue-500" : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="address"
                className="mt-1 mr-3"
                checked={idx === selectedAddrIdx}
                onChange={() => setSelectedAddrIdx(idx)}
              />
              <div>
                <p className="font-medium">
                  {a.receiver_name} ({a.phone_number})
                </p>
                <p className="text-sm text-gray-600">
                  {a.specific_address}, {a.village_name}, {a.district_name},{" "}
                  {a.province_name}
                </p>
              </div>
            </label>
          ))}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
            onClick={() => setIsChoosingAddress(false)}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
            onClick={() => {
              const a = addresses[selectedAddrIdx];
              setDeliveryInfo({
                name: a.receiver_name,
                phone: a.phone_number,
                address: `${a.specific_address}, ${a.village_name}, ${a.district_name}, ${a.province_name}`,
                note: "",
              });
              setIsChoosingAddress(false);
            }}
          >
            Chọn
          </button>
        </div>
      </Modal>

      <ShippingTypeModal
        isOpen={isChoosingShipping}
        onClose={() => setIsChoosingShipping(false)}
        shippingTypes={getFirstProductShippingType()}
        onSelectShipping={(newShippingType) => {
          setSelectedShippingType(newShippingType);
        }}
      />

      <VoucherModal
        isOpen={isChoosingVoucher}
        onClose={() => setIsChoosingVoucher(false)}
        vouchers={vouchers}
        onSelectVoucher={(idx) => onSelectVoucher(idx)}
        total={baseTotal}
      />

      <Footer />
    </div>
  );
};

export default PaymentPage;
