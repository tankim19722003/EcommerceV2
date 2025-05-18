// Quantity Selector Component
const QuantitySelector = ({ quantity, setQuantity }) => {
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  return (
    <div className="mt-4">
      <p className="text-gray-700 font-medium">Số Lượng</p>
      <div className="flex items-center mt-2">
        <button
          onClick={handleDecrease}
          className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-l hover:bg-gray-200 transition"
        >
          -
        </button>

        <input
          // type="number"
          value={quantity}
          onChange={handleInputChange}
          className="w-16 text-center py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          min="1"
        />

        <button
          onClick={handleIncrease}
          className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-r hover:bg-gray-200 transition"
        >
          +
        </button>
      </div>

      <p className="text-red-500 text-sm mt-1">
        Số lượng bạn chọn đã đạt tối đa của sản phẩm này
      </p>
    </div>
  );
};

export default QuantitySelector;
