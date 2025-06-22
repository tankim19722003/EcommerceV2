import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <div className="flex items-center justify-center bg-red-100 text-red-600 p-4 rounded-full mb-4">
        <AlertTriangle size={40} />
      </div>
      <h1 className="text-6xl font-bold text-teal-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-2">Oops! Trang không tồn tại.</p>
      <p className="text-gray-500 mb-6">
        Trang bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors duration-200"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
}
