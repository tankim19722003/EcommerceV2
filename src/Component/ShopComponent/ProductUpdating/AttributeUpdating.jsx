import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../../config/interceptor-config";
import Swal from "sweetalert2";

function AttributeUpdating() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId"); // Get productId from URL
  const [attributes, setAttributes] = useState([]); // State for attributes
  const [errors, setErrors] = useState({ attributes: false, update: null }); // Error state
  const [loading, setLoading] = useState(true); // Loading state
  const [successMessage, setSuccessMessage] = useState(null); // Success message

  // Fetch attributes from API
  useEffect(() => {
    if (!productId) {
      setErrors({ attributes: true, update: null });
      setLoading(false);
      return;
    }

    const fetchAttributes = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/product_attribute_value/${productId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch attributes");
        }
        const data = await response.json();
        setAttributes(data);
        setErrors({ attributes: false, update: null });
      } catch (error) {
        console.error("Error fetching attributes:", error);
        setErrors({ attributes: true, update: null });
      } finally {
        setLoading(false);
      }
    };

    fetchAttributes();
  }, [productId]);

  // Handle input change
  const handleAttributeChange = (index, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index].value = value;
    setAttributes(updatedAttributes);
  };

  // Handle update submission
  const handleUpdate = async () => {
    if (!attributes.length) {
      setErrors({ ...errors, update: "No attributes to update" });
      return;
    }

    // Prepare payload in the required format
    const payload = attributes.map(({ subcategory_attribute_id, value }) => ({
      subcategory_attribute_id,
      value,
    }));

    console.log(payload);

    try {
      const response = await api.post(
        `http://localhost:8080/api/v1/product_attribute_value/add_multiple?productId=${productId}`,
        JSON.stringify(payload)
      );

      // ✅ Show success SweetAlert
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật thuộc tính thành công!",
      });

      if (response.status != 200) {
        throw new Error("Failed to update attributes");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Đã xảy ra lỗi khi cập nhật thuộc tính.",
      });
      setErrors({ ...errors, update: error.message });
      setSuccessMessage(null);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600 text-lg">Loading...</div>;
  }

  if (errors.attributes) {
    return (
      <div className="text-center text-red-600 text-lg">
        Error loading attributes. Please try again.
      </div>
    );
  }

  return (
    <div className="p-6 w-6xl m-auto h-screen bg-white rounded-lg shadow-md">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 mb-6 tracking-tight bg-gradient-to-r from-blue-500 to-teal-500 text-transparent bg-clip-text">
        Chỉnh sửa giá trị thuộc tính sản phẩm
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {attributes.map((attribute, index) => (
          <div key={attribute.product_attribute_value_id}>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              {attribute.attribute_name} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={attribute.value || ""}
              onChange={(e) => handleAttributeChange(index, e.target.value)}
              placeholder={`Nhập giá trị, ví dụ: ${attribute.attribute_name}`}
              className={`w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                errors.attributes ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleUpdate}
          className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-full hover:bg-teal-700 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
        >
          Cập nhật thuộc tính
        </button>
      </div>
      {errors.update && (
        <div className="mt-4 text-red-500 text-center">{errors.update}</div>
      )}
      {successMessage && (
        <div className="mt-4 text-green-600 text-center">{successMessage}</div>
      )}
    </div>
  );
}

export default AttributeUpdating;
