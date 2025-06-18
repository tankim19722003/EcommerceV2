import { ChevronLeft, ChevronRight } from "lucide-react";

const OrderManagement = ({ orders, orderPage, setOrderPage, itemsPerPage }) => {
  const handleUpdateOrderStatus = (id, status) => {
    alert(`Update order ${id} to ${status}`);
  };

  const orderTotalPage = Math.ceil(orders.length / itemsPerPage);
  const handleOrderPrevious = () => setOrderPage((prev) => Math.max(prev - 1, 0));
  const handleOrderNext = () => setOrderPage((prev) => Math.min(prev + 1, orderTotalPage - 1));

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Orders</h3>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders
              .slice(orderPage * itemsPerPage, (orderPage + 1) * itemsPerPage)
              .map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      value={order.status}
                      className="p-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex justify-center items-center mt-6 gap-3">
          <button
            onClick={handleOrderPrevious}
            disabled={orderPage === 0}
            className={`flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 ease-in-out ${
              orderPage === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 rounded-md">
            Page {orderPage + 1} of {orderTotalPage}
          </span>
          <button
            onClick={handleOrderNext}
            disabled={orderPage === orderTotalPage - 1}
            className={`flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 ease-in-out ${
              orderPage === orderTotalPage - 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;