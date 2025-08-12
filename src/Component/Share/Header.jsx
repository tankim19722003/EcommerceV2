import Icon from "../Share/Icon";
import bell from "../../assets/bell.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userAction } from "../../store/user-slice";
import UserDropdown from "../User/UserDropdown";
import { useState } from "react";

function Header() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    dispatch(userAction.logout());
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate("/products", { state: { keyword: searchQuery } });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 p-2 sm:p-3 md:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Full header for tablet/desktop */}
        <div className="hidden sm:flex sm:flex-row justify-between items-center px-2 sm:px-3 md:px-4 w-full">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-white mb-2 sm:mb-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                to="/"
                className="text-sm sm:text-lg font-semibold hover:text-teal-200"
              >
              <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradHeader" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#4f46e5" stopOpacity="1" /> 
      <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" /> 
    </linearGradient>
  </defs>
  <path
    d="M20 55H80L70 25H30L20 55ZM50 15C55 15 60 20 60 25H40C40 20 45 15 50 15Z"
    fill="url(#gradHeader)"
    stroke="#FFF"
    strokeWidth="4"
  />
  <path
    d="M25 40C30 30 40 25 50 25C60 25 70 30 75 40"
    fill="none"
    stroke="#2dd4bf"
    strokeWidth="5"
    strokeLinecap="round"
  />
  <circle cx="35" cy="65" r="6" fill="#FFF" stroke="#4f46e5" strokeWidth="3" />
  <circle cx="65" cy="65" r="6" fill="#FFF" stroke="#4f46e5" strokeWidth="3" />
  <text
    x="50%"
    y="90"
    textAnchor="middle"
    fontFamily="Roboto, Arial, sans-serif"
    fontSize="18"
    fontWeight="700"
    fill="#FFF"
  >
    Shop Mind
  </text>
</svg>
              </Link>
              <div className="h-4 sm:h-5 w-px bg-teal-200"></div>
              <Link
                to="/shop-registration"
                className="text-xs sm:text-sm hover:text-teal-200"
              >
                Kênh Người Bán
              </Link>
              <div className="h-4 sm:h-5 w-px bg-teal-200"></div>
              <div className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                <span>Kết nối</span>
                <div className="flex gap-1 sm:gap-2">
                  <i className="fab fa-facebook-f text-white hover:text-teal-200 text-xs sm:text-sm"></i>
                  <i className="fab fa-instagram text-white hover:text-teal-200 text-xs sm:text-sm"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
              <Icon>
                <img
                  src={bell}
                  alt="Bell icon"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </Icon>
            </div>
            {!user && (
              <div className="flex gap-2 sm:gap-3">
                <Link
                  to="/register"
                  className="text-xs sm:text-sm text-white hover:text-teal-200"
                >
                  Đăng Ký
                </Link>
                <Link
                  to="/login"
                  className="text-xs sm:text-sm text-white hover:text-teal-200"
                >
                  Đăng Nhập
                </Link>
              </div>
            )}
            {user && <UserDropdown user={user} />}
          </div>
        </div>

        {/* Search bar and cart icon (visible on all screens) */}
        <div className="mt-2 sm:mt-3 flex flex-row justify-center items-center gap-2 sm:gap-3">
          <div className="relative w-full sm:max-w-lg flex items-center bg-white rounded-lg shadow-md">
            <input
              type="text"
              className="w-full h-9 sm:h-11 px-3 sm:px-4 py-1 sm:py-2 rounded-l-md bg-white shadow-sm outline-none text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition duration-200 ease-in-out hover:border-cyan-300 text-sm sm:text-base"
              placeholder="Tìm sản phẩm, thương hiệu hoặc tên shop"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              aria-label="Tìm kiếm sản phẩm, thương hiệu hoặc tên shop"
            />
            <button
              onClick={handleSearch}
              className="px-2 sm:px-4 py-1 sm:py-2 rounded-r-md bg-cyan-500 hover:bg-cyan-600 focus:ring-2 focus:ring-cyan-400 transition duration-200 ease-in-out"
              aria-label="Tìm kiếm"
            >
              <Icon>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </Icon>
            </button>
          </div>
          <Link to="/cart" className="relative">
            <Icon>
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </Icon>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
