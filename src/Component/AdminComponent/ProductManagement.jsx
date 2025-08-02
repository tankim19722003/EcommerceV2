import React, { useState } from "react";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function ProductManagement() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Áo thun nam đỏ",
      price: 199000,
      description: "Áo thun chất liệu cotton, thoáng mát.",
      sold: 34,
      thumbnail:
        "https://pos.nvncdn.com/5556ba-124517/ps/20220728_egHP3TvGx08M2MLxcSEnfi02.jpg",
      createdAt: "2024-06-01",
    },
    {
      id: 2,
      name: "Quần jeans nữ",
      price: 299000,
      description: "Quần jeans thời trang nữ dáng ôm.",
      sold: 20,
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwUiSlNX8p1cHxn-hdmBaHUgNHwZNgf-3elw&s",
      createdAt: "2024-06-15",
    },
  ]);

  const handleEdit = (id) => {
  };

  const handleDelete = (id) => {
    const confirm = window.confirm("Bạn có chắc muốn xoá sản phẩm?");
    if (confirm) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleCreate = () => {
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Package size={24} /> Quản lý sản phẩm
        </h2>
        <NavLink
          to={"/shop/product-creation"}
          onClick={handleCreate}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center gap-2 transition"
        >
          <Plus size={18} /> Thêm sản phẩm
        </NavLink>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Ảnh</th>
              <th className="px-4 py-3 text-left">Tên sản phẩm</th>
              <th className="px-4 py-3 text-left">Giá</th>
              <th className="px-4 py-3 text-left">Mô tả</th>
              <th className="px-4 py-3 text-left">Đã bán</th>
              <th className="px-4 py-3 text-left">Ngày tạo</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 select-none">
                <td className="px-4 py-3">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded border border-gray-200"
                  />
                </td>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.price.toLocaleString()}₫</td>
                <td className="px-4 py-3 text-gray-600">
                  {product.description}
                </td>
                <td className="px-4 py-3">{product.sold}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 hover:shadow-sm transition text-sm cursor-pointer"
                  >
                    <Edit size={16} /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-500 text-red-500 rounded hover:bg-red-50 hover:shadow-sm transition text-sm cursor-pointer"
                  >
                    <Trash2 size={16} /> Xoá
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                  Không có sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
