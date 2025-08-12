import React, { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../../../config/interceptor-config";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { Pencil, Trash2 } from "lucide-react";

const VoucherManager = () => {
  const [vouchers, setVouchers] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    description: "",
    discount_percent: "",
    start_date: "",
    end_date: "",
    minimum_order_value: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        "http://localhost:8080/api/v1/voucher/get_shop_vouchers"
      );
      setVouchers(response.data);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách mã giảm giá. Vui lòng thử lại.");
      console.error("Error fetching vouchers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateVoucher = async () => {
    if (
      !formData.description ||
      !formData.discount_percent ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.minimum_order_value
    ) {
      setError("Vui lòng điền đầy đủ tất cả các trường");
      return;
    }

    setLoading(true);
    try {
      const voucherData = {
        description: formData.description,
        discount_percent: parseFloat(formData.discount_percent),
        start_date: formData.start_date,
        end_date: formData.end_date,
        minimum_order_value: parseFloat(formData.minimum_order_value),
      };

      // Call API to create
      const res = await api.post(
        "http://localhost:8080/api/v1/voucher",
        voucherData
      );

      // Append the new voucher to state
      setVouchers((prev) => [...prev, res.data]);

      // Reset form & close modal
      resetForm();
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError("Không thể tạo mã giảm giá. Vui lòng thử lại.");
      console.error("Error creating voucher:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditVoucher = (voucher) => {
    console.log(voucher)
    setFormData({
      id: voucher.id,
      description: voucher.description,
      discount_percent: voucher.discount_percent,
      start_date: voucher.start_date,
      end_date: voucher.end_date,
      minimum_order_value: voucher.minimum_order_value,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleUpdateVoucher = async () => {
    if (
      !formData.description ||
      !formData.discount_percent ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.minimum_order_value
    ) {
      setError("Vui lòng điền đầy đủ tất cả các trường");
      return;
    }

    setLoading(true);
    try {
      const voucherData = {
        id: formData.id,
        description: formData.description,
        discount_percent: parseFloat(formData.discount_percent),
        start_date: formData.start_date,
        end_date: formData.end_date,
        minimum_order_value: parseFloat(formData.minimum_order_value),
      };

      await api.put("http://localhost:8080/api/v1/voucher", voucherData);

      // Update voucher in state
      setVouchers((prev) =>
        prev.map((voucher) =>
          voucher.id === voucherData.id ? voucherData : voucher
        )
      );

      resetForm();
      setIsEditing(false);
      setIsModalOpen(false);
      setError(null);

      // SweetAlert success
      Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        text: "Mã giảm giá đã được cập nhật.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      setError("Không thể cập nhật mã giảm giá. Vui lòng thử lại.");
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Cập nhật mã giảm giá thất bại.",
      });
      console.error("Error updating voucher:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVoucher = async (id) => {
    Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa mã giảm giá này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await api.delete(
            `http://localhost:8080/api/v1/voucher?voucherId=${id}`
          );

          // Cập nhật UI ngay lập tức
          setVouchers((prevVouchers) =>
            prevVouchers.filter((voucher) => voucher.id !== id)
          );

          Swal.fire({
            title: "Đã xóa!",
            text: "Mã giảm giá đã được xóa thành công.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          setError(null);
        } catch (err) {
          setError("Không thể xóa mã giảm giá. Vui lòng thử lại.");
          Swal.fire({
            title: "Lỗi!",
            text: "Xóa mã giảm giá thất bại.",
            icon: "error",
          });
          console.error("Error deleting voucher:", err);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const resetForm = () => {
    setFormData({
      id: null,
      description: "",
      discount_percent: "",
      start_date: "",
      end_date: "",
      minimum_order_value: "",
    });
    setError(null);
  };

  const openModal = () => {
    resetForm();
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setIsEditing(false);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-8 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Quản Lý Mã Giảm Giá
        </h1>
        <button
          onClick={openModal}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 disabled:bg-indigo-300 cursor-pointer"
          disabled={loading}
        >
          Tạo Mã Giảm Giá
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-6 p-4 bg-indigo-100 text-indigo-700 rounded-lg">
          Đang tải...
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {isEditing ? "Cập Nhật Mã Giảm Giá" : "Tạo Mã Giảm Giá Mới"}
            </h2>
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả mã giảm giá"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  disabled={loading}
                />
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600">
                  Mô Tả
                </label>
              </div>
              <div className="relative">
                <input
                  type="number"
                  name="discount_percent"
                  value={formData.discount_percent}
                  onChange={handleInputChange}
                  placeholder="Giá trị giảm giá (%)"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  disabled={loading}
                />
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600">
                  Giảm Giá (%)
                </label>
              </div>
              <div className="relative">
                <input
                  type="datetime-local"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  disabled={loading}
                />
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600">
                  Ngày Bắt Đầu
                </label>
              </div>
              <div className="relative">
                <input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  disabled={loading}
                />
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600">
                  Ngày Kết Thúc
                </label>
              </div>
              <div className="relative">
                <input
                  type="number"
                  name="minimum_order_value"
                  value={formData.minimum_order_value}
                  onChange={handleInputChange}
                  placeholder="Giá trị đơn hàng tối thiểu (₫)"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  disabled={loading}
                />
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-gray-600">
                  Đơn Hàng Tối Thiểu (₫)
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={isEditing ? handleUpdateVoucher : handleCreateVoucher}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 disabled:bg-indigo-300 cursor-pointer"
                disabled={loading}
              >
                {isEditing ? "Cập Nhật Mã" : "Tạo Mã"}
              </button>
              <button
                onClick={closeModal}
                className="bg-slate-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-slate-300 transition-all duration-200 transform hover:scale-105 disabled:bg-slate-100 cursor-pointer"
                disabled={loading}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Danh Sách Mã Giảm Giá
        </h2>
        {loading ? (
          <p className="text-gray-500 text-lg">
            Đang tải danh sách mã giảm giá...
          </p>
        ) : vouchers.length === 0 ? (
          <p className="text-gray-500 text-lg">
            Chưa có mã giảm giá nào. Hãy tạo mã để bắt đầu!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-indigo-50 text-gray-700">
                  <th className="p-4 text-left font-semibold">Mô Tả</th>
                  <th className="p-4 text-left font-semibold">Giảm Giá (%)</th>
                  <th className="p-4 text-left font-semibold">Ngày Bắt Đầu</th>
                  <th className="p-4 text-left font-semibold">Ngày Kết Thúc</th>
                  <th className="p-4 text-left font-semibold">
                    Đơn Hàng Tối Thiểu (₫)
                  </th>
                  <th className="p-4 text-left font-semibold">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher) => (
                  <tr
                    key={voucher.id}
                    className="border-b border-gray-200 hover:bg-indigo-50 transition-all duration-200"
                  >
                    <td className="p-4">{voucher.description}</td>
                    <td className="p-4">{voucher.discount_percent}</td>
                    <td className="p-4">
                      {dayjs(voucher.start_date).format("DD/MM/YYYY HH:mm")}
                    </td>
                    <td className="p-4">
                      {dayjs(voucher.end_date).format("DD/MM/YYYY HH:mm")}
                    </td>
                    <td className="p-4">{voucher.minimum_order_value}</td>
                    <td className="p-4 flex justify-end space-x-3">
                      <button
                        onClick={() => handleEditVoucher(voucher)}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 disabled:bg-blue-300 cursor-pointer flex items-center justify-center"
                        disabled={loading}
                        title="Chỉnh sửa"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteVoucher(voucher.id)}
                        className="bg-rose-500 text-white p-2 rounded-lg hover:bg-rose-600 transition-all duration-200 transform hover:scale-105 disabled:bg-rose-300 cursor-pointer flex items-center justify-center"
                        disabled={loading}
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherManager;
