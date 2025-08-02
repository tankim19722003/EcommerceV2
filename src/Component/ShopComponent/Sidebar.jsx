import React from "react";
import { NavLink } from "react-router-dom";
import { LogOut, Home, Package, ShoppingCart, BarChart2 } from "lucide-react";

export default function Sidebar() {
  const handleLogout = () => {
    // Add actual logout logic here
  };

  const menuItems = [
    {
      label: "Tổng quan",
      path: "/shop",
      exact: true,
      icon: <Home size={18} />,
    },
    {
      label: "Quản lý sản phẩm",
      path: "/shop/product-management",
      icon: <Package size={18} />,
    },
    {
      label: "Quản lý đơn hàng",
      path: "/shop/order",
      icon: <ShoppingCart size={18} />,
    },
    {
      label: "Quản lý doanh số",
      path: "/shop/sales",
      icon: <BarChart2 size={18} />,
    },
  ];

  return (
    <aside className="h-screen w-full bg-white text-gray-800 flex flex-col shadow-md border-r border-gray-200">
      {/* Header */}
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-3xl font-semibold text-teal-600">Shop Admin</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 px-6 py-5">
          {menuItems.map(({ label, path, exact, icon }) => (
            <li key={label}>
              <NavLink
                to={path}
                end={exact}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md text-base font-medium transition-colors duration-150 flex items-center gap-2 ${
                    isActive
                      ? "bg-teal-500 text-white shadow"
                      : "hover:bg-gray-100 hover:text-teal-600"
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-5 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-teal-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 transition-all duration-200 cursor-pointer"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
