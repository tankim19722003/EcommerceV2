import { useState } from "react";

const ShippingTypeModal = ({
  isOpen,
  onClose,
  shippingTypes,
  onSelectShipping,
}) => {
  const [selectedType, setSelectedType] = useState(
    shippingTypes && Array.isArray(shippingTypes) && shippingTypes.length > 0
      ? shippingTypes[0] // default to the first option
      : null
  );

  const handleSelect = (type) => {
    setSelectedType(type);
  };

  const handleSave = () => {
    if (selectedType) {
      onSelectShipping({
        id: selectedType.id,
        name: selectedType.shippingType.name,
        price: selectedType.price,
        description: selectedType.shippingType.description,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl p-6 bg-white rounded-xl shadow-2xl">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-red-600 mb-6 border-b-2 border-gray-200 pb-2">
          Chọn loại vận chuyển
        </h2>
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
          {shippingTypes && shippingTypes.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Loại vận chuyển
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {shippingTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                      ${selectedType?.id === type.id ? "border-gray-500 bg-teal-50" : "border-gray-200"}`}
                  >
                    <input
                      type="radio"
                      name="shipping-type"
                      className="w-5 h-5 text-blue-600"
                      checked={selectedType?.id === type.id}
                      onChange={() => handleSelect(type)}
                    />
                    <div className="ml-3">
                      <p className="text-base font-medium">
                        {type.shippingType.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        ₫{type.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {type.shippingType.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-red-500">Không có loại vận chuyển nào khả dụng</p>
          )}
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg"
            onClick={onClose}
          >
            Huỷ
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleSave}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingTypeModal;
