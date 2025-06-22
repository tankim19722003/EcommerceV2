import { Outlet } from "react-router-dom";
import Sidebar from "../Component/ShopComponent/Sidebar";

export default function ShopLayOut() {
  return (
    <div className="flex h-screen">
      {/* Sidebar chiếm 1/5 chiều rộng */}
      <div className="w-1/5 min-w-[200px] max-w-[260px]">
        <Sidebar />
      </div>

      {/* Nội dung chiếm phần còn lại */}
      <div className="w-4/5 flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
