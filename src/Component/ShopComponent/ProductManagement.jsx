import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Package, Eye, X } from "lucide-react";
import { api } from "../../config/interceptor-config";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch products from API when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(
          "http://localhost:8080/api/v1/product/get_shop_product"
        );

        if (!response.data) {
          throw new Error("không tìm thấy sản phẩm");
        }

        // Map API response to the format expected by the table
        const mappedProducts = response.data.map((item) => {
          // Determine price, quantity, and category details
          let price = 0;
          let quantity = 0;
          let categoryDetails = {};

          // Check for product_category_one_level_responses
          if (
            item.product_category_responses
              ?.product_category_one_level_responses?.[0]
          ) {
            price =
              item.product_category_responses
                .product_category_one_level_responses[0].price || 0;
            quantity =
              item.product_category_responses
                .product_category_one_level_responses[0].quantity || 0;
            categoryDetails = {
              levelOne:
                item.product_category_responses
                  .product_category_one_level_responses[0],
            };
          }
          // Check for product_category_two_level
          else if (
            item.product_category_responses?.product_category_two_level?.[0]
              ?.child_product_category_responses?.[0]
          ) {
            price =
              item.product_category_responses.product_category_two_level[0]
                .child_product_category_responses[0].price || 0;
            quantity =
              item.product_category_responses.product_category_two_level[0]
                .child_product_category_responses[0].quantity || 0;
            categoryDetails = {
              levelTwo:
                item.product_category_responses.product_category_two_level[0],
              groupName:
                item.product_category_responses.product_category_group
                  ?.product_category_group_name || "Không xác định",
              subGroupName:
                item.product_category_responses.sub_product_category_group
                  ?.product_category_group_name || "Không xác định",
            };
          }

          return {
            id: item.product_basic_info.product_id,
            name: item.product_basic_info.name,
            price,
            description: item.product_basic_info.description,
            sold: quantity,
            image: item.product_basic_info.thumbnail?.avatar_url || "",
            categoryDetails,
            subCategory:
              item.product_basic_info.sub_category_response?.name ||
              "Không xác định",
            category:
              item.product_basic_info.sub_category_response?.category_response
                ?.name || "Không xác định",
            productImages: item.product_images || [],
            attributes: item.product_attribute_value_responses || [],
            shippingTypes: item.product_shipping_type_responses || [],
          };
        });

        setProducts(mappedProducts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (id) => {
    // Navigate to ProductCreationForm with productId as query parameter
    navigate(`/shop/product-creation?productId=${id}`);
  };

  const handleDelete = async (id) => {
    // Store the current products state for potential rollback
    const previousProducts = [...products];

    // Show SweetAlert confirmation
    const result = await Swal.fire({
      title: "Xác nhận xóa sản phẩm",
      text: "Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d9488", // Matches bg-teal-600
      cancelButtonColor: "#ef4444", // Matches red for delete
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true,
      customClass: {
        popup: "rounded-xl shadow-lg",
        title: "text-lg font-bold text-teal-700",
        content: "text-gray-600",
        confirmButton: "px-4 py-2 rounded-lg font-medium",
        cancelButton: "px-4 py-2 rounded-lg font-medium",
      },
    });

    if (result.isConfirmed) {
      try {
        // Make DELETE request to API
        await api.delete(`http://localhost:8080/api/v1/product/${id}`);

        // Update products state by filtering out the deleted product
        setProducts(products.filter((p) => p.id !== id));

        // Show success message
        await Swal.fire({
          title: "Xóa thành công",
          text: "Sản phẩm đã được xóa.",
          icon: "success",
          confirmButtonColor: "#0d9488", // Matches bg-teal-600
          confirmButtonText: "OK",
          customClass: {
            popup: "rounded-xl shadow-lg",
            title: "text-lg font-bold text-teal-700",
            content: "text-gray-600",
            confirmButton: "px-4 py-2 rounded-lg font-medium",
          },
        });
      } catch (err) {
        // Revert to previous products state on failure
        console.log(err);
        setProducts(previousProducts);

        // Show error message
        await Swal.fire({
          title: "Xóa thất bại",
          text:
            err.response?.data?.message ||
            "Không thể xóa sản phẩm này vì nó đã được sử dụng trong một hoặc nhiều đơn hàng.",
          icon: "error",
          confirmButtonColor: "#0d9488", // Matches bg-teal-600
          confirmButtonText: "OK",
          customClass: {
            popup: "rounded-xl shadow-lg",
            title: "text-lg font-bold text-teal-700",
            content: "text-gray-600",
            confirmButton: "px-4 py-2 rounded-lg font-medium",
          },
        });
      }
    }
  };

  const handleCreate = () => {
    navigate("/shop/product-creation");
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Package size={24} /> Quản lý sản phẩm
        </h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2 transition-all duration-200 ease-in-out cursor-pointer"
        >
          <Plus size={18} /> Thêm sản phẩm
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Hình ảnh</th>
              <th className="px-4 py-3 text-left">Tên sản phẩm</th>
              <th className="px-4 py-3 text-left">Đã bán</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-red-500">
                  Lỗi: {error}
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                  Không có sản phẩm nào.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">Không có ảnh</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{product.sold}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 hover:text-red-800 flex items-center gap-1 transition-all duration-200 ease-in-out cursor-pointer"
                      >
                        <Trash2 size={16} /> Xoá
                      </button>
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 hover:text-blue-800 flex items-center gap-1 transition-all duration-200 ease-in-out cursor-pointer"
                      >
                        <Edit size={16} /> Sửa
                      </button>
                      <button
                        onClick={() => handleViewDetails(product)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 hover:text-green-800 flex items-center gap-1 transition-all duration-200 ease-in-out cursor-pointer"
                      >
                        <Eye size={16} /> Xem chi tiết
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 -black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative border border-gray-200">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-all duration-200 ease-in-out cursor-pointer"
            >
              <X size={28} />
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
              Chi tiết sản phẩm
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <strong className="text-gray-700 font-medium w-32">
                  Tên sản phẩm:
                </strong>
                <span className="text-gray-900">{selectedProduct.name}</span>
              </div>
              <div className="flex items-start gap-4">
                <strong className="text-gray-700 font-medium w-32">
                  Mô tả:
                </strong>
                <span className="text-gray-900">
                  {selectedProduct.description || "Không có mô tả"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <strong className="text-gray-700 font-medium w-32">
                  Danh mục chính:
                </strong>
                <span className="text-gray-900">
                  {selectedProduct.category}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <strong className="text-gray-700 font-medium w-32">
                  Danh mục phụ:
                </strong>
                <span className="text-gray-900">
                  {selectedProduct.subCategory}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <strong className="text-gray-700 font-medium w-32">Giá:</strong>
                <span className="text-gray-900">
                  {selectedProduct.price.toLocaleString()}₫
                </span>
              </div>
              <div className="flex items-center gap-4">
                <strong className="text-gray-700 font-medium w-32">
                  Số lượng đã bán:
                </strong>
                <span className="text-gray-900">{selectedProduct.sold}</span>
              </div>
              <div>
                <strong className="text-gray-700 font-medium block mb-2">
                  Phân loại:
                </strong>
                {selectedProduct.categoryDetails.levelOne ? (
                  <div className="ml-4 bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900">
                      <span className="font-medium">Phân loại:</span>{" "}
                      {selectedProduct.categoryDetails.levelOne.value ||
                        "Không xác định"}
                    </p>
                    <p className="text-gray-900">
                      <span className="font-medium">Giá:</span>{" "}
                      {selectedProduct.categoryDetails.levelOne.price.toLocaleString()}
                      ₫
                    </p>
                    <p className="text-gray-900">
                      <span className="font-medium">Số lượng:</span>{" "}
                      {selectedProduct.categoryDetails.levelOne.quantity}
                    </p>
                    {selectedProduct.categoryDetails.levelOne.image_url && (
                      <img
                        src={selectedProduct.categoryDetails.levelOne.image_url}
                        alt="Category"
                        className="w-20 h-20 object-cover rounded mt-3"
                      />
                    )}
                  </div>
                ) : selectedProduct.categoryDetails.levelTwo ? (
                  <div className="ml-4 bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900">
                      <span className="font-medium">Nhóm phân loại:</span>{" "}
                      {selectedProduct.categoryDetails.groupName}
                    </p>
                    <p className="text-gray-900">
                      <span className="font-medium">Phân loại:</span>{" "}
                      {selectedProduct.categoryDetails.levelTwo
                        .product_category_response.name || "Không xác định"}
                    </p>
                    <p className="text-gray-900">
                      <span className="font-medium">Nhóm con:</span>{" "}
                      {selectedProduct.categoryDetails.subGroupName}
                    </p>
                    {selectedProduct.categoryDetails.levelTwo.child_product_category_responses.map(
                      (child, index) => (
                        <div
                          key={index}
                          className="ml-4 mt-3 bg-white p-3 rounded-md border border-gray-100"
                        >
                          <p className="text-gray-900">
                            <span className="font-medium">Kích thước:</span>{" "}
                            {child.name}
                          </p>
                          <p className="text-gray-900">
                            <span className="font-medium">Giá:</span>{" "}
                            {child.price.toLocaleString()}₫
                          </p>
                          <p className="text-gray-900">
                            <span className="font-medium">Số lượng:</span>{" "}
                            {child.quantity}
                          </p>
                        </div>
                      )
                    )}
                    {selectedProduct.categoryDetails.levelTwo
                      .product_category_response.image_url && (
                      <img
                        src={
                          selectedProduct.categoryDetails.levelTwo
                            .product_category_response.image_url
                        }
                        alt="Category"
                        className="w-20 h-20 object-cover rounded mt-3"
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">Không có thông tin phân loại</p>
                )}
              </div>
              <div>
                <strong className="text-gray-700 font-medium block mb-2">
                  Hình ảnh sản phẩm:
                </strong>
                <div className="flex flex-wrap gap-3 mt-2">
                  {selectedProduct.productImages?.length > 0 ? (
                    selectedProduct.productImages?.map((image, index) => (
                      <img
                        key={index}
                        src={image.avatar_url}
                        alt={`Product ${index}`}
                        className="w-20 h-20 object-cover rounded-md border border-gray-200"
                      />
                    ))
                  ) : (
                    <p className="text-gray-600">Không có hình ảnh</p>
                  )}
                </div>
              </div>
              <div>
                <strong className="text-gray-700 font-medium block mb-2">
                  Thuộc tính:
                </strong>
                {selectedProduct.attributes.length > 0 ? (
                  <ul className="ml-4 list-disc text-gray-900">
                    {selectedProduct.attributes.map((attr, index) => (
                      <li key={index}>
                        <span className="font-medium">
                          {attr.attribute_name}:
                        </span>{" "}
                        {attr.value}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Không có thuộc tính</p>
                )}
              </div>
              <div>
                <strong className="text-gray-700 font-medium block mb-2">
                  Phương thức vận chuyển:
                </strong>
                {selectedProduct.shippingTypes.length > 0 ? (
                  <ul className="ml-4 list-disc text-gray-900">
                    {selectedProduct.shippingTypes.map((shipping, index) => (
                      <li key={index}>
                        <span className="font-medium">
                          {shipping.shippingType.name}:
                        </span>{" "}
                        {shipping.shippingType.price.toLocaleString()}₫
                        <br />
                        <span className="text-gray-600">
                          {shipping.shippingType.description}
                        </span>{" "}
                        (Thời gian ước tính:{" "}
                        {shipping.shippingType.estimatedTime} ngày)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Không có thông tin vận chuyển</p>
                )}
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={closeModal}
                className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 ease-in-out cursor-pointer shadow-md"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
