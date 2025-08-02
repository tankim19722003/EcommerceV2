import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../config/interceptor-config";

function PaymentConfirmation() {
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const responseCode = queryParams.get("vnp_ResponseCode");

  const amount = queryParams.get("vnp_Amount");
  const txnRef = queryParams.get("vnp_TxnRef");
  const secureHash = queryParams.get("vnp_SecureHash");

  useEffect(() => {
    if (txnRef && secureHash) {
      setIsUpdatingOrder(true);

      // Convert all query parameters to object
      const paramsObject = Object.fromEntries(queryParams.entries());

      console.log(paramsObject)
      api
        .post(
          "http://localhost:8080/api/v1/order/update-order-payment-status",
          paramsObject
        )
        .then((response) => {
          setIsUpdatingOrder(false);
        })
        .catch((error) => {
          console.log(error);
          console.error(
            "Payment verification failed:",
            error.response?.data || error.message
          );
          setIsUpdatingOrder(false);
        });
    }
  }, [txnRef, secureHash]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-[16px]">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-xl w-full text-center">
        <h2
          className={`text-4xl font-bold mb-6 ${
            responseCode === "00" ? "text-green-600" : "text-red-600"
          }`}
        >
          Thanh toán {responseCode === "00" ? "thành công ✅" : "thất bại ❌"}
        </h2>
        <p className="text-xl text-gray-700 mb-4">
          Mã giao dịch: <span className="font-semibold text-2xl">{txnRef}</span>
        </p>
        <p className="text-xl text-gray-700">
          Số tiền:{" "}
          <span className="font-semibold text-2xl">
            {(amount / 100).toLocaleString("vi-VN")} VNĐ
          </span>
        </p>

        <a
          href="/"
          className={`mt-8 inline-block text-xl py-3 px-6 rounded transition-colors 
          ${
            isUpdatingOrder
              ? "bg-gray-400 text-white pointer-events-none cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Quay lại trang chủ
        </a>
      </div>
    </div>
  );
}

export default PaymentConfirmation;
