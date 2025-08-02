import { useEffect, useState } from "react";
import { api } from "../../config/interceptor-config";
import OrderDetailModal from "./OrderDetailModal";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = ["PENDING", "PACKAGING"];

  // Fetch orders by status using Axios
  const fetchOrders = async (status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `http://localhost:8080/api/v1/order/get_shop_order_by_status?status=${status}`,
        { headers: { "Content-Type": "application/json" } }
      );
      setOrders(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể tải danh sách đơn hàng"
      );
    } finally {
      setLoading(false);
    }
  };

  // Change order status using Axios
  const changeOrderStatus = async (orderId, newStatus) => {
    try {
      await api.post(
        `http://localhost:8080/api/v1/order/change_order_status?orderId=${orderId}&status=${newStatus}`,
        {},
        { headers: { "Content-Type": "application/json" } }
      );
      fetchOrders(selectedStatus);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể thay đổi trạng thái đơn hàng"
      );
    }
  };

  // Fetch orders when selected status changes
  useEffect(() => {
    fetchOrders(selectedStatus);
  }, [selectedStatus]);

  // Format address
  const formatAddress = (village) => {
    return `${village.specific_address}, ${village.village_name}, ${village.district_name}, ${village.province_name}`;
  };

  // Modal for order details
  // const OrderDetailModal = ({ order, onClose }) => {
  //   if (!order) return null;

  //   // Placeholder function for printing invoice
  //   const handlePrintInvoice = () => {
  //     console.log(`Printing invoice for order #${order.id}`);
  //     // Add your invoice printing logic here, e.g., generate PDF or open print dialog
  //     // Example: window.print() or use a library like jsPDF
  //   };

  //   return (
  //     <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
  //       <div className="bg-white rounded-xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
  //         <div className="flex justify-between items-center mb-6">
  //           <h2 className="text-2xl font-bold text-gray-800">
  //             Chi Tiết Đơn Hàng #{order.id}
  //           </h2>
  //           <button
  //             onClick={onClose}
  //             className="text-gray-500 hover:text-gray-700 transition duration-200 cursor-pointer"
  //           >
  //             <svg
  //               className="w-7 h-7"
  //               fill="none"
  //               stroke="currentColor"
  //               viewBox="0 0 24 24"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth="2"
  //                 d="M6 18L18 6M6 6l12 12"
  //               />
  //             </svg>
  //           </button>
  //         </div>
  //         <div className="space-y-6">
  //           <div className="bg-gray-50 p-4 rounded-lg">
  //             <h3 className="font-semibold text-lg text-gray-700 mb-2">
  //               Thông Tin Khách Hàng
  //             </h3>
  //             <div className="grid grid-cols-1 gap-2 text-gray-600">
  //               <p>
  //                 <span className="font-medium">Tên:</span>{" "}
  //                 {order.user_village_response.receiver_name}
  //               </p>
  //               <p>
  //                 <span className="font-medium">Số điện thoại:</span>{" "}
  //                 {order.user_village_response.phone_number}
  //               </p>
  //               <p>
  //                 <span className="font-medium">Địa chỉ:</span>{" "}
  //                 {formatAddress(order.user_village_response)}
  //               </p>
  //             </div>
  //           </div>
  //           <div className="bg-gray-50 p-4 rounded-lg">
  //             <h3 className="font-semibold text-lg text-gray-700 mb-2">
  //               Thông Tin Vận Chuyển
  //             </h3>
  //             <div className="grid grid-cols-1 gap-2 text-gray-600">
  //               <p>
  //                 <span className="font-medium">Loại:</span>{" "}
  //                 {order.shipping_type_response.name}
  //               </p>
  //               <p>
  //                 <span className="font-medium">Phí vận chuyển:</span>{" "}
  //                 {order.shipping_type_response.price.toLocaleString("vi-VN")} ₫
  //               </p>
  //               <p>
  //                 <span className="font-medium">Mô tả:</span>{" "}
  //                 {order.shipping_type_response.description}
  //               </p>
  //             </div>
  //           </div>
  //           <div className="bg-gray-50 p-4 rounded-lg">
  //             <h3 className="font-semibold text-lg text-gray-700 mb-2">
  //               Sản Phẩm Đặt Hàng
  //             </h3>
  //             <div className="overflow-x-auto">
  //               <table className="w-full">
  //                 <thead>
  //                   <tr className="bg-gray-100 text-gray-600">
  //                     <th className="p-3 text-left text-sm font-semibold">
  //                       Sản phẩm
  //                     </th>
  //                     <th className="p-3 text-left text-sm font-semibold">
  //                       Số lượng
  //                     </th>
  //                     <th className="p-3 text-left text-sm font-semibold">
  //                       Giá
  //                     </th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {order.order_detail_responses.map((item, index) => (
  //                     <tr
  //                       key={item.id}
  //                       className={`${
  //                         index % 2 === 0 ? "bg-white" : "bg-gray-50"
  //                       } hover:bg-gray-100 transition duration-150`}
  //                     >
  //                       <td className="p-3 text-gray-600">
  //                         {item.product_name}
  //                       </td>
  //                       <td className="p-3 text-gray-600">{item.quantity}</td>
  //                       <td className="p-3 text-gray-600">
  //                         {item.price.toLocaleString("vi-VN")} ₫
  //                       </td>
  //                     </tr>
  //                   ))}
  //                 </tbody>
  //               </table>
  //             </div>
  //           </div>
  //           <div className="bg-gray-50 p-4 rounded-lg">
  //             <h3 className="font-semibold text-lg text-gray-700 mb-2">
  //               Ghi Chú
  //             </h3>
  //             <p className="text-gray-600">
  //               {order.note || "Không có ghi chú"}
  //             </p>
  //           </div>
  //           <div className="bg-gray-50 p-4 rounded-lg">
  //             <h3 className="font-semibold text-lg text-gray-700">
  //               Tổng cộng: {order.total_money.toLocaleString("vi-VN")} ₫
  //             </h3>
  //           </div>
  //         </div>
  //         <div className="mt-6 flex justify-end space-x-4">
  //           {order.order_status === "PACKAGING" && (
  //             <button
  //               onClick={handlePrintInvoice}
  //               className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition duration-200 font-medium"
  //             >
  //               In hóa đơn
  //             </button>
  //           )}
  //           <button
  //             onClick={onClose}
  //             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
  //           >
  //             Đóng
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản Lý Đơn Hàng</h1>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-600">
            Lọc theo trạng thái:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "PENDING" ? "Chờ xử lý" : "Đang chuẩn bị"}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-center text-sm font-semibold text-gray-600">
                Mã đơn hàng
              </th>
              <th className="p-4 text-center text-sm font-semibold text-gray-600">
                Khách hàng
              </th>
              <th className="p-4 text-center text-sm font-semibold text-gray-600">
                Địa chỉ
              </th>
              <th className="p-4 text-center text-sm font-semibold text-gray-600">
                Tổng cộng
              </th>
              <th className="p-4 text-center text-sm font-semibold text-gray-600">
                Vận chuyển
              </th>
              <th className="p-4 text-center text-sm font-semibold text-gray-600">
                Hành động
              </th>
            </tr>
          </thead>
          {/* Loading State */}
          {loading && (
            <tr>
              <td colSpan="100%" className="py-10 text-center">
                <div className="inline-flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-gray-600">
                    Đang tải đơn hàng...
                  </span>
                </div>
              </td>
            </tr>
          )}

          {!loading && (
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 my-2">
                  <td className="p-4 text-gray-700 text-center">{order.id}</td>
                  <td className="p-4 text-gray-700">
                    {order.user_village_response.receiver_name}
                  </td>
                  <td className="p-4 text-gray-700">
                    {formatAddress(order.user_village_response)}
                  </td>
                  <td className="p-4 text-gray-700">
                    {order.total_money.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="p-4 text-gray-700">
                    {order.shipping_type_response.name}
                  </td>
                  <td className="p-4 flex space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-200 font-semibold text-sm cursor-pointer"
                    >
                      Xem chi tiết
                    </button>
                    {order.order_status === "PENDING" && (
                      <button
                        onClick={() => changeOrderStatus(order.id, "PACKAGING")}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-200 font-semibold text-sm cursor-pointer"
                      >
                        Đánh dấu đang chuẩn bị
                      </button>
                    )}
                    {order.order_status === "PACKAGING" && (
                      <button
                        onClick={() =>
                          changeOrderStatus(order.id, "HANDED_OVER_TO_CARRIER")
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200 font-semibold text-sm cursor-pointer"
                      >
                        Chuyển cho đơn vị vận chuyển
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {/* Orders Table */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Không tìm thấy đơn hàng cho trạng thái{" "}
            {selectedStatus === "PENDING" ? "Chờ xử lý" : "Đang chuẩn bị"}.
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderManagement;
