import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import DOWN_ICON from "/src/assets/down.png";
import { userAction } from "../../store/user-slice";
import { FaRegCircleUser } from "react-icons/fa6";
import { ShoppingBagIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserDropdown({ user }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setOpen((prev) => {
      return !prev;
    });
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    dispatch(userAction.logout());
  }

  return (
    <div className="relative inline-block text-sm" ref={dropdownRef}>
      {/* User Account Button */}
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 px-3 py-2 text-white hover:text-gray-200 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors duration-200"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="User avatar"
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <FaRegCircleUser size={24} className="text-white" />
        )}
        <span className="text-base font-medium">{user?.account || "User"}</span>
        <img
          src={DOWN_ICON}
          alt="Down arrow"
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-visible animate-fade-in-down">
          <li
            className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
            onClick={() => alert("Change info clicked!")}
          >
            <FaRegCircleUser size={16} />
            <span>Thay đổi thông tin</span>
          </li>

          <li className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-150">
            <Link
              to="/orders"
              className="flex items-center gap-2 w-full"
              aria-label="Xem đơn mua"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              <span>Đơn mua</span>
            </Link>
          </li>
          <li
            className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-150"
            onClick={handleLogout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Đăng xuất</span>
          </li>
        </ul>
      )}
    </div>
  );
}
