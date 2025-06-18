const OverviewSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
        <p className="text-2xl text-teal-500">50</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
        <p className="text-2xl text-teal-500">50</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Recent Orders</h3>
        <p className="text-2xl text-teal-500">50</p>
      </div>
    </div>
  );
};

export default OverviewSection;