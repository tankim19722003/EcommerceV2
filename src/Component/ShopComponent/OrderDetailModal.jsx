const OrderDetailModal = ({ order, onClose }) => {
  // Function to format address
  const formatAddress = (village) => {
    return `${village.specific_address}, ${village.village_name}, ${village.district_name}, ${village.province_name}`;
  };

  // Calculate total money before discount
  const totalMoneyBeforeDiscount = order.order_detail_responses.reduce(
    (sum, item) => sum + item.quantity * item.price,
    order.shipping_type_response.price
  );

  // Get discount percentage
  const discountPercent = order.voucher_response?.discount_percent || 0;

  // Calculate total money after discount
  const totalMoneyAfterDiscount = order.total_money;

  // Function to print modal content
  const handlePrintInvoice = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa Đơn #${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .order-details { max-width: 800px; margin: auto; }
            .section { margin-bottom: 20px; }
            .section h3 { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .section p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-size: 16px; font-weight: bold; }
            .no-print { display: none; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="order-details">
            <h2>Chi Tiết Đơn Hàng #${order.id}</h2>
            <div class="section">
              <h3>Thông Tin Khách Hàng</h3>
              <p><strong>Tên:</strong> ${
                order.user_village_response.receiver_name
              }</p>
              <p><strong>Số điện thoại:</strong> ${
                order.user_village_response.phone_number
              }</p>
              <p><strong>Địa chỉ:</strong> ${formatAddress(
                order.user_village_response
              )}</p>
            </div>
            <div class="section">
              <h3>Thông Tin Vận Chuyển</h3>
              <p><strong>Loại:</strong> ${order.shipping_type_response.name}</p>
              <p><strong>Phí vận chuyển:</strong> ${order.shipping_type_response.price.toLocaleString(
                "vi-VN"
              )} ₫</p>
              <p><strong>Mô tả:</strong> ${
                order.shipping_type_response.description
              }</p>
            </div>
            <div class="section">
              <h3>Sản Phẩm Đặt Hàng</h3>
              <table>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.order_detail_responses
                    .map(
                      (item) => `
                        <tr>
                          <td>${item.product_name}</td>
                          <td>${item.quantity}</td>
                          <td>${item.price.toLocaleString("vi-VN")} ₫</td>
                          <td>${(item.quantity * item.price).toLocaleString(
                            "vi-VN"
                          )} ₫</td>
                        </tr>
                      `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            <div class="section">
              <h3>Ghi Chú</h3>
              <p>${order.note || "Không có ghi chú"}</p>
            </div>
            <div class="section">
              <h3>Thanh Toán</h3>
              <p><strong>Tổng tiền trước giảm giá:</strong> ${totalMoneyBeforeDiscount.toLocaleString(
                "vi-VN"
              )} ₫</p>
              <p><strong>Giảm giá:</strong> ${discountPercent}%</p>
              <p class="total"><strong>Tổng cộng sau giảm giá:</strong> ${totalMoneyAfterDiscount.toLocaleString(
                "vi-VN"
              )} ₫</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6 no-print">
          <h2 className="text-2xl font-bold text-gray-800">
            Chi Tiết Đơn Hàng #{order.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition duration-200 cursor-pointer no-print"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-700 mb-2">
              Thông Tin Khách Hàng
            </h3>
            <div className="grid grid-cols-1 gap-2 text-gray-600">
              <p>
                <span className="font-medium">Tên:</span>{" "}
                {order.user_village_response.receiver_name}
              </p>
              <p>
                <span className="font-medium">Số điện thoại:</span>{" "}
                {order.user_village_response.phone_number}
              </p>
              <p>
                <span className="font-medium">Địa chỉ:</span>{" "}
                {formatAddress(order.user_village_response)}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-700 mb-2">
              Thông Tin Vận Chuyển
            </h3>
            <div className="grid grid-cols-1 gap-2 text-gray-600">
              <p>
                <span className="font-medium">Loại:</span>{" "}
                {order.shipping_type_response.name}
              </p>
              <p>
                <span className="font-medium">Phí vận chuyển:</span>{" "}
                {order.shipping_type_response.price.toLocaleString("vi-VN")} ₫
              </p>
              <p>
                <span className="font-medium">Mô tả:</span>{" "}
                {order.shipping_type_response.description}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-700 mb-2">
              Sản Phẩm Đặt Hàng
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-gray-600">
                    <th className="p-3 text-left text-sm font-semibold">
                      Sản phẩm
                    </th>
                    <th className="p-3 text-left text-sm font-semibold">
                      Số lượng
                    </th>
                    <th className="p-3 text-left text-sm font-semibold">Giá</th>
                    <th className="p-3 text-left text-sm font-semibold">
                      Tổng
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_detail_responses.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 transition duration-150`}
                    >
                      <td className="p-3 text-gray-600">{item.product_name}</td>
                      <td className="p-3 text-gray-600">{item.quantity}</td>
                      <td className="p-3 text-gray-600">
                        {item.price.toLocaleString("vi-VN")} ₫
                      </td>
                      <td className="p-3 text-gray-600">
                        {(item.quantity * item.price).toLocaleString("vi-VN")} ₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-700 mb-2">
              Ghi Chú
            </h3>
            <p className="text-gray-600">{order.note || "Không có ghi chú"}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-700 mb-2">
              Thanh Toán
            </h3>
            <div className="grid grid-cols-1 gap-2 text-gray-600">
              <p>
                <span className="font-medium">Tổng tiền trước giảm giá:</span>{" "}
                {totalMoneyBeforeDiscount.toLocaleString("vi-VN")} ₫
              </p>
              <p>
                <span className="font-medium">Giảm giá:</span> {discountPercent}
                %
              </p>
              <p className="font-bold">
                <span className="font-medium">Tổng cộng sau giảm giá:</span>{" "}
                {totalMoneyAfterDiscount.toLocaleString("vi-VN")} ₫
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4 no-print">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2.5 rounded-full shadow-md hover:bg-gray-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200 font-semibold text-sm no-print cursor-pointer"
          >
            Đóng
          </button>
          {order.order_status === "PACKAGING" && (
            <button
              onClick={handlePrintInvoice}
              className="bg-teal-500 text-white px-6 py-2.5 rounded-full shadow-md hover:bg-teal-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 transition-all duration-200 font-semibold text-sm no-print cursor-pointer"
            >
              In hóa đơn
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
