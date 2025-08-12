import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function UserInfoSidebar() {
  const [account, setAccount] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const location = useLocation(); // To track active route

  useEffect(() => {
    // Get data from localStorage
    const storedData = localStorage.getItem("user");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setAccount(parsedData.user?.account || "");
        setAvatarUrl(parsedData.user?.avatar_url || "");
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
  }, []);

  return (
    <div className="p-4 md:p-6 bg-gray-50 h-full">
      <div className="w-full md:w-72 bg-white rounded-xl shadow-md h-full md:h-auto overflow-y-auto p-6 md:p-8 transition-all duration-200">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={avatarUrl || "https://via.placeholder.com/100"}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-teal-100 shadow-sm"
          />
          <p className="font-semibold text-base text-gray-800">
            {account || "Khách hàng"}
          </p>
          <Link
            to="/user-info"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium mt-2 transition-colors duration-150"
          >
            Sửa Hồ Sơ
          </Link>
        </div>
        {/* Navigation */}
        <ul className="space-y-2 text-sm font-medium">
          <li>
            <Link
              to="/user-info"
              className={`flex items-center p-3 rounded-lg transition-colors duration-150 ${
                location.pathname === "/user-info"
                  ? "bg-teal-50 text-teal-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Tài Khoản Của Tôi
            </Link>
            <ul className="ml-6 mt-2 space-y-1 text-gray-600">
              <li>
                <Link
                  to="/user-info"
                  className={`block p-2 rounded-lg transition-colors duration-150 ${
                    location.pathname === "/user-info"
                      ? "bg-teal-50 text-teal-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Hồ Sơ
                </Link>
              </li>
              <li>
                <Link
                  to="/user-address-updating"
                  className={`block p-2 rounded-lg transition-colors duration-150 ${
                    location.pathname === "/user-address-updating"
                      ? "bg-teal-50 text-teal-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Địa Chỉ
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className={`block p-2 rounded-lg transition-colors duration-150 ${
                    location.pathname === "/orders"
                      ? "bg-teal-50 text-teal-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Đơn hàng
                </Link>
              </li>
              <li>
                <Link
                  to="/change-password"
                  className={`block p-2 rounded-lg transition-colors duration-150 ${
                    location.pathname === "/change-password"
                      ? "bg-teal-50 text-teal-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Đổi Mật Khẩu
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
