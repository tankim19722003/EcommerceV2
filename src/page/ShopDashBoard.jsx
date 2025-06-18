import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ShopDashBoard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [productPage, setProductPage] = useState(0);
  const [orderPage, setOrderPage] = useState(0);
  const itemsPerPage = 5;

  // Mock data (replace with API calls)
  const products = [
    { id: 1, name: "Bàn phím cơ Akko F75", price: 99.99, stock: 50 },
    { id: 2, name: "Son bóng dưỡng môi", price: 19.99, stock: 100 },
  ];
  const orders = [
    { id: 1, customer: "John Doe", total: 149.99, status: "Pending" },
    { id: 2, customer: "Jane Smith", total: 89.99, status: "Shipped" },
  ];
  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Cosmetics" },
  ];
  const salesData = { totalSales: 12345.67, recentOrders: 15 };

  // Navigation items
  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "products", label: "Product Management" },
    { id: "orders", label: "Order Management" },
    { id: "categories", label: "Category Management" },
    { id: "sales", label: "Sales Management" },
  ];

  // Product Management Functions
  const handleAddProduct = () => {
    alert("Add product functionality");
  };
  const handleEditProduct = (id) => {
    alert(`Edit product ${id}`);
  };
  const handleDeleteProduct = (id) => {
    alert(`Delete product ${id}`);
  };

  // Order Management Functions
  const handleUpdateOrderStatus = (id, status) => {
    alert(`Update order ${id} to ${status}`);
  };

  // Category Management Functions
  const handleAddCategory = () => {
    alert("Add category functionality");
  };
  const handleEditCategory = (id) => {
    alert(`Edit category ${id}`);
  };
  const handleDeleteCategory = (id) => {
    alert(`Delete category ${id}`);
  };

  // Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  // Pagination
  const productTotalPage = Math.ceil(products.length / itemsPerPage);
  const orderTotalPage = Math.ceil(orders.length / itemsPerPage);
  const handleProductPrevious = () => setProductPage((prev) => Math.max(prev - 1, 0));
  const handleProductNext = () => setProductPage((prev) => Math.min(prev + 1, productTotalPage - 1));
  const handleOrderPrevious = () => setOrderPage((prev) => Math.max(prev - 1, 0));
  const handleOrderNext = () => setOrderPage((prev) => Math.min(prev + 1, orderTotalPage - 1));

//   // Redirect if not admin
//   if (!user || user.role !== "admin") {
//     return null; // Handled by AdminRoute, but added for safety
//   }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-teal-400">Shop Dashboard</h2>
        <nav className="flex-grow">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left py-2 px-4 mb-2 rounded-lg transition-colors text-sm font-medium ${
                activeSection === item.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Shop Dashboard</h1>

        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
              <p className="text-2xl text-teal-500">${salesData.totalSales.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
              <p className="text-2xl text-teal-500">{products.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Recent Orders</h3>
              <p className="text-2xl text-teal-500">{salesData.recentOrders}</p>
            </div>
          </div>
        )}

        {/* Product Management */}
        {activeSection === "products" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Products</h3>
              <button
                onClick={handleAddProduct}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Add Product
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products
                    .slice(productPage * itemsPerPage, (productPage + 1) * itemsPerPage)
                    .map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${product.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEditProduct(product.id)}
                            className="text-blue-600 hover:text-blue-800 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="flex justify-center items-center mt-6 gap-3">
                <button
                  onClick={handleProductPrevious}
                  disabled={productPage === 0}
                  className={`flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 ease-in-out ${
                    productPage === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 rounded-md">
                  Page {productPage + 1} of {productTotalPage}
                </span>
                <button
                  onClick={handleProductNext}
                  disabled={productPage === productTotalPage - 1}
                  className={`flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 ease-in-out ${
                    productPage === productTotalPage - 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
                  aria-label="Next page"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Management */}
        {activeSection === "orders" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Orders</h3>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
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
              {/* Pagination */}
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
        )}

        {/* Category Management */}
        {activeSection === "categories" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Categories</h3>
              <button
                onClick={handleAddCategory}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Add Category
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md">
              <ul className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <li key={category.id} className="px-6 py-4 flex justify-between items-center">
                    <span className="text-sm text-gray-800">{category.name}</span>
                    <div>
                      <button
                        onClick={() => handleEditCategory(category.id)}
                        className="text-blue-600 hover:text-blue-800 mr-2 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Sales Management */}
        {activeSection === "sales" && (
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
        )}
      </main>
    </div>
  );
};

export default ShopDashBoard;