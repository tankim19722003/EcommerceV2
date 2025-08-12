import React, { useState, useEffect } from "react";
import { api } from "../../../config/interceptor-config";
import Swal from "sweetalert2";

const ProductDiscount = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discountData, setDiscountData] = useState({
    product_id: "",
    discount_percent: "",
    date_start: "",
    date_end: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Lấy danh sách sản phẩm khi component được mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("http://localhost:8080/api/v1/product/get_shop_product");
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Lọc và sắp xếp sản phẩm dựa trên từ khóa tìm kiếm và tỷ lệ giảm giá
  useEffect(() => {
    const filtered = products
      .filter((product) =>
        product.product_basic_info.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => 
        b.product_basic_info.discount_percent - a.product_basic_info.discount_percent
      );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Xác thực dữ liệu form
  const validateForm = () => {
    const errors = {};
    const now = new Date();
    const startDate = new Date(discountData.date_start);
    const endDate = new Date(discountData.date_end);

    if (
      !discountData.discount_percent ||
      discountData.discount_percent < 0 ||
      discountData.discount_percent > 100
    ) {
      errors.discount_percent = "Tỷ lệ giảm giá phải từ 0 đến 100";
    }
    if (!discountData.date_start) {
      errors.date_start = "Ngày bắt đầu là bắt buộc";
    } else if (startDate < now) {
      errors.date_start = "Ngày bắt đầu không được là ngày trong quá khứ";
    }
    if (!discountData.date_end) {
      errors.date_end = "Ngày kết thúc là bắt buộc";
    } else if (endDate <= startDate) {
      errors.date_end = "Ngày kết thúc phải sau ngày bắt đầu";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Xử lý thay đổi dữ liệu đầu vào trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDiscountData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Mở modal để tạo/cập nhật giảm giá
  const openModal = async (productId) => {
    setSelectedProductId(productId);
    const product = products.find((p) => p.product_basic_info.product_id === productId);
    try {
      if (product.product_basic_info.discount_percent > 0) {
        const { discount_percent, date_start, date_end } = product.discountResponse || {};
        const formattedStartDate = date_start && !isNaN(new Date(date_start))
          ? new Date(date_start).toISOString().slice(0, 16)
          : "";
        const formattedEndDate = date_end && !isNaN(new Date(date_end))
          ? new Date(date_end).toISOString().slice(0, 16)
          : "";
        setDiscountData({
          product_id: productId,
          discount_percent: discount_percent || "",
          date_start: formattedStartDate,
          date_end: formattedEndDate,
        });
      } else {
        setDiscountData({
          product_id: productId,
          discount_percent: "",
          date_start: "",
          date_end: "",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Thất bại!",
        text: "Không thể tải thông tin giảm giá. Vui lòng thử lại.",
        confirmButtonText: "OK",
      });
      setDiscountData({
        product_id: productId,
        discount_percent: product.product_basic_info.discount_percent || "",
        date_start: "",
        date_end: "",
      });
    }
    setShowModal(true);
  };

  // Xử lý gửi giảm giá
  const handleSubmitDiscount = async () => {
    if (!validateForm()) return;
    setShowConfirm(true);
  };

  // Xác nhận gửi giảm giá
  const confirmSubmit = async () => {
    try {
      await api.post("http://localhost:8080/api/v1/product/create_discount", {
        product_id: selectedProductId,
        discount_percent: parseInt(discountData.discount_percent),
        date_start: discountData.date_start,
        date_end: discountData.date_end,
      });
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Giảm giá đã được tạo/cập nhật thành công!",
        confirmButtonText: "OK",
      });
      setShowModal(false);
      setShowConfirm(false);
      setDiscountData({
        product_id: "",
        discount_percent: "",
        date_start: "",
        date_end: "",
      });
      const response = await api.get("http://localhost:8080/api/v1/product/get_shop_product");
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Thất bại!",
        text: "Không thể tạo/cập nhật giảm giá. Vui lòng thử lại.",
        confirmButtonText: "OK",
      });
      setShowModal(false);
      setShowConfirm(false);
    }
  };

  // Xóa giảm giá
  const handleClearDiscount = async (productId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn xóa giảm giá cho sản phẩm này?",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      try {
        await api.post("http://localhost:8080/api/v1/product/create_discount", {
          product_id: productId,
          discount_percent: 0,
          date_start: new Date(),
          date_end: new Date(),
        });
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Giảm giá đã được xóa thành công!",
          confirmButtonText: "OK",
        });
        const response = await api.get("http://localhost:8080/api/v1/product/get_shop_product");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Thất bại!",
          text: "Không thể xóa giảm giá. Vui lòng thử lại.",
          confirmButtonText: "OK",
        });
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
    </div>
  );
  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mx-auto max-w-3xl animate-pulse">
      {error}
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
        Quản Lý Giảm Giá Sản Phẩm
      </h1>

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded mx-auto max-w-3xl animate-fade-in">
          {successMessage}
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full sm:w-1/2 mx-auto block rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-3 transition-all"
          aria-label="Tìm kiếm sản phẩm"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1">
          <div className="hidden sm:grid grid-cols-12 gap-4 bg-gray-100 p-4 font-semibold text-gray-700">
            <div className="col-span-2">Hình Ảnh</div>
            <div className="col-span-5">Tên Sản Phẩm</div>
            <div className="col-span-2 text-center">Giảm Giá</div>
            <div className="col-span-3">Hành Động</div>
          </div>
          {filteredProducts.map((product) => (
            <div
              key={product.product_basic_info.product_id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-all items-center"
            >
              <div className="col-span-2">
                {product.product_basic_info.thumbnail?.avatar_url ? (
                  <img
                    src={product.product_basic_info.thumbnail.avatar_url}
                    alt={product.product_basic_info.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                    Không Có Hình
                  </div>
                )}
              </div>
              <div className="col-span-5">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                  {product.product_basic_info.name}
                </h2>
              </div>
              <div className="col-span-2 text-center">
                <p className="text-gray-600 text-sm font-medium">
                  {product.product_basic_info.discount_percent}%
                </p>
              </div>
              <div className="col-span-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-center">
                <button
                  onClick={() => openModal(product.product_basic_info.product_id)}
                  className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-300"
                  aria-label={product.product_basic_info.discount_percent > 0 ? "Cập nhật giảm giá" : "Tạo giảm giá"}
                >
                  {product.product_basic_info.discount_percent > 0 ? "Cập Nhật" : "Tạo"}
                </button>
                {product.product_basic_info.discount_percent > 0 && (
                  <button
                    onClick={() => handleClearDiscount(product.product_basic_info.product_id)}
                    className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-red-300"
                    aria-label="Ngừng áp dụng giảm giá"
                  >
                    Ngừng áp dụng
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Giảm Giá */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg shadow-2xl transform transition-all scale-95 animate-modal-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {discountData.discount_percent > 0 ? "Cập Nhật Giảm Giá" : "Tạo Giảm Giá"}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tỷ Lệ Giảm Giá (%)
                </label>
                <input
                  type="number"
                  name="discount_percent"
                  value={discountData.discount_percent}
                  onChange={handleInputChange}
                  className={`block w-full rounded-lg border ${
                    formErrors.discount_percent ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-3 transition-all`}
                  placeholder="Nhập tỷ lệ giảm giá (ví dụ: 70)"
                  min="0"
                  max="100"
                  aria-invalid={formErrors.discount_percent ? "true" : "false"}
                />
                {formErrors.discount_percent && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.discount_percent}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày Bắt Đầu
                </label>
                <input
                  type="datetime-local"
                  name="date_start"
                  value={discountData.date_start}
                  onChange={handleInputChange}
                  className={`block w-full rounded-lg border ${
                    formErrors.date_start ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-3 transition-all`}
                  aria-invalid={formErrors.date_start ? "true" : "false"}
                />
                {formErrors.date_start && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.date_start}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày Kết Thúc
                </label>
                <input
                  type="datetime-local"
                  name="date_end"
                  value={discountData.date_end}
                  onChange={handleInputChange}
                  className={`block w-full rounded-lg border ${
                    formErrors.date_end ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-3 transition-all`}
                  aria-invalid={formErrors.date_end ? "true" : "false"}
                />
                {formErrors.date_end && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.date_end}</p>
                )}
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Hủy"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitDiscount}
                  className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
                  aria-label={discountData.discount_percent > 0 ? "Cập nhật giảm giá" : "Tạo giảm giá"}
                >
                  {discountData.discount_percent > 0 ? "Cập Nhật" : "Tạo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận */}
      {showConfirm && (
        <div className="fixed inset-0 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md shadow-2xl transform transition-all scale-95 animate-modal-in">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Xác Nhận</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn {discountData.discount_percent > 0 ? "cập nhật" : "tạo"} giảm giá này?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-label="Hủy"
              >
                Hủy
              </button>
              <button
                onClick={confirmSubmit}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Xác nhận"
              >
                Xác Nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDiscount;