import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { api } from "../../config/interceptor-config";

const OrderList = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderDetailId, setSelectedOrderDetailId] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const statusMap = {
    "Tất cả": "ALL",
    "Đang chờ xác nhận": "PENDING",
    "Vận chuyển": "HANDED_OVER_TO_CARRIER",
    "Chờ giao hàng": "SHIPPING",
    "Hoàn thành": "COMPLETED",
    "Đã hủy": "CANCEL",
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const status = statusMap[activeTab];
        let url = `http://localhost:8080/api/v1/order/get_order_by_status?`;
        url += `status=${status}`;

        const response = await api.get(url);
        setOrders(response.data);
        console.log(response.data)
      } catch (err) {
        setError(err.response?.data || "Failed to fetch orders");
        console.error("API Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab]);

  const handleRatingSubmit = async () => {
    console.log("Selected id:")
    console.log(selectedOrderDetailId);
    try {
      await api.post("http://localhost:8080/api/v1/feedback/create_feedback", {
        order_detail_id: selectedOrderDetailId,
        content: feedback,
        rating: rating,
      });
      setShowModal(false);
      setRating(0);
      setFeedback("");
      setSelectedOrderId(null);
      setSelectedOrderDetailId(null);
      // Optionally show success message or refresh orders
      alert("Đánh giá đã được gửi thành công!");
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      alert("Gửi đánh giá thất bại. Vui lòng thử lại!");
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-600 bg-gray-50 min-h-screen">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 sm:space-x-6 border-b border-gray-200 mb-6">
        {Object.keys(statusMap).map((tab) => (
          <button
            key={tab}
            className={`pb-3 px-4 text-sm font-semibold capitalize ${
              activeTab === tab
                ? "border-b-2 border-cyan-500 text-cyan-600"
                : "text-gray-600 hover:text-gray-800"
            } transition-colors duration-200`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            className="w-full p-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 shadow-sm transition duration-200 ease-in-out text-base"
            placeholder="Bạn có thể tìm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
            aria-label="Tìm kiếm đơn hàng"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <ClipLoader color="#36d7b7" size={60} />
        </div>
      ) : (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md">
              Hiện chưa có đơn hàng nào.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex flex-row items-center justify-between mb-4">
                  <div className="flex flex-row items-center space-x-4">
                    <Link
                      to={`/shop/${order.shop_name}`}
                      className="text-cyan-600 font-medium hover:text-cyan-700 hover:underline transition-colors text-sm sm:text-base"
                    >
                      {order.shop_name}
                    </Link>
                    <button className="hidden sm:block text-gray-500 hover:text-gray-700 transition-colors text-xs sm:text-sm">
                      Xem Shop
                    </button>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {activeTab || "Hoàn thành"}
                  </span>
                </div>

                {order.order_detail_responses.map((orderDetail, index) => (
                  <div
                    key={`${order.order_id}-${index}`}
                    className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-t border-gray-200 first:border-t-0"
                  >
                    {/* Image and Product Name */}
                    <div className="flex items-center space-x-2">
                      <img
                        src={
                          orderDetail.product_category_image_url ||
                          "https://via.placeholder.com/100"
                        }
                        alt={orderDetail.product_name}
                        className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-lg border border-gray-200 mr-5"
                      />
                      <div>
                        <p className="text-sm sm:text-base text-gray-800 font-medium line-clamp-2">
                          {orderDetail.product_name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          Số lượng: {orderDetail.quantity || "1"}
                        </p>
                      </div>
                    </div>

                    {/* Price Details (empty to maintain grid structure) */}
                    <div></div>

                    {/* Price Details */}
                    <div className="text-right">
                      {orderDetail.discount_percent !== 0 && (
                        <p className="text-xs sm:text-sm text-gray-500 line-through">
                          đ
                          {(
                            orderDetail.price * orderDetail.quantity
                          ).toLocaleString()}
                        </p>
                      )}
                      <p className="text-sm sm:text-base text-red-600 font-semibold mt-1">
                        {!order.payment_status &&
                          "đ" +
                            (
                              orderDetail.price * orderDetail.quantity
                            ).toLocaleString("vi-VN")}

                        {order.payment_status && (
                          <p className="text-sm">Đã thanh toán</p>
                        )}
                      </p>
                    </div>

                    <div className="col-span-3 grid grid-cols-3">
                      <p className="col-span-2 text-xs sm:text-sm text-gray-500">
                        Đặt hàng ngày{" "}
                        {new Date(order.created_at).toLocaleDateString(
                          "vi-VN",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                      </p>

                      {activeTab === "Hoàn thành" && !orderDetail.has_commented && (
                        <div className="col-span-1 flex justify-end">
                          <button
                            className="px-3 sm:px-4 py-1 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-xs sm:text-sm font-medium"
                            onClick={() => {
                              setSelectedOrderDetailId(
                                orderDetail.id
                              );
                              setShowModal(true);
                            }}
                          >
                            Đánh giá
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}

      {/* Rating Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="border border-gray-300 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Đánh giá đơn hàng</h2>

            {/* Star Rating */}
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`text-2xl mx-1 ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Feedback Textarea */}
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              rows="4"
              placeholder="Nhập nhận xét của bạn..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                onClick={() => {
                  setShowModal(false);
                  setRating(0);
                  setFeedback("");
                  setSelectedOrderId(null);
                  setSelectedOrderDetailId(null);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={handleRatingSubmit}
                // disabled={rating === 0 || !selectedOrderDetailId}
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
