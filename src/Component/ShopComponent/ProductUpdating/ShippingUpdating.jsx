import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import CollapsibleSection from "../CollapsibleSection";
import { api } from "../../../config/interceptor-config";

function ShippingUpdating() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId"); // Get productId from URL
  const [dimensions, setDimensions] = useState({
    weight: "",
    height: "",
    width: "",
    high: "",
  });
  const [shippingTypes, setShippingTypes] = useState([]);
  const [openSections, setOpenSections] = useState({
    dimensions: true,
    shipping: true,
  });
  const [errors, setErrors] = useState({ dimensions: null, shipping: null, update: null });
  const [isLoadingShippingTypes, setIsLoadingShippingTypes] = useState(true);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Toggle collapsible section
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Fetch shipping data
  useEffect(() => {
    if (!productId) {
      setErrors({ dimensions: "Missing product ID", shipping: null, update: null });
      setIsLoadingShippingTypes(false);
      return;
    }

    const fetchShippingData = async () => {
      try {
        const response = await api.get(
          `http://localhost:8080/api/v1/product_shipping/${productId}`
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch shipping data");
        }
        const data = response.data;
        setDimensions({
          weight: data.weight || "",
          height: data.height || "",
          width: data.width || "",
          high: data.high || "",
        });
        if (Array.isArray(data.product_shipping_type)) {
          setShippingTypes(
            data.product_shipping_type.map((type) => ({
              id: type.id,
              type: type.shippingType.name,
              eta:
                type.shippingType.description ||
                `${type.shippingType.estimatedTime} ngày`,
              cost: type.price,
              enabled: type.enabled ?? false,
            }))
          );
        } else {
          throw new Error("Expected an array of product shipping types");
        }
        setErrors({ dimensions: null, shipping: null, update: null });
      } catch (error) {
        console.error("Error fetching shipping data:", error);
        setErrors({ dimensions: null, shipping: error.message, update: null });
      } finally {
        setIsLoadingShippingTypes(false);
      }
    };

    fetchShippingData();
  }, [productId]);

  // Handle dimension input change
  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setDimensions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Debounced function to calculate shipping fees
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const calculateShippingFees = useCallback(async () => {
    const { weight, height, width, high } = dimensions;
    if (
      !weight ||
      !height ||
      !width ||
      !high ||
      isNaN(weight) ||
      isNaN(height) ||
      isNaN(width) ||
      isNaN(high) ||
      parseFloat(weight) <= 0 ||
      parseFloat(height) <= 0 ||
      parseFloat(width) <= 0 ||
      parseFloat(high) <= 0
    ) {
      setErrors((prev) => ({
        ...prev,
        dimensions: "Vui lòng nhập đầy đủ và hợp lệ các kích thước (lớn hơn 0)",
      }));
      return;
    }

    setIsLoadingShipping(true);
    try {
      const payload = {
        productId: parseInt(productId),
        weight: parseFloat(weight),
        height: parseFloat(height),
        width: parseFloat(width),
        high: parseFloat(high),
      };
      console.log("Calculating shipping fees with payload:", payload);

      const response = await api.post(
        "http://localhost:8080/api/v1/product_shipping/calculate_each_shipping_type_fee",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        const updatedShippingTypes = response.data.map((item) => {
          const existingType = shippingTypes.find(
            (type) => type.id === item.shipping_type_response.id
          );
          return {
            id: item.shipping_type_response.id,
            type: item.shipping_type_response.name,
            eta:
              item.shipping_type_response.description ||
              `${item.shipping_type_response.estimated_time} ngày`,
            cost: item.price,
            enabled: existingType ? existingType.enabled : false,
          };
        });
        setShippingTypes(updatedShippingTypes);
        setErrors((prev) => ({ ...prev, dimensions: null, shipping: null }));
        setSuccessMessage("Phí vận chuyển đã được cập nhật thành công!");
      } else {
        throw new Error("Failed to calculate shipping fees");
      }
    } catch (error) {
      console.error("Error calculating shipping fees:", error.response?.data || error.message);
      setErrors({
        ...errors,
        shipping: error.response?.data?.message || error.message || "Không thể tính phí vận chuyển",
      });
      setSuccessMessage(null);
    } finally {
      setIsLoadingShipping(false);
    }
  }, [dimensions, productId, shippingTypes]);

  const debouncedCalculateShippingFees = useCallback(debounce(calculateShippingFees, 500), [
    calculateShippingFees,
  ]);

  // Calculate shipping fees when dimensions change
  useEffect(() => {
    if (
      dimensions.weight &&
      dimensions.height &&
      dimensions.width &&
      dimensions.high
    ) {
      debouncedCalculateShippingFees();
    }
  }, [dimensions, debouncedCalculateShippingFees]);

  // Handle shipping type checkbox change
  const handleShippingTypeChange = (index) => {
    const updatedShippingTypes = [...shippingTypes];
    updatedShippingTypes[index].enabled = !updatedShippingTypes[index].enabled;
    setShippingTypes(updatedShippingTypes);
  };

  // Handle update button click
  const handleUpdate = async () => {
    const { weight, height, width, high } = dimensions;
    if (
      !weight ||
      !height ||
      !width ||
      !high ||
      isNaN(weight) ||
      isNaN(height) ||
      isNaN(width) ||
      isNaN(high) ||
      parseFloat(weight) <= 0 ||
      parseFloat(height) <= 0 ||
      parseFloat(width) <= 0 ||
      parseFloat(high) <= 0
    ) {
      setErrors({
        ...errors,
        update: "Vui lòng nhập đầy đủ và hợp lệ các kích thước (lớn hơn 0)",
      });
      setSuccessMessage(null);
      return;
    }

    try {
      const payload = {
        product_id: parseInt(productId),
        weight: parseFloat(weight),
        height: parseFloat(height),
        width: parseFloat(width),
        high: parseFloat(high),
        shipping_type_ids: shippingTypes
          .filter((type) => type.enabled)
          .map((type) => type.id),
      };
      console.log("Creating shipping types with payload:", payload);

      const response = await api.post(
        "http://localhost:8080/api/v1/product_shipping/create_product_shipping_type",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        setSuccessMessage("Cập nhật thông tin vận chuyển thành công!");
        setErrors({ ...errors, update: null });

        // Refetch shipping data to sync with server
        const refetchResponse = await api.get(
          `http://localhost:8080/api/v1/product_shipping/${productId}`
        );
        if (refetchResponse.status === 200) {
          const data = refetchResponse.data;
          setDimensions({
            weight: data.weight || "",
            height: data.height || "",
            width: data.width || "",
            high: data.high || "",
          });
          setShippingTypes(
            data.product_shipping_type.map((type) => ({
              id: type.id,
              type: type.shippingType.name,
              eta:
                type.shippingType.description ||
                `${type.shippingType.estimatedTime} ngày`,
              cost: type.price,
              enabled: type.enabled ?? false,
            }))
          );
        }
      } else {
        throw new Error("Failed to create shipping types");
      }
    } catch (error) {
      console.error("Error creating shipping types:", error.response?.data || error.message);
      setErrors({
        ...errors,
        update: error.response?.data?.message || error.message || "Không thể cập nhật thông tin vận chuyển",
      });
      setSuccessMessage(null);
    }
  };

  if (errors.shipping && !shippingTypes.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-red-600 text-lg">
        {errors.shipping}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full bg-white rounded-lg shadow-md px-9 py-6 h-screen">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-gray-900 mb-6 tracking-tight bg-gradient-to-r from-blue-500 to-teal-500 text-transparent bg-clip-text">
          Cập nhật thông tin vận chuyển sản phẩm
        </h1>

        <CollapsibleSection
          title="Kích Thước Gói Hàng"
          isOpen={openSections.dimensions}
          toggle={() => toggleSection("dimensions")}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Cân Nặng (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="weight"
                value={dimensions.weight}
                onChange={handleDimensionChange}
                placeholder="VD: 10"
                className={`w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                  errors.dimensions ? "border-red-500" : "border-gray-300"
                }`}
                step="0.01"
                min="0"
                aria-label="Cân nặng"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Chiều Cao (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="height"
                value={dimensions.height}
                onChange={handleDimensionChange}
                placeholder="VD: 20"
                className={`w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                  errors.dimensions ? "border-red-500" : "border-gray-300"
                }`}
                step="0.01"
                min="0"
                aria-label="Chiều cao"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Chiều Rộng (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="width"
                value={dimensions.width}
                onChange={handleDimensionChange}
                placeholder="VD: 12"
                className={`w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                  errors.dimensions ? "border-red-500" : "border-gray-300"
                }`}
                step="0.01"
                min="0"
                aria-label="Chiều rộng"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">
                Chiều Dài (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="high"
                value={dimensions.high}
                onChange={handleDimensionChange}
                placeholder="VD: 30"
                className={`w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                  errors.dimensions ? "border-red-500" : "border-gray-300"
                }`}
                step="0.01"
                min="0"
                aria-label="Chiều dài"
              />
            </div>
          </div>
          {errors.dimensions && (
            <p className="mt-4 text-red-500 text-center">{errors.dimensions}</p>
          )}
        </CollapsibleSection>

        <CollapsibleSection
          title="Phương Thức Vận Chuyển"
          isOpen={openSections.shipping}
          toggle={() => toggleSection("shipping")}
        >
          <div className="space-y-4">
            <p className="text-base text-gray-600">
              Chọn phương thức vận chuyển phù hợp với sản phẩm của bạn.
            </p>
            {isLoadingShippingTypes ? (
              <div className="flex items-center space-x-2 text-gray-600 bg-white border border-gray-300 p-4 rounded-lg">
                <svg
                  className="animate-spin h-5 w-5 text-teal-500"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-base">
                  Đang tải phương thức vận chuyển...
                </span>
              </div>
            ) : shippingTypes.length === 0 ? (
              <p className="text-base text-gray-600 p-4 bg-white border border-gray-300 rounded-lg">
                Không có phương thức vận chuyển nào được cấu hình.
              </p>
            ) : (
              shippingTypes.map((type, index) => (
                <div
                  key={type.id || index}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    checked={type.enabled}
                    onChange={() => handleShippingTypeChange(index)}
                    className="h-4 w-4 text-teal-500 focus:ring-teal-500 rounded"
                    aria-label={`Kích hoạt ${type.type}`}
                  />
                  <label className="text-base font-medium text-gray-800 flex items-center space-x-2">
                    <span>{type.type}</span>
                    <span className="text-teal-600">({type.eta})</span>
                    {isLoadingShipping ? (
                      <span className="text-gray-500 animate-pulse text-base">
                        Đang tính phí...
                      </span>
                    ) : type.cost !== null ? (
                      <span className="text-green-600 font-semibold text-base">
                        {type.cost.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-base">
                        Không có giá trị
                      </span>
                    )}
                  </label>
                </div>
              ))
            )}
          </div>
        </CollapsibleSection>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUpdate}
            className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Cập nhật
          </button>
        </div>

        {errors.update && (
          <div className="mt-4 text-red-500 text-center">{errors.update}</div>
        )}
        {successMessage && (
          <div className="mt-4 text-green-600 text-center">{successMessage}</div>
        )}
      </div>
    </div>
  );
}

export default ShippingUpdating;