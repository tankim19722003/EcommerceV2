import { Package, ShoppingCart, DollarSign, Users } from "lucide-react";

export default function ShopOverview() {
  const stats = [
    { name: "Tổng số sản phẩm", value: 120, icon: Package },
    { name: "Tổng số đơn hàng", value: 345, icon: ShoppingCart },
    { name: "Tổng doanh thu", value: "$12,300", icon: DollarSign },
    { name: "Tổng số khách hàng", value: 98, icon: Users },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shop Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ name, value, icon: Icon }) => (
          <div
            key={name}
            className="bg-white shadow-md rounded-xl p-4 border border-gray-200 flex items-center space-x-4"
          >
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Icon size={24} />
            </div>
            <div>
              <div className="text-gray-500 text-sm">{name}</div>
              <div className="text-xl font-semibold">{value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-6h13M4 6h16M4 12h4m-4 6h4"
            />
          </svg>
          Đơn hàng gần đây
        </h2>
        <div className="bg-gray-50 p-4 rounded-md border border-dashed border-gray-300">
          <p className="text-gray-500 italic">Tính năng này sẽ sớm có mặt...</p>
        </div>
      </div>
    </div>
  );
}
