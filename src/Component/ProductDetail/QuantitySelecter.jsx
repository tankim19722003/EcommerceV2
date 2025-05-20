const QuantitySelector = ({
  quantity,
  setQuantity,
  maxQuantity,
  isDisabled = true,
}) => {
  const handleDecrease = () => {
    if (!isDisabled && quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (!isDisabled) {
      if (quantity < maxQuantity) {
        setQuantity(quantity + 1);
      } else {
        setQuantity(maxQuantity);
        alert("Số lượng bạn chọn đã đạt tối đa của sản phẩm này");
      }
    }
  };

  const handleInputChange = (e) => {
    if (!isDisabled) {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value > 0) {
        setQuantity(value);
      }
    }
  };

  return (
    <div className={`mt-4 ${isDisabled ? "opacity-60" : ""}`}>
      <p className={`font-medium ${isDisabled ? "opacity-90" : ""}`}>
        Số Lượng
      </p>
      <div className="flex items-center mt-2 gap-2">
        <div className="flex items-center mt-2">
          <button
            disabled={isDisabled}
            onClick={handleDecrease}
            className={`px-4 py-2 border rounded-l transition font-semibold
            ${
              isDisabled
                ? "bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed"
                : "bg-gray-100 border-gray-300 hover:bg-gray-200"
            }`}
          >
            -
          </button>

          <input
            value={quantity}
            onChange={handleInputChange}
            disabled={isDisabled}
            className={`w-16 text-center py-2 border font-semibold focus:outline-none
            ${
              isDisabled
                ? "bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed"
                : "border-gray-300 focus:ring-2 focus:ring-orange-500"
            }`}
            min="1"
          />

          <button
            disabled={isDisabled}
            onClick={handleIncrease}
            className={`px-4 py-2 border rounded-r transition font-semibold
            ${
              isDisabled
                ? "bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed"
                : "bg-gray-100 border-gray-300 hover:bg-gray-200"
            }`}
          >
            +
          </button>
        </div>

        {maxQuantity > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            Tối đa: {maxQuantity} sản phẩm
          </p>
        )}
      </div>
    </div>
  );
};

export default QuantitySelector;
