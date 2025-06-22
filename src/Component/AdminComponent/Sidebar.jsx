import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  ShoppingCart,
  Layers,
  BarChart2,
  LogOut,
  Store,
} from "lucide-react";

const navItems = [
  { id: "admin", label: "Tổng quan", icon: <Home size={18} /> },
  { id: "products", label: "Quản lý sản phẩm", icon: <Package size={18} /> },
  { id: "orders", label: "Quản lý đơn hàng", icon: <ShoppingCart size={18} /> },
  {
    id: "categories",
    label: "Quản lý danh mục",
    icon: <Layers size={18} />,
  },
  { id: "sales", label: "Quản lý doanh thu", icon: <BarChart2 size={18} /> },
];

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`w-64 bg-white h-screen text-gray-900 p-6 flex flex-col fixed md:static transition-all duration-300 z-400 border-r border-gray-200 ${
        isSidebarOpen ? "left-0" : "-left-64"
      }`}
    >
      <div className="flex items-center gap-3 mb-8">
        <Store size={28} className="text-teal-600" />
        <h2 className="text-2xl font-extrabold tracking-tight text-teal-600">
          Shop Mind
        </h2>
      </div>

      <nav className="flex-grow overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={`/admin/${item.id}`}
            onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile
            className={({ isActive }) =>
              `w-full flex items-center gap-3 text-left py-3 px-4 mb-2 rounded-xl transition-all duration-200 text-sm font-semibold ${
                isActive
                  ? "bg-teal-500 text-white shadow-md"
                  : "text-gray-900 hover:bg-gray-100 hover:text-teal-600"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 text-sm font-semibold shadow-md flex items-center gap-2"
      >
        <LogOut size={18} />
        Đăng xuất
      </button>
    </aside>
  );
};

export default Sidebar;
