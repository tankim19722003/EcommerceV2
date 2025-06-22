import React, { useState } from "react";
import { Plus, Edit, Trash2, Package } from "lucide-react";

export default function ProductManagement() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Áo thun nam đỏ",
      price: 199000,
      description: "Áo thun chất liệu cotton, thoáng mát.",
      sold: 34,
    },
    {
      id: 2,
      name: "Quần jeans nữ",
      price: 299000,
      description: "Quần jeans thời trang nữ dáng ôm.",
      sold: 20,
    },
  ]);

  const handleEdit = (id) => {
    console.log("Edit product with ID:", id);
  };

  const handleDelete = (id) => {
    const confirm = window.confirm("Bạn có chắc muốn xoá sản phẩm?");
    if (confirm) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleCreate = () => {
    console.log("Navigate to create product form");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Package size={24} /> Quản lý sản phẩm
        </h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 flex items-center gap-2 transition"
        >
          <Plus size={18} /> Thêm sản phẩm
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Tên sản phẩm</th>
              <th className="px-4 py-3 text-left">Giá</th>
              <th className="px-4 py-3 text-left">Mô tả</th>
              <th className="px-4 py-3 text-left">Đã bán</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.price.toLocaleString()}₫</td>
                <td className="px-4 py-3 text-gray-600">{product.description}</td>
                <td className="px-4 py-3">{product.sold}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                  >
                    <Edit size={16} /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Xoá
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
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
