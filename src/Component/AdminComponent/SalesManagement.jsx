const SalesManagement = ({ salesData }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Sales Overview</h3>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-sm text-gray-600">
          Total Sales: <span className="font-bold text-teal-500">${salesData.totalSales.toFixed(2)}</span>
        </p>
        <p className="text-sm text-gray-600">
          Recent Orders: <span className="font-bold text-teal-500">{salesData.recentOrders}</span>
        </p>
        <p className="text-sm text-gray-500 mt-4">More detailed sales analytics coming soon...</p>
      </div>
    </div>
  );
};

export default SalesManagement;